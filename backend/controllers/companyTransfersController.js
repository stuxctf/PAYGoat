const { db } = require('../models/bunisses_transacctions');
const { addAuditLog } = require('../utils/logger');
const fs = require('fs');
const csv = require('csv-parser');

/* =========================================================
   CREATE BATCH
   ========================================================= */
const createTransferBatch = (req, res) => {
    const { companyID, createdBy, currency, transfers } = req.body;

    if (!companyID) return res.status(400).json({ error: 'Missing companyID' });
    if (!transfers || transfers.length === 0) return res.status(400).json({ error: 'Empty transfer batch' });

    const totalAmount = transfers.reduce((sum, t) => sum + Number(t.amount), 0);

    db.get(`SELECT MAX(batchID) as lastBatch FROM company_transfer_batches`, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        const batchID = row && row.lastBatch ? row.lastBatch + 1 : 1; // primer batch = 1
        db.run(
            `INSERT INTO company_transfer_batches
             (batchID, companyID, createdBy, currency, totalAmount, status)
             VALUES (?, ?, ?, ?, ?, 'PENDING')`,
            [batchID, companyID, createdBy, currency, totalAmount],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });

                const stmt = db.prepare(`
                    INSERT INTO company_transfer_items
                    (batchID, targetAccount, amount)
                    VALUES (?, ?, ?)
                `);

                transfers.forEach(t => {
                    stmt.run(batchID, t.targetAccount, t.amount);
                });

                stmt.finalize();

                addAuditLog(
                    companyID,
                    'CREATE_BATCH',
                    `Batch ${batchID}`,
                    `Created batch for ${totalAmount} ${currency}`
                );

                res.status(201).json({
                    message: 'Batch created',
                    batchID,
                    status: 'PENDING'
                });
            }
        );
    });
};


/* =========================================================
   CREATE BATCH FROM CSV (FINANCE)
   ========================================================= */
const createBatchFromCSV = (req, res) => {
    const { companyID, createdBy, currency } = req.body;

    if (!companyID) {
        return res.status(400).json({ error: 'Missing companyID' });
    }

    if (!currency) {
        return res.status(400).json({ error: 'Missing currency' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'CSV file not uploaded' });
    }

    const transfers = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            if (!row.targetAccount || !row.amount) return;

            transfers.push({
                targetAccount: row.targetAccount.trim(),
                amount: Number(row.amount)
            });
        })
        .on('end', () => {
            if (transfers.length === 0) {
                fs.unlinkSync(filePath);
                return res.status(400).json({ error: 'CSV contains no valid transfers' });
            }

            req.body.transfers = transfers;

            fs.unlinkSync(filePath);

            createTransferBatch(req, res);
        })
        .on('error', () => {
            fs.unlinkSync(filePath);
            res.status(500).json({ error: 'Error parsing CSV file' });
        });
};

/* =========================================================
   LIST BATCHES
   ========================================================= */
const listBatches = (req, res) => {
    const { companyID } = req.query;
    if (!companyID) return res.status(400).json({ error: 'companyID required' });

    db.all(
        `SELECT * FROM company_transfer_batches WHERE companyID = ? ORDER BY createdAt DESC`,
        [companyID],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
};

/* =========================================================
   VIEW BATCH DETAILS
   ========================================================= */
const getBatchDetails = (req, res) => {
    const { batchID } = req.params;
    db.all(
        `SELECT * FROM company_transfer_items WHERE batchID = ?`,
        [batchID],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
};


/* =========================================================
   approveBatch
   ========================================================= */
const approveBatch = (req, res) => {
    const batchID = Number(req.params.batchID);
    const { companyID } = req.body;

    if (isNaN(batchID)) return res.status(400).json({ error: 'Invalid batchID' });
    if (!companyID) return res.status(400).json({ error: 'Missing companyID' });

    db.get(`SELECT * FROM company_transfer_batches WHERE batchID = ?`, [batchID], (err, batch) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });
        if (!batch) return res.status(404).json({ error: 'Batch not found' });
        if (batch.status !== 'PENDING') return res.status(400).json({ error: `Batch status is '${batch.status}', cannot approve` });

        db.get(
            `SELECT * FROM business_accounts WHERE companyID = ? AND currency = ?`,
            [companyID, batch.currency],
            (err2, account) => {
                if (err2) return res.status(500).json({ error: 'Database error', details: err2.message });
                if (!account) return res.status(404).json({ error: 'Company account not found' });

                const columnBalance = `balance${batch.currency}`;
                const columnAccount = `account${batch.currency}`; 
                const companyAccountNumber = account.accountNumber; 

                db.serialize(() => {
                    db.run('BEGIN TRANSACTION');

                    db.run(
                        `UPDATE business_accounts SET balance = balance - ? WHERE accountID = ?`,
                        [batch.totalAmount, account.accountID],
                        function(err3) {
                            if (err3) {
                                db.run('ROLLBACK');
                                return res.status(500).json({ error: 'Failed to debit company account', details: err3.message });
                            }

                            db.all(`SELECT * FROM company_transfer_items WHERE batchID = ?`, [batchID], (err4, items) => {
                                if (err4) {
                                    db.run('ROLLBACK');
                                    return res.status(500).json({ error: 'Failed to fetch transfer items' });
                                }

                                const creditUserAccounts = (index = 0) => {
                                    if (index >= items.length) {
                                        db.run(
                                            `UPDATE users SET ${columnBalance} = ? WHERE ${columnAccount} = ?`,
                                            [account.balance, companyAccountNumber],
                                            function(errUser) {
                                                if (errUser) {
                                                    db.run('ROLLBACK');
                                                    return res.status(500).json({ error: 'Failed to sync company account in users', details: errUser.message });
                                                }

                                                db.run(
                                                    `UPDATE company_transfer_batches SET status = 'APPROVED' WHERE batchID = ?`,
                                                    [batchID],
                                                    function(err6) {
                                                        if (err6) { db.run('ROLLBACK'); return res.status(500).json({ error: 'Failed to update batch status' }); }

                                                        db.run('COMMIT', (errCommit) => {
                                                            if (errCommit) { db.run('ROLLBACK'); return res.status(500).json({ error: 'Transaction commit failed' }); }

                                                            addAuditLog(companyID, 'APPROVE_BATCH', `Batch ${batchID}`, `Approved batch ${batchID}`);
                                                            return res.json({ message: 'Batch approved and executed' });
                                                        });
                                                    }
                                                );
                                            }
                                        );
                                        return;
                                    }

                                    const item = items[index];
                                    db.run(
                                        `UPDATE users SET ${columnBalance} = ${columnBalance} + ? WHERE ${columnAccount} = ?`,
                                        [item.amount, item.targetAccount],
                                        function(err5) {
                                            if (err5) {
                                                db.run('ROLLBACK');
                                                return res.status(500).json({ error: 'Failed to credit user accounts', details: err5.message });
                                            }
                                            creditUserAccounts(index + 1);
                                        }
                                    );
                                };

                                creditUserAccounts();
                            });
                        }
                    );
                });
            }
        );
    });
};



/* =========================================================
   DECLINE BATCH
   ========================================================= */
const declineBatch = (req, res) => {
    const { batchID } = req.params;
    const { companyID } = req.body;

    db.run(
        `UPDATE company_transfer_batches SET status = 'DECLINED' WHERE id = ?`,
        [batchID],
        () => {
            addAuditLog(
                companyID,
                'DECLINE_BATCH',
                `Batch ${batchID}`,
                'Batch declined'
            );
            res.json({ message: 'Batch declined' });
        }
    );
};

module.exports = {
    createTransferBatch,
    createBatchFromCSV,
    listBatches,
    getBatchDetails,
    approveBatch,
    declineBatch
};

const multer = require('multer');
const express = require('express');
const router = express.Router();
//const authenticate = require('../middlewares/authenticate');

const upload = multer({
  dest: 'uploads/'
});

const { 
    getBusinessAccounts 
} = require('../controllers/BusinnesAccountsController');

const { 
    getBusinessUserProfile 
} = require('../controllers/profileBusinessUserController');

const { 
    getAuditLogs 
} = require('../controllers/auditController');

const {
  getCompanyUsers,
  createCompanyUser,
  deleteCompanyUser
} = require('../controllers/businessUserscontroller');

const {
  updateCompanySettings,
  deleteCompany
} = require('../controllers/companySettingsController');

const {
    createTransferBatch,
    createBatchFromCSV,
    listBatches,
    getBatchDetails,
    approveBatch,
    declineBatch
} = require('../controllers/companyTransfersController');


router.post('/batch',  createTransferBatch);
router.post('/batch/upload', upload.single('file'), createBatchFromCSV);
router.get('/batch', listBatches);
router.get('/batch/:batchID', getBatchDetails);

router.post('/batch/:batchID/approve', approveBatch);
router.post('/batch/:batchID/decline', declineBatch);

router.post('/accounts', getBusinessAccounts)
router.post('/profile-business', getBusinessUserProfile);

router.get('/users', getCompanyUsers);
router.post('/users/create', createCompanyUser);
router.delete('/users/delete/:userID', deleteCompanyUser);


router.post('/settings/update', updateCompanySettings);
router.delete('/company/delete/:companyID', deleteCompany);

router.get('/audit', getAuditLogs);

module.exports = router;

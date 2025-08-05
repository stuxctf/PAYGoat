const db = require('../models/tickets');

const createConversation = (req, res) => {
  const { title, content } = req.body;
  const userID = req.user.userID;

  db.run(
    `INSERT INTO support_conversations (userID, title, content) VALUES (?, ?, ?)`,
    [userID, title, content],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create conversation' });
      res.status(201).json({ message: 'Conversation created', conversationID: this.lastID });
    }
  );
};

const getUserConversations = (req, res) => {
  const userID = req.user.userID;
  db.all(
    `SELECT * FROM support_conversations WHERE userID = ?`,
    [userID],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
};

const getConversationWithComments = (req, res) => {
  const { id } = req.params;
  const userID = req.user.userID;

  db.get(`SELECT * FROM support_conversations WHERE id = ?`, [id], (err, convo) => {
    if (err || !convo) return res.status(404).json({ error: 'Conversation not found' });

    if (convo.userID !== userID) {
      return res.status(403).json({ error: 'Access denied' });
    }

    
    res.json(convo);
  });
};

const addComment = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  db.run(
    `INSERT INTO support_comments (conversationID, comment) VALUES (?, ?)`,
    [id, comment],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to add comment' });
      res.status(201).json({ message: 'Comment added' });
    }
  );
};

const getCommentsByConversation = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM support_conversations WHERE id = ?', [id], (err, conversation) => {
    if (err || !conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    db.all('SELECT * FROM support_comments WHERE conversationID = ?', [id], (err, comments) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch comments' });
      }

      res.json({
        conversation,
        comments
      });
    });
  });
};

module.exports = {
  createConversation,
  getUserConversations,
  getConversationWithComments,
  addComment,
  getCommentsByConversation,
};

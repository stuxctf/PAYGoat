const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/paygoat.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS support_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userID INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS support_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversationID INTEGER NOT NULL,
      comment TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversationID) REFERENCES support_conversations(id)
    )
  `);
});

module.exports = db;
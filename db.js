const Database = require("better-sqlite3");

let db;

try {
  db = new Database("nodesk_jobs.db");

  db.prepare(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      company TEXT,
      location TEXT,
      role_type TEXT,
      category TEXT,
      url TEXT UNIQUE
    )
  `).run();

  console.log("Database initialized successfully.");
} catch (err) {
  console.error("Failed to initialize database:", err.message);
  process.exit(1); // stop the app if DB setup fails
}

module.exports = db;

// db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './bank.db',
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    balance REAL DEFAULT 1000
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fromUserId INTEGER,
    toUserId INTEGER,
    amount REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;

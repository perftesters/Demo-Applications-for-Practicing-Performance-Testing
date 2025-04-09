// auth.js
import jwt from 'jsonwebtoken';
import db from './db.js';

export async function loginUser(username, password) {
  const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  if (user) {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
  return null;
}

export async function registerUser(username, password) {
  try {
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    return { success: true };
  } catch (err) {
    return { success: false, message: 'Username already exists' };
  }
}

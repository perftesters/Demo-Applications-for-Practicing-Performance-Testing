// models/transactionModel.js
import db from '../db.js';

export async function getBalance(userId) {
  const user = await db.get('SELECT balance FROM users WHERE id = ?', [userId]);
  return user?.balance ?? 0;
}

export async function makePayment(fromUserId, toUserId, amount) {
  const fromUser = await db.get('SELECT balance FROM users WHERE id = ?', [fromUserId]);
  const toUser = await db.get('SELECT id FROM users WHERE id = ?', [toUserId]);

  if (!toUser) return { success: false, message: 'Recipient not found' };
  if (fromUser.balance < amount) return { success: false, message: 'Insufficient funds' };

  await db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, fromUserId]);
  await db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, toUserId]);
  await db.run('INSERT INTO transactions (fromUserId, toUserId, amount) VALUES (?, ?, ?)', [fromUserId, toUserId, amount]);

  return { success: true };
}

export async function getTransactionHistory(userId) {
  return await db.all(`
    SELECT * FROM transactions
    WHERE fromUserId = ? OR toUserId = ?
    ORDER BY timestamp DESC
  `, [userId, userId]);
}

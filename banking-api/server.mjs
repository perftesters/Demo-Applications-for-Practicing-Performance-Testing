// server.mjs
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import { verifyToken } from './middleware/verifyToken.js';
import { loginUser, registerUser } from './auth.js';
import { getBalance, makePayment, getTransactionHistory } from './models/transactionModel.js';

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const result = await registerUser(username, password);
  if (result.success) {
    res.status(201).json({ message: 'User registered successfully' });
  } else {
    res.status(400).json({ message: result.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const token = await loginUser(username, password);
  if (token) {
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected Routes
app.get('/balance', verifyToken, async (req, res) => {
  const balance = await getBalance(req.user.id);
  res.json({ balance });
});

app.post('/payment', verifyToken, async (req, res) => {
  const { toUserId, amount } = req.body;
  const result = await makePayment(req.user.id, toUserId, amount);
  if (result.success) {
    res.json({ message: 'Payment successful' });
  } else {
    res.status(400).json({ message: result.message });
  }
});

app.get('/transactions', verifyToken, async (req, res) => {
  const transactions = await getTransactionHistory(req.user.id);
  res.json({ transactions });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

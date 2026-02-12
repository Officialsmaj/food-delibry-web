const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = []; // In-memory users for demo

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, name, email, password: hashedPassword };
  users.push(user);
  const token = jwt.sign({ id: user.id }, 'secretkey');
  res.json({ token, user: { id: user.id, name, email } });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id }, 'secretkey');
  res.json({ token, user: { id: user.id, name: user.name, email } });
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, 'secretkey');
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: user.id, name: user.name, email } });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;

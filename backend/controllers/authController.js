const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { validateRegistration, validateLogin } = require('../validation');

async function register(req, res, next) {
  const error = validateRegistration(req.body);
  if (error) return res.status(400).json({ error });

  const { password } = req.body;
  const username = req.body.username.trim();
  const email = req.body.email.trim().toLowerCase();
  const address = req.body.address.trim();

  try {
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash, address) VALUES (?, ?, ?, ?)',
      [username, email, hash, address]
    );

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: result.insertId, username, email, address }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    next(error);
  }
}

async function login(req, res, next) {
  const error = validateLogin(req.body);
  if (error) return res.status(400).json({ error });

  const email = req.body.email.trim().toLowerCase();

  try {
    const [users] = await db.execute(
      'SELECT id, username, email, password_hash, address FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (!users.length || !(await bcrypt.compare(req.body.password, users[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { id, username, address } = users[0];
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1h'
    });

    return res.json({
      message: 'Login successful',
      token,
      user: { id, username, email: users[0].email, address }
    });
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  if (id !== req.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [users] = await db.execute(
      'SELECT id, username, email, address, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );

    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: users[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getUser };

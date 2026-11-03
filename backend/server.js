require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  const secret = process.env.JWT_SECRET || '';
  if (secret.length < 32 || secret.startsWith('replace_with_')) {
    throw new Error('Set JWT_SECRET to a unique, random secret of at least 32 characters');
  }

  await db.query('SELECT 1');
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Failed to start API:', error.message);
  process.exit(1);
});

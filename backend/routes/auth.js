const express = require('express');
const { register, login, getUser } = require('../controllers/authController');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users/:id', requireAuth, getUser);

module.exports = router;

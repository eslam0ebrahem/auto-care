const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;

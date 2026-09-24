const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index.js');

const JWT_SECRET = process.env.JWT_SECRET || 'auto_care_secret_key_change_in_production';

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please provide name, email, and password.' });
  }

  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during registration.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password.' });
  }

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during login.' });
  }
}

async function getMe(req, res) {
  try {
    const user = await db.User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email'],
    });
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error.' });
  }
}

module.exports = { register, login, getMe };

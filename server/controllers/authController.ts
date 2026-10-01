import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index';
import { getJwtSecret } from '../config';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: 'Please provide name, email, and password.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const trimmedName = String(name).trim();

  if (trimmedName.length === 0) {
    return res.status(400).json({ msg: 'Please provide a valid name.' });
  }

  if (String(password).length < 6) {
    return res
      .status(400)
      .json({ msg: 'Password must be at least 6 characters long.' });
  }

  try {
    const existingUser = await db.User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id }, getJwtSecret(), {
      expiresIn: '7d',
    });

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

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const user = await db.User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, getJwtSecret(), {
      expiresIn: '7d',
    });

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

export async function getMe(req: AuthenticatedRequest, res: Response) {
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

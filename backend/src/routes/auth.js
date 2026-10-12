import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User, publicUser } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many attempts. Try again later.' } });
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const issueToken = user => jwt.sign({}, process.env.JWT_SECRET, { subject: String(user._id), expiresIn: '8h', algorithm: 'HS256' });

authRouter.post('/register', limiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100 || typeof email !== 'string' || !emailPattern.test(email.trim()) || typeof password !== 'string' || password.length < 8 || password.length > 128) return res.status(400).json({ message: 'Enter a name (2-100 characters), valid email, and password (8-128 characters)' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'Email is already registered' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: issueToken(user), user: publicUser(user) });
  } catch (error) { if (error.code === 11000) return res.status(409).json({ message: 'Email is already registered' }); next(error); }
});
authRouter.post('/login', limiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ message: 'Enter your email and password' });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Incorrect email or password' });
    res.json({ token: issueToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
});
authRouter.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { studentRouter } from './routes/students.js';
import { dashboardRouter } from './routes/dashboard.js';
import { profileRouter } from './routes/profile.js';
import { connectDatabase } from './db.js';

export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api', async (_req, res, next) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || !process.env.MONGODB_URI) {
    console.error('Backend configuration is incomplete: check JWT_SECRET and MONGODB_URI');
    return res.status(503).json({ message: 'Backend configuration is incomplete' });
  }
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    res.status(503).json({ message: 'Database connection failed' });
  }
});
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/profile', profileRouter);
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ message: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;

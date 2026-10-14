import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { studentRouter } from './routes/students.js';
import { dashboardRouter } from './routes/dashboard.js';
import { profileRouter } from './routes/profile.js';

export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'https://student-information-system-advwebde.vercel.app/' }));
app.use(express.json({ limit: '20kb' }));
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

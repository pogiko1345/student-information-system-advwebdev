import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './db.js';

if (!process.env.VERCEL) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  await connectDatabase();
  app.listen(process.env.PORT || 5000, () => console.log(`API listening on ${process.env.PORT || 5000}`));
}
export default app;

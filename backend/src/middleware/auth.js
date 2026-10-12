import jwt from 'jsonwebtoken';
import { User, publicUser } from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const match = /^Bearer (.+)$/i.exec(req.get('authorization') || '');
    if (!match) return res.status(401).json({ message: 'Sign in to continue' });
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired or invalid. Sign in again.' });
  }
}
export { publicUser };

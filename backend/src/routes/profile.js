import { Router } from 'express';
import { User, publicUser } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

export const profileRouter = Router();
profileRouter.use(requireAuth);
profileRouter.get('/', (req, res) => res.json({ user: publicUser(req.user) }));
profileRouter.put('/', async (req, res, next) => {
  try {
    const name = req.body?.name;
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) return res.status(400).json({ message: 'Name must be 2-100 characters' });
    const user = await User.findByIdAndUpdate(req.user.id, { name: name.trim() }, { new: true, runValidators: true });
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
});

import { Router } from 'express';
import { Student } from '../models/Student.js';
import { requireAuth } from '../middleware/auth.js';

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);
dashboardRouter.get('/', async (_req, res, next) => {
  try {
    const [totalStudents, courses, years] = await Promise.all([
      Student.countDocuments(),
      Student.aggregate([{ $group: { _id: '$course', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Student.aggregate([{ $group: { _id: '$yearLevel', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    ]);
    res.json({ totalStudents, byCourse: courses.map(({ _id, count }) => ({ label: _id, count })), byYearLevel: years.map(({ _id, count }) => ({ label: `Year ${_id}`, count })) });
  } catch (error) { next(error); }
});

import { Router } from 'express';
import mongoose from 'mongoose';
import { Student } from '../models/Student.js';
import { requireAuth } from '../middleware/auth.js';

export const studentRouter = Router();
studentRouter.use(requireAuth);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validated(body) {
  const { studentId, fullName, email, course, yearLevel } = body || {};
  if (typeof studentId !== 'string' || !/^[A-Za-z0-9-]{2,30}$/.test(studentId.trim())) throw new Error('Student ID must be 2-30 letters, numbers, or hyphens');
  if (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 120) throw new Error('Full name must be 2-120 characters');
  if (typeof email !== 'string' || !emailPattern.test(email.trim())) throw new Error('Enter a valid email');
  if (typeof course !== 'string' || course.trim().length < 2 || course.trim().length > 100) throw new Error('Course must be 2-100 characters');
  if (!Number.isInteger(Number(yearLevel)) || Number(yearLevel) < 1 || Number(yearLevel) > 6) throw new Error('Year level must be 1-6');
  return { studentId: studentId.trim().toUpperCase(), fullName: fullName.trim(), email: email.trim().toLowerCase(), course: course.trim(), yearLevel: Number(yearLevel) };
}
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
studentRouter.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    const filter = {};
    if (typeof req.query.search === 'string' && req.query.search.trim()) { const term = new RegExp(escapeRegex(req.query.search.trim().slice(0, 80)), 'i'); filter.$or = [{ studentId: term }, { fullName: term }]; }
    if (typeof req.query.course === 'string' && req.query.course.trim()) filter.course = req.query.course.trim();
    if (req.query.yearLevel) { const year = Number(req.query.yearLevel); if (!Number.isInteger(year) || year < 1 || year > 6) return res.status(400).json({ message: 'Invalid year level' }); filter.yearLevel = year; }
    const [students, total] = await Promise.all([Student.find(filter).sort({ fullName: 1, _id: 1 }).skip((page - 1) * limit).limit(limit), Student.countDocuments(filter)]);
    res.json({ students, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) { next(error); }
});
studentRouter.post('/', async (req, res, next) => {
  try { const student = await Student.create(validated(req.body)); res.status(201).json({ student }); }
  catch (error) { if (error.code === 11000) return res.status(409).json({ message: 'Student ID or email already exists' }); if (error.message && !error.name?.includes('Mongo')) return res.status(400).json({ message: error.message }); next(error); }
});
studentRouter.get('/:id', async (req, res, next) => {
  try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid student ID' }); const student = await Student.findById(req.params.id); if (!student) return res.status(404).json({ message: 'Student not found' }); res.json({ student }); } catch (error) { next(error); }
});
studentRouter.put('/:id', async (req, res, next) => {
  try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid student ID' }); const student = await Student.findByIdAndUpdate(req.params.id, validated(req.body), { new: true, runValidators: true }); if (!student) return res.status(404).json({ message: 'Student not found' }); res.json({ student }); }
  catch (error) { if (error.code === 11000) return res.status(409).json({ message: 'Student ID or email already exists' }); if (error.message && !error.name?.includes('Mongo')) return res.status(400).json({ message: error.message }); next(error); }
});
studentRouter.delete('/:id', async (req, res, next) => {
  try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid student ID' }); const student = await Student.findByIdAndDelete(req.params.id); if (!student) return res.status(404).json({ message: 'Student not found' }); res.json({ message: 'Student deleted' }); } catch (error) { next(error); }
});

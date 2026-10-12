import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  course: { type: String, required: true, trim: true, maxlength: 100 },
  yearLevel: { type: Number, required: true, min: 1, max: 6 },
}, { timestamps: true });
studentSchema.index({ fullName: 'text', studentId: 'text' });
export const Student = mongoose.model('Student', studentSchema);

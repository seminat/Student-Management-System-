import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protect all routes
router.use(authenticate);

// List and Get - Admin, Teacher, Student (only own?)
// For now, let's allow all authenticated users to view
router.get('/', getStudents);
router.get('/:id', getStudentById);

// Create, Update, Delete - Admin only (or restricted)
router.post('/', authorize([Role.ADMIN]), createStudent);
router.put('/:id', authorize([Role.ADMIN, Role.TEACHER]), updateStudent);
router.delete('/:id', authorize([Role.ADMIN]), deleteStudent);

export default router;

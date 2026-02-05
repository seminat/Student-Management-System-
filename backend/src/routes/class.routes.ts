import { Router } from 'express';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  enrollStudent,
  unenrollStudent,
} from '../controllers/class.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Public (authenticated)
router.get('/', getClasses);
router.get('/:id', getClassById);

// Admin only
router.post('/', authorize([Role.ADMIN]), createClass);
router.put('/:id', authorize([Role.ADMIN]), updateClass);
router.delete('/:id', authorize([Role.ADMIN]), deleteClass);

// Enrollments (Admin/Teacher)
router.post('/:id/enroll', authorize([Role.ADMIN, Role.TEACHER]), enrollStudent);
router.delete('/:id/students/:studentId', authorize([Role.ADMIN, Role.TEACHER]), unenrollStudent);

export default router;

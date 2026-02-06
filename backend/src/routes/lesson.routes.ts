import { Router } from 'express';
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lesson.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// View lessons - All students/teachers in the class
router.get('/', getLessons);

// Manage lessons - Admin/Teacher only
router.post('/', authorize([Role.ADMIN, Role.TEACHER]), createLesson);
router.put('/:id', authorize([Role.ADMIN, Role.TEACHER]), updateLesson);
router.delete('/:id', authorize([Role.ADMIN, Role.TEACHER]), deleteLesson);

export default router;

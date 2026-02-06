import { Router } from 'express';
import { addResult, getStudentResults } from '../controllers/performance.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// View results - All users can view (Student own, Teacher/Admin all)
router.get('/student/:studentId', getStudentResults);

// Add result - Teacher & Admin only
router.post('/', authorize([Role.ADMIN, Role.TEACHER]), addResult);

export default router;

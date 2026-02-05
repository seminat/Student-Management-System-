import { Router } from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// View attendance - All authenticated users (Students see own, Teachers see classes)
// Improvement: Filter logic in controller based on role, for now open to auth users
router.get('/', getAttendance);

// Mark attendance - Teacher & Admin only
router.post('/', authorize([Role.ADMIN, Role.TEACHER]), markAttendance);

export default router;

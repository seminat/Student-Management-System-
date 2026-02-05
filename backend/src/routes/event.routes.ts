import { Router } from 'express';
import { getEvents, createEvent, deleteEvent } from '../controllers/event.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', getEvents);
router.post('/', authorize([Role.ADMIN, Role.TEACHER]), createEvent);
router.delete('/:id', authorize([Role.ADMIN, Role.TEACHER]), deleteEvent);

export default router;

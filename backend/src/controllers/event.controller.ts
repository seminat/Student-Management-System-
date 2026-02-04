import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthenticatedRequest } from '../types';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {};
    if (startDate || endDate) {
      where.eventDate = {};
      if (startDate) where.eventDate.gte = new Date(String(startDate));
      if (endDate) where.eventDate.lte = new Date(String(endDate));
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        creator: {
          select: {
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { eventDate: 'asc' },
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, eventDate, eventTime, durationMinutes, location, isAllDay } =
      req.body;

    if (!title || !eventDate) {
      res.status(400).json({ message: 'Title and date are required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        eventTime: eventTime ? new Date(`1970-01-01T${eventTime}`) : null,
        durationMinutes: durationMinutes ? Number(durationMinutes) : null,
        location,
        isAllDay: !!isAllDay,
        createdBy: req.user.id,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    // Optional: only allow creator or admin to delete
    await prisma.event.delete({ where: { id } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

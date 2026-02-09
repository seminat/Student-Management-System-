import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthenticatedRequest } from '../types';

/**
 * Get lessons - optionally filter by class ID
 */
export const getLessons = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;

    const lessons = await prisma.lesson.findMany({
      where: classId ? { classId: classId as string } : undefined,
      include: {
        class: {
          select: {
            name: true,
            code: true,
            grade: true,
          },
        },
        teacher: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create a new lesson
 */
export const createLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      classId,
      teacherId,
      title,
      subject,
      startTime,
      durationMinutes,
      lessonType,
      description,
      location,
      materials,
      homework,
    } = req.body;

    // Validate required fields
    if (
      !classId ||
      !teacherId ||
      !title ||
      !subject ||
      !startTime ||
      !durationMinutes ||
      !lessonType
    ) {
      res.status(400).json({
        message:
          'classId, teacherId, title, subject, startTime, durationMinutes, and lessonType are required',
      });
      return;
    }

    // Verify class exists
    const classExists = await prisma.class.findUnique({ where: { id: classId } });
    if (!classExists) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    // Verify teacher exists
    const teacherExists = await prisma.user.findUnique({ where: { id: teacherId } });
    if (!teacherExists) {
      res.status(404).json({ message: 'Teacher not found' });
      return;
    }

    const lesson = await prisma.lesson.create({
      data: {
        classId,
        teacherId,
        title,
        subject,
        startTime: new Date(startTime as string),
        durationMinutes: parseInt(durationMinutes as string),
        lessonType,
        description,
        location,
        materials,
        homework,
      },
      include: {
        class: true,
        teacher: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a lesson
 */
export const updateLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const {
      title,
      subject,
      startTime,
      durationMinutes,
      lessonType,
      description,
      location,
      materials,
      homework,
      isCompleted,
    } = req.body;

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({ where: { id } });
    if (!existingLesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        title,
        subject,
        startTime: startTime ? new Date(startTime as string) : undefined,
        durationMinutes: durationMinutes ? parseInt(durationMinutes as string) : undefined,
        lessonType,
        description,
        location,
        materials,
        homework,
        isCompleted,
      },
      include: {
        class: true,
        teacher: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.json(updatedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a lesson
 */
export const deleteLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({ where: { id } });
    if (!existingLesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    await prisma.lesson.delete({ where: { id } });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Role } from '@prisma/client';

export const addResult = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      classId,
      subject,
      masteryLevel,
      grade,
      assessmentType,
      maxScore,
      achievedScore,
    } = req.body;

    if (!studentId || !classId || !subject || !masteryLevel) {
      res
        .status(400)
        .json({ message: 'Student ID, Class ID, Subject, and Mastery Level are required' });
      return;
    }

    const result = await prisma.performance.create({
      data: {
        studentId,
        classId,
        subject,
        masteryLevel,
        grade,
        assessmentType,
        maxScore,
        achievedScore,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentResults = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params as { studentId: string };

    const results = await prisma.performance.findMany({
      where: { studentId },
      include: {
        class: {
          select: { name: true, code: true },
        },
      },
      orderBy: { assessmentDate: 'desc' },
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

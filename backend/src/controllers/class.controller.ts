import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Role } from '@prisma/client';

export const getClasses = async (_req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            email: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedClasses = classes.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      grade: c.grade,
      teacherId: c.teacherId, // Useful for frontend or future calls
      teacher: {
        id: c.teacher.id,
        name: c.teacher.profile
          ? `${c.teacher.profile.firstName} ${c.teacher.profile.lastName}`
          : c.teacher.email,
        email: c.teacher.email,
      },
      academicYear: c.academicYear,
      semester: c.semester,
      studentCount: c._count.enrollments,
      isActive: c.isActive,
    }));

    res.json(formattedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            profile: true,
            email: true,
          },
        },
        enrollments: {
          include: {
            student: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
        lessons: {
          orderBy: { startTime: 'asc' },
        },
      },
    });

    if (!classData) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    res.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, code, grade, teacherId, academicYear, semester, description } = req.body;

    if (!name || !code || !grade || !teacherId) {
      res.status(400).json({ message: 'Name, code, grade, and teacherId are required' });
      return;
    }

    const existingClass = await prisma.class.findUnique({ where: { code } });
    if (existingClass) {
      res.status(400).json({ message: 'Class with this code already exists' });
      return;
    }

    // Verify teacher exists and is actually a teacher
    const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
    if (!teacher || teacher.role !== Role.TEACHER) {
      res.status(400).json({ message: 'Invalid teacher ID' });
      return;
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        code,
        grade,
        teacherId,
        academicYear,
        semester,
        description,
      },
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name, grade, teacherId, academicYear, semester, description, isActive } = req.body;

    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    if (teacherId) {
      const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
      if (!teacher || teacher.role !== Role.TEACHER) {
        res.status(400).json({ message: 'Invalid teacher ID' });
        return;
      }
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        grade,
        teacherId,
        academicYear,
        semester,
        description,
        isActive,
      },
    });

    res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    await prisma.class.delete({ where: { id } });

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const enrollStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { studentId } = req.body;

    if (!studentId) {
      res.status(400).json({ message: 'Student ID is required' });
      return;
    }

    const classExists = await prisma.class.findUnique({ where: { id } });
    if (!classExists) {
      res.status(404).json({ message: 'Class not found' });
      return;
    }

    const studentExists = await prisma.student.findUnique({ where: { id: studentId } });
    if (!studentExists) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    // Check existing enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId,
          classId: id,
        },
      },
    });

    if (existingEnrollment) {
      res.status(400).json({ message: 'Student is already enrolled in this class' });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        classId: id,
        studentId,
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unenrollStudent = async (req: Request, res: Response) => {
  try {
    const { id, studentId } = req.params as { id: string; studentId: string };

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId,
          classId: id,
        },
      },
    });

    if (!enrollment) {
      res.status(404).json({ message: 'Enrollment not found' });
      return;
    }

    await prisma.enrollment.delete({
      where: {
        studentId_classId: {
          studentId,
          classId: id,
        },
      },
    });

  

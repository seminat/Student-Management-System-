import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { Role } from '@prisma/client';

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            email: true,
            isActive: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
                phone: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            class: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedStudents = students.map((student) => ({
      id: student.id,
      studentNumber: student.studentNumber,
      grade: student.grade,
      email: student.user.email,
      firstName: student.user.profile?.firstName,
      lastName: student.user.profile?.lastName,
      avatarUrl: student.user.profile?.avatarUrl,
      phone: student.user.profile?.phone,
      enrollmentDate: student.enrollmentDate,
      status: student.user.isActive ? 'Active' : 'Inactive',
      classes: student.enrollments.map((e) => e.class.name),
    }));

    res.json(formattedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        enrollments: {
          include: {
            class: true,
          },
        },
        attendance: {
          take: 10,
          orderBy: { date: 'desc' },
        },
        performance: {
          take: 10,
          orderBy: { assessmentDate: 'desc' },
        },
      },
    });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, grade, studentNumber, phone, address } = req.body;

    if (!firstName || !lastName || !email || !grade) {
      res.status(400).json({ message: 'First name, last name, email, and grade are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password || 'student123', 12);

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: Role.STUDENT,
          profile: {
            create: {
              firstName,
              lastName,
              phone,
              address,
            },
          },
          student: {
            create: {
              studentNumber: studentNumber || `STU${Math.random().toString().slice(2, 8)}`,
              grade,
            },
          },
        },
        include: {
          student: true,
          profile: true,
        },
      });

      return user;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { firstName, lastName, grade, phone, address, isActive } = req.body;

    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    await prisma.$transaction(async (prisma) => {
      if (grade) {
        await prisma.student.update({
          where: { id },
          data: { grade },
        });
      }

      if (isActive !== undefined) {
        await prisma.user.update({
          where: { id: student.userId },
          data: { isActive },
        });
      }

      if (firstName || lastName || phone || address) {
        await prisma.profile.update({
          where: { userId: student.userId },
          data: {
            firstName,
            lastName,
            phone,
            address,
          },
        });
      }
    });

    const updatedStudent = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    await prisma.user.delete({
      where: { id: student.userId },
    });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

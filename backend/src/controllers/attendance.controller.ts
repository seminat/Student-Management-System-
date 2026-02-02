import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AttendanceStatus } from '@prisma/client';

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { classId, date, records } = req.body; // records: [{ studentId, status, notes? }]

    if (!classId || !date || !Array.isArray(records)) {
      res.status(400).json({ message: 'Class ID, date, and records array are required' });
      return;
    }

    // Optional: Verify teacher access to this class if we want strictly scoped access

    // Use transaction to update multiple records
    const results = await prisma.$transaction(
      records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_classId_date: {
              studentId: record.studentId,
              classId,
              date: new Date(date),
            },
          },
          update: {
            status: record.status as AttendanceStatus,
            notes: record.notes,
          },
          create: {
            studentId: record.studentId,
            classId,
            date: new Date(date),
            status: record.status as AttendanceStatus,
            notes: record.notes,
          },
        })
      )
    );

    res.json({ message: 'Attendance recorded successfully', count: results.length });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { classId, studentId, startDate, endDate } = req.query;

    const whereClause: any = {};

    if (classId) whereClause.classId = String(classId);
    if (studentId) whereClause.studentId = String(studentId);

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(String(startDate));
      if (endDate) whereClause.date.lte = new Date(String(endDate));
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: {
              select: {
                profile: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
        },
        class: {
          select: { name: true, code: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

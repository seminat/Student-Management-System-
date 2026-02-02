import { PrismaClient, Role, AttendanceStatus, EnrollmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@school.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
        },
      },
    },
  });

  // Create teacher user
  const teacherPassword = await bcrypt.hash('teacher123', 12);
  const teacher = await prisma.user.create({
    data: {
      email: 'kayla@school.com',
      passwordHash: teacherPassword,
      role: Role.TEACHER,
      profile: {
        create: {
          firstName: 'Kayla',
          lastName: 'Smith',
          avatarUrl: '/avatars/teacher.jpg',
        },
      },
    },
  });

  // Create classes
  const mathClass = await prisma.class.create({
    data: {
      name: 'Mathematics',
      code: 'MATH-101',
      grade: 'Grade 8',
      teacherId: teacher.id,
      academicYear: '2023-2024',
      semester: 'Fall',
      description: 'Introduction to Algebra and Geometry',
    },
  });

  const scienceClass = await prisma.class.create({
    data: {
      name: 'Science',
      code: 'SCI-101',
      grade: 'Grade 8',
      teacherId: teacher.id,
      academicYear: '2023-2024',
      semester: 'Fall',
      description: 'Physics and Chemistry Basics',
    },
  });

  // Create student users
  const students = [
    { firstName: 'Sam', lastName: 'Smith', email: 'sam.smith@student.com', grade: 'Grade 8' },
    {
      firstName: 'Olivier',
      lastName: 'Jones',
      email: 'olivier.jones@student.com',
      grade: 'Grade 8',
    },
    {
      firstName: 'Michelle',
      lastName: 'Marie',
      email: 'michelle.marie@student.com',
      grade: 'Grade 8',
    },
    {
      firstName: 'Cassandra',
      lastName: 'Brit',
      email: 'cassandra.brit@student.com',
      grade: 'Grade 8',
    },
  ];

  for (const studentData of students) {
    const studentPassword = await bcrypt.hash('student123', 12);
    // Use upsert to avoid unique constraint errors if re-seeding involves partial data?
    // Actually, create is fine since we do a fresh seed usually.
    const user = await prisma.user.create({
      data: {
        email: studentData.email,
        passwordHash: studentPassword,
        role: Role.STUDENT,
        profile: {
          create: {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
          },
        },
        student: {
          create: {
            studentNumber: `STU${Math.random().toString().slice(2, 8)}`,
            grade: studentData.grade,
          },
        },
      },
      include: {
        student: true,
      },
    });

    if (user.student) {
      // Enroll in classes
      await prisma.enrollment.create({
        data: {
          studentId: user.student.id,
          classId: mathClass.id,
          status: EnrollmentStatus.ACTIVE,
        },
      });

      await prisma.enrollment.create({
        data: {
          studentId: user.student.id,
          classId: scienceClass.id,
          status: EnrollmentStatus.ACTIVE,
        },
      });

      // Create performance records
      await prisma.performance.create({
        data: {
          studentId: user.student.id,
          classId: mathClass.id,
          subject: 'Mathematics',
          masteryLevel: 85 + Math.floor(Math.random() * 15),
          grade: 'A',
          assessmentType: 'Final Exam',
          maxScore: 100,
          achievedScore: 85 + Math.floor(Math.random() * 15),
        },
      });

      // Create attendance records
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        await prisma.attendance.create({
          data: {
            studentId: user.student.id,
            classId: mathClass.id,
            date: date,
            status: Math.random() > 0.1 ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
          },
        });
      }
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# Database Schema Design

## Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Users    │────────▶│  Profiles   │         │  Students   │
│             │         │             │         │             │
│ id (PK)     │         │ id (PK)     │         │ id (PK)     │
│ email       │         │ user_id(FK) │◀────────│ user_id(FK) │
│ password    │         │ first_name  │         │ student_num │
│ role        │         │ last_name   │         │ grade       │
└─────────────┘         └─────────────┘         └─────────────┘
      │                                                 │
      │                                                 │
      │                 ┌─────────────┐                │
      │                 │   Classes   │                │
      │                 │             │                │
      └────────────────▶│ id (PK)     │◀───────────────┘
                        │ name        │
                        │ grade       │         ┌─────────────┐
                        │ teacher_id  │         │ Enrollments │
                        └─────────────┘         │             │
                              │                 │ id (PK)     │
                              │                 │ student_id  │
                              └────────────────▶│ class_id    │
                                                └─────────────┘
                                                      │
                        ┌─────────────┐               │
                        │ Attendance  │               │
                        │             │               │
                        │ id (PK)     │               │
                        │ student_id  │◀──────────────┘
                        │ class_id    │
                        │ date        │
                        │ status      │
                        └─────────────┘

                        ┌─────────────┐
                        │ Performance │
                        │             │
                        │ id (PK)     │
                        │ student_id  │
                        │ class_id    │
                        │ subject     │
                        │ mastery     │
                        └─────────────┘

                        ┌─────────────┐
                        │   Lessons   │
                        │             │
                        │ id (PK)     │
                        │ class_id    │
                        │ teacher_id  │
                        │ title       │
                        │ start_time  │
                        └─────────────┘

                        ┌─────────────┐
                        │   Events    │
                        │             │
                        │ id (PK)     │
                        │ title       │
                        │ event_date  │
                        │ created_by  │
                        └─────────────┘

                        ┌─────────────┐
                        │    Notes    │
                        │             │
                        │ id (PK)     │
                        │ user_id     │
                        │ title       │
                        │ content     │
                        └─────────────┘
```

## Prisma Schema

```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

enum EnrollmentStatus {
  ACTIVE
  INACTIVE
  GRADUATED
  WITHDRAWN
}

enum LessonType {
  LECTURE
  LAB
  TUTORIAL
  WORKSHOP
  EXAM
}

enum NotePriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

// ============================================================================
// User Management
// ============================================================================

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  role          Role      @default(STUDENT)
  isActive      Boolean   @default(true) @map("is_active")
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  profile       Profile?
  student       Student?
  teacherClasses Class[]   @relation("TeacherClasses")
  lessons       Lesson[]
  events        Event[]
  notes         Note[]

  @@map("users")
}

model Profile {
  id          String   @id @default(uuid())
  userId      String   @unique @map("user_id")
  firstName   String   @map("first_name")
  lastName    String   @map("last_name")
  avatarUrl   String?  @map("avatar_url")
  phone       String?
  dateOfBirth DateTime? @map("date_of_birth")
  address     String?
  city        String?
  state       String?
  zipCode     String?  @map("zip_code")
  country     String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

// ============================================================================
// Student Management
// ============================================================================

model Student {
  id             String    @id @default(uuid())
  userId         String    @unique @map("user_id")
  studentNumber  String    @unique @map("student_number")
  grade          String
  enrollmentDate DateTime  @default(now()) @map("enrollment_date")
  graduationDate DateTime? @map("graduation_date")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  // Relations
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  enrollments    Enrollment[]
  attendance     Attendance[]
  performance    Performance[]

  @@map("students")
}

model Class {
  id           String   @id @default(uuid())
  name         String
  code         String   @unique
  grade        String
  teacherId    String   @map("teacher_id")
  academicYear String   @map("academic_year")
  semester     String?
  description  String?
  maxStudents  Int?     @map("max_students")
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  teacher      User         @relation("TeacherClasses", fields: [teacherId], references: [id])
  enrollments  Enrollment[]
  attendance   Attendance[]
  performance  Performance[]
  lessons      Lesson[]

  @@map("classes")
}

model Enrollment {
  id             String           @id @default(uuid())
  studentId      String           @map("student_id")
  classId        String           @map("class_id")
  enrollmentDate DateTime         @default(now()) @map("enrollment_date")
  status         EnrollmentStatus @default(ACTIVE)
  createdAt      DateTime         @default(now()) @map("created_at")
  updatedAt      DateTime         @updatedAt @map("updated_at")

  // Relations
  student        Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  class          Class            @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@unique([studentId, classId])
  @@map("enrollments")
}

// ============================================================================
// Attendance Management
// ============================================================================

model Attendance {
  id        String           @id @default(uuid())
  studentId String           @map("student_id")
  classId   String           @map("class_id")
  date      DateTime         @db.Date
  status    AttendanceStatus
  notes     String?
  createdAt DateTime         @default(now()) @map("created_at")
  updatedAt DateTime         @updatedAt @map("updated_at")

  // Relations
  student   Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  class     Class            @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@unique([studentId, classId, date])
  @@index([studentId])
  @@index([classId])
  @@index([date])
  @@index([studentId, date])
  @@map("attendance")
}

// ============================================================================
// Performance Management
// ============================================================================

model Performance {
  id             String   @id @default(uuid())
  studentId      String   @map("student_id")
  classId        String   @map("class_id")
  subject        String
  masteryLevel   Decimal  @map("mastery_level") @db.Decimal(5, 2)
  grade          String?
  assessmentDate DateTime @default(now()) @map("assessment_date") @db.Date
  assessmentType String?  @map("assessment_type")
  maxScore       Decimal? @map("max_score") @db.Decimal(10, 2)
  achievedScore  Decimal? @map("achieved_score") @db.Decimal(10, 2)
  notes          String?
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // Relations
  student        Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  class          Class    @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@index([studentId])
  @@index([classId])
  @@index([subject])
  @@map("performance")
}

// ============================================================================
// Lesson Management
// ============================================================================

model Lesson {
  id              String     @id @default(uuid())
  classId         String     @map("class_id")
  teacherId       String     @map("teacher_id")
  title           String
  subject         String
  startTime       DateTime   @map("start_time")
  durationMinutes Int        @map("duration_minutes")
  lessonType      LessonType @map("lesson_type")
  description     String?
  location        String?
  materials       String?
  homework        String?
  isCompleted     Boolean    @default(false) @map("is_completed")
  createdAt       DateTime   @default(now()) @map("created_at")
  updatedAt       DateTime   @updatedAt @map("updated_at")

  // Relations
  class           Class      @relation(fields: [classId], references: [id], onDelete: Cascade)
  teacher         User       @relation(fields: [teacherId], references: [id])

  @@index([classId])
  @@index([teacherId])
  @@index([startTime])
  @@map("lessons")
}

// ============================================================================
// Event Management
// ============================================================================

model Event {
  id              String   @id @default(uuid())
  title           String
  description     String?
  eventDate       DateTime @map("event_date") @db.Date
  eventTime       DateTime? @map("event_time") @db.Time
  durationMinutes Int?     @map("duration_minutes")
  location        String?
  createdBy       String   @map("created_by")
  isAllDay        Boolean  @default(false) @map("is_all_day")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  creator         User     @relation(fields: [createdBy], references: [id])

  @@index([eventDate])
  @@index([createdBy])
  @@map("events")
}

// ============================================================================
// Notes Management
// ============================================================================

model Note {
  id        String       @id @default(uuid())
  userId    String       @map("user_id")
  title     String
  content   String
  color     String?
  priority  NotePriority @default(MEDIUM)
  isPinned  Boolean      @default(false) @map("is_pinned")
  createdAt DateTime     @default(now()) @map("created_at")
  updatedAt DateTime     @updatedAt @map("updated_at")

  // Relations
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("notes")
}
```

## Seed Data

```typescript
// prisma/seed.ts
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
    },
  });

  // Create student users
  const students = [
    { firstName: 'Sam', lastName: 'Smith', email: 'sam.smith@student.com', grade: 'Grade 8' },
    { firstName: 'Olivier', lastName: 'Jones', email: 'olivier.jones@student.com', grade: 'Grade 8' },
    { firstName: 'Michelle', lastName: 'Marie', email: 'michelle.marie@student.com', grade: 'Grade 8' },
    { firstName: 'Cassandra', lastName: 'Brit', email: 'cassandra.brit@student.com', grade: 'Grade 8' },
  ];

  for (const studentData of students) {
    const studentPassword = await bcrypt.hash('student123', 12);
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

    // Enroll in classes
    await prisma.enrollment.create({
      data: {
        studentId: user.student!.id,
        classId: mathClass.id,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    await prisma.enrollment.create({
      data: {
        studentId: user.student!.id,
        classId: scienceClass.id,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    // Create performance records
    await prisma.performance.create({
      data: {
        studentId: user.student!.id,
        classId: mathClass.id,
        subject: 'Mathematics',
        masteryLevel: 98,
        grade: 'A',
        assessmentType: 'Final Exam',
      },
    });

    // Create attendance records
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      await prisma.attendance.create({
        data: {
          studentId: user.student!.id,
          classId: mathClass.id,
          date: date,
          status: Math.random() > 0.1 ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
        },
      });
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Migration Commands

```bash
# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed

# Reset database (development only)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import classRoutes from './routes/class.routes';
import attendanceRoutes from './routes/attendance.routes';
import performanceRoutes from './routes/performance.routes';
import lessonRoutes from './routes/lesson.routes';
import eventRoutes from './routes/event.routes';
import noteRoutes from './routes/note.routes';
import prisma from './utils/prisma';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev')); // Request logging

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notes', noteRoutes);

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Student Management API is running' });
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
    });

    // Graceful Shutdown
    const shutdown = async () => {
      console.log('🛑 Shutting down server...');
      server.close(() => {
        console.log('✅ Server closed');
      });
      await prisma.$disconnect();
      console.log('✅ Database disconnected');
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

startServer();

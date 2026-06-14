import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './db';
import { seedDatabase } from './seed';

// Import routes
import authRouter from './routes/auth';
import settingsRouter from './routes/settings';
import usersRouter from './routes/users';
import academicsRouter from './routes/academics';
import attendanceRouter from './routes/attendance';
import examsRouter from './routes/exams';
import assignmentsRouter from './routes/assignments';
import announcementsRouter from './routes/announcements';
import eventsRouter from './routes/events';
import dashboardRouter from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/academics', academicsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/exams', examsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Sync database and start server
const startServer = async () => {
  try {
    console.log('Synchronizing database models...');
    // Sync models
    await sequelize.sync();
    console.log('✔ Database models synchronized.');

    // Seed database
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();

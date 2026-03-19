import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const app = express();

import authRoutes from './routes/auth.routes';
import classRoutes from './routes/class.routes';
import subjectRoutes from './routes/subject.routes';

// Middleware
app.use(cors());
app.use(express.json());

import userRoutes from './routes/user.routes';
import attendanceRoutes from './routes/attendance.routes';
import assignmentRoutes from './routes/assignment.routes';
import communicationRoutes from './routes/communication.routes';
import announcementRoutes from './routes/announcement.routes';
import feeRoutes from './routes/fee.routes';
import reportRoutes from './routes/report.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/reports', reportRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Infogate Schools API is running');
});

const PORT = process.env.PORT || 5000;

import { seedAdminUser } from './services/adminSeed.service';

// Connect to database and start server
connectDB().then(async () => {
    // Seed initial admin user
    await seedAdminUser();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to database', err);
});

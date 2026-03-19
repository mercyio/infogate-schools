import express from 'express';
import {
    getAdminDashboardStats,
    getTeacherDashboardStats,
    getStudentDashboardStats
} from '../controllers/report.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/admin/dashboard', protect, authorize('admin'), getAdminDashboardStats);
router.get('/teacher/dashboard', protect, authorize('teacher'), getTeacherDashboardStats);
router.get('/student/dashboard', protect, authorize('student'), getStudentDashboardStats);

export default router;

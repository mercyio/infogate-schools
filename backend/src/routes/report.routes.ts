import express from 'express';
import {
    getAdminDashboardStats,
    getTeacherDashboardStats,
    getStudentDashboardStats,
    getAcademicReport,
    getFinancialReport,
    getTeacherPerformanceReport
} from '../controllers/report.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/admin/dashboard', protect, authorize('admin'), getAdminDashboardStats);
router.get('/admin/academic-report', protect, authorize('admin'), getAcademicReport);
router.get('/admin/financial-report', protect, authorize('admin'), getFinancialReport);
router.get('/admin/teacher-report', protect, authorize('admin'), getTeacherPerformanceReport);
router.get('/teacher/dashboard', protect, authorize('teacher'), getTeacherDashboardStats);
router.get('/student/dashboard', protect, authorize('student'), getStudentDashboardStats);

export default router;

import express from 'express';
import { getAttendance, markAttendance, getTeacherAttendance, markTeacherAttendance } from '../controllers/attendance.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getAttendance)
    .post(protect, authorize('admin', 'teacher'), markAttendance);

router.route('/teachers')
    .get(protect, authorize('admin', 'teacher'), getTeacherAttendance)
    .post(protect, authorize('admin', 'teacher'), markTeacherAttendance);

export default router;

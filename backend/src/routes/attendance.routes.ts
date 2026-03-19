import express from 'express';
import { getAttendance, markAttendance } from '../controllers/attendance.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getAttendance)
    .post(protect, authorize('admin', 'teacher'), markAttendance);

export default router;

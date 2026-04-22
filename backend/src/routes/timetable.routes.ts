import express from 'express';
import {
    getTimetables,
    getTimetableClassSubjects,
    createTimetable,
    createTimetableBulk,
    updateTimetable,
    deleteTimetable,
} from '../controllers/timetable.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/class-subjects', protect, authorize('admin', 'teacher'), getTimetableClassSubjects);
router.post('/bulk', protect, authorize('admin'), createTimetableBulk);

router.route('/')
    .get(protect, authorize('admin', 'teacher', 'student', 'parent'), getTimetables)
    .post(protect, authorize('admin'), createTimetable);

router.route('/:id')
    .put(protect, authorize('admin'), updateTimetable)
    .delete(protect, authorize('admin'), deleteTimetable);

export default router;

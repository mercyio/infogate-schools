import express from 'express';
import {
    getTimetables,
    getSubjectsByLevel,
    createTimetable,
    createTimetableBulk,
    updateTimetable,
    deleteTimetable,
    deleteTimetablesByLevel,
} from '../controllers/timetable.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/subjects-by-level', protect, authorize('admin', 'teacher'), getSubjectsByLevel);
router.delete('/level/:level', protect, authorize('admin'), deleteTimetablesByLevel);
router.post('/bulk', protect, authorize('admin'), createTimetableBulk);

router.route('/')
    .get(protect, authorize('admin', 'teacher', 'student', 'parent'), getTimetables)
    .post(protect, authorize('admin'), createTimetable);

router.route('/:id')
    .put(protect, authorize('admin'), updateTimetable)
    .delete(protect, authorize('admin'), deleteTimetable);

export default router;

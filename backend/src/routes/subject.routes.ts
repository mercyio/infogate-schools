import express from 'express';
import { getSubjects, createSubject, getSubjectsByClass } from '../controllers/subject.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getSubjects)
    .post(protect, authorize('admin'), createSubject);

router.route('/class/:classId')
    .get(protect, getSubjectsByClass);

export default router;

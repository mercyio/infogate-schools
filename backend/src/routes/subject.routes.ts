import express from 'express';
import { getSubjects, createSubject } from '../controllers/subject.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getSubjects)
    .post(protect, authorize('admin'), createSubject);

export default router;

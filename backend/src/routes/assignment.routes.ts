import express from 'express';
import { getAssignments, createAssignment } from '../controllers/assignment.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getAssignments)
    .post(protect, authorize('teacher'), createAssignment);

export default router;

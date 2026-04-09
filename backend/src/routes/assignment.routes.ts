import express from 'express';
import {
    getAssignments,
    createAssignment,
    getAdminAssignmentFeed,
    getAssignmentSubmissions,
} from '../controllers/assignment.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/admin/feed', protect, authorize('admin'), getAdminAssignmentFeed);
router.get('/:assignmentId/submissions', protect, authorize('admin', 'teacher'), getAssignmentSubmissions);

router.route('/')
    .get(protect, getAssignments)
    .post(protect, authorize('teacher'), createAssignment);

export default router;

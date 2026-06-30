import express from 'express';
import {
    getAssignments,
    createAssignment,
    getAdminAssignmentFeed,
    getAssignmentSubmissions,
    submitAssignment,
    getMySubmission,
} from '../controllers/assignment.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = express.Router();

router.get('/admin/feed', protect, authorize('admin'), getAdminAssignmentFeed);
router.get('/:assignmentId/submissions', protect, authorize('admin', 'teacher'), getAssignmentSubmissions);
router.get('/:assignmentId/my-submission', protect, authorize('student'), getMySubmission);
router.post('/:assignmentId/submit', protect, authorize('student'), uploadSingle, submitAssignment);

router.route('/')
    .get(protect, getAssignments)
    .post(protect, authorize('teacher'), createAssignment);

export default router;

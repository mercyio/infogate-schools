import express from 'express';
import { createFeedback, getFeedback, updateFeedbackStatus } from '../controllers/feedback.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', protect, authorize('admin'), getFeedback);
router.post('/', protect, createFeedback);
router.put('/:id/status', protect, authorize('admin'), updateFeedbackStatus);

export default router;

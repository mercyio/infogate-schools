import express from 'express';
import { getAnnouncements, createAnnouncement, getEvents, createEvent } from '../controllers/communication.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/announcements')
    .get(protect, getAnnouncements)
    .post(protect, authorize('admin', 'teacher'), createAnnouncement);

router.route('/events')
    .get(protect, getEvents)
    .post(protect, authorize('admin', 'teacher'), createEvent);

export default router;

import express from 'express';
import {
    getAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} from '../controllers/announcement.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', protect, getAnnouncements);
router.get('/:id', protect, getAnnouncementById);

// Admin and Teacher can manage announcements
router.post('/', protect, authorize('admin', 'teacher'), createAnnouncement);
router.put('/:id', protect, authorize('admin', 'teacher'), updateAnnouncement);
router.delete('/:id', protect, authorize('admin', 'teacher'), deleteAnnouncement);

export default router;

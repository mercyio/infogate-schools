import express from 'express';
import { getClasses, getClassById, createClass, updateClass, deleteClass } from '../controllers/class.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getClasses)
    .post(protect, authorize('admin', 'teacher'), createClass);

router.route('/:id')
    .get(protect, getClassById)
    .put(protect, authorize('admin', 'teacher'), updateClass)
    .delete(protect, authorize('admin', 'teacher'), deleteClass);

export default router;

import express from 'express';
import {
    getFees,
    getFeeById,
    createFee,
    updateFee,
    deleteFee
} from '../controllers/fee.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', protect, getFees);
router.get('/:id', protect, getFeeById);

// Admin can manage fees
router.post('/', protect, authorize('admin'), createFee);
router.put('/:id', protect, authorize('admin'), updateFee);
router.delete('/:id', protect, authorize('admin'), deleteFee);

export default router;

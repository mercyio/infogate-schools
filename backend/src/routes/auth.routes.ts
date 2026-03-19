import express from 'express';
import { login, getMe, updatePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

export default router;

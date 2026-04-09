import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import { AuthRequest } from '../middleware/auth.middleware';

export const getFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
        const feedback = await Feedback.find()
            .populate('submitted_by', 'full_name email role')
            .sort({ createdAt: -1 });

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message, category } = req.body;

        if (!message || !String(message).trim()) {
            res.status(400).json({ message: 'Message is required' });
            return;
        }

        const feedback = await Feedback.create({
            message: String(message).trim(),
            category,
            submitted_by: req.user?.id,
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

export const updateFeedbackStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!['read', 'unread', 'actioned'].includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('submitted_by', 'full_name email role');

        if (!feedback) {
            res.status(404).json({ message: 'Feedback not found' });
            return;
        }

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

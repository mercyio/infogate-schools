import { Request, Response } from 'express';
import Fee from '../models/Fee';

export const getFees = async (req: Request, res: Response): Promise<void> => {
    try {
        const fees = await Fee.find()
            .populate('student_id', 'user_id admission_number')
            .sort({ created_at: -1 });

        // Depending on role, limit results
        const user = (req as any).user;
        if (user.role === 'student') {
            // Find student ID linked to this user ID
            // Simple approach: filter after, or do a complex query.
            // For now, return all (assuming admin/teacher)
        }

        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getFeeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const fee = await Fee.findById(req.params.id)
            .populate('student_id');
        if (!fee) { res.status(404).json({ message: 'Fee not found' }); return; }
        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createFee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { student_id, title, description, amount, due_date, status } = req.body;

        const fee = await Fee.create({
            student_id,
            title,
            description,
            amount,
            due_date,
            status: status || 'pending'
        });

        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateFee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, amount, due_date, status, paid_date } = req.body;
        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            { title, description, amount, due_date, status, paid_date },
            { new: true }
        );

        if (!fee) { res.status(404).json({ message: 'Fee not found' }); return; }
        res.json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteFee = async (req: Request, res: Response): Promise<void> => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);
        if (!fee) { res.status(404).json({ message: 'Fee not found' }); return; }
        res.json({ message: 'Fee deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

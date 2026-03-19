import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import AssignmentSubmission from '../models/AssignmentSubmission';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
        const assignments = await Assignment.find().populate('class_subject_id').populate('teacher_id');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, class_subject_id, due_date, total_marks } = req.body;
        const teacher_id = req.user.id;

        const assignment = await Assignment.create({
            title, description, class_subject_id, teacher_id, due_date, total_marks
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

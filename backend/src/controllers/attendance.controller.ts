import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let query = {};
        if (req.query.student_id) {
            query = { student_id: req.query.student_id };
        }
        const records = await Attendance.find(query).populate('student_id').populate('class_id');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const markAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const records = req.body.records; // Array of { student_id, class_id, date, status, remarks }
        const marked_by = req.user.id;

        const formattedRecords = records.map((record: any) => ({
            ...record,
            marked_by
        }));

        const result = await Attendance.insertMany(formattedRecords);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

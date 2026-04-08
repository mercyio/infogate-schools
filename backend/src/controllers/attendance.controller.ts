import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import TeacherAttendance from '../models/TeacherAttendance';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let query = {};
        if (req.query.student_id) {
            query = { student_id: req.query.student_id };
        }
        if (req.query.class_id) {
            query = { ...query, class_id: req.query.class_id };
        }
        if (req.query.date) {
            const date = new Date(req.query.date as string);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            query = { ...query, date: { $gte: startOfDay, $lte: endOfDay } };
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

        // Delete existing records for the same students on the same date to avoid duplicates
        for (const record of records) {
            const date = new Date(record.date);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            await Attendance.deleteMany({
                student_id: record.student_id,
                date: { $gte: startOfDay, $lte: endOfDay }
            });
        }

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

export const getTeacherAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let query = {};
        if (req.query.teacher_id) {
            query = { teacher_id: req.query.teacher_id };
        }
        if (req.query.date) {
            const date = new Date(req.query.date as string);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            query = { ...query, date: { $gte: startOfDay, $lte: endOfDay } };
        }
        const records = await TeacherAttendance.find(query).populate({
            path: 'teacher_id',
            populate: { path: 'user_id', select: 'full_name email' }
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const markTeacherAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const records = req.body.records; // Array of { teacher_id, date, status, remarks }
        
        // Delete existing records for the same teachers on the same date
        for (const record of records) {
            const date = new Date(record.date);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            await TeacherAttendance.deleteMany({
                teacher_id: record.teacher_id,
                date: { $gte: startOfDay, $lte: endOfDay }
            });
        }

        const result = await TeacherAttendance.insertMany(records);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

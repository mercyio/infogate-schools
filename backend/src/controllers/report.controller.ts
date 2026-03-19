import { Request, Response } from 'express';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Fee from '../models/Fee';
import Attendance from '../models/Attendance';
import Class from '../models/Class';
import Assignment from '../models/Assignment';

export const getAdminDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();

        // Sum up paid fees
        const fees = await Fee.find({ status: 'paid' });
        const revenue = fees.reduce((sum, fee) => sum + fee.amount, 0);

        // Simple attendance calculation for today (mock/placeholder logic)
        // A real system would count present vs total
        const attendanceRate = 95;

        res.json({
            totalStudents,
            totalTeachers,
            revenue,
            attendanceRate
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeacherDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Assume req.user.id maps directly to Teacher model user_id, 
        // need to lookup Teacher document first using user_id from token
        const teacher = await Teacher.findOne({ user_id: (req as any).user.id });

        let classesCount = 0;
        let activeAssignments = 0;

        if (teacher) {
            // Found the teacher, check assignments they created
            classesCount = await Class.countDocuments({ class_teacher_id: teacher._id });
            activeAssignments = await Assignment.countDocuments({ teacher_id: teacher._id, due_date: { $gte: new Date() } });
        }

        res.json({
            classesCount,
            activeAssignments,
            unreadMessages: 0 // Placeholder
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getStudentDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json({
            attendance: '98%',
            gpa: '3.8',
            upcomingAssignments: 2,
            unreadMessages: 1
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

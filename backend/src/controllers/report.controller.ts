import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Fee from '../models/Fee';
import Attendance from '../models/Attendance';
import Class from '../models/Class';
import Assignment from '../models/Assignment';
import Grade from '../models/Grade';
import TeacherAttendance from '../models/TeacherAttendance';

export const getAdminDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();

        // Sum up paid fees
        const fees = await Fee.find({ status: 'paid' });
        const revenue = fees.reduce((sum, fee) => sum + fee.amount, 0);

        // Calculate real attendance rate
        const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

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
        const teacher = await Teacher.findOne({ user_id: (req as any).user.id });
        let classesCount = 0;
        let activeAssignments = 0;

        if (teacher) {
            classesCount = await Class.countDocuments({ class_teacher_id: teacher._id });
            activeAssignments = await Assignment.countDocuments({ teacher_id: teacher._id, due_date: { $gte: new Date() } });
        }

        res.json({
            classesCount,
            activeAssignments,
            unreadMessages: 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getStudentDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Placeholder for student-specific dashboard - could be expanded to real gpa/attendance
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

export const getAcademicReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const grades = await Grade.find();
        const performanceBySubject = await Grade.aggregate([
            {
                $group: {
                    _id: '$class_subject_id',
                    avgScore: { $avg: '$marks_obtained' },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'classsubjects',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'subjectInfo'
                }
            }
        ]);

        res.json({
            performanceBySubject: performanceBySubject.map(s => ({
                subject: s.subjectInfo[0]?.name || 'Unknown',
                avgScore: Math.round(s.avgScore),
                count: s.count
            })),
            gradeDistribution: [
                { grade: "A", count: grades.filter(g => g.marks_obtained >= 90).length },
                { grade: "B", count: grades.filter(g => g.marks_obtained >= 80 && g.marks_obtained < 90).length },
                { grade: "C", count: grades.filter(g => g.marks_obtained >= 70 && g.marks_obtained < 80).length },
                { grade: "D", count: grades.filter(g => g.marks_obtained >= 60 && g.marks_obtained < 70).length },
                { grade: "F", count: grades.filter(g => g.marks_obtained < 60).length },
            ]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getFinancialReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const fees = await Fee.find();
        const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
        const outstanding = fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);

        res.json({
            totalRevenue,
            outstanding,
            paymentStats: [
                { status: 'Paid', count: fees.filter(f => f.status === 'paid').length },
                { status: 'Pending', count: fees.filter(f => f.status === 'pending').length },
                { status: 'Overdue', count: fees.filter(f => f.status === 'overdue').length },
            ]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeacherPerformanceReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const teachers = await Teacher.find().populate('user_id');
        
        const teacherData = await Promise.all(teachers.map(async (t) => {
            const marked = await TeacherAttendance.countDocuments({ teacher_id: t._id });
            const present = await TeacherAttendance.countDocuments({ 
                teacher_id: t._id, 
                status: { $in: ['present', 'late'] } 
            });
            const rate = marked > 0 ? Math.round((present / marked) * 100) : 0;

            return {
                name: (t.user_id as any)?.full_name || 'Unknown',
                specialization: t.specialization,
                attendance: marked > 0 ? `${rate}%` : 'No Data'
            };
        }));

        res.json({ teachers: teacherData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

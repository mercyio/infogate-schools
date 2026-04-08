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

export const getAcademicReport = async (req: Request, res: Response): Promise<void> => {
    try {
        // Aggregate grade distribution
        const grades = await mongoose.model('Grade').find();
        
        // This is a simplified aggregation for demonstration
        const performanceBySubject = await mongoose.model('Grade').aggregate([
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
        
        res.json({
            teachers: teachers.map(t => ({
                name: (t.user_id as any)?.full_name || 'Unknown',
                specialization: t.specialization,
                attendance: '95%' // Placeholder until TeacherAttendance is fully used
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

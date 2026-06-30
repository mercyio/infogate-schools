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
import ClassSubject from '../models/ClassSubject';
import Timetable from '../models/Timetable';
import { AuthRequest } from '../middleware/auth.middleware';

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

export const getStudentDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const studentProfile = await Student.findOne({ user_id: req.user?.id })
            .populate({ path: 'class_id', select: 'name level academic_year' });

        if (!studentProfile) {
            res.status(404).json({ message: 'Student profile not found' });
            return;
        }

        const classInfo = studentProfile.class_id as any;

        // Timetable for the student's level (all classes in the same level share one timetable)
        let timetables: any[] = [];
        if (classInfo?.level) {
            timetables = await Timetable.find({ level: classInfo.level })
                .populate('subject_id', 'name code')
                .sort({ day_of_week: 1, start_time: 1 });
        }

        // Assignments for the student's class
        let assignments: any[] = [];
        if (classInfo?._id) {
            const classSubjects = await ClassSubject.find({ class_id: classInfo._id }).select('_id');
            assignments = await Assignment.find({ class_subject_id: { $in: classSubjects.map((cs) => cs._id) } })
                .populate({ path: 'class_subject_id', populate: { path: 'subject_id', select: 'name code' } })
                .sort({ due_date: 1 });
        }

        res.json({
            class: classInfo ? { _id: classInfo._id, name: classInfo.name, level: classInfo.level } : null,
            timetables,
            assignments,
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
        const fees = await Fee.find().populate({
            path: 'student_id',
            populate: { path: 'user_id', select: 'full_name' },
        });

        const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
        const outstanding = fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);

        // Aggregate per-student totals per status
        const studentMap: Record<string, { name: string; paid: number; pending: number; overdue: number }> = {};
        for (const fee of fees) {
            const s = fee.student_id as any;
            const id = String(s?._id || fee.student_id);
            const name = s?.user_id?.full_name || 'Unknown Student';
            if (!studentMap[id]) studentMap[id] = { name, paid: 0, pending: 0, overdue: 0 };
            studentMap[id][fee.status as 'paid' | 'pending' | 'overdue'] += fee.amount;
        }

        const rows = Object.values(studentMap);
        const sort = (arr: typeof rows, key: 'paid' | 'pending' | 'overdue') =>
            [...arr].sort((a, b) => b[key] - a[key]).slice(0, 10).map(r => ({ name: r.name, amount: r[key] }));

        res.json({
            totalRevenue,
            outstanding,
            paymentStats: [
                { status: 'Paid',    count: fees.filter(f => f.status === 'paid').length },
                { status: 'Pending', count: fees.filter(f => f.status === 'pending').length },
                { status: 'Overdue', count: fees.filter(f => f.status === 'overdue').length },
            ],
            topPaid:    sort(rows, 'paid'),
            topPending: sort(rows, 'pending'),
            topOverdue: sort(rows, 'overdue'),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeacherPerformanceReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const teachers = await Teacher.find().populate('user_id');

        const teacherData = await Promise.all(teachers.map(async (t) => {
            const [marked, present, late, absent, assignmentsCount, classSubjectsCount] = await Promise.all([
                TeacherAttendance.countDocuments({ teacher_id: t._id }),
                TeacherAttendance.countDocuments({ teacher_id: t._id, status: 'present' }),
                TeacherAttendance.countDocuments({ teacher_id: t._id, status: 'late' }),
                TeacherAttendance.countDocuments({ teacher_id: t._id, status: 'absent' }),
                Assignment.countDocuments({ teacher_id: t._id }),
                ClassSubject.countDocuments({ teacher_id: t._id }),
            ]);

            const attendanceRate = marked > 0 ? Math.round(((present + late) / marked) * 100) : null;

            return {
                name: (t.user_id as any)?.full_name || 'Unknown',
                email: (t.user_id as any)?.email || '',
                specialization: t.specialization || 'General',
                attendanceRate,         // number | null
                attendanceDays: { marked, present, late, absent },
                assignmentsCount,
                classesCount: classSubjectsCount,
            };
        }));

        const ratedTeachers = teacherData.filter(t => t.attendanceRate !== null);
        const avgAttendance = ratedTeachers.length > 0
            ? Math.round(ratedTeachers.reduce((s, t) => s + (t.attendanceRate as number), 0) / ratedTeachers.length)
            : 0;

        const topPerformer = ratedTeachers.sort((a, b) => (b.attendanceRate as number) - (a.attendanceRate as number))[0] || null;
        const atRisk = teacherData.filter(t => t.attendanceRate !== null && (t.attendanceRate as number) < 75).length;

        res.json({
            teachers: teacherData,
            summary: {
                total: teachers.length,
                avgAttendance,
                topPerformer: topPerformer?.name || null,
                atRisk,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

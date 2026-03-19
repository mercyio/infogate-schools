"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentDashboardStats = exports.getTeacherDashboardStats = exports.getAdminDashboardStats = void 0;
const Student_1 = __importDefault(require("../models/Student"));
const Teacher_1 = __importDefault(require("../models/Teacher"));
const Fee_1 = __importDefault(require("../models/Fee"));
const Class_1 = __importDefault(require("../models/Class"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
const getAdminDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student_1.default.countDocuments();
        const totalTeachers = await Teacher_1.default.countDocuments();
        // Sum up paid fees
        const fees = await Fee_1.default.find({ status: 'paid' });
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAdminDashboardStats = getAdminDashboardStats;
const getTeacherDashboardStats = async (req, res) => {
    try {
        // Assume req.user.id maps directly to Teacher model user_id, 
        // need to lookup Teacher document first using user_id from token
        const teacher = await Teacher_1.default.findOne({ user_id: req.user.id });
        let classesCount = 0;
        let activeAssignments = 0;
        if (teacher) {
            // Found the teacher, check assignments they created
            classesCount = await Class_1.default.countDocuments({ class_teacher_id: teacher._id });
            activeAssignments = await Assignment_1.default.countDocuments({ teacher_id: teacher._id, due_date: { $gte: new Date() } });
        }
        res.json({
            classesCount,
            activeAssignments,
            unreadMessages: 0 // Placeholder
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getTeacherDashboardStats = getTeacherDashboardStats;
const getStudentDashboardStats = async (req, res) => {
    try {
        res.json({
            attendance: '98%',
            gpa: '3.8',
            upcomingAssignments: 2,
            unreadMessages: 1
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getStudentDashboardStats = getStudentDashboardStats;

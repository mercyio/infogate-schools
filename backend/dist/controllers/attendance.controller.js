"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAttendance = exports.getAttendance = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const getAttendance = async (req, res) => {
    try {
        let query = {};
        if (req.query.student_id) {
            query = { student_id: req.query.student_id };
        }
        const records = await Attendance_1.default.find(query).populate('student_id').populate('class_id');
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAttendance = getAttendance;
const markAttendance = async (req, res) => {
    try {
        const records = req.body.records; // Array of { student_id, class_id, date, status, remarks }
        const marked_by = req.user.id;
        const formattedRecords = records.map((record) => ({
            ...record,
            marked_by
        }));
        const result = await Attendance_1.default.insertMany(formattedRecords);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};
exports.markAttendance = markAttendance;

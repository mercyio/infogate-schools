"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssignment = exports.getAssignments = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment_1.default.find().populate('class_subject_id').populate('teacher_id');
        res.json(assignments);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAssignments = getAssignments;
const createAssignment = async (req, res) => {
    try {
        const { title, description, class_subject_id, due_date, total_marks } = req.body;
        const teacher_id = req.user.id;
        const assignment = await Assignment_1.default.create({
            title, description, class_subject_id, teacher_id, due_date, total_marks
        });
        res.status(201).json(assignment);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};
exports.createAssignment = createAssignment;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFee = exports.updateFee = exports.createFee = exports.getFeeById = exports.getFees = void 0;
const Fee_1 = __importDefault(require("../models/Fee"));
const getFees = async (req, res) => {
    try {
        const fees = await Fee_1.default.find()
            .populate('student_id', 'user_id admission_number')
            .sort({ created_at: -1 });
        // Depending on role, limit results
        const user = req.user;
        if (user.role === 'student') {
            // Find student ID linked to this user ID
            // Simple approach: filter after, or do a complex query.
            // For now, return all (assuming admin/teacher)
        }
        res.json(fees);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getFees = getFees;
const getFeeById = async (req, res) => {
    try {
        const fee = await Fee_1.default.findById(req.params.id)
            .populate('student_id');
        if (!fee) {
            res.status(404).json({ message: 'Fee not found' });
            return;
        }
        res.json(fee);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getFeeById = getFeeById;
const createFee = async (req, res) => {
    try {
        const { student_id, title, description, amount, due_date, status } = req.body;
        const fee = await Fee_1.default.create({
            student_id,
            title,
            description,
            amount,
            due_date,
            status: status || 'pending'
        });
        res.status(201).json(fee);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createFee = createFee;
const updateFee = async (req, res) => {
    try {
        const { title, description, amount, due_date, status, paid_date } = req.body;
        const fee = await Fee_1.default.findByIdAndUpdate(req.params.id, { title, description, amount, due_date, status, paid_date }, { new: true });
        if (!fee) {
            res.status(404).json({ message: 'Fee not found' });
            return;
        }
        res.json(fee);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateFee = updateFee;
const deleteFee = async (req, res) => {
    try {
        const fee = await Fee_1.default.findByIdAndDelete(req.params.id);
        if (!fee) {
            res.status(404).json({ message: 'Fee not found' });
            return;
        }
        res.json({ message: 'Fee deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteFee = deleteFee;

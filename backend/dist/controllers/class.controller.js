"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClass = exports.updateClass = exports.createClass = exports.getClassById = exports.getClasses = void 0;
const Class_1 = __importDefault(require("../models/Class"));
const getClasses = async (req, res) => {
    try {
        const classes = await Class_1.default.find().populate('class_teacher_id', 'full_name');
        res.json(classes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getClasses = getClasses;
const getClassById = async (req, res) => {
    try {
        const classInfo = await Class_1.default.findById(req.params.id).populate('class_teacher_id', 'full_name');
        if (classInfo) {
            res.json(classInfo);
        }
        else {
            res.status(404).json({ message: 'Class not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getClassById = getClassById;
const createClass = async (req, res) => {
    try {
        const newClass = await Class_1.default.create(req.body);
        res.status(201).json(newClass);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};
exports.createClass = createClass;
const updateClass = async (req, res) => {
    try {
        const updatedClass = await Class_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('class_teacher_id', 'full_name');
        if (!updatedClass) {
            res.status(404).json({ message: 'Class not found' });
            return;
        }
        res.json(updatedClass);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateClass = updateClass;
const deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class_1.default.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            res.status(404).json({ message: 'Class not found' });
            return;
        }
        res.json({ message: 'Class deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteClass = deleteClass;

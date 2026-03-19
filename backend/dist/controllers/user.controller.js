"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteParent = exports.updateParent = exports.getParentById = exports.deleteTeacher = exports.updateTeacher = exports.getTeacherById = exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.createParent = exports.createTeacher = exports.createStudent = exports.getParents = exports.getTeachers = exports.getStudents = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const Student_1 = __importDefault(require("../models/Student"));
const Teacher_1 = __importDefault(require("../models/Teacher"));
const Parent_1 = __importDefault(require("../models/Parent"));
const generateRegNumber = async (role) => {
    const rolePrefix = {
        student: 'STU',
        teacher: 'TEA',
        parent: 'PAR',
        admin: 'ADM',
    };
    const prefix = rolePrefix[role] || role.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const count = await User_1.default.countDocuments({ role });
    const sequence = (count + 1).toString().padStart(4, '0');
    return `IG/${year}/${prefix}-${sequence}`;
};
const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
};
const getStudents = async (req, res) => {
    try {
        const students = await Student_1.default.find().populate('user_id', '-passwordHash').populate('class_id');
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getStudents = getStudents;
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher_1.default.find().populate('user_id', '-passwordHash');
        res.json(teachers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getTeachers = getTeachers;
const getParents = async (req, res) => {
    try {
        const parents = await Parent_1.default.find().populate('user_id', '-passwordHash');
        res.json(parents);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getParents = getParents;
const createStudent = async (req, res) => {
    try {
        const { full_name, email, phone, class_id, date_of_birth, gender, address, emergency_contact } = req.body;
        const reg_number = await generateRegNumber('student');
        const password = generateRandomPassword();
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const user = await User_1.default.create({
            reg_number,
            email,
            passwordHash,
            role: 'student',
            full_name,
            phone,
        });
        const student = await Student_1.default.create({
            user_id: user._id,
            admission_number: reg_number,
            class_id,
            date_of_birth,
            gender,
            address,
            emergency_contact
        });
        res.status(201).json({
            message: 'Student created successfully',
            credentials: { reg_number, password },
            student
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createStudent = createStudent;
const createTeacher = async (req, res) => {
    try {
        const { full_name, email, phone, specialization, qualification } = req.body;
        const reg_number = await generateRegNumber('teacher');
        const password = generateRandomPassword();
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const user = await User_1.default.create({
            reg_number,
            email,
            passwordHash,
            role: 'teacher',
            full_name,
            phone,
        });
        const teacher = await Teacher_1.default.create({
            user_id: user._id,
            employee_id: reg_number,
            specialization,
            qualification
        });
        res.status(201).json({
            message: 'Teacher created successfully',
            credentials: { reg_number, password },
            teacher
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createTeacher = createTeacher;
const createParent = async (req, res) => {
    try {
        const { full_name, email, phone, occupation, relationship } = req.body;
        const reg_number = await generateRegNumber('parent');
        const password = generateRandomPassword();
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const user = await User_1.default.create({
            reg_number,
            email,
            passwordHash,
            role: 'parent',
            full_name,
            phone,
        });
        const parent = await Parent_1.default.create({
            user_id: user._id,
            occupation,
            relationship
        });
        res.status(201).json({
            message: 'Parent created successfully',
            credentials: { reg_number, password },
            parent
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createParent = createParent;
const getStudentById = async (req, res) => {
    try {
        const student = await Student_1.default.findById(req.params.id).populate('user_id', '-passwordHash').populate('class_id');
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getStudentById = getStudentById;
const updateStudent = async (req, res) => {
    try {
        const student = await Student_1.default.findById(req.params.id);
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        const { full_name, email, phone, class_id, date_of_birth, gender, address, emergency_contact, status } = req.body;
        await User_1.default.findByIdAndUpdate(student.user_id, { full_name, email, phone }, { new: true });
        const updatedStudent = await Student_1.default.findByIdAndUpdate(req.params.id, {
            class_id, date_of_birth, gender, address, emergency_contact, status
        }, { new: true }).populate('user_id', '-passwordHash').populate('class_id');
        res.json(updatedStudent);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateStudent = updateStudent;
const deleteStudent = async (req, res) => {
    try {
        const student = await Student_1.default.findById(req.params.id);
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        await User_1.default.findByIdAndDelete(student.user_id);
        await Student_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student and associated user account deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteStudent = deleteStudent;
const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher_1.default.findById(req.params.id).populate('user_id', '-passwordHash');
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return;
        }
        res.json(teacher);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getTeacherById = getTeacherById;
const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher_1.default.findById(req.params.id);
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return;
        }
        const { full_name, email, phone, specialization, qualification, status } = req.body;
        await User_1.default.findByIdAndUpdate(teacher.user_id, { full_name, email, phone }, { new: true });
        const updatedTeacher = await Teacher_1.default.findByIdAndUpdate(req.params.id, {
            specialization, qualification, status
        }, { new: true }).populate('user_id', '-passwordHash');
        res.json(updatedTeacher);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateTeacher = updateTeacher;
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher_1.default.findById(req.params.id);
        if (!teacher) {
            res.status(404).json({ message: 'Teacher not found' });
            return;
        }
        await User_1.default.findByIdAndDelete(teacher.user_id);
        await Teacher_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Teacher and associated user account deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteTeacher = deleteTeacher;
const getParentById = async (req, res) => {
    try {
        const parent = await Parent_1.default.findById(req.params.id).populate('user_id', '-passwordHash');
        if (!parent) {
            res.status(404).json({ message: 'Parent not found' });
            return;
        }
        res.json(parent);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getParentById = getParentById;
const updateParent = async (req, res) => {
    try {
        const parent = await Parent_1.default.findById(req.params.id);
        if (!parent) {
            res.status(404).json({ message: 'Parent not found' });
            return;
        }
        const { full_name, email, phone, occupation, relationship } = req.body;
        await User_1.default.findByIdAndUpdate(parent.user_id, { full_name, email, phone }, { new: true });
        const updatedParent = await Parent_1.default.findByIdAndUpdate(req.params.id, {
            occupation, relationship
        }, { new: true }).populate('user_id', '-passwordHash');
        res.json(updatedParent);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateParent = updateParent;
const deleteParent = async (req, res) => {
    try {
        const parent = await Parent_1.default.findById(req.params.id);
        if (!parent) {
            res.status(404).json({ message: 'Parent not found' });
            return;
        }
        await User_1.default.findByIdAndDelete(parent.user_id);
        await Parent_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Parent and associated user account deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteParent = deleteParent;

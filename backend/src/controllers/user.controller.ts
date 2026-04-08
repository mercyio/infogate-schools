import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Parent from '../models/Parent';
import Class from '../models/Class';

const generateRegNumber = async (role: string): Promise<string> => {
    const rolePrefix: Record<string, string> = {
        student: 'STU',
        teacher: 'TEA',
        parent: 'PAR',
        admin: 'ADM',
    };
    const prefix = rolePrefix[role] || role.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const count = await User.countDocuments({ role });
    const sequence = (count + 1).toString().padStart(4, '0');
    return `IG/${year}/${prefix}-${sequence}`;
};

const generateRandomPassword = (): string => {
    return Math.random().toString(36).slice(-8);
};

export const getStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        const { class_id } = req.query;
        const filter: any = {};
        if (class_id) filter.class_id = class_id;

        const students = await Student.find(filter)
            .populate({
                path: 'user_id',
                select: '-passwordHash',
                match: { role: 'student' }
            })
            .populate('class_id');
        
        const realStudents = students.filter(student => student.user_id);
        res.json(realStudents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeachers = async (req: Request, res: Response): Promise<void> => {
    try {
        const teachers = await Teacher.find()
            .populate('user_id', '-passwordHash')
            .populate('assigned_class');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getParents = async (req: Request, res: Response): Promise<void> => {
    try {
        const parents = await Parent.find().populate('user_id', '-passwordHash');
        res.json(parents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            full_name, email, phone, class_id, date_of_birth, gender, address, emergency_contact,
            program, grade, parent_name, parent_email, parent_phone, medical_info
        } = req.body;

        const reg_number = await generateRegNumber('student');
        const password = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            reg_number,
            email,
            passwordHash,
            role: 'student',
            full_name,
            phone,
        });

        const student = await Student.create({
            user_id: user._id,
            admission_number: reg_number,
            class_id,
            date_of_birth,
            gender,
            address,
            emergency_contact,
            program,
            grade,
            parent_name,
            parent_email,
            parent_phone,
            medical_info
        });

        res.status(201).json({
            message: 'Student created successfully',
            credentials: { reg_number, password },
            student
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, phone, role, assigned_class, assigned_subject, experience, address, qualification, specialization } = req.body;

        const reg_number = await generateRegNumber('teacher');
        const password = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            reg_number,
            email,
            passwordHash,
            role: 'teacher',
            full_name,
            phone,
        });

        const teacher = await Teacher.create({
            user_id: user._id,
            employee_id: reg_number,
            role,
            assigned_class: assigned_class || null,
            assigned_subject,
            experience,
            address,
            qualification,
            specialization
        });

        // Link class to teacher if assigned
        if (assigned_class) {
            await Class.findByIdAndUpdate(assigned_class, { class_teacher_id: teacher._id });
        }

        res.status(201).json({
            message: 'Teacher created successfully',
            credentials: { reg_number, password },
            teacher
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createParent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, phone, occupation, relationship } = req.body;

        const reg_number = await generateRegNumber('parent');
        const password = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            reg_number,
            email,
            passwordHash,
            role: 'parent',
            full_name,
            phone,
        });

        const parent = await Parent.create({
            user_id: user._id,
            occupation,
            relationship
        });

        res.status(201).json({
            message: 'Parent created successfully',
            credentials: { reg_number, password },
            parent
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id).populate('user_id', '-passwordHash').populate('class_id');
        if (!student) { res.status(404).json({ message: 'Student not found' }); return; }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) { res.status(404).json({ message: 'Student not found' }); return; }

        const { 
            full_name, email, phone, class_id, date_of_birth, gender, address, emergency_contact, status,
            program, grade, parent_name, parent_email, parent_phone, medical_info 
        } = req.body;

        await User.findByIdAndUpdate(student.user_id, { full_name, email, phone }, { new: true });

        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, {
            class_id, date_of_birth, gender, address, emergency_contact, status,
            program, grade, parent_name, parent_email, parent_phone, medical_info
        }, { new: true }).populate('user_id', '-passwordHash').populate('class_id');

        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) { res.status(404).json({ message: 'Student not found' }); return; }

        await User.findByIdAndDelete(student.user_id);
        await Student.findByIdAndDelete(req.params.id);

        res.json({ message: 'Student and associated user account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeacherById = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('user_id', '-passwordHash');
        if (!teacher) { res.status(404).json({ message: 'Teacher not found' }); return; }
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) { res.status(404).json({ message: 'Teacher not found' }); return; }

        const { full_name, email, phone, role, assigned_class, assigned_subject, experience, address, qualification, specialization, status } = req.body;

        const oldAssignedClass = teacher.assigned_class;

        await User.findByIdAndUpdate(teacher.user_id, { full_name, email, phone }, { new: true });

        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, {
            role, 
            assigned_class: assigned_class || null, 
            assigned_subject, 
            experience, 
            address, 
            qualification, 
            specialization, 
            status
        }, { new: true })
        .populate('user_id', '-passwordHash')
        .populate('assigned_class');

        // Handing class synchronization
        if (assigned_class && String(assigned_class) !== String(oldAssignedClass)) {
            // Unlink old class
            if (oldAssignedClass) {
                await Class.findByIdAndUpdate(oldAssignedClass, { class_teacher_id: null });
            }
            // Link new class
            await Class.findByIdAndUpdate(assigned_class, { class_teacher_id: teacher._id });
        } else if (!assigned_class && oldAssignedClass) {
            // Unlink if class assignment was removed
            await Class.findByIdAndUpdate(oldAssignedClass, { class_teacher_id: null });
        }

        res.json(updatedTeacher);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) { res.status(404).json({ message: 'Teacher not found' }); return; }

        await User.findByIdAndDelete(teacher.user_id);
        await Teacher.findByIdAndDelete(req.params.id);

        res.json({ message: 'Teacher and associated user account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getParentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const parent = await Parent.findById(req.params.id).populate('user_id', '-passwordHash');
        if (!parent) { res.status(404).json({ message: 'Parent not found' }); return; }
        res.json(parent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateParent = async (req: Request, res: Response): Promise<void> => {
    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) { res.status(404).json({ message: 'Parent not found' }); return; }

        const { full_name, email, phone, occupation, relationship } = req.body;

        await User.findByIdAndUpdate(parent.user_id, { full_name, email, phone }, { new: true });

        const updatedParent = await Parent.findByIdAndUpdate(req.params.id, {
            occupation, relationship
        }, { new: true }).populate('user_id', '-passwordHash');

        res.json(updatedParent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteParent = async (req: Request, res: Response): Promise<void> => {
    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) { res.status(404).json({ message: 'Parent not found' }); return; }

        await User.findByIdAndDelete(parent.user_id);
        await Parent.findByIdAndDelete(req.params.id);

        res.json({ message: 'Parent and associated user account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getMeTeacher = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const teacher = await Teacher.findOne({ user_id: req.user.id }).populate('user_id', '-passwordHash');
        if (!teacher) {
            res.status(404).json({ message: 'Teacher profile not found' });
            return;
        }
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

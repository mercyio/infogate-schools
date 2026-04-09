import { Request, Response } from 'express';
import Class from '../models/Class';
import ClassSubject from '../models/ClassSubject';

export const getClasses = async (req: Request, res: Response): Promise<void> => {
    try {
        const classes = await Class.find().populate({
            path: 'class_teacher_id',
            populate: {
                path: 'user_id',
                select: 'full_name email phone'
            }
        });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getClassById = async (req: Request, res: Response): Promise<void> => {
    try {
        const classInfo = await Class.findById(req.params.id).populate({
            path: 'class_teacher_id',
            populate: {
                path: 'user_id',
                select: 'full_name email phone'
            }
        });
        if (classInfo) {
            res.json(classInfo);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, level, capacity, academic_year, class_teacher_id, subjects, fee_structure } = req.body;
        
        // Ensure class_teacher_id is null if empty string
        const teacherId = class_teacher_id === "" ? null : class_teacher_id;

        const newClass = await Class.create({
            name,
            level,
            capacity,
            academic_year,
            class_teacher_id: teacherId,
            fee_structure
        });

        // Link subjects if provided
        if (subjects && Array.isArray(subjects)) {
            const classSubjectLinks = subjects.map(subjectId => ({
                class_id: newClass._id,
                subject_id: subjectId
            }));
            await ClassSubject.insertMany(classSubjectLinks);
        }

        res.status(201).json(newClass);
    } catch (error) {
        console.error('Create Class Error:', error);
        res.status(400).json({ message: 'Invalid data', error });
    }
};
export const updateClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('class_teacher_id', 'full_name');
        if (!updatedClass) { res.status(404).json({ message: 'Class not found' }); return; }
        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) { res.status(404).json({ message: 'Class not found' }); return; }
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

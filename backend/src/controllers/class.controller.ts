import { Request, Response } from 'express';
import Class from '../models/Class';

export const getClasses = async (req: Request, res: Response): Promise<void> => {
    try {
        const classes = await Class.find().populate('class_teacher_id', 'full_name');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getClassById = async (req: Request, res: Response): Promise<void> => {
    try {
        const classInfo = await Class.findById(req.params.id).populate('class_teacher_id', 'full_name');
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
        const newClass = await Class.create(req.body);
        res.status(201).json(newClass);
    } catch (error) {
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

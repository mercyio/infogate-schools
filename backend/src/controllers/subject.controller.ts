import { Request, Response } from 'express';
import Subject from '../models/Subject';
import ClassSubject from '../models/ClassSubject';

export const getSubjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getSubjectsByClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const { classId } = req.params;
        const classSubjects = await ClassSubject.find({ class_id: classId }).populate('subject_id');
        const subjects = classSubjects.map(cs => cs.subject_id);
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createSubject = async (req: Request, res: Response): Promise<void> => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

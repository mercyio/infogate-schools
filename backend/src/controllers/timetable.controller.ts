import { Request, Response } from 'express';
import Timetable from '../models/Timetable';
import ClassSubject from '../models/ClassSubject';

const isValidTime = (value: string): boolean => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export const getTimetables = async (req: Request, res: Response): Promise<void> => {
    try {
        const filter: Record<string, unknown> = {};
        if (req.query.class_id) {
            const classSubjects = await ClassSubject.find({ class_id: req.query.class_id }).select('_id');
            filter.class_subject_id = { $in: classSubjects.map((item) => item._id) };
        }

        const timetables = await Timetable.find(filter)
            .populate({
                path: 'class_subject_id',
                populate: [
                    { path: 'class_id', select: 'name level academic_year' },
                    { path: 'subject_id', select: 'name code' },
                    {
                        path: 'teacher_id',
                        populate: { path: 'user_id', select: 'full_name email' },
                    },
                ],
            })
            .sort({ day_of_week: 1, start_time: 1 });

        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTimetableClassSubjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const filter: Record<string, unknown> = {};
        if (req.query.class_id) {
            filter.class_id = req.query.class_id;
        }

        const classSubjects = await ClassSubject.find(filter)
            .populate('class_id', 'name level academic_year')
            .populate('subject_id', 'name code')
            .populate({
                path: 'teacher_id',
                populate: { path: 'user_id', select: 'full_name email' },
            })
            .sort({ createdAt: -1 });

        res.json(classSubjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { class_subject_id, day_of_week, start_time, end_time, room_number } = req.body;

        if (!class_subject_id || day_of_week === undefined || !start_time || !end_time) {
            res.status(400).json({ message: 'class_subject_id, day_of_week, start_time and end_time are required' });
            return;
        }

        if (!isValidTime(start_time) || !isValidTime(end_time)) {
            res.status(400).json({ message: 'start_time and end_time must be in HH:mm format' });
            return;
        }

        if (start_time >= end_time) {
            res.status(400).json({ message: 'end_time must be later than start_time' });
            return;
        }

        const classSubject = await ClassSubject.findById(class_subject_id).select('_id');
        if (!classSubject) {
            res.status(404).json({ message: 'Class-subject mapping not found' });
            return;
        }

        const duplicate = await Timetable.findOne({
            class_subject_id,
            day_of_week,
            start_time,
            end_time,
        });

        if (duplicate) {
            res.status(409).json({ message: 'This timetable slot already exists for the selected class and subject' });
            return;
        }

        const timetable = await Timetable.create({
            class_subject_id,
            day_of_week,
            start_time,
            end_time,
            room_number,
        });

        res.status(201).json(timetable);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

export const createTimetableBulk = async (req: Request, res: Response): Promise<void> => {
    try {
        const { entries } = req.body;

        if (!Array.isArray(entries) || entries.length === 0) {
            res.status(400).json({ message: 'entries must be a non-empty array' });
            return;
        }

        const normalizedEntries = entries
            .map((entry: any) => ({
                class_subject_id: entry?.class_subject_id,
                day_of_week: entry?.day_of_week,
                start_time: entry?.start_time,
                end_time: entry?.end_time,
                room_number: entry?.room_number,
            }))
            .filter((entry: any) => entry.class_subject_id && entry.start_time && entry.end_time && entry.day_of_week !== undefined);

        if (normalizedEntries.length === 0) {
            res.status(400).json({ message: 'No valid timetable rows were provided' });
            return;
        }

        for (const entry of normalizedEntries) {
            if (!isValidTime(entry.start_time) || !isValidTime(entry.end_time)) {
                res.status(400).json({ message: 'All start_time and end_time values must be in HH:mm format' });
                return;
            }

            if (entry.start_time >= entry.end_time) {
                res.status(400).json({ message: 'Every row must have end_time later than start_time' });
                return;
            }

            if (entry.day_of_week < 0 || entry.day_of_week > 6) {
                res.status(400).json({ message: 'day_of_week must be between 0 and 6 for all rows' });
                return;
            }
        }

        const classSubjectIds = [...new Set(normalizedEntries.map((entry: any) => String(entry.class_subject_id)))];
        const classSubjects = await ClassSubject.find({ _id: { $in: classSubjectIds } }).select('_id class_id');

        if (classSubjects.length !== classSubjectIds.length) {
            res.status(404).json({ message: 'One or more class-subject mappings were not found' });
            return;
        }

        const classIds = [...new Set(classSubjects.map((item) => String(item.class_id)))];
        if (classIds.length > 1) {
            res.status(400).json({ message: 'Bulk timetable save must target one class at a time' });
            return;
        }

        const uniquenessSet = new Set<string>();
        for (const entry of normalizedEntries) {
            const key = `${entry.class_subject_id}:${entry.day_of_week}:${entry.start_time}:${entry.end_time}`;
            if (uniquenessSet.has(key)) {
                res.status(409).json({ message: 'Duplicate timetable rows detected in request' });
                return;
            }
            uniquenessSet.add(key);
        }

        const existingRows = await Timetable.find({
            $or: normalizedEntries.map((entry: any) => ({
                class_subject_id: entry.class_subject_id,
                day_of_week: entry.day_of_week,
                start_time: entry.start_time,
                end_time: entry.end_time,
            })),
        }).select('_id');

        if (existingRows.length > 0) {
            res.status(409).json({ message: 'Some timetable rows already exist' });
            return;
        }

        const created = await Timetable.insertMany(normalizedEntries);
        res.status(201).json({ data: created, total: created.length });
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

export const updateTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { day_of_week, start_time, end_time } = req.body;

        if (start_time && !isValidTime(start_time)) {
            res.status(400).json({ message: 'start_time must be in HH:mm format' });
            return;
        }

        if (end_time && !isValidTime(end_time)) {
            res.status(400).json({ message: 'end_time must be in HH:mm format' });
            return;
        }

        if (start_time && end_time && start_time >= end_time) {
            res.status(400).json({ message: 'end_time must be later than start_time' });
            return;
        }

        if (day_of_week !== undefined && (day_of_week < 0 || day_of_week > 6)) {
            res.status(400).json({ message: 'day_of_week must be between 0 and 6' });
            return;
        }

        const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate({
                path: 'class_subject_id',
                populate: [
                    { path: 'class_id', select: 'name level academic_year' },
                    { path: 'subject_id', select: 'name code' },
                ],
            });

        if (!updated) {
            res.status(404).json({ message: 'Timetable entry not found' });
            return;
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await Timetable.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Timetable entry not found' });
            return;
        }

        res.json({ message: 'Timetable entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

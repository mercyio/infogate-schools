import { Request, Response } from 'express';
import Timetable from '../models/Timetable';
import ClassSubject from '../models/ClassSubject';
import Class from '../models/Class';

const isValidTime = (value: string): boolean => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
const VALID_LEVELS = ['nursery', 'primary', 'secondary', 'vocational'];

export const getTimetables = async (req: Request, res: Response): Promise<void> => {
    try {
        const filter: Record<string, unknown> = {};
        if (req.query.level) filter.level = (req.query.level as string).toLowerCase();

        const timetables = await Timetable.find(filter)
            .populate('subject_id', 'name code')
            .sort({ day_of_week: 1, start_time: 1 });

        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Returns unique subjects assigned to any class under the given level
export const getSubjectsByLevel = async (req: Request, res: Response): Promise<void> => {
    try {
        const { level } = req.query;
        if (!level) {
            res.status(400).json({ message: 'level query param is required' });
            return;
        }

        const classes = await Class.find({ level: (level as string).toLowerCase() }).select('_id');
        const classSubjects = await ClassSubject.find({
            class_id: { $in: classes.map((c) => c._id) },
        }).populate('subject_id', 'name code');

        const seen = new Map<string, any>();
        classSubjects.forEach((cs) => {
            const s = cs.subject_id as any;
            if (s?._id && !seen.has(String(s._id))) seen.set(String(s._id), s);
        });

        res.json(Array.from(seen.values()));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { level, subject_id, day_of_week, start_time, end_time, room_number } = req.body;

        if (!level || !subject_id || day_of_week === undefined || !start_time || !end_time) {
            res.status(400).json({ message: 'level, subject_id, day_of_week, start_time and end_time are required' });
            return;
        }

        if (!VALID_LEVELS.includes(level)) {
            res.status(400).json({ message: `level must be one of: ${VALID_LEVELS.join(', ')}` });
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

        const duplicate = await Timetable.findOne({ level, subject_id, day_of_week, start_time, end_time });
        if (duplicate) {
            res.status(409).json({ message: 'This timetable slot already exists for this level and subject' });
            return;
        }

        const timetable = await Timetable.create({ level, subject_id, day_of_week, start_time, end_time, room_number });
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

        const normalized = entries
            .map((e: any) => ({
                level: e?.level ? String(e.level).toLowerCase() : undefined,
                subject_id: e?.subject_id,
                day_of_week: e?.day_of_week,
                start_time: e?.start_time,
                end_time: e?.end_time,
                room_number: e?.room_number,
            }))
            .filter((e: any) => e.level && e.subject_id && e.start_time && e.end_time && e.day_of_week !== undefined);

        if (normalized.length === 0) {
            res.status(400).json({ message: 'No valid timetable rows provided' });
            return;
        }

        for (const entry of normalized) {
            if (!VALID_LEVELS.includes(entry.level)) {
                res.status(400).json({ message: `Invalid level "${entry.level}"` });
                return;
            }
            if (!isValidTime(entry.start_time) || !isValidTime(entry.end_time)) {
                res.status(400).json({ message: 'All times must be in HH:mm format' });
                return;
            }
            if (entry.start_time >= entry.end_time) {
                res.status(400).json({ message: 'end_time must be later than start_time for every row' });
                return;
            }
            if (entry.day_of_week < 0 || entry.day_of_week > 6) {
                res.status(400).json({ message: 'day_of_week must be 0–6' });
                return;
            }
        }

        // Ensure all entries target a single level
        const levels = [...new Set(normalized.map((e: any) => e.level))];
        if (levels.length > 1) {
            res.status(400).json({ message: 'Bulk save must target one level at a time' });
            return;
        }

        // Duplicate check within request
        const uniquenessSet = new Set<string>();
        for (const entry of normalized) {
            const key = `${entry.subject_id}:${entry.day_of_week}:${entry.start_time}:${entry.end_time}`;
            if (uniquenessSet.has(key)) {
                res.status(409).json({ message: 'Duplicate rows detected in request' });
                return;
            }
            uniquenessSet.add(key);
        }

        const created = await Timetable.insertMany(normalized);
        res.status(201).json({ data: created, total: created.length });
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

export const updateTimetable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { start_time, end_time, day_of_week } = req.body;

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
            res.status(400).json({ message: 'day_of_week must be 0–6' });
            return;
        }

        const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('subject_id', 'name code');

        if (!updated) {
            res.status(404).json({ message: 'Timetable entry not found' });
            return;
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteTimetablesByLevel = async (req: Request, res: Response): Promise<void> => {
    try {
        const level = req.params.level?.toLowerCase();
        if (!level || !VALID_LEVELS.includes(level)) {
            res.status(400).json({ message: 'Invalid level' });
            return;
        }
        const result = await Timetable.deleteMany({ level });
        res.json({ deleted: result.deletedCount });
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

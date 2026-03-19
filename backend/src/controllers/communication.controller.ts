import { Request, Response } from 'express';
import Announcement from '../models/Announcement';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcements = await Announcement.find().populate('created_by', 'full_name');
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, content, target_audience, priority, expires_at } = req.body;
        const created_by = req.user.id;

        const announcement = await Announcement.create({
            title, content, target_audience, priority, expires_at, created_by
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await Event.find().populate('created_by', 'full_name');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, event_date, start_time, end_time, location, target_audience } = req.body;
        const created_by = req.user.id;

        const event = await Event.create({
            title, description, event_date, start_time, end_time, location, target_audience, created_by
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};

import { Request, Response } from 'express';
import Announcement from '../models/Announcement';

export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcements = await Announcement.find()
            .populate('author', 'full_name role')
            .populate('class_id', 'name level')
            .sort({ date_posted: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAnnouncementById = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('author', 'full_name role')
            .populate('class_id', 'name level');
        if (!announcement) { res.status(404).json({ message: 'Announcement not found' }); return; }
        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, target_audience, class_id } = req.body;
        // User from protect middleware
        const author = (req as any).user.id;

        const announcement = await Announcement.create({
            title,
            content,
            target_audience,
            class_id,
            author,
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateAnnouncement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, target_audience, class_id, status } = req.body;
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { title, content, target_audience, class_id, status },
            { new: true }
        ).populate('author', 'full_name role');

        if (!announcement) { res.status(404).json({ message: 'Announcement not found' }); return; }
        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) { res.status(404).json({ message: 'Announcement not found' }); return; }
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

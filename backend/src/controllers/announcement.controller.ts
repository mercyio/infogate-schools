import { Request, Response } from 'express';
import Announcement from '../models/Announcement';

export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcements = await Announcement.find()
            .populate('author', 'full_name role avatar_url')
            .sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAnnouncementById = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('author', 'full_name role avatar_url');
        if (!announcement) { res.status(404).json({ message: 'Announcement not found' }); return; }
        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, target_audience, priority, expires_at } = req.body;
        const author = (req as any).user.id; // Corrected from _id to id to match JWT payload

        const announcement = await Announcement.create({
            title,
            content,
            target_audience,
            priority,
            expires_at,
            author,
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateAnnouncement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, target_audience, priority, status, expires_at } = req.body;
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { title, content, target_audience, priority, status, expires_at },
            { new: true }
        ).populate('author', 'full_name role avatar_url');

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

export const likeAnnouncement = async (req: Request, res: Response): Promise<void> => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) { res.status(404).json({ message: 'Announcement not found' }); return; }

        // Simulating a toggle for now as we don't have a separate Likes model
        // In a real app, you'd check if the user already liked it
        announcement.likes += 1;
        await announcement.save();

        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

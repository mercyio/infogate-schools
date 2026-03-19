"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncement = exports.updateAnnouncement = exports.createAnnouncement = exports.getAnnouncementById = exports.getAnnouncements = void 0;
const Announcement_1 = __importDefault(require("../models/Announcement"));
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement_1.default.find()
            .populate('author', 'full_name role')
            .populate('class_id', 'name level')
            .sort({ date_posted: -1 });
        res.json(announcements);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAnnouncements = getAnnouncements;
const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement_1.default.findById(req.params.id)
            .populate('author', 'full_name role')
            .populate('class_id', 'name level');
        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }
        res.json(announcement);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAnnouncementById = getAnnouncementById;
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, target_audience, class_id } = req.body;
        // User from protect middleware
        const author = req.user.id;
        const announcement = await Announcement_1.default.create({
            title,
            content,
            target_audience,
            class_id,
            author,
        });
        res.status(201).json(announcement);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createAnnouncement = createAnnouncement;
const updateAnnouncement = async (req, res) => {
    try {
        const { title, content, target_audience, class_id, status } = req.body;
        const announcement = await Announcement_1.default.findByIdAndUpdate(req.params.id, { title, content, target_audience, class_id, status }, { new: true }).populate('author', 'full_name role');
        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }
        res.json(announcement);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement_1.default.findByIdAndDelete(req.params.id);
        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }
        res.json({ message: 'Announcement deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteAnnouncement = deleteAnnouncement;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = exports.getEvents = exports.createAnnouncement = exports.getAnnouncements = void 0;
const Announcement_1 = __importDefault(require("../models/Announcement"));
const Event_1 = __importDefault(require("../models/Event"));
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement_1.default.find().populate('created_by', 'full_name');
        res.json(announcements);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAnnouncements = getAnnouncements;
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, target_audience, priority, expires_at } = req.body;
        const created_by = req.user.id;
        const announcement = await Announcement_1.default.create({
            title, content, target_audience, priority, expires_at, created_by
        });
        res.status(201).json(announcement);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};
exports.createAnnouncement = createAnnouncement;
const getEvents = async (req, res) => {
    try {
        const events = await Event_1.default.find().populate('created_by', 'full_name');
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getEvents = getEvents;
const createEvent = async (req, res) => {
    try {
        const { title, description, event_date, start_time, end_time, location, target_audience } = req.body;
        const created_by = req.user.id;
        const event = await Event_1.default.create({
            title, description, event_date, start_time, end_time, location, target_audience, created_by
        });
        res.status(201).json(event);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};
exports.createEvent = createEvent;

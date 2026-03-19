"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubject = exports.getSubjects = void 0;
const Subject_1 = __importDefault(require("../models/Subject"));
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject_1.default.find();
        res.json(subjects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getSubjects = getSubjects;
const createSubject = async (req, res) => {
    try {
        const subject = await Subject_1.default.create(req.body);
        res.status(201).json(subject);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data', error });
    }
};
exports.createSubject = createSubject;

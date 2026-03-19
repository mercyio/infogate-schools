"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.updatePassword = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'supersecretjwtkey_please_change_in_production', {
        expiresIn: '30d',
    });
};
// generateRegNumber and generateRandomPassword have been moved to admin controllers
const login = async (req, res) => {
    try {
        const { reg_number, password } = req.body;
        const user = await User_1.default.findOne({ reg_number });
        if (user && (await bcrypt_1.default.compare(password, user.passwordHash))) {
            res.json({
                _id: user.id,
                reg_number: user.reg_number,
                email: user.email,
                role: user.role,
                full_name: user.full_name,
                token: generateToken(user.id, user.role),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid registration number or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.login = login;
const updatePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (!(await bcrypt_1.default.compare(old_password, user.passwordHash))) {
            res.status(401).json({ message: 'Incorrect old password' });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        user.passwordHash = await bcrypt_1.default.hash(new_password, salt);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updatePassword = updatePassword;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select('-passwordHash');
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getMe = getMe;

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretjwtkey_please_change_in_production', {
        expiresIn: '30d',
    });
};

// generateRegNumber and generateRandomPassword have been moved to admin controllers



export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reg_number, password } = req.body;

        const normalizedRegNumber = String(reg_number || '').trim();
        const submittedPassword = String(password || '');

        if (!normalizedRegNumber || !submittedPassword) {
            res.status(400).json({ message: 'Registration number and password are required' });
            return;
        }

        const user = await User.findOne({ reg_number: normalizedRegNumber });

        if (!user) {
            res.status(401).json({ message: 'Invalid registration number or password' });
            return;
        }

        const passwordMatches = user.passwordHash
            ? await bcrypt.compare(submittedPassword, user.passwordHash)
            : user.password === submittedPassword;

        if (passwordMatches) {
            res.json({
                _id: user.id,
                reg_number: user.reg_number,
                email: user.email,
                role: user.role,
                full_name: user.full_name,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid registration number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updatePassword = async (req: any, res: Response): Promise<void> => {
    try {
        const { old_password, new_password } = req.body;



        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!(await bcrypt.compare(old_password, user.passwordHash))) {
            res.status(401).json({ message: 'Incorrect old password' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(new_password, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
    try {

        const user = await User.findById(req.user.id).select('-passwordHash -password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

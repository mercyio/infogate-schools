import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface IUser extends Document {
    reg_number: string;
    email?: string;
    passwordHash: string;
    role: UserRole;
    full_name: string;
    avatar_url?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        reg_number: { type: String, required: true, unique: true },
        email: { type: String },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['admin', 'teacher', 'student', 'parent'], required: true },
        full_name: { type: String, required: true },
        avatar_url: { type: String },
        phone: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);

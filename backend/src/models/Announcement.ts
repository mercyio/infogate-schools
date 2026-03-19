import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from './User';

export type Priority = 'low' | 'medium' | 'high';

export interface IAnnouncement extends Document {
    title: string;
    content: string;
    created_by: mongoose.Types.ObjectId;
    target_audience: UserRole[];
    priority: Priority;
    expires_at?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        target_audience: [{ type: String, enum: ['admin', 'teacher', 'student', 'parent'] }],
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
        expires_at: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

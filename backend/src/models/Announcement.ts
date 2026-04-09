import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from './User';

export type Priority = 'low' | 'medium' | 'high' | 'normal';

export interface IAnnouncement extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    target_audience: string[];
    priority: Priority;
    likes: number;
    comments: number;
    expires_at?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        target_audience: [{ type: String }],
        priority: { type: String, enum: ['low', 'medium', 'high', 'normal'], default: 'normal' },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        expires_at: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

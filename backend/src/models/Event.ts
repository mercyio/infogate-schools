import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from './User';

export interface IEvent extends Document {
    title: string;
    description?: string;
    event_date: Date;
    start_time?: string;
    end_time?: string;
    location?: string;
    created_by: mongoose.Types.ObjectId;
    target_audience: UserRole[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        event_date: { type: Date, required: true },
        start_time: { type: String }, // HH:mm format
        end_time: { type: String },
        location: { type: String },
        created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        target_audience: [{ type: String, enum: ['admin', 'teacher', 'student', 'parent'] }],
    },
    { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);

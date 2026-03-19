import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetable extends Document {
    class_subject_id: mongoose.Types.ObjectId;
    day_of_week: number;
    start_time: string;
    end_time: string;
    room_number?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TimetableSchema: Schema = new Schema(
    {
        class_subject_id: { type: Schema.Types.ObjectId, ref: 'ClassSubject', required: true },
        day_of_week: { type: Number, required: true, min: 0, max: 6 },
        start_time: { type: String, required: true }, // HH:mm format
        end_time: { type: String, required: true },
        room_number: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<ITimetable>('Timetable', TimetableSchema);

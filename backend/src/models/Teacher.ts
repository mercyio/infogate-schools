import mongoose, { Schema, Document } from 'mongoose';

export type TeacherStatus = 'active' | 'inactive';

export interface ITeacher extends Document {
    user_id: mongoose.Types.ObjectId;
    employee_id: string;
    specialization?: string;
    date_of_joining: Date;
    qualification?: string;
    status: TeacherStatus;
    createdAt: Date;
    updatedAt: Date;
}

const TeacherSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        employee_id: { type: String, required: true, unique: true },
        specialization: { type: String },
        date_of_joining: { type: Date, required: true, default: Date.now },
        qualification: { type: String },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    { timestamps: true }
);

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);

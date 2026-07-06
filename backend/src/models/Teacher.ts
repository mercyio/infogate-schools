import mongoose, { Schema, Document } from 'mongoose';

export type TeacherStatus = 'active' | 'inactive';

export interface ITeacher extends Document {
    user_id: mongoose.Types.ObjectId;
    employee_id: string;
    role?: string;
    assigned_class?: mongoose.Types.ObjectId;   // kept for migration compat
    assigned_classes?: mongoose.Types.ObjectId[];
    assigned_subject?: string;          // legacy single string
    assigned_subjects?: mongoose.Types.ObjectId[];
    experience?: string;
    address?: string;
    date_of_joining: Date;
    qualification?: string;
    specialization?: string;
    status: TeacherStatus;
    createdAt: Date;
    updatedAt: Date;
}

const TeacherSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        employee_id: { type: String, required: true, unique: true },
        role: { type: String },
        assigned_class: { type: Schema.Types.ObjectId, ref: 'Class' },  // legacy single
        assigned_classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
        assigned_subject: { type: String },   // legacy
        assigned_subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
        experience: { type: String },
        address: { type: String },
        date_of_joining: { type: Date, required: true, default: Date.now },
        qualification: { type: String },
        specialization: { type: String },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    { timestamps: true }
);

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);

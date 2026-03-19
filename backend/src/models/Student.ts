import mongoose, { Schema, Document } from 'mongoose';

export type StudentStatus = 'active' | 'inactive' | 'graduated';

export interface IStudent extends Document {
    user_id: mongoose.Types.ObjectId;
    admission_number: string;
    class_id?: mongoose.Types.ObjectId;
    date_of_birth?: Date;
    gender?: 'male' | 'female';
    address?: string;
    emergency_contact?: string;
    admission_date: Date;
    status: StudentStatus;
    createdAt: Date;
    updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        admission_number: { type: String, required: true, unique: true },
        class_id: { type: Schema.Types.ObjectId, ref: 'Class' },
        date_of_birth: { type: Date },
        gender: { type: String, enum: ['male', 'female'] },
        address: { type: String },
        emergency_contact: { type: String },
        admission_date: { type: Date, required: true, default: Date.now },
        status: { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' },
    },
    { timestamps: true }
);

export default mongoose.model<IStudent>('Student', StudentSchema);

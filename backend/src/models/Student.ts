import mongoose, { Schema, Document } from 'mongoose';

export type StudentStatus = 'active' | 'inactive' | 'graduated';

export interface IStudent extends Document {
    user_id: mongoose.Types.ObjectId;
    admission_number: string;
    class_id?: mongoose.Types.ObjectId;
    date_of_birth?: Date;
    gender?: 'male' | 'female' | 'other';
    address?: string;
    emergency_contact?: string;
    admission_date: Date;
    status: StudentStatus;
    program?: string;
    grade?: string;
    parent_name?: string;
    parent_email?: string;
    parent_phone?: string;
    medical_info?: string;
    paid_fees?: number;
    payment_history?: {
        id: string;
        date: Date;
        amount: number;
        method: string;
        reference: string;
        description: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        admission_number: { type: String, required: true, unique: true },
        class_id: { type: Schema.Types.ObjectId, ref: 'Class' },
        date_of_birth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        address: { type: String },
        emergency_contact: { type: String },
        admission_date: { type: Date, required: true, default: Date.now },
        status: { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' },
        program: { type: String },
        grade: { type: String },
        parent_name: { type: String },
        parent_email: { type: String },
        parent_phone: { type: String },
        medical_info: { type: String },
        paid_fees: { type: Number, default: 0 },
        payment_history: [
            {
                id: { type: String },
                date: { type: Date, default: Date.now },
                amount: { type: Number, required: true },
                method: { type: String, required: true },
                reference: { type: String },
                description: { type: String },
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IStudent>('Student', StudentSchema);

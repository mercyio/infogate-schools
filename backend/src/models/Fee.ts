import mongoose, { Document, Schema } from 'mongoose';

export interface IFee extends Document {
    // class-level bill (set by admin for a whole class)
    class_id?: mongoose.Types.ObjectId;
    // student-level override / individual charge
    student_id?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    amount: number;
    due_date: Date;
    status: 'pending' | 'paid' | 'overdue';
    paid_date?: Date;
    session: string;   // e.g. "2024/2025"
    term: string;      // e.g. "First Term" | "Second Term" | "Third Term"
    created_at: Date;
    updated_at: Date;
}

const feeSchema = new Schema<IFee>(
    {
        class_id: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
        },
        student_id: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
        title: { type: String, required: true },
        description: { type: String },
        amount: { type: Number, required: true, min: 0 },
        due_date: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'paid', 'overdue'],
            default: 'pending',
        },
        paid_date: { type: Date },
        session: { type: String, default: '' },
        term: { type: String, default: '' },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

const Fee = mongoose.model<IFee>('Fee', feeSchema);

export default Fee;

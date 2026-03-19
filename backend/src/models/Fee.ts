import mongoose, { Document, Schema } from 'mongoose';

export interface IFee extends Document {
    student_id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    amount: number;
    due_date: Date;
    status: 'pending' | 'paid' | 'overdue';
    paid_date?: Date;
    created_at: Date;
    updated_at: Date;
}

const feeSchema = new Schema<IFee>(
    {
        student_id: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        due_date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'overdue'],
            default: 'pending',
        },
        paid_date: {
            type: Date,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

const Fee = mongoose.model<IFee>('Fee', feeSchema);

export default Fee;

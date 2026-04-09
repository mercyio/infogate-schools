import mongoose, { Schema, Document } from 'mongoose';

export type SchoolLevel = 'nursery' | 'primary' | 'secondary' | 'vocational';

export interface IClass extends Document {
    name: string;
    level: SchoolLevel;
    capacity: number;
    class_teacher_id?: mongoose.Types.ObjectId;
    academic_year: string;
    fee_structure?: {
        termly_fees: { name: string; amount: number }[];
        books: { name: string; price: number }[];
        total_termly: number;
        total_books: number;
        total: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ClassSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        level: { type: String, enum: ['nursery', 'primary', 'secondary', 'vocational'], required: true },
        capacity: { type: Number, required: true },
        class_teacher_id: { type: Schema.Types.ObjectId, ref: 'Teacher' },
        academic_year: { type: String, required: true },
        fee_structure: {
            termly_fees: [{
                name: { type: String },
                amount: { type: Number }
            }],
            books: [{
                name: { type: String },
                price: { type: Number }
            }],
            total_termly: { type: Number, default: 0 },
            total_books: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model<IClass>('Class', ClassSchema);

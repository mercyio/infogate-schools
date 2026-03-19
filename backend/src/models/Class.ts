import mongoose, { Schema, Document } from 'mongoose';

export type SchoolLevel = 'nursery' | 'primary' | 'secondary' | 'vocational';

export interface IClass extends Document {
    name: string;
    level: SchoolLevel;
    capacity: number;
    class_teacher_id?: mongoose.Types.ObjectId;
    academic_year: string;
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
    },
    { timestamps: true }
);

export default mongoose.model<IClass>('Class', ClassSchema);

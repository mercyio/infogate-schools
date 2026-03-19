import mongoose, { Schema, Document } from 'mongoose';
import { SchoolLevel } from './Class';

export interface ISubject extends Document {
    name: string;
    code: string;
    description?: string;
    level: SchoolLevel;
    createdAt: Date;
    updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        description: { type: String },
        level: { type: String, enum: ['nursery', 'primary', 'secondary', 'vocational'], required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ISubject>('Subject', SubjectSchema);

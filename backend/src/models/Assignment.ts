import mongoose, { Schema, Document } from 'mongoose';

export type AssignmentStatus = 'pending' | 'submitted' | 'graded';

export interface IAssignment extends Document {
    title: string;
    description?: string;
    class_subject_id: mongoose.Types.ObjectId;
    teacher_id: mongoose.Types.ObjectId;
    due_date: Date;
    total_marks: number;
    attachment_url?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        class_subject_id: { type: Schema.Types.ObjectId, ref: 'ClassSubject', required: true },
        teacher_id: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
        due_date: { type: Date, required: true },
        total_marks: { type: Number, required: true },
        attachment_url: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);

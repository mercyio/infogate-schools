import mongoose, { Schema, Document } from 'mongoose';

export type Term = 'first' | 'second' | 'third';
export type AssessmentType = 'test' | 'exam' | 'assignment';

export interface IGrade extends Document {
    student_id: mongoose.Types.ObjectId;
    class_subject_id: mongoose.Types.ObjectId;
    term: Term;
    academic_year: string;
    assessment_type: AssessmentType;
    marks_obtained: number;
    total_marks: number;
    grade?: string;
    remarks?: string;
    recorded_at: Date;
    createdAt: Date;
    updatedAt: Date;
}

const GradeSchema: Schema = new Schema(
    {
        student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        class_subject_id: { type: Schema.Types.ObjectId, ref: 'ClassSubject', required: true },
        term: { type: String, enum: ['first', 'second', 'third'], required: true },
        academic_year: { type: String, required: true },
        assessment_type: { type: String, enum: ['test', 'exam', 'assignment'], required: true },
        marks_obtained: { type: Number, required: true },
        total_marks: { type: Number, required: true },
        grade: { type: String },
        remarks: { type: String },
        recorded_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<IGrade>('Grade', GradeSchema);

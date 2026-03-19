import mongoose, { Schema, Document } from 'mongoose';
import { AssignmentStatus } from './Assignment';

export interface IAssignmentSubmission extends Document {
    assignment_id: mongoose.Types.ObjectId;
    student_id: mongoose.Types.ObjectId;
    submission_text?: string;
    attachment_url?: string;
    submitted_at: Date;
    marks_obtained?: number;
    feedback?: string;
    graded_at?: Date;
    status: AssignmentStatus;
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSubmissionSchema: Schema = new Schema(
    {
        assignment_id: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
        student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        submission_text: { type: String },
        attachment_url: { type: String },
        submitted_at: { type: Date, default: Date.now },
        marks_obtained: { type: Number },
        feedback: { type: String },
        graded_at: { type: Date },
        status: { type: String, enum: ['pending', 'submitted', 'graded'], default: 'pending' },
    },
    { timestamps: true }
);

export default mongoose.model<IAssignmentSubmission>('AssignmentSubmission', AssignmentSubmissionSchema);

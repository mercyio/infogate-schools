import mongoose, { Schema, Document } from 'mongoose';

export interface IClassSubject extends Document {
    class_id: mongoose.Types.ObjectId;
    subject_id: mongoose.Types.ObjectId;
    teacher_id?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ClassSubjectSchema: Schema = new Schema(
    {
        class_id: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
        subject_id: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
        teacher_id: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    },
    { timestamps: true }
);

export default mongoose.model<IClassSubject>('ClassSubject', ClassSubjectSchema);

import mongoose, { Schema, Document } from 'mongoose';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface IAttendance extends Document {
    student_id: mongoose.Types.ObjectId;
    class_id: mongoose.Types.ObjectId;
    date: Date;
    status: AttendanceStatus;
    marked_by?: mongoose.Types.ObjectId;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
    {
        student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        class_id: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
        date: { type: Date, required: true },
        status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
        marked_by: { type: Schema.Types.ObjectId, ref: 'Teacher' },
        remarks: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);

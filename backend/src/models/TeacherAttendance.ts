import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherAttendance extends Document {
    teacher_id: mongoose.Types.ObjectId;
    date: Date;
    status: 'present' | 'absent' | 'late' | 'on_leave';
    check_in_time?: Date;
    check_out_time?: Date;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TeacherAttendanceSchema: Schema = new Schema(
    {
        teacher_id: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
        date: { type: Date, required: true },
        status: { type: String, enum: ['present', 'absent', 'late', 'on_leave'], required: true },
        check_in_time: { type: Date },
        check_out_time: { type: Date },
        remarks: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<ITeacherAttendance>('TeacherAttendance', TeacherAttendanceSchema);

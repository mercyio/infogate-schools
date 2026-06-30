import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
    user_id: mongoose.Types.ObjectId;
    occupation?: string;
    relationship?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ParentSchema: Schema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        occupation: { type: String },
        relationship: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IParent>('Parent', ParentSchema);

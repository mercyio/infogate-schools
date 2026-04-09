import mongoose, { Schema, Document } from 'mongoose';

export type FeedbackCategory = 'Appreciation' | 'Suggestion' | 'Complaint' | 'Concern';
export type FeedbackStatus = 'read' | 'unread' | 'actioned';

export interface IFeedback extends Document {
    message: string;
    category: FeedbackCategory;
    status: FeedbackStatus;
    submitted_by?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
    {
        message: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ['Appreciation', 'Suggestion', 'Complaint', 'Concern'],
            default: 'Suggestion',
        },
        status: {
            type: String,
            enum: ['read', 'unread', 'actioned'],
            default: 'unread',
        },
        submitted_by: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);

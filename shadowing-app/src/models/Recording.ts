import mongoose, { Schema, Document } from 'mongoose';

export interface IRecording extends Document {
  user: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  audioUrl: string;
  selfRating: number;
  selfCheck: {
    matchedRhythm: boolean;
    copiedStress: boolean;
    followedPauses: boolean;
    spokeClearly: boolean;
    triedWithoutReading: boolean;
  };
  isBestAttempt: boolean;
  submittedForReview: boolean;
  teacherFeedback?: string;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RecordingSchema = new Schema<IRecording>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: Schema.Types.ObjectId, ref: 'ShadowingItem', required: true },
  audioUrl: { type: String, required: true },
  selfRating: { type: Number, min: 1, max: 5, default: 3 },
  selfCheck: {
    matchedRhythm: { type: Boolean, default: false },
    copiedStress: { type: Boolean, default: false },
    followedPauses: { type: Boolean, default: false },
    spokeClearly: { type: Boolean, default: false },
    triedWithoutReading: { type: Boolean, default: false },
  },
  isBestAttempt: { type: Boolean, default: false },
  submittedForReview: { type: Boolean, default: false },
  teacherFeedback: String,
  reviewedAt: Date,
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Recording || mongoose.model<IRecording>('Recording', RecordingSchema);

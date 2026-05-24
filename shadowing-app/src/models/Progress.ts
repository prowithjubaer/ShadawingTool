import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  currentStep: number;
  completedSteps: number[];
  selfRating?: number;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: Schema.Types.ObjectId, ref: 'ShadowingItem', required: true },
  currentStep: { type: Number, default: 1 },
  completedSteps: [{ type: Number }],
  selfRating: { type: Number, min: 1, max: 5 },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
}, { timestamps: true });

ProgressSchema.index({ user: 1, item: 1 }, { unique: true });

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

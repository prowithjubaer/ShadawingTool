import mongoose, { Schema, Document } from 'mongoose';

export interface ILevel extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
  unlockPercentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LevelSchema = new Schema<ILevel>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  order: { type: Number, default: 0 },
  unlockPercentage: { type: Number, default: 70 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Level || mongoose.model<ILevel>('Level', LevelSchema);

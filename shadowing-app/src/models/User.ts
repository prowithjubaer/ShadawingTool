import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  avatar?: string;
  phone?: string;
  batch?: mongoose.Types.ObjectId;
  xp: number;
  level: number;
  streak: number;
  lastPracticeDate?: Date;
  longestStreak: number;
  totalPractices: number;
  badges: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  avatar: String,
  phone: String,
  batch: { type: Schema.Types.ObjectId, ref: 'Batch' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastPracticeDate: Date,
  longestStreak: { type: Number, default: 0 },
  totalPractices: { type: Number, default: 0 },
  badges: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
  name: string;
  slug: string;
  description?: string;
  category: mongoose.Types.ObjectId;
  level: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  level: { type: Schema.Types.ObjectId, ref: 'Level', required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);

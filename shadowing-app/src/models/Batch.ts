import mongoose, { Schema, Document } from 'mongoose';

export interface IBatch extends Document {
  name: string;
  description?: string;
  students: mongoose.Types.ObjectId[];
  modules: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>({
  name: { type: String, required: true },
  description: String,
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Batch || mongoose.model<IBatch>('Batch', BatchSchema);

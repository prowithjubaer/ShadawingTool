import mongoose, { Schema, Document } from 'mongoose';

export interface IHomework extends Document {
  title: string;
  description?: string;
  assignedTo: mongoose.Types.ObjectId[];
  batch?: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[];
  module?: mongoose.Types.ObjectId;
  deadline: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HomeworkSchema = new Schema<IHomework>({
  title: { type: String, required: true },
  description: String,
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  batch: { type: Schema.Types.ObjectId, ref: 'Batch' },
  items: [{ type: Schema.Types.ObjectId, ref: 'ShadowingItem' }],
  module: { type: Schema.Types.ObjectId, ref: 'Module' },
  deadline: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Homework || mongoose.model<IHomework>('Homework', HomeworkSchema);

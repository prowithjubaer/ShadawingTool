import mongoose, { Schema, Document } from 'mongoose';

export interface IStickyNote extends Document {
  user: mongoose.Types.ObjectId;
  item?: mongoose.Types.ObjectId;
  englishText: string;
  banglaMeaning: string;
  example?: string;
  pronunciationNote?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const StickyNoteSchema = new Schema<IStickyNote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: Schema.Types.ObjectId, ref: 'ShadowingItem' },
  englishText: { type: String, required: true },
  banglaMeaning: { type: String, required: true },
  example: String,
  pronunciationNote: String,
  category: { type: String, default: 'general' },
}, { timestamps: true });

export default mongoose.models.StickyNote || mongoose.model<IStickyNote>('StickyNote', StickyNoteSchema);

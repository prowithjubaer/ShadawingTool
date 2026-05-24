import mongoose, { Schema, Document } from 'mongoose';

export interface IShadowingItem extends Document {
  title: string;
  category: mongoose.Types.ObjectId;
  module: mongoose.Types.ObjectId;
  level: mongoose.Types.ObjectId;
  type: 'word' | 'phrase' | 'sentence' | 'context';
  englishText: string;
  banglaMeaning: string;
  englishMeaning?: string;
  pronunciationHint?: string;
  vocabularyNotes?: string;
  commonMistake?: string;
  exampleSentence?: string;
  speakingNotes?: string;
  ieltsRelevance?: string;
  britishAudio?: string;
  australianAudio?: string;
  tags: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShadowingItemSchema = new Schema<IShadowingItem>({
  title: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  level: { type: Schema.Types.ObjectId, ref: 'Level', required: true },
  type: { type: String, enum: ['word', 'phrase', 'sentence', 'context'], required: true },
  englishText: { type: String, required: true },
  banglaMeaning: { type: String, required: true },
  englishMeaning: String,
  pronunciationHint: String,
  vocabularyNotes: String,
  commonMistake: String,
  exampleSentence: String,
  speakingNotes: String,
  ieltsRelevance: String,
  britishAudio: String,
  australianAudio: String,
  tags: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ShadowingItem || mongoose.model<IShadowingItem>('ShadowingItem', ShadowingItemSchema);

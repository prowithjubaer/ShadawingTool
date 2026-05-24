/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shadowing-app';

// Schemas inline for seed script
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true, lowercase: true }, password: String,
  role: { type: String, default: 'student' }, phone: String, xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }, streak: { type: Number, default: 0 },
  lastPracticeDate: Date, longestStreak: { type: Number, default: 0 },
  totalPractices: { type: Number, default: 0 }, badges: [String], isActive: { type: Boolean, default: true },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  type: { type: String, enum: ['word', 'phrase', 'sentence', 'context'] },
  icon: String, order: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const LevelSchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  order: { type: Number, default: 0 }, unlockPercentage: { type: Number, default: 70 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ModuleSchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
  order: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ShadowingItemSchema = new mongoose.Schema({
  title: String, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
  type: { type: String, enum: ['word', 'phrase', 'sentence', 'context'] },
  englishText: String, banglaMeaning: String, englishMeaning: String,
  pronunciationHint: String, vocabularyNotes: String, commonMistake: String,
  exampleSentence: String, speakingNotes: String, ieltsRelevance: String,
  britishAudio: String, australianAudio: String, tags: [String],
  order: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await mongoose.connection.db.dropDatabase();
  console.log('Database cleared');

  const User = mongoose.model('User', UserSchema);
  const Category = mongoose.model('Category', CategorySchema);
  const Level = mongoose.model('Level', LevelSchema);
  const Module = mongoose.model('Module', ModuleSchema);
  const ShadowingItem = mongoose.model('ShadowingItem', ShadowingItemSchema);

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  await User.create({
    name: 'Admin', email: 'admin@proenglishbd.com', password: adminPassword, role: 'admin',
  });
  console.log('Admin created: admin@proenglishbd.com / admin123');

  // Create Student
  const studentPassword = await bcrypt.hash('student123', 12);
  await User.create({
    name: 'Demo Student', email: 'student@proenglishbd.com', password: studentPassword, role: 'student',
    xp: 50, level: 1, streak: 3, longestStreak: 5, totalPractices: 10,
  });
  console.log('Student created: student@proenglishbd.com / student123');

  // Create Categories
  const wordCat = await Category.create({ name: 'Word Shadowing', slug: 'word-shadowing', type: 'word', description: 'Single word practice', order: 1 });
  const phraseCat = await Category.create({ name: 'Phrase Shadowing', slug: 'phrase-shadowing', type: 'phrase', description: 'Short phrase practice', order: 2 });
  const sentenceCat = await Category.create({ name: 'Sentence Shadowing', slug: 'sentence-shadowing', type: 'sentence', description: 'Full sentence practice', order: 3 });
  const contextCat = await Category.create({ name: 'Context Shadowing', slug: 'context-shadowing', type: 'context', description: 'Connected speech & IELTS-style', order: 4 });
  console.log('Categories created');

  // Create Levels
  const beginner = await Level.create({ name: 'Beginner', slug: 'beginner', order: 1, unlockPercentage: 0 });
  const easy = await Level.create({ name: 'Easy', slug: 'easy', order: 2, unlockPercentage: 70 });
  const medium = await Level.create({ name: 'Medium', slug: 'medium', order: 3, unlockPercentage: 70 });
  const advanced = await Level.create({ name: 'Advanced', slug: 'advanced', order: 4, unlockPercentage: 70 });
  const ielts = await Level.create({ name: 'IELTS', slug: 'ielts', order: 5, unlockPercentage: 70 });
  console.log('Levels created');

  // Create Modules
  const day1 = await Module.create({ name: 'Day 1 - Basics', slug: 'day-1-basics', category: wordCat._id, level: beginner._id, order: 1 });
  const dailyConv = await Module.create({ name: 'Daily Conversation', slug: 'daily-conversation', category: phraseCat._id, level: easy._id, order: 2 });
  const officeEng = await Module.create({ name: 'Office English', slug: 'office-english', category: sentenceCat._id, level: medium._id, order: 3 });
  const ieltsPart1 = await Module.create({ name: 'IELTS Part 1', slug: 'ielts-part-1', category: contextCat._id, level: ielts._id, order: 4 });
  console.log('Modules created');

  // Create Shadowing Items
  // Words
  const words = [
    { title: 'improve', englishText: 'improve', banglaMeaning: 'উন্নত করা', englishMeaning: 'to make something better', pronunciationHint: 'im-PROOV (stress on second syllable)', vocabularyNotes: 'Common in IELTS Speaking', exampleSentence: 'I want to improve my English.', commonMistake: 'Don\'t say "im-prove" with equal stress', tags: ['common', 'ielts'] },
    { title: 'confident', englishText: 'confident', banglaMeaning: 'আত্মবিশ্বাসী', englishMeaning: 'feeling sure about yourself', pronunciationHint: 'CON-fi-dent (stress on first syllable)', vocabularyNotes: 'Adjective - describes a person', exampleSentence: 'She is very confident in interviews.', commonMistake: 'Don\'t confuse with "confidant" (a friend)', tags: ['personality', 'ielts'] },
    { title: 'fluent', englishText: 'fluent', banglaMeaning: 'সাবলীল / ফ্লুয়েন্ট', englishMeaning: 'able to speak smoothly', pronunciationHint: 'FLOO-ent', vocabularyNotes: 'Goal of every English learner', exampleSentence: 'I want to become fluent in English.', commonMistake: 'Fluent means smooth, not just fast', tags: ['speaking', 'ielts'] },
    { title: 'pronunciation', englishText: 'pronunciation', banglaMeaning: 'উচ্চারণ', englishMeaning: 'the way a word is spoken', pronunciationHint: 'pro-NUN-see-AY-shun (5 syllables)', vocabularyNotes: 'Key skill in speaking', exampleSentence: 'Good pronunciation helps people understand you.', commonMistake: 'It\'s "pronunciation" not "pronounciation"', tags: ['speaking', 'common'] },
  ];

  for (const word of words) {
    await ShadowingItem.create({ ...word, type: 'word', category: wordCat._id, module: day1._id, level: beginner._id });
  }

  // Phrases
  const phrases = [
    { title: 'in my opinion', englishText: 'in my opinion', banglaMeaning: 'আমার মতে', englishMeaning: 'a way to express your view', pronunciationHint: 'in MY o-PIN-yun', vocabularyNotes: 'Very useful in IELTS Speaking Part 3', exampleSentence: 'In my opinion, education is very important.', speakingNotes: 'Use at the beginning of a statement', ieltsRelevance: 'Common discourse marker in Part 3', tags: ['opinion', 'ielts'] },
    { title: 'as far as I know', englishText: 'as far as I know', banglaMeaning: 'আমি যতদূর জানি', englishMeaning: 'based on my knowledge', pronunciationHint: 'as FAR as I KNOW', vocabularyNotes: 'Shows you\'re not 100% sure', exampleSentence: 'As far as I know, the exam is next week.', speakingNotes: 'Use when you\'re not completely certain', ieltsRelevance: 'Shows hedging - important IELTS skill', tags: ['hedging', 'ielts'] },
    { title: 'step by step', englishText: 'step by step', banglaMeaning: 'ধাপে ধাপে', englishMeaning: 'gradually, one stage at a time', pronunciationHint: 'STEP by STEP (equal stress)', vocabularyNotes: 'Used to describe a process', exampleSentence: 'Learn English step by step, don\'t rush.', speakingNotes: 'Good for describing processes', tags: ['process', 'common'] },
  ];

  for (const phrase of phrases) {
    await ShadowingItem.create({ ...phrase, type: 'phrase', category: phraseCat._id, module: dailyConv._id, level: easy._id });
  }

  // Sentences
  const sentences = [
    { title: 'Improve speaking skills', englishText: 'I want to improve my English speaking skills.', banglaMeaning: 'আমি আমার ইংরেজি বলার দক্ষতা উন্নত করতে চাই।', pronunciationHint: 'I WANT to im-PROOV my ENG-lish SPEAK-ing skills', vocabularyNotes: '"improve" = make better, "skills" = abilities', exampleSentence: 'Practice daily to improve.', speakingNotes: 'Say this sentence with confidence and clear stress', commonMistake: 'Don\'t rush - pause slightly after "improve"', tags: ['motivation', 'daily'] },
    { title: 'Practice builds confidence', englishText: 'Practice helps me become more confident.', banglaMeaning: 'অনুশীলন আমাকে আরও আত্মবিশ্বাসী হতে সাহায্য করে।', pronunciationHint: 'PRAC-tice HELPS me be-COME more CON-fi-dent', vocabularyNotes: '"practice" = regular activity, "confident" = sure of yourself', speakingNotes: 'Stress "helps" and "confident"', tags: ['confidence', 'motivation'] },
  ];

  for (const sentence of sentences) {
    await ShadowingItem.create({ ...sentence, type: 'sentence', category: sentenceCat._id, module: officeEng._id, level: medium._id });
  }

  // Contexts
  const contexts = [
    { title: 'Overcoming shyness', englishText: 'I used to feel shy when speaking English. But now I practice every day, and I can see real improvement.', banglaMeaning: 'আমি ইংরেজিতে কথা বলতে লজ্জা পেতাম। কিন্তু এখন আমি প্রতিদিন অনুশীলন করি, এবং আমি সত্যিকারের উন্নতি দেখতে পাচ্ছি।', pronunciationHint: 'Link words: "used to" sounds like "yoos-to", stress "every day" and "real improvement"', vocabularyNotes: '"used to" = past habit, "improvement" = getting better', speakingNotes: 'This is a personal narrative. Speak naturally like telling a story.', ieltsRelevance: 'Perfect for IELTS Part 2 - Describe a change in your life', commonMistake: 'Don\'t pause too long between sentences - keep flow', tags: ['ielts', 'narrative', 'confidence'] },
    { title: 'Shadowing benefits', englishText: 'In my opinion, shadowing is one of the best ways to improve pronunciation and fluency.', banglaMeaning: 'আমার মতে, শ্যাডোয়িং উচ্চারণ এবং সাবলীলতা উন্নত করার সবচেয়ে ভালো উপায়গুলোর মধ্যে একটি।', pronunciationHint: 'in my o-PIN-yun, SHAD-owing is ONE of the BEST ways...', vocabularyNotes: '"shadowing" = repeating what you hear, "fluency" = smooth speaking', speakingNotes: 'Start with "In my opinion" confidently, then flow into the explanation', ieltsRelevance: 'This structure works in IELTS Part 3 - giving opinions', commonMistake: 'Don\'t say "one of the best way" - must be "ways" (plural)', tags: ['ielts', 'opinion', 'speaking'] },
  ];

  for (const context of contexts) {
    await ShadowingItem.create({ ...context, type: 'context', category: contextCat._id, module: ieltsPart1._id, level: ielts._id });
  }

  console.log('Demo items created');
  console.log('\n✅ Seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin: admin@proenglishbd.com / admin123');
  console.log('   Student: student@proenglishbd.com / student123');

  // Keep references to suppress unused variable warnings
  void [advanced, medium, easy, beginner, ielts];

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

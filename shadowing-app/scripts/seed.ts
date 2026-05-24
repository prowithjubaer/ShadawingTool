/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shadowing-app';

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
  await mongoose.connection.db.dropDatabase();
  console.log('Database cleared');

  const User = mongoose.model('User', UserSchema);
  const Category = mongoose.model('Category', CategorySchema);
  const Level = mongoose.model('Level', LevelSchema);
  const Module = mongoose.model('Module', ModuleSchema);
  const ShadowingItem = mongoose.model('ShadowingItem', ShadowingItemSchema);

  // Users
  const adminPassword = await bcrypt.hash('admin123', 12);
  await User.create({ name: 'Admin', email: 'admin@proenglishbd.com', password: adminPassword, role: 'admin' });
  const studentPassword = await bcrypt.hash('student123', 12);
  await User.create({ name: 'Demo Student', email: 'student@proenglishbd.com', password: studentPassword, role: 'student', xp: 150, level: 2, streak: 5, longestStreak: 12, totalPractices: 25, badges: ['first-recording'] });
  await User.create({ name: 'Rahim Ahmed', email: 'rahim@example.com', password: studentPassword, role: 'student', xp: 80, level: 1, streak: 2, totalPractices: 8 });
  await User.create({ name: 'Fatima Begum', email: 'fatima@example.com', password: studentPassword, role: 'student', xp: 220, level: 3, streak: 7, longestStreak: 14, totalPractices: 35, badges: ['first-recording', '7-day-streak'] });
  await User.create({ name: 'Karim Hossain', email: 'karim@example.com', password: studentPassword, role: 'student', xp: 40, level: 1, streak: 1, totalPractices: 4 });
  console.log('Users created');

  // Categories
  const wordCat = await Category.create({ name: 'Word Shadowing', slug: 'word-shadowing', type: 'word', description: 'Single word practice with pronunciation, meaning & usage', icon: '🔤', order: 1 });
  const phraseCat = await Category.create({ name: 'Phrase Shadowing', slug: 'phrase-shadowing', type: 'phrase', description: 'Short phrases & chunks for natural speech', icon: '💬', order: 2 });
  const sentenceCat = await Category.create({ name: 'Sentence Shadowing', slug: 'sentence-shadowing', type: 'sentence', description: 'Complete sentence practice for fluency', icon: '📝', order: 3 });
  const contextCat = await Category.create({ name: 'Context Shadowing', slug: 'context-shadowing', type: 'context', description: 'IELTS-style connected speech & paragraphs', icon: '🎯', order: 4 });
  console.log('Categories created');

  // Levels
  const beginner = await Level.create({ name: 'Beginner', slug: 'beginner', order: 1, unlockPercentage: 0, description: 'Start your journey here' });
  const easy = await Level.create({ name: 'Easy', slug: 'easy', order: 2, unlockPercentage: 70, description: 'Building confidence' });
  const medium = await Level.create({ name: 'Medium', slug: 'medium', order: 3, unlockPercentage: 70, description: 'Intermediate practice' });
  const advanced = await Level.create({ name: 'Advanced', slug: 'advanced', order: 4, unlockPercentage: 70, description: 'Complex structures' });
  const ieltsLvl = await Level.create({ name: 'IELTS', slug: 'ielts', order: 5, unlockPercentage: 70, description: 'IELTS Speaking preparation' });
  console.log('Levels created');


  // Modules
  const day1 = await Module.create({ name: 'Day 1 - Basic Words', slug: 'day-1-basic-words', category: wordCat._id, level: beginner._id, order: 1 });
  const day2 = await Module.create({ name: 'Day 2 - Essential Words', slug: 'day-2-essential-words', category: wordCat._id, level: beginner._id, order: 2 });
  const dailyConv = await Module.create({ name: 'Daily Conversation', slug: 'daily-conversation', category: phraseCat._id, level: easy._id, order: 3 });
  const ieltsPhrase = await Module.create({ name: 'IELTS Discourse Markers', slug: 'ielts-discourse-markers', category: phraseCat._id, level: ieltsLvl._id, order: 4 });
  const officeEng = await Module.create({ name: 'Office English', slug: 'office-english', category: sentenceCat._id, level: medium._id, order: 5 });
  const motivationMod = await Module.create({ name: 'Motivation & Goals', slug: 'motivation-goals', category: sentenceCat._id, level: easy._id, order: 6 });
  const ieltsPart1 = await Module.create({ name: 'IELTS Part 1 Answers', slug: 'ielts-part-1', category: contextCat._id, level: ieltsLvl._id, order: 7 });
  const storytelling = await Module.create({ name: 'Storytelling Practice', slug: 'storytelling-practice', category: contextCat._id, level: advanced._id, order: 8 });
  console.log('Modules created');

  // ============ 10 WORD ITEMS ============
  const words = [
    { title: 'improve', englishText: 'improve', banglaMeaning: 'উন্নত করা', englishMeaning: 'to make something better', pronunciationHint: 'im-PROOV (stress on 2nd syllable)', vocabularyNotes: 'Verb - very common in IELTS', exampleSentence: 'I want to improve my speaking skills.', commonMistake: 'Don\'t say "im-prove" with equal stress on both', tags: ['common', 'ielts', 'verb'], order: 1 },
    { title: 'confident', englishText: 'confident', banglaMeaning: 'আত্মবিশ্বাসী', englishMeaning: 'feeling sure about your abilities', pronunciationHint: 'CON-fi-dent (stress on 1st syllable)', vocabularyNotes: 'Adjective. Noun form: confidence', exampleSentence: 'Practice makes you more confident.', commonMistake: 'Don\'t confuse with "confidant" (a trusted person)', tags: ['personality', 'ielts', 'adjective'], order: 2 },
    { title: 'fluent', englishText: 'fluent', banglaMeaning: 'সাবলীল', englishMeaning: 'able to speak a language smoothly and easily', pronunciationHint: 'FLOO-ent (2 syllables)', vocabularyNotes: 'Adjective. Noun: fluency', exampleSentence: 'She speaks fluent English.', commonMistake: 'Fluent means smooth flow, not just speaking fast', tags: ['speaking', 'ielts'], order: 3 },
    { title: 'pronunciation', englishText: 'pronunciation', banglaMeaning: 'উচ্চারণ', englishMeaning: 'the way in which a word is spoken', pronunciationHint: 'pro-NUN-see-AY-shun (5 syllables!)', vocabularyNotes: 'Noun. Verb: pronounce', exampleSentence: 'Her pronunciation is very clear.', commonMistake: 'Spelling: "pronunciation" NOT "pronounciation"', tags: ['speaking', 'common'], order: 4 },
    { title: 'opportunity', englishText: 'opportunity', banglaMeaning: 'সুযোগ', englishMeaning: 'a chance to do something', pronunciationHint: 'op-or-TOO-ni-tee (stress on 3rd syllable)', vocabularyNotes: 'Formal word, great for IELTS', exampleSentence: 'This course gives me an opportunity to learn.', commonMistake: 'Don\'t stress the first syllable', tags: ['formal', 'ielts'], order: 5 },
    { title: 'environment', englishText: 'environment', banglaMeaning: 'পরিবেশ', englishMeaning: 'the surroundings or conditions around you', pronunciationHint: 'en-VY-run-ment (stress on 2nd syllable)', vocabularyNotes: 'IELTS Topic: Environment is very common', exampleSentence: 'We should protect our environment.', commonMistake: 'Don\'t say "en-vi-RON-ment" - stress is on VY', tags: ['ielts', 'topic', 'noun'], order: 6 },
    { title: 'communicate', englishText: 'communicate', banglaMeaning: 'যোগাযোগ করা', englishMeaning: 'to share information or ideas with others', pronunciationHint: 'com-MYOO-ni-kate (stress on 2nd syllable)', vocabularyNotes: 'Verb. Noun: communication', exampleSentence: 'English helps me communicate globally.', commonMistake: 'Don\'t forget the "u" sound in the middle', tags: ['speaking', 'work'], order: 7 },
    { title: 'vocabulary', englishText: 'vocabulary', banglaMeaning: 'শব্দভাণ্ডার', englishMeaning: 'all the words a person knows', pronunciationHint: 'vo-CAB-yoo-luh-ree (stress on 2nd syllable)', vocabularyNotes: 'Noun. Key for language learning', exampleSentence: 'Reading books increases your vocabulary.', commonMistake: '5 syllables - don\'t skip any', tags: ['learning', 'common'], order: 8 },
    { title: 'essential', englishText: 'essential', banglaMeaning: 'অপরিহার্য / আবশ্যক', englishMeaning: 'absolutely necessary, very important', pronunciationHint: 'eh-SEN-shul (stress on 2nd syllable)', vocabularyNotes: 'Adjective. Synonym: crucial, vital', exampleSentence: 'Practice is essential for improvement.', commonMistake: 'Don\'t pronounce the "t" - it\'s "shul" not "tial"', tags: ['formal', 'ielts'], order: 9 },
    { title: 'achieve', englishText: 'achieve', banglaMeaning: 'অর্জন করা', englishMeaning: 'to successfully reach a goal', pronunciationHint: 'uh-CHEEV (stress on 2nd syllable)', vocabularyNotes: 'Verb. Noun: achievement', exampleSentence: 'Hard work helps you achieve your goals.', commonMistake: 'Don\'t say "a-chieve" - blend it smoothly', tags: ['motivation', 'ielts', 'verb'], order: 10 },
  ];

  for (let i = 0; i < words.length; i++) {
    const mod = i < 5 ? day1._id : day2._id;
    await ShadowingItem.create({ ...words[i], type: 'word', category: wordCat._id, module: mod, level: beginner._id });
  }
  console.log('10 Word items created');


  // ============ 10 PHRASE ITEMS ============
  const phrases = [
    { title: 'in my opinion', englishText: 'in my opinion', banglaMeaning: 'আমার মতে', englishMeaning: 'used to express your personal view', pronunciationHint: 'in MY o-PIN-yun', vocabularyNotes: 'Discourse marker for IELTS Part 3', exampleSentence: 'In my opinion, education is key.', speakingNotes: 'Use at the start of a sentence', ieltsRelevance: 'Essential for Part 3 opinion questions', tags: ['opinion', 'ielts'], order: 1 },
    { title: 'as far as I know', englishText: 'as far as I know', banglaMeaning: 'আমি যতদূর জানি', englishMeaning: 'based on my current knowledge', pronunciationHint: 'as FAR as I KNOW', vocabularyNotes: 'Hedging phrase - shows uncertainty', exampleSentence: 'As far as I know, the meeting is at 3.', speakingNotes: 'Great for when you\'re not 100% sure', ieltsRelevance: 'Shows hedging skill valued in IELTS', tags: ['hedging', 'ielts'], order: 2 },
    { title: 'step by step', englishText: 'step by step', banglaMeaning: 'ধাপে ধাপে', englishMeaning: 'gradually, one stage at a time', pronunciationHint: 'STEP by STEP (equal stress)', vocabularyNotes: 'Adverb phrase for describing processes', exampleSentence: 'I\'m learning English step by step.', speakingNotes: 'Use when describing how you do things', tags: ['process', 'common'], order: 3 },
    { title: 'on the other hand', englishText: 'on the other hand', banglaMeaning: 'অন্যদিকে', englishMeaning: 'used to present a contrasting point', pronunciationHint: 'on the OTHER HAND', vocabularyNotes: 'Linking phrase for contrast', exampleSentence: 'It\'s expensive. On the other hand, it\'s high quality.', speakingNotes: 'Perfect for showing both sides', ieltsRelevance: 'Excellent for IELTS Part 3 balanced answers', tags: ['contrast', 'ielts', 'linking'], order: 4 },
    { title: 'to be honest', englishText: 'to be honest', banglaMeaning: 'সত্যি বলতে', englishMeaning: 'used before saying what you really think', pronunciationHint: 'to be HON-est', vocabularyNotes: 'Informal discourse marker', exampleSentence: 'To be honest, I find grammar difficult.', speakingNotes: 'Makes you sound natural and sincere', ieltsRelevance: 'Good for informal Part 1 answers', tags: ['honesty', 'informal', 'ielts'], order: 5 },
    { title: 'it depends on', englishText: 'it depends on', banglaMeaning: 'এটা নির্ভর করে', englishMeaning: 'the answer varies based on the situation', pronunciationHint: 'it de-PENDS on', vocabularyNotes: 'Very useful for nuanced answers', exampleSentence: 'It depends on the situation.', speakingNotes: 'Use this to avoid yes/no answers', ieltsRelevance: 'Shows maturity in IELTS answers', tags: ['hedging', 'ielts'], order: 6 },
    { title: 'first of all', englishText: 'first of all', banglaMeaning: 'সর্বপ্রথম', englishMeaning: 'used to introduce the first point', pronunciationHint: 'FIRST of ALL', vocabularyNotes: 'Sequencing phrase', exampleSentence: 'First of all, let me introduce myself.', speakingNotes: 'Great way to organize your answer', ieltsRelevance: 'Shows structured thinking', tags: ['sequencing', 'ielts'], order: 7 },
    { title: 'as a result', englishText: 'as a result', banglaMeaning: 'ফলস্বরূপ', englishMeaning: 'because of something that happened', pronunciationHint: 'as a re-ZULT', vocabularyNotes: 'Cause-effect linking phrase', exampleSentence: 'I practiced daily. As a result, I improved.', speakingNotes: 'Use to show cause and effect', ieltsRelevance: 'Strong connector for Part 3', tags: ['cause-effect', 'ielts', 'formal'], order: 8 },
    { title: 'from my perspective', englishText: 'from my perspective', banglaMeaning: 'আমার দৃষ্টিকোণ থেকে', englishMeaning: 'from my point of view', pronunciationHint: 'from my per-SPEC-tiv', vocabularyNotes: 'Formal alternative to "in my opinion"', exampleSentence: 'From my perspective, technology helps education.', speakingNotes: 'More formal than "I think"', ieltsRelevance: 'Band 7+ vocabulary for opinions', tags: ['opinion', 'ielts', 'formal'], order: 9 },
    { title: 'for instance', englishText: 'for instance', banglaMeaning: 'উদাহরণস্বরূপ', englishMeaning: 'used to give an example', pronunciationHint: 'for IN-stunce', vocabularyNotes: 'Synonym of "for example"', exampleSentence: 'Many people use apps. For instance, Duolingo.', speakingNotes: 'Always follow with a specific example', ieltsRelevance: 'Examples boost IELTS band score', tags: ['example', 'ielts'], order: 10 },
  ];

  for (let i = 0; i < phrases.length; i++) {
    const mod = i < 5 ? dailyConv._id : ieltsPhrase._id;
    const lvl = i < 5 ? easy._id : ieltsLvl._id;
    await ShadowingItem.create({ ...phrases[i], type: 'phrase', category: phraseCat._id, module: mod, level: lvl });
  }
  console.log('10 Phrase items created');


  // ============ 10 SENTENCE ITEMS ============
  const sentences = [
    { title: 'Improve speaking skills', englishText: 'I want to improve my English speaking skills.', banglaMeaning: 'আমি আমার ইংরেজি বলার দক্ষতা উন্নত করতে চাই।', pronunciationHint: 'I WANT to im-PROOV my ENG-lish SPEAK-ing skills', vocabularyNotes: '"improve" = make better, "skills" = abilities', speakingNotes: 'Speak with determination in your voice', commonMistake: 'Don\'t rush - pause slightly after "improve"', tags: ['motivation', 'daily'], order: 1 },
    { title: 'Practice builds confidence', englishText: 'Practice helps me become more confident every day.', banglaMeaning: 'অনুশীলন আমাকে প্রতিদিন আরও আত্মবিশ্বাসী হতে সাহায্য করে।', pronunciationHint: 'PRAC-tice HELPS me be-COME more CON-fi-dent EV-ry DAY', vocabularyNotes: '"confident" = self-assured', speakingNotes: 'Stress "helps" and "confident" and "every day"', tags: ['confidence', 'motivation'], order: 2 },
    { title: 'Meeting introduction', englishText: 'Good morning everyone, let me briefly introduce myself.', banglaMeaning: 'সবাইকে শুভ সকাল, আমাকে সংক্ষেপে পরিচয় দিতে দিন।', pronunciationHint: 'good MOR-ning EV-ry-one, let me BRIEF-ly intro-DUCE my-SELF', vocabularyNotes: '"briefly" = in a short way, "introduce" = present yourself', speakingNotes: 'Professional tone - clear and warm', commonMistake: 'Don\'t skip "briefly" - it shows professionalism', tags: ['office', 'formal', 'introduction'], order: 3 },
    { title: 'Email follow-up', englishText: 'I am writing to follow up on our previous discussion.', banglaMeaning: 'আমি আমাদের আগের আলোচনার বিষয়ে follow up করতে লিখছি।', pronunciationHint: 'I am WRI-ting to FOL-low UP on our PRE-vious dis-CUS-sion', vocabularyNotes: '"follow up" = continue/check on something, "previous" = earlier', speakingNotes: 'Professional email language - practice reading aloud', tags: ['office', 'email', 'formal'], order: 4 },
    { title: 'Asking for clarification', englishText: 'Could you please explain that in a different way?', banglaMeaning: 'আপনি কি দয়া করে সেটা অন্যভাবে ব্যাখ্যা করতে পারবেন?', pronunciationHint: 'COULD you PLEASE ex-PLAIN that in a DIF-ferent WAY', vocabularyNotes: '"Could you" = polite request, "explain" = make clear', speakingNotes: 'Polite intonation - voice goes up slightly at end', commonMistake: 'Don\'t say "Can you" in formal settings - use "Could you"', tags: ['polite', 'office', 'request'], order: 5 },
    { title: 'Daily routine', englishText: 'I usually wake up early and start my day with exercise.', banglaMeaning: 'আমি সাধারণত তাড়াতাড়ি ঘুম থেকে উঠি এবং ব্যায়াম দিয়ে দিন শুরু করি।', pronunciationHint: 'I YOO-zhoo-uh-lee WAKE up ER-lee and START my DAY with EX-er-size', vocabularyNotes: '"usually" = most of the time, "exercise" = physical activity', speakingNotes: 'Natural rhythm - this is everyday speech', ieltsRelevance: 'Perfect for IELTS Part 1 - Daily routine topic', tags: ['daily', 'ielts', 'routine'], order: 6 },
    { title: 'Expressing preference', englishText: 'I prefer reading books rather than watching television.', banglaMeaning: 'আমি টেলিভিশন দেখার চেয়ে বই পড়তে বেশি পছন্দ করি।', pronunciationHint: 'I pre-FER READ-ing BOOKS RA-ther than WATCH-ing TEL-e-vi-zhun', vocabularyNotes: '"prefer X rather than Y" = like X more than Y', speakingNotes: 'Clear comparison structure', ieltsRelevance: 'IELTS Part 1 often asks about preferences', tags: ['preference', 'ielts'], order: 7 },
    { title: 'Future plans', englishText: 'I am planning to start a business after completing my studies.', banglaMeaning: 'আমি পড়াশোনা শেষ করার পর একটি ব্যবসা শুরু করার পরিকল্পনা করছি।', pronunciationHint: 'I am PLAN-ning to START a BIZ-ness AF-ter com-PLEE-ting my STUD-ees', vocabularyNotes: '"planning to" = intending to do in future', speakingNotes: 'Future tense - speak with hope and excitement', ieltsRelevance: 'IELTS Part 1 - Future plans question', tags: ['future', 'ielts', 'plans'], order: 8 },
    { title: 'Describing hometown', englishText: 'My hometown is a small but beautiful city in the southern part of Bangladesh.', banglaMeaning: 'আমার শহর বাংলাদেশের দক্ষিণ অংশে একটি ছোট কিন্তু সুন্দর শহর।', pronunciationHint: 'my HOME-town is a SMALL but BYOO-ti-ful CI-ty in the SOUTH-ern part of BANG-la-desh', vocabularyNotes: '"hometown" = where you grew up', speakingNotes: 'Describe with pride - add emotion', ieltsRelevance: 'Very common IELTS Part 1 topic', tags: ['ielts', 'hometown', 'description'], order: 9 },
    { title: 'Agreeing politely', englishText: 'That is a very good point, and I completely agree with you.', banglaMeaning: 'এটা একটা খুব ভালো পয়েন্ট, এবং আমি আপনার সাথে সম্পূর্ণ একমত।', pronunciationHint: 'THAT is a VE-ry GOOD point, and I com-PLETE-ly a-GREE with you', vocabularyNotes: '"completely" = 100%, "agree" = same opinion', speakingNotes: 'Warm, professional tone', commonMistake: 'Don\'t just say "I agree" - add detail', tags: ['agreement', 'polite', 'discussion'], order: 10 },
  ];

  for (let i = 0; i < sentences.length; i++) {
    const mod = i < 5 ? officeEng._id : motivationMod._id;
    const lvl = i < 5 ? medium._id : easy._id;
    await ShadowingItem.create({ ...sentences[i], type: 'sentence', category: sentenceCat._id, module: mod, level: lvl });
  }
  console.log('10 Sentence items created');


  // ============ 10 CONTEXT ITEMS ============
  const contexts = [
    { title: 'Overcoming shyness', englishText: 'I used to feel shy when speaking English. But now I practice every day, and I can see real improvement. The key is consistency and not being afraid of making mistakes.', banglaMeaning: 'আমি ইংরেজিতে কথা বলতে লজ্জা পেতাম। কিন্তু এখন আমি প্রতিদিন অনুশীলন করি, এবং সত্যিকারের উন্নতি দেখতে পাচ্ছি। মূল বিষয় হলো ধারাবাহিকতা এবং ভুল করতে ভয় না পাওয়া।', pronunciationHint: 'Link: "used to" = "yoos-to". Stress "every day", "real improvement", "consistency"', vocabularyNotes: '"used to" = past habit, "consistency" = doing regularly, "improvement" = getting better', speakingNotes: 'Tell it like a personal story. Show emotion - proud of your progress.', ieltsRelevance: 'IELTS Part 2: Describe a positive change / Part 3: Learning habits', commonMistake: 'Keep flow between sentences - don\'t pause too long', tags: ['ielts', 'narrative', 'confidence'], order: 1 },
    { title: 'Shadowing benefits', englishText: 'In my opinion, shadowing is one of the best ways to improve pronunciation and fluency. When you repeat what a native speaker says, your brain learns the natural rhythm and stress patterns automatically.', banglaMeaning: 'আমার মতে, শ্যাডোয়িং উচ্চারণ ও সাবলীলতা উন্নতির সেরা উপায়গুলোর একটি। যখন আপনি একজন native speaker যা বলেন তা repeat করেন, আপনার মস্তিষ্ক স্বয়ংক্রিয়ভাবে স্বাভাবিক rhythm ও stress patterns শিখে ফেলে।', pronunciationHint: 'Start confident: "In my o-PIN-yun". Flow into explanation naturally.', vocabularyNotes: '"shadowing" = repeating after speaker, "rhythm" = beat/pattern, "automatically" = without thinking', speakingNotes: 'Opinion + explanation structure. Sound knowledgeable.', ieltsRelevance: 'IELTS Part 3: Opinion + reason + example structure', commonMistake: '"one of the best ways" - NOT "way" (plural needed)', tags: ['ielts', 'opinion', 'speaking'], order: 2 },
    { title: 'Technology and education', englishText: 'Technology has completely transformed the way we learn. Nowadays, students can access educational resources from anywhere in the world. However, I believe that traditional classroom learning still has its own unique value.', banglaMeaning: 'প্রযুক্তি আমাদের শেখার পদ্ধতি সম্পূর্ণরূপে পরিবর্তন করেছে। আজকাল, শিক্ষার্থীরা বিশ্বের যেকোনো জায়গা থেকে শিক্ষামূলক সংস্থানগুলো access করতে পারে। তবে, আমি বিশ্বাস করি ঐতিহ্যবাহী classroom শিক্ষার এখনো নিজস্ব অনন্য মূল্য রয়েছে।', pronunciationHint: 'Stress: "com-PLETE-ly TRANS-formed", "NOW-a-days", "HOW-ever". Link sentences smoothly.', vocabularyNotes: '"transformed" = changed completely, "access" = get/reach, "unique" = one of a kind', speakingNotes: 'Balanced answer: positive + contrasting view. Academic tone.', ieltsRelevance: 'IELTS Part 3: Technology & Education is a common topic', tags: ['ielts', 'technology', 'education', 'balanced'], order: 3 },
    { title: 'My hobby - reading', englishText: 'Reading has been my favorite hobby since childhood. I particularly enjoy novels because they take me to different worlds. Whenever I feel stressed, I pick up a book and lose myself in the story.', banglaMeaning: 'পড়া শৈশব থেকেই আমার প্রিয় শখ। আমি বিশেষভাবে উপন্যাস পছন্দ করি কারণ সেগুলো আমাকে বিভিন্ন জগতে নিয়ে যায়। যখনই আমি চাপ অনুভব করি, আমি একটা বই তুলে নিই এবং গল্পে হারিয়ে যাই।', pronunciationHint: 'Warm tone: "my FA-vorite HOB-by". Natural linking throughout.', vocabularyNotes: '"particularly" = especially, "stressed" = feeling pressure, "lose myself" = become fully absorbed', speakingNotes: 'Personal and emotional. Share genuine enthusiasm.', ieltsRelevance: 'IELTS Part 2: Describe your hobby / a book you enjoyed', tags: ['ielts', 'hobby', 'personal'], order: 4 },
    { title: 'Importance of English', englishText: 'English is essential in today\'s globalized world. It opens doors to better career opportunities, helps us connect with people from different cultures, and gives us access to a vast amount of knowledge and information.', banglaMeaning: 'আজকের বিশ্বায়িত পৃথিবীতে ইংরেজি অপরিহার্য। এটি ভালো ক্যারিয়ারের সুযোগ খুলে দেয়, বিভিন্ন সংস্কৃতির মানুষের সাথে যোগাযোগে সাহায্য করে, এবং বিশাল জ্ঞান ও তথ্যের ভাণ্ডারে প্রবেশাধিকার দেয়।', pronunciationHint: 'List with rhythm: "opens DOORS... HELPS us... GIVES us..." - parallel structure', vocabularyNotes: '"essential" = absolutely necessary, "globalized" = connected worldwide, "vast" = very large', speakingNotes: 'Confident, persuasive tone. Use listing with clear pauses.', ieltsRelevance: 'IELTS Writing Task 2 / Part 3: Language & Communication', tags: ['ielts', 'importance', 'global'], order: 5 },
  ];

  const contexts2 = [
    { title: 'Describing a teacher', englishText: 'The teacher who influenced me the most was my high school English teacher. She always encouraged us to speak without fear of mistakes. Her positive attitude made the classroom a comfortable place to practice and learn.', banglaMeaning: 'যে শিক্ষক আমাকে সবচেয়ে বেশি প্রভাবিত করেছেন তিনি আমার হাই স্কুলের ইংরেজি শিক্ষক। তিনি সবসময় আমাদের ভুলের ভয় ছাড়া কথা বলতে উৎসাহিত করতেন। তাঁর ইতিবাচক মনোভাব ক্লাসরুমকে অনুশীলন ও শেখার আরামদায়ক জায়গা করে তুলেছিল।', pronunciationHint: 'Past tense flow. Stress: "IN-fluenced", "en-COU-raged", "COM-for-ta-ble"', vocabularyNotes: '"influenced" = had an effect on, "encouraged" = gave confidence, "positive attitude" = good mindset', speakingNotes: 'Warm, grateful tone. Like sharing a fond memory.', ieltsRelevance: 'IELTS Part 2: Describe a teacher who helped you', tags: ['ielts', 'description', 'teacher', 'past'], order: 6 },
    { title: 'Work-life balance', englishText: 'I strongly believe that maintaining a healthy work-life balance is crucial for both physical and mental well-being. People who work too much often experience burnout, which negatively affects their productivity and relationships.', banglaMeaning: 'আমি দৃঢ়ভাবে বিশ্বাস করি স্বাস্থ্যকর কাজ-জীবনের ভারসাম্য বজায় রাখা শারীরিক ও মানসিক সুস্থতার জন্য অত্যন্ত গুরুত্বপূর্ণ। যারা অত্যধিক কাজ করেন তারা প্রায়ই বার্নআউট অনুভব করেন, যা তাদের উৎপাদনশীলতা ও সম্পর্কে নেতিবাচক প্রভাব ফেলে।', pronunciationHint: 'Emphatic: "I STRONG-ly be-LIEVE". Technical vocab clear: "BURN-out", "pro-duc-TI-vi-ty"', vocabularyNotes: '"crucial" = extremely important, "burnout" = exhaustion from overwork, "negatively affects" = harms', speakingNotes: 'Strong opinion + reason + consequence. Academic speaking style.', ieltsRelevance: 'IELTS Part 3: Work & lifestyle questions', tags: ['ielts', 'work', 'health', 'opinion'], order: 7 },
    { title: 'Childhood memories', englishText: 'When I think about my childhood, I remember spending long summer afternoons playing cricket with my friends in the neighborhood. Those simple moments of joy shaped who I am today and taught me the value of teamwork.', banglaMeaning: 'যখন আমি আমার শৈশবের কথা ভাবি, মনে পড়ে পাড়ায় বন্ধুদের সাথে দীর্ঘ গ্রীষ্মের বিকেলে ক্রিকেট খেলা। সেই সাধারণ আনন্দের মুহূর্তগুলো আমাকে আজকের মানুষ হিসেবে গড়ে তুলেছে এবং দলগত কাজের মূল্য শিখিয়েছে।', pronunciationHint: 'Nostalgic tone. Slow, warm delivery. Stress: "LONG summer", "SIM-ple moments", "SHAPED who I am"', vocabularyNotes: '"shaped" = formed/influenced, "teamwork" = working together, "neighborhood" = local area', speakingNotes: 'Storytelling mode. Paint a picture with your words. Show emotion.', ieltsRelevance: 'IELTS Part 2: Describe a childhood memory', tags: ['ielts', 'childhood', 'narrative', 'memory'], order: 8 },
    { title: 'Environmental problems', englishText: 'Climate change is undoubtedly one of the biggest challenges facing our planet today. Rising temperatures, extreme weather events, and pollution are all serious concerns. I think every individual has a responsibility to reduce their carbon footprint.', banglaMeaning: 'জলবায়ু পরিবর্তন নিঃসন্দেহে আজ আমাদের গ্রহের সবচেয়ে বড় চ্যালেঞ্জগুলোর একটি। ক্রমবর্ধমান তাপমাত্রা, চরম আবহাওয়া ও দূষণ সবই গুরুতর উদ্বেগের বিষয়। আমি মনে করি প্রতিটি ব্যক্তির কার্বন ফুটপ্রিন্ট কমানোর দায়িত্ব রয়েছে।', pronunciationHint: 'Serious topic - measured pace. "un-DOUBT-ed-ly", "chal-LEN-ges", "re-spon-si-BI-li-ty"', vocabularyNotes: '"undoubtedly" = certainly, "carbon footprint" = environmental impact, "extreme" = very severe', speakingNotes: 'Formal, concerned tone. Problem + examples + personal opinion structure.', ieltsRelevance: 'IELTS Writing Task 2 & Part 3: Environment topic', tags: ['ielts', 'environment', 'formal', 'opinion'], order: 9 },
    { title: 'Learning from failure', englishText: 'I believe that failure is not the opposite of success but rather a stepping stone towards it. Every successful person has failed multiple times before achieving their goals. The important thing is to learn from our mistakes and keep moving forward.', banglaMeaning: 'আমি বিশ্বাস করি ব্যর্থতা সফলতার বিপরীত নয়, বরং সফলতার দিকে একটি ধাপ। প্রতিটি সফল ব্যক্তি তাদের লক্ষ্য অর্জনের আগে একাধিকবার ব্যর্থ হয়েছেন। গুরুত্বপূর্ণ বিষয় হলো আমাদের ভুল থেকে শেখা এবং সামনে এগিয়ে যাওয়া।', pronunciationHint: 'Inspirational tone! "NOT the OP-posite but RA-ther a STEP-ping STONE". Build energy through the paragraph.', vocabularyNotes: '"stepping stone" = something that helps progress, "multiple" = many, "moving forward" = continuing to progress', speakingNotes: 'Motivational speaking style. Strong, confident delivery. End powerfully.', ieltsRelevance: 'IELTS Part 3: Success, learning, personal development topics', tags: ['ielts', 'motivation', 'life-lesson', 'philosophical'], order: 10 },
  ];

  for (const ctx of contexts) {
    await ShadowingItem.create({ ...ctx, type: 'context', category: contextCat._id, module: ieltsPart1._id, level: ieltsLvl._id });
  }
  for (const ctx of contexts2) {
    await ShadowingItem.create({ ...ctx, type: 'context', category: contextCat._id, module: storytelling._id, level: advanced._id });
  }
  console.log('10 Context items created');

  // Suppress unused warnings
  void [advanced, medium, easy, beginner, ieltsLvl, day2, ieltsPhrase, motivationMod, storytelling];

  console.log('\n✅ Seed completed! 40 demo items created (10 per category)');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin: admin@proenglishbd.com / admin123');
  console.log('   Student: student@proenglishbd.com / student123');
  console.log('   Also: rahim@example.com, fatima@example.com, karim@example.com / student123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });

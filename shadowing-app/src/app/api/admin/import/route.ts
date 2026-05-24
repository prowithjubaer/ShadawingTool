import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import ShadowingItem from '@/models/ShadowingItem';
import Category from '@/models/Category';
import Module from '@/models/Module';
import Level from '@/models/Level';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const results = { created: 0, errors: 0, errorMessages: [] as string[] };

    for (const row of items) {
      try {
        const category = await Category.findOne({ name: { $regex: new RegExp(row.category, 'i') } });
        const level = await Level.findOne({ name: { $regex: new RegExp(row.level, 'i') } });
        const module = await Module.findOne({ name: { $regex: new RegExp(row.module, 'i') } });

        if (!category || !level || !module) {
          results.errors++;
          results.errorMessages.push(`Missing ref for: ${row.title || row.english_text}`);
          continue;
        }

        await ShadowingItem.create({
          title: row.title || row.english_text?.substring(0, 50),
          category: category._id,
          module: module._id,
          level: level._id,
          type: category.type,
          englishText: row.english_text,
          banglaMeaning: row.bangla_meaning,
          englishMeaning: row.english_meaning,
          pronunciationHint: row.pronunciation_hint,
          vocabularyNotes: row.vocabulary_notes,
          commonMistake: row.common_mistake,
          exampleSentence: row.example_sentence,
          britishAudio: row.british_audio,
          australianAudio: row.australian_audio,
          tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
          order: row.order || 0,
          isActive: row.status !== 'inactive',
        });
        results.created++;
      } catch (e) {
        results.errors++;
        results.errorMessages.push(`Error: ${e instanceof Error ? e.message : 'Unknown'}`);
      }
    }

    return NextResponse.json({ results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Import failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

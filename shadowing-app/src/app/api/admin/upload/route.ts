import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const accent = formData.get('accent') as string || 'british';
    const itemId = formData.get('itemId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/audio/{accent}/
    const uploadDir = path.join(process.cwd(), 'public', 'audio', accent);
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const audioUrl = `/audio/${accent}/${fileName}`;

    // If itemId provided, update the item
    if (itemId) {
      const { connectDB } = await import('@/lib/db');
      const ShadowingItem = (await import('@/models/ShadowingItem')).default;
      await connectDB();
      const updateField = accent === 'british' ? 'britishAudio' : 'australianAudio';
      await ShadowingItem.findByIdAndUpdate(itemId, { [updateField]: audioUrl });
    }

    return NextResponse.json({ url: audioUrl, fileName });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ShadowingItem from '@/models/ShadowingItem';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const module = searchParams.get('module');
    const level = searchParams.get('level');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (module) filter.module = module;
    if (level) filter.level = level;
    if (type) filter.type = type;

    const items = await ShadowingItem.find(filter)
      .populate('category', 'name type icon')
      .populate('module', 'name')
      .populate('level', 'name order')
      .sort({ order: 1, createdAt: 1 })
      .limit(limit);

    return NextResponse.json({ items, total: items.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch items';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

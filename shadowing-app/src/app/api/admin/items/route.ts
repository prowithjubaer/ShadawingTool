import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import ShadowingItem from '@/models/ShadowingItem';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const module = searchParams.get('module');
    const level = searchParams.get('level');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (module) filter.module = module;
    if (level) filter.level = level;
    if (type) filter.type = type;
    if (search) filter.englishText = { $regex: search, $options: 'i' };

    const total = await ShadowingItem.countDocuments(filter);
    const items = await ShadowingItem.find(filter)
      .populate('category module level')
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch items';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const data = await req.json();
    const item = await ShadowingItem.create(data);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, ...data } = await req.json();
    const item = await ShadowingItem.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, ids } = await req.json();
    if (ids && Array.isArray(ids)) {
      await ShadowingItem.deleteMany({ _id: { $in: ids } });
      return NextResponse.json({ message: `${ids.length} items deleted` });
    }
    await ShadowingItem.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Item deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

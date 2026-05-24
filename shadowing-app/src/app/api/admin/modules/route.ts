import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Module from '@/models/Module';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const filter: Record<string, string> = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    const modules = await Module.find(filter).populate('category level').sort({ order: 1 });
    return NextResponse.json({ modules });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch modules';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const data = await req.json();
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');
    const module = await Module.create({ ...data, slug });
    return NextResponse.json({ module }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create module';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, ...data } = await req.json();
    if (data.name) data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    const module = await Module.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ module });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update module';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await req.json();
    await Module.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Module deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete module';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

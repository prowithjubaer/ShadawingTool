import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Level from '@/models/Level';

export async function GET() {
  try {
    await connectDB();
    const levels = await Level.find().sort({ order: 1 });
    return NextResponse.json({ levels });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch levels';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const data = await req.json();
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');
    const level = await Level.create({ ...data, slug });
    return NextResponse.json({ level }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create level';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, ...data } = await req.json();
    if (data.name) data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    const level = await Level.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ level });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update level';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await req.json();
    await Level.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Level deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete level';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

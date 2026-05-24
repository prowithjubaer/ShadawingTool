import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Homework from '@/models/Homework';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const homework = await Homework.find()
      .populate('assignedTo', 'name email')
      .populate('batch', 'name')
      .populate('module', 'name')
      .sort({ createdAt: -1 });
    return NextResponse.json({ homework });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch homework';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const data = await req.json();
    const homework = await Homework.create(data);
    return NextResponse.json({ homework }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create homework';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, ...data } = await req.json();
    const homework = await Homework.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ homework });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update homework';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await req.json();
    await Homework.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Homework deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete homework';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

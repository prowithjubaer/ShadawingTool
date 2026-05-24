import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Batch from '@/models/Batch';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const batches = await Batch.find().populate('students', 'name email').populate('modules', 'name');
    return NextResponse.json({ batches });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch batches';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const data = await req.json();
    const batch = await Batch.create(data);
    return NextResponse.json({ batch }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create batch';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, ...data } = await req.json();
    const batch = await Batch.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ batch });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update batch';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await req.json();
    await Batch.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Batch deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete batch';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

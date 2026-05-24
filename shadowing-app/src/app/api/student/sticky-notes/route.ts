import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import StickyNote from '@/models/StickyNote';

export async function GET() {
  try {
    const session = await requireAuth();
    await connectDB();
    const notes = await StickyNote.find({ user: session.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ notes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();
    const data = await req.json();
    const note = await StickyNote.create({ ...data, user: session.userId });
    return NextResponse.json({ note }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create note';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();
    const { id } = await req.json();
    await StickyNote.findOneAndDelete({ _id: id, user: session.userId });
    return NextResponse.json({ message: 'Note deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete note';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

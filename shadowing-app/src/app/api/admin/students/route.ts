import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const filter: Record<string, unknown> = { role: 'student' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const students = await User.find(filter).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ students });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch students';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, ...data } = await req.json();
    delete data.password;
    const user = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
    return NextResponse.json({ user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update student';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await req.json();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Student deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete student';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Recording from '@/models/Recording';

export async function GET() {
  try {
    const session = await requireAuth();
    await connectDB();
    const recordings = await Recording.find({ user: session.userId })
      .populate('item', 'title englishText type')
      .sort({ createdAt: -1 });
    return NextResponse.json({ recordings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch recordings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();
    const data = await req.json();

    if (data.isBestAttempt) {
      await Recording.updateMany(
        { user: session.userId, item: data.item, isBestAttempt: true },
        { isBestAttempt: false }
      );
    }

    const recording = await Recording.create({
      ...data,
      user: session.userId,
    });

    // Check for first recording badge
    const User = (await import('@/models/User')).default;
    const user = await User.findById(session.userId);
    if (user && !user.badges.includes('first-recording')) {
      user.badges.push('first-recording');
      user.xp += 20;
      await user.save();
    }

    return NextResponse.json({ recording }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save recording';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

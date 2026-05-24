import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Homework from '@/models/Homework';
import Progress from '@/models/Progress';

export async function GET() {
  try {
    const session = await requireAuth();
    await connectDB();

    const homework = await Homework.find({
      $or: [{ assignedTo: session.userId }, { batch: { $exists: true } }],
      isActive: true,
    })
      .populate('items', 'title englishText type')
      .populate('module', 'name')
      .sort({ deadline: 1 });

    const progress = await Progress.find({ user: session.userId });
    const completedItems = new Set(
      progress.filter(p => p.isCompleted).map(p => p.item.toString())
    );

    const result = homework.map(hw => {
      const totalItems = hw.items.length;
      const completed = hw.items.filter((item: { _id: { toString: () => string } }) => completedItems.has(item._id.toString())).length;
      const isOverdue = new Date(hw.deadline) < new Date();
      return {
        ...hw.toObject(),
        completedCount: completed,
        totalCount: totalItems,
        isOverdue,
        isComplete: completed >= totalItems,
      };
    });

    return NextResponse.json({ homework: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch homework';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

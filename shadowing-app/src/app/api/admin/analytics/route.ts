import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import User from '@/models/User';
import Recording from '@/models/Recording';
import Progress from '@/models/Progress';
import ShadowingItem from '@/models/ShadowingItem';
import Homework from '@/models/Homework';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({
      role: 'student',
      lastPracticeDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const inactiveStudents = totalStudents - activeStudents;
    const totalRecordings = await Recording.countDocuments();
    const totalItems = await ShadowingItem.countDocuments();
    const completedPractices = await Progress.countDocuments({ isCompleted: true });
    const pendingHomework = await Homework.countDocuments({
      deadline: { $gte: new Date() },
      isActive: true
    });

    const topStudents = await User.find({ role: 'student' })
      .select('name xp streak totalPractices')
      .sort({ xp: -1 })
      .limit(10);

    const streakStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: null, avgStreak: { $avg: '$streak' }, maxStreak: { $max: '$longestStreak' } } }
    ]);

    return NextResponse.json({
      analytics: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        totalRecordings,
        totalItems,
        completedPractices,
        pendingHomework,
        topStudents,
        streakStats: streakStats[0] || { avgStreak: 0, maxStreak: 0 },
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch analytics';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

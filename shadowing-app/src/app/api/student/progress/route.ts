import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Progress from '@/models/Progress';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await requireAuth();
    await connectDB();
    const progress = await Progress.find({ user: session.userId })
      .populate('item')
      .sort({ updatedAt: -1 });
    return NextResponse.json({ progress });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();
    const { itemId, step, selfRating } = await req.json();

    let progress = await Progress.findOne({ user: session.userId, item: itemId });

    if (!progress) {
      progress = await Progress.create({
        user: session.userId,
        item: itemId,
        currentStep: step,
        completedSteps: [step],
      });
    } else {
      if (!progress.completedSteps.includes(step)) {
        progress.completedSteps.push(step);
      }
      progress.currentStep = Math.max(progress.currentStep, step);
      if (selfRating) progress.selfRating = selfRating;
      if (progress.completedSteps.length >= 4) {
        progress.isCompleted = true;
        progress.completedAt = new Date();
      }
      await progress.save();
    }

    // Update user stats - give XP for each step AND full completion
    const user = await User.findById(session.userId);
    if (user) {
      // Give XP per step (3 XP per step, bonus 8 XP on full completion)
      const isNewStep = progress.completedSteps.length > 0;
      if (isNewStep) {
        user.xp += 3; // XP for each step completed
      }

      if (progress.isCompleted) {
        user.xp += 8; // Bonus XP for completing all 4 steps
        user.totalPractices += 1;
      }

      // Update streak
      const today = new Date().toDateString();
      const lastDate = user.lastPracticeDate ? user.lastPracticeDate.toDateString() : '';
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (lastDate !== today) {
        // First practice today
        if (lastDate === yesterday) {
          user.streak += 1;
        } else if (!lastDate) {
          user.streak = 1;
        } else {
          user.streak = 1; // Reset streak if missed a day
        }
      }
      if (user.streak > user.longestStreak) user.longestStreak = user.streak;
      user.lastPracticeDate = new Date();
      user.level = Math.floor(user.xp / 100) + 1;
      await user.save();
    }

    return NextResponse.json({
      progress,
      xpGained: progress.isCompleted ? 11 : 3,
      userStats: user ? { xp: user.xp, level: user.level, streak: user.streak } : null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

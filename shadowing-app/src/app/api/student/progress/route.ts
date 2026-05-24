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
      // Brand new item - student practicing for the first time
      progress = await Progress.create({
        user: session.userId,
        item: itemId,
        currentStep: step,
        completedSteps: [step],
        lastPracticedAt: new Date(),
        reviewCount: 0,
        isCompleted: false,
      });
    } else {
      // If item was previously completed (came back for review),
      // reset it so student practices fresh
      if (progress.isCompleted) {
        progress.isCompleted = false;
        progress.completedSteps = [];
        progress.currentStep = 0;
        progress.completedAt = undefined;
      }

      // Add step to completedSteps if not already there
      if (!progress.completedSteps.includes(step)) {
        progress.completedSteps.push(step);
      }
      progress.currentStep = Math.max(progress.currentStep, step);
      if (selfRating) progress.selfRating = selfRating;
      progress.lastPracticedAt = new Date();

      // Check if all 4 steps are now completed
      const hasAll4 = progress.completedSteps.length >= 4;
      if (hasAll4 && !progress.isCompleted) {
        // Mark as completed
        progress.isCompleted = true;
        progress.completedAt = new Date();
        progress.reviewCount = (progress.reviewCount || 0) + 1;

        // SPACED REPETITION SCHEDULE:
        // reviewCount 1 = first completion → hide 3 days, then come back
        // reviewCount 2 = second completion → hide 7 days, then come back
        // reviewCount 3+ = MASTERED → never show again
        const rc = progress.reviewCount;
        if (rc === 1) {
          const next = new Date();
          next.setDate(next.getDate() + 3);
          next.setHours(0, 0, 0, 0);
          progress.nextReviewDate = next;
        } else if (rc === 2) {
          const next = new Date();
          next.setDate(next.getDate() + 7);
          next.setHours(0, 0, 0, 0);
          progress.nextReviewDate = next;
        } else {
          // rc >= 3 → mastered, set far future so never shows
          progress.nextReviewDate = new Date('2099-12-31');
        }
      }

      await progress.save();
    }

    // Update user stats
    const user = await User.findById(session.userId);
    let xpGained = 0;
    if (user) {
      // Give XP per step (3 XP per step)
      xpGained = 3;
      user.xp += 3;

      // Bonus XP on full completion
      if (progress.isCompleted && progress.completedSteps.length >= 4) {
        xpGained += 8;
        user.xp += 8;
        user.totalPractices += 1;
      }

      // Update streak
      const today = new Date().toDateString();
      const lastDate = user.lastPracticeDate ? user.lastPracticeDate.toDateString() : '';
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (lastDate !== today) {
        if (lastDate === yesterday) {
          user.streak += 1;
        } else if (!lastDate) {
          user.streak = 1;
        } else {
          user.streak = 1;
        }
      }
      if (user.streak > user.longestStreak) user.longestStreak = user.streak;
      user.lastPracticeDate = new Date();
      user.level = Math.floor(user.xp / 100) + 1;
      await user.save();
    }

    return NextResponse.json({
      progress: {
        ...progress.toObject(),
        reviewCount: progress.reviewCount,
        nextReviewDate: progress.nextReviewDate,
        lastPracticedAt: progress.lastPracticedAt,
      },
      xpGained,
      userStats: user ? { xp: user.xp, level: user.level, streak: user.streak } : null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update progress';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

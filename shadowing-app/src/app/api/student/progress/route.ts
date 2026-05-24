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
      // Brand new item - student is practicing for the first time
      progress = await Progress.create({
        user: session.userId,
        item: itemId,
        currentStep: step,
        completedSteps: [step],
        lastPracticedAt: new Date(),
        reviewCount: 0,
      });
    } else {
      // Item came back for review (was completed before, now due)
      // If it was completed but student is starting again, reset the steps
      if (progress.isCompleted && step === 1) {
        // Reset for new review round
        progress.isCompleted = false;
        progress.completedSteps = [step];
        progress.currentStep = step;
        progress.completedAt = undefined;
      } else {
        // Normal step progression
        if (!progress.completedSteps.includes(step)) {
          progress.completedSteps.push(step);
        }
        progress.currentStep = Math.max(progress.currentStep, step);
      }

      if (selfRating) progress.selfRating = selfRating;
      progress.lastPracticedAt = new Date();

      // Check if all 4 steps are now completed
      const allStepsDone = [1, 2, 3, 4].every(s => progress!.completedSteps.includes(s));
      if (allStepsDone && !progress.isCompleted) {
        progress.isCompleted = true;
        progress.completedAt = new Date();
        progress.reviewCount = (progress.reviewCount || 0) + 1;

        // SPACED REPETITION SCHEDULE:
        // reviewCount 1 = first completion → come back in 3 days
        // reviewCount 2 = second completion (3-day review) → come back in 7 days
        // reviewCount 3 = third completion (7-day review) → MASTERED, never again
        const rc = progress.reviewCount;
        if (rc === 1) {
          const next = new Date();
          next.setDate(next.getDate() + 3);
          next.setHours(0, 0, 0, 0); // Start of that day
          progress.nextReviewDate = next;
        } else if (rc === 2) {
          const next = new Date();
          next.setDate(next.getDate() + 7);
          next.setHours(0, 0, 0, 0);
          progress.nextReviewDate = next;
        } else if (rc >= 3) {
          // Mastered! Set far future date so it never shows
          const never = new Date('2099-12-31');
          progress.nextReviewDate = never;
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

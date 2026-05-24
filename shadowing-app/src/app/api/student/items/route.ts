import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import ShadowingItem from '@/models/ShadowingItem';
import Progress from '@/models/Progress';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const module = searchParams.get('module');
    const level = searchParams.get('level');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (module) filter.module = module;
    if (level) filter.level = level;
    if (type) filter.type = type;

    // Get all active items
    const allItems = await ShadowingItem.find(filter)
      .populate('category', 'name type icon')
      .populate('module', 'name')
      .populate('level', 'name order')
      .sort({ order: 1, createdAt: 1 })
      .limit(limit);

    // Check if user is logged in - apply spaced repetition filter
    const session = await getSession();
    if (!session) {
      // Not logged in - return all items
      return NextResponse.json({ items: allItems, total: allItems.length });
    }

    // Get user's progress for these items
    const itemIds = allItems.map(item => item._id);
    const progressRecords = await Progress.find({
      user: session.userId,
      item: { $in: itemIds },
    });

    // Create a map of itemId -> progress
    const progressMap = new Map<string, typeof progressRecords[0]>();
    for (const p of progressRecords) {
      progressMap.set(p.item.toString(), p);
    }

    const now = new Date();

    // SPACED REPETITION FILTER:
    // Rule 1: Never practiced → SHOW
    // Rule 2: In progress (not all 4 steps done) → SHOW
    // Rule 3: Completed once (reviewCount=1), within 3 days → HIDE
    // Rule 4: Completed once, after 3 days → SHOW (for 2nd review)
    // Rule 5: Completed twice (reviewCount=2), within 7 days → HIDE
    // Rule 6: Completed twice, after 7 days → SHOW (for 3rd/final review)
    // Rule 7: Completed 3 times (reviewCount>=3) → HIDE FOREVER (mastered)
    const filteredItems = allItems.filter(item => {
      const progress = progressMap.get(item._id.toString());

      // Rule 1: Never practiced
      if (!progress) return true;

      // Rule 2: Started but not completed yet
      if (!progress.isCompleted) return true;

      // Item is completed - check review schedule
      const reviewCount = progress.reviewCount || 0;

      // Rule 7: Mastered (completed 3 times)
      if (reviewCount >= 3) return false;

      // Check nextReviewDate
      if (progress.nextReviewDate) {
        const reviewDate = new Date(progress.nextReviewDate);
        // If today >= nextReviewDate, show it
        if (now >= reviewDate) return true;
        // Otherwise hide it (not due yet)
        return false;
      }

      // Fallback: if nextReviewDate missing but completed
      // Use completedAt to calculate
      if (progress.completedAt) {
        const completedDate = new Date(progress.completedAt);
        const msSinceCompleted = now.getTime() - completedDate.getTime();
        const daysSinceCompleted = msSinceCompleted / (1000 * 60 * 60 * 24);

        if (reviewCount === 1 && daysSinceCompleted < 3) return false;
        if (reviewCount === 2 && daysSinceCompleted < 7) return false;
        return true;
      }

      // Safety: show by default
      return true;
    });

    // Add progress info to items for frontend
    const itemsWithProgress = filteredItems.map(item => {
      const progress = progressMap.get(item._id.toString());
      const itemObj = item.toObject();
      return {
        ...itemObj,
        _progress: progress ? {
          reviewCount: progress.reviewCount || 0,
          lastPracticedAt: progress.lastPracticedAt || progress.updatedAt,
          isCompleted: progress.isCompleted,
          nextReviewDate: progress.nextReviewDate,
        } : null,
      };
    });

    return NextResponse.json({ items: itemsWithProgress, total: itemsWithProgress.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch items';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

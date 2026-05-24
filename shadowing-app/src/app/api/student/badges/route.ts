import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import User from '@/models/User';

export const BADGE_DEFINITIONS = [
  { id: 'first-recording', name: 'First Recording', description: 'Made your first recording', icon: '🎙️', xp: 20 },
  { id: '10-words', name: '10 Words Completed', description: 'Completed 10 word practices', icon: '📝', xp: 30 },
  { id: '10-sentences', name: '10 Sentences Completed', description: 'Completed 10 sentence practices', icon: '📖', xp: 40 },
  { id: '7-day-streak', name: '7 Day Streak', description: 'Practiced 7 days in a row', icon: '🔥', xp: 50 },
  { id: 'ielts-starter', name: 'IELTS Shadowing Starter', description: 'Started IELTS level practice', icon: '🎯', xp: 30 },
  { id: 'pronunciation-warrior', name: 'Pronunciation Warrior', description: '50 total practices completed', icon: '⚔️', xp: 60 },
  { id: 'consistency-master', name: 'Consistency Master', description: '30 day streak achieved', icon: '👑', xp: 100 },
];

export async function GET() {
  try {
    const session = await requireAuth();
    await connectDB();
    const user = await User.findById(session.userId).select('badges xp level streak');

    const badges = BADGE_DEFINITIONS.map(badge => ({
      ...badge,
      earned: user?.badges.includes(badge.id) || false,
    }));

    return NextResponse.json({ badges, userBadges: user?.badges || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch badges';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

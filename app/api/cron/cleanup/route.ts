import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logEvent } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const retentionDays = parseInt(process.env.DATA_RETENTION_DAYS || '90', 10);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Purge old assessment sessions
    const deletedSessions = await db.assessmentSession.deleteMany({
      where: {
        created_at: {
          lt: cutoffDate
        }
      }
    });

    await logEvent('result_generated', `Data retention cleanup purged ${deletedSessions.count} sessions older than ${retentionDays} days.`);

    return NextResponse.json({
      success: true,
      purgedCount: deletedSessions.count,
      cutoffDate: cutoffDate.toISOString(),
      retentionDays
    });
  } catch (error) {
    console.error('Data retention cleanup error:', error);
    return NextResponse.json({ success: false, error: 'Cleanup failed' }, { status: 500 });
  }
}

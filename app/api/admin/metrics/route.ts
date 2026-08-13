import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pass = searchParams.get('key');
    
    // Basic protection for admin endpoint
    const expectedPass = process.env.ADMIN_PASSWORD || 'predlife_admin_pass';
    if (pass !== expectedPass) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const totalSessions = await db.assessmentSession.count();
    const completedSessions = await db.assessmentSession.count({ where: { status: 'completed' } });
    const paidPayments = await db.payment.findMany({ where: { status: 'paid' } });
    const failedPaymentsCount = await db.payment.count({ where: { status: 'failed' } });
    const totalReports = await db.report.count();

    const totalRevenuePaise = paidPayments.reduce((acc: number, p: { amount: number }) => acc + p.amount, 0);
    const totalRevenueINR = totalRevenuePaise / 100;

    const recentLogs = await db.adminLog.findMany({
      take: 10,
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalSessions,
        completedSessions,
        successfulPayments: paidPayments.length,
        failedPayments: failedPaymentsCount,
        reportsGenerated: totalReports,
        revenueINR: totalRevenueINR,
        methodologyVersion: 'PL-1.0',
        conversionRate: totalSessions > 0 ? `${((completedSessions / totalSessions) * 100).toFixed(1)}%` : '0%'
      },
      recentLogs
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve admin metrics' }, { status: 500 });
  }
}

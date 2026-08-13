import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, email } = body;

    if (!token || !email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email and report token required' }, { status: 400 });
    }

    const report = await db.report.findUnique({
      where: { report_token: token }
    });

    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    await db.report.update({
      where: { report_token: token },
      data: { emailed_to: email }
    });

    return NextResponse.json({
      success: true,
      message: `Report delivery registered for ${email}. (In production, an automated SMTP dispatch triggers here).`
    });
  } catch (error) {
    console.error('Error saving report email:', error);
    return NextResponse.json({ success: false, error: 'Failed to record email' }, { status: 500 });
  }
}

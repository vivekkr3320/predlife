import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkClinicalRedFlags } from '@/lib/safety';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const sessionId = searchParams.get('sessionId');

    if (!token && !sessionId) {
      return NextResponse.json({ success: false, error: 'Report token or session ID required' }, { status: 400 });
    }

    const report = await db.report.findFirst({
      where: token ? { report_token: token } : { assessment_session_id: sessionId! }
    });

    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found or payment incomplete' }, { status: 404 });
    }

    const session = await db.assessmentSession.findUnique({
      where: { id: report.assessment_session_id }
    });

    // Check payment verification
    const payment = await db.payment.findFirst({
      where: { assessment_session_id: report.assessment_session_id, status: 'paid' }
    });

    if (!payment && session?.status !== 'completed' && session?.status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Payment required.' }, { status: 403 });
    }

    const clinicalAlerts = checkClinicalRedFlags({
      systolic_bp: session?.systolic_bp,
      diastolic_bp: session?.diastolic_bp,
      glucose_status: session?.glucose_status
    });

    return NextResponse.json({
      success: true,
      report: {
        score: report.score,
        riskBand: report.risk_band,
        estimatedRange: {
          minAge: report.min_age,
          maxAge: report.max_age
        },
        strengths: JSON.parse(report.strengths_json),
        priorityFactors: JSON.parse(report.priority_factors_json),
        plan: JSON.parse(report.plan_json),
        methodologyVersion: report.methodology_version,
        createdAt: report.created_at,
        sessionId: report.assessment_session_id,
        emailedTo: report.emailed_to
      },
      answers: session ? {
        age: session.age,
        nicotine_exposure: session.nicotine_exposure,
        physical_activity: session.physical_activity,
        diet_quality: session.diet_quality,
        sleep_duration: session.sleep_duration,
        height_cm: session.height_cm,
        weight_kg: session.weight_kg,
        bmi: session.bmi,
        systolic_bp: session.systolic_bp,
        diastolic_bp: session.diastolic_bp,
        bp_status: session.bp_status,
        lipids_status: session.lipids_status,
        glucose_status: session.glucose_status,
        alcohol_exposure: session.alcohol_exposure
      } : null,
      clinicalAlerts
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve report' }, { status: 500 });
  }
}

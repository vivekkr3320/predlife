import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { calculateLongevityProfile } from '@/lib/longevity/scoring';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, answers } = body;

    if (!sessionId || !answers) {
      return NextResponse.json({ success: false, error: 'Missing session or answers' }, { status: 400 });
    }

    // Verify session & payment status from DB
    const session = await db.assessmentSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    // Anti-bypass check: ensure payment is complete
    const payment = await db.payment.findFirst({
      where: { assessment_session_id: sessionId, status: 'paid' }
    });

    if (!payment && session.status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Unpaid assessment session. Payment required.' }, { status: 403 });
    }

    // Calculate longevity profile
    const result = calculateLongevityProfile(answers);

    // Save answers & update session status
    await db.assessmentSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        age: answers.age || null,
        nicotine_exposure: answers.nicotine_exposure || null,
        physical_activity: answers.physical_activity || null,
        diet_quality: answers.diet_quality || null,
        sleep_duration: answers.sleep_duration || null,
        height_cm: answers.height_cm ? Number(answers.height_cm) : null,
        weight_kg: answers.weight_kg ? Number(answers.weight_kg) : null,
        bmi: answers.height_cm && answers.weight_kg ? Number((answers.weight_kg / Math.pow(answers.height_cm / 100, 2)).toFixed(1)) : null,
        systolic_bp: answers.systolic_bp ? Number(answers.systolic_bp) : null,
        diastolic_bp: answers.diastolic_bp ? Number(answers.diastolic_bp) : null,
        bp_status: answers.bp_status || null,
        lipids_status: answers.lipids_status || null,
        glucose_status: answers.glucose_status || null,
        alcohol_exposure: answers.alcohol_exposure || null,
        raw_answers_json: JSON.stringify(answers),
        completed_at: new Date()
      }
    });

    // Create Report token & save report record
    const reportToken = `rep_${crypto.randomBytes(16).toString('hex')}`;
    
    await db.report.upsert({
      where: { assessment_session_id: sessionId },
      update: {
        report_token: reportToken,
        score: result.score,
        risk_band: result.riskBand,
        min_age: result.estimatedRange.minAge,
        max_age: result.estimatedRange.maxAge,
        strengths_json: JSON.stringify(result.strengths),
        priority_factors_json: JSON.stringify(result.priorityFactors),
        plan_json: JSON.stringify(result.plan),
        methodology_version: result.methodologyVersion
      },
      create: {
        assessment_session_id: sessionId,
        report_token: reportToken,
        score: result.score,
        risk_band: result.riskBand,
        min_age: result.estimatedRange.minAge,
        max_age: result.estimatedRange.maxAge,
        strengths_json: JSON.stringify(result.strengths),
        priority_factors_json: JSON.stringify(result.priorityFactors),
        plan_json: JSON.stringify(result.plan),
        methodology_version: result.methodologyVersion
      }
    });

    return NextResponse.json({
      success: true,
      reportToken,
      sessionId
    });
  } catch (error) {
    console.error('Error saving assessment answers:', error);
    return NextResponse.json({ success: false, error: 'Failed to process assessment results' }, { status: 500 });
  }
}

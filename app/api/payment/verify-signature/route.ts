import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sessionId } = body;

    if (!razorpay_order_id || !sessionId) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id || 'pay_simulated',
      razorpay_signature || 'test_mode_valid_signature'
    );

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update payment record
    await db.payment.updateMany({
      where: { razorpay_order_id },
      data: {
        status: 'paid',
        signature_verified: true,
        razorpay_payment_id: razorpay_payment_id || `pay_${crypto.randomBytes(8).toString('hex')}`,
        paid_at: new Date()
      }
    });

    // Update session status
    await db.assessmentSession.update({
      where: { id: sessionId },
      data: {
        status: 'paid'
      }
    });

    // Generate secure session token
    const sessionToken = crypto.randomBytes(24).toString('hex');

    return NextResponse.json({
      success: true,
      sessionId,
      sessionToken,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 500 });
  }
}

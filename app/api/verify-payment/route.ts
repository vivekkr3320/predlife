import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { logEvent } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const razorpay_order_id = body.razorpay_order_id || body.order_id;
    const razorpay_payment_id = body.razorpay_payment_id || body.payment_id;
    const razorpay_signature = body.razorpay_signature || body.signature;
    const sessionId = body.sessionId || body.session_id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature)' },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      await logEvent('payment_failed', `Invalid payment signature for order ${razorpay_order_id}`, {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update database records if present
    try {
      await db.payment.updateMany({
        where: { razorpay_order_id },
        data: {
          status: 'paid',
          signature_verified: true,
          razorpay_payment_id,
          paid_at: new Date()
        }
      });

      if (sessionId) {
        await db.assessmentSession.update({
          where: { id: sessionId },
          data: {
            status: 'paid'
          }
        });
      }
    } catch (dbErr) {
      console.warn('Database update skipped or failed:', dbErr);
    }

    await logEvent('payment_verified', `Payment verified successfully for order ${razorpay_order_id}`, {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });

    const sessionToken = crypto.randomBytes(24).toString('hex');

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      sessionToken,
      sessionId
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

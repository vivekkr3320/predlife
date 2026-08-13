import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { createServerRazorpayOrder } from '@/lib/razorpay';

export async function POST() {
  try {
    const sessionId = `PL-${crypto.randomBytes(6).toString('hex')}`;
    const order = createServerRazorpayOrder(19900); // ₹199 in paise

    // Save payment & session record
    await db.payment.create({
      data: {
        assessment_session_id: sessionId,
        razorpay_order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'pending',
        methodology_version: 'PL-1.0'
      }
    });

    await db.assessmentSession.create({
      data: {
        id: sessionId,
        status: 'created',
        methodology_version: 'PL-1.0'
      }
    });

    return NextResponse.json({
      success: true,
      sessionId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_predlife_key'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create payment order' }, { status: 500 });
  }
}

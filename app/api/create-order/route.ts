import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { createServerRazorpayOrder } from '@/lib/razorpay';
import { logEvent } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    let amount = 19900;
    let currency = 'INR';
    let notes: Record<string, string> | undefined;

    try {
      const body = await req.json();
      if (body?.amount !== undefined) {
        amount = Number(body.amount);
      }
      if (body?.currency) {
        currency = body.currency;
      }
      if (body?.notes) {
        notes = body.notes;
      }
    } catch {
      // Body is optional, default values apply
    }

    if (amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Amount must be at least 100 paise (₹1.00)' },
        { status: 400 }
      );
    }

    const sessionId = `PL-${crypto.randomBytes(6).toString('hex')}`;
    const order = await createServerRazorpayOrder(amount, {
      sessionId,
      product: 'PredLife Longevity Assessment (PL-1.0)',
      ...(notes || {})
    });

    // Save payment & session records in DB if available
    try {
      await db.payment.create({
        data: {
          assessment_session_id: sessionId,
          razorpay_order_id: order.id,
          amount: order.amount,
          currency: order.currency || currency,
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
    } catch (dbErr) {
      console.warn('Database record creation skipped or failed:', dbErr);
    }

    await logEvent('payment_created', `Created Razorpay order ${order.id}`, {
      orderId: order.id,
      sessionId,
      amount: order.amount
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || currency,
      sessionId,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    const status = error?.statusCode || error?.status || 500;
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create payment order' },
      { status: status === 401 ? 401 : 500 }
    );
  }
}

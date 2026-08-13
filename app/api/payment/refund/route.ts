import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logEvent } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, email, reason } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Razorpay Order ID is required.' }, { status: 400 });
    }

    const payment = await db.payment.findFirst({
      where: { razorpay_order_id: orderId }
    });

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Order not found in system.' }, { status: 404 });
    }

    // Update refund status to requested
    await db.payment.update({
      where: { id: payment.id },
      data: {
        refund_status: 'requested'
      }
    });

    await logEvent('refund_requested', `Refund requested for order ${orderId}`, { email, reason });

    return NextResponse.json({
      success: true,
      message: 'Refund request recorded successfully. Our team will review your order within 24–48 hours.',
      refundStatus: 'requested'
    });
  } catch (error) {
    console.error('Error processing refund request:', error);
    return NextResponse.json({ success: false, error: 'Failed to record refund request.' }, { status: 500 });
  }
}

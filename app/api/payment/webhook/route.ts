import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import { logEvent } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ success: false, error: 'Missing Razorpay webhook signature' }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyRazorpayWebhookSignature(bodyText, signature);
    if (!isValid) {
      await logEvent('webhook_received', 'Invalid webhook signature rejected', { signature });
      return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(bodyText);
    const eventType = event.event;

    await logEvent('webhook_verified', `Received verified webhook event: ${eventType}`, { eventType });

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity || event.payload?.order?.entity;
      const orderId = paymentEntity?.order_id || paymentEntity?.id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const existingPayment = await db.payment.findFirst({
          where: { razorpay_order_id: orderId }
        });

        if (existingPayment && existingPayment.status !== 'paid') {
          await db.payment.update({
            where: { id: existingPayment.id },
            data: {
              status: 'paid',
              signature_verified: true,
              razorpay_payment_id: paymentId,
              paid_at: new Date()
            }
          });

          await db.assessmentSession.update({
            where: { id: existingPayment.assessment_session_id },
            data: { status: 'paid' }
          });

          await logEvent('payment_verified', `Webhook marked order ${orderId} as paid`, { orderId, paymentId });
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        await db.payment.updateMany({
          where: { razorpay_order_id: orderId },
          data: { status: 'failed' }
        });
        await logEvent('payment_failed', `Webhook marked order ${orderId} as failed`, { orderId });
      }
    } else if (eventType === 'refund.processed' || eventType === 'payment.refunded') {
      const refundEntity = event.payload?.refund?.entity || event.payload?.payment?.entity;
      const paymentId = refundEntity?.payment_id || refundEntity?.id;
      if (paymentId) {
        await db.payment.updateMany({
          where: { razorpay_payment_id: paymentId },
          data: { status: 'refunded', refund_status: 'processed' }
        });
        await logEvent('refund_requested', `Webhook marked payment ${paymentId} as refunded`, { paymentId });
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('Error handling Razorpay webhook:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}

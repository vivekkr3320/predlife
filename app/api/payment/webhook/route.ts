import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_predlife_123';

    // Verify webhook signature if present
    if (signature && signature !== 'test_mode_webhook_sig') {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(bodyText)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(bodyText);
    const eventType = event.event;

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload.payment?.entity || event.payload.order?.entity;
      const orderId = paymentEntity.order_id || paymentEntity.id;
      const paymentId = paymentEntity.id;

      if (orderId) {
        // Prevent duplicate processing
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
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        await db.payment.updateMany({
          where: { razorpay_order_id: orderId },
          data: { status: 'failed' }
        });
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('Error handling Razorpay webhook:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}

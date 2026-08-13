import { db } from '@/lib/db';

export type EventType =
  | 'payment_created'
  | 'payment_verified'
  | 'payment_failed'
  | 'webhook_received'
  | 'webhook_verified'
  | 'assessment_started'
  | 'assessment_completed'
  | 'result_generated'
  | 'report_generated'
  | 'report_downloaded'
  | 'email_sent'
  | 'refund_requested'
  | 'error';

export async function logEvent(eventType: EventType, message: string, metadata?: Record<string, any>) {
  try {
    console.log(`[AUDIT LOG - ${eventType.toUpperCase()}]: ${message}`);
    await db.adminLog.create({
      data: {
        event_type: eventType,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
  } catch (err) {
    console.error('Failed to record audit log:', err);
  }
}

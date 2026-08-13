'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return setError('Order ID is required');

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/payment/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email, reason })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to submit request');
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message || 'Refund request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editorial-container max-w-3xl py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif-editorial text-4xl font-bold text-[var(--text-primary)]">Refund & Cancellation Policy</h1>
        <p className="text-xs text-[var(--text-muted)]">Compliant with E-Commerce Consumer Protection Rules</p>
      </div>

      <div className="card-editorial p-8 space-y-6 bg-[var(--card-bg)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] leading-relaxed">
        <h2 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">1. Payment & Refund Terms</h2>
        <p>
          PredLife costs a one-time fee of ₹199 INR. If a technical issue occurs where your payment was debited but a report token could not be generated due to a server error, you are eligible for a 100% full refund upon request.
        </p>

        <h2 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">2. Refund Request Process</h2>
        <p>
          You can request a refund below by providing your Razorpay Order ID or payment reference. Refund processing takes 3–5 business days back to your original payment method.
        </p>

        {/* Interactive Refund Form */}
        <div className="p-6 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-sm space-y-4 pt-4">
          <h3 className="font-serif-editorial text-lg font-bold text-[var(--text-primary)]">Submit a Refund Request</h3>
          
          {message ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs rounded-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Razorpay Order ID or Payment ID</label>
                <input
                  type="text"
                  placeholder="e.g. order_..."
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  className="w-full p-3 border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] rounded-sm text-xs focus:outline-[var(--accent-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Optional Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] rounded-sm text-xs focus:outline-[var(--accent-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Reason for Refund</label>
                <textarea
                  placeholder="Describe technical issue or reason..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] rounded-sm text-xs focus:outline-[var(--accent-primary)]"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-editorial text-xs py-3 px-6 w-full sm:w-auto"
              >
                {loading ? 'Submitting Request...' : 'Submit Refund Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2, CreditCard, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/create-order', { method: 'POST' });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      const { sessionId, orderId, amount, currency, keyId } = data;

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('predlife_session_id', sessionId);
      }

      if (window.Razorpay && keyId && !keyId.startsWith('rzp_test_predlife')) {
        const options = {
          key: keyId,
          amount: amount,
          currency: currency || 'INR',
          name: 'PredLife Health',
          description: 'Longevity Risk Assessment — ₹199',
          order_id: orderId,
          handler: async function (response: any) {
            if (!response?.razorpay_payment_id || !response?.razorpay_signature) {
              setError('Incomplete payment response received from gateway.');
              setLoading(false);
              return;
            }
            setLoading(true);
            await verifyPayment(
              response.razorpay_order_id || orderId,
              response.razorpay_payment_id,
              response.razorpay_signature,
              sessionId
            );
          },
          prefill: {
            name: '',
            email: '',
            contact: ''
          },
          notes: {
            sessionId: sessionId
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
            escape: true,
            backdropclose: false
          },
          theme: {
            color: '#0F382C'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          const desc = response?.error?.description || response?.error?.reason || 'Payment was unsuccessful or cancelled. Please try again.';
          setError(desc);
          setLoading(false);
        });
        rzp.open();
      } else {
        // Run Seamless Test Mode Simulator when no real Razorpay key is configured
        setTimeout(async () => {
          await verifyPayment(orderId, `pay_sim_${Date.now()}`, 'test_mode_valid_signature', sessionId);
        }, 1000);
      }
    } catch (err: any) {
      setError(err?.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId: string, paymentId: string, signature: string, sessionId: string) => {
    try {
      const res = await fetch('/api/payment/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          sessionId
        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Signature verification failed');
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('predlife_session_token', data.sessionToken);
      }

      router.push('/assessment/questionnaire');
    } catch (err: any) {
      setError(err?.message || 'Payment verification failed');
      setLoading(false);
    }
  };

  return (
    <div className="editorial-container max-w-xl py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[var(--accent-primary)] font-bold">Secure Checkout</span>
        <h1 className="font-serif-editorial text-4xl font-bold text-[var(--text-primary)]">
          Unlock Your PredLife Longevity Report
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          One-time payment of ₹199. No subscription. No hidden fees.
        </p>
      </div>

      <div className="card-editorial p-8 space-y-6 bg-[var(--card-bg)] border border-[var(--border-color)]">
        {/* Order Summary */}
        <div className="space-y-4 pb-6 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-center text-sm font-semibold text-[var(--text-primary)]">
            <span>PredLife Longevity Profile (PL-1.0)</span>
            <span>₹199.00</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Includes 10-question evidence assessment, longevity range estimate, risk profile, and 10-page downloadable PDF report.
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Server-Verified Razorpay Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>100% Anonymous Assessment (No Signup / No Password)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Instant In-Browser Report & Downloadable PDF</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-sm space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            {error.toLowerCase().includes('expired') && (
              <p className="text-[11px] text-red-600 dark:text-red-400 pl-6">
                Tip: Generate a fresh Key ID & Secret from your Razorpay Dashboard &gt; Settings &gt; API Keys and paste them into <code className="bg-red-100 dark:bg-red-900/40 px-1 py-0.5 rounded">.env.local</code>.
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleInitiatePayment}
            disabled={loading}
            className="btn-editorial w-full py-4 text-base shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            <span>{loading ? 'Processing Razorpay Payment...' : 'Pay ₹199 — Start Assessment'}</span>
          </button>

          {/* Test Mode Simulator for local developer testing */}
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              setError('');
              try {
                const res = await fetch('/api/payment/create-order', { method: 'POST' });
                const data = await res.json();
                if (!data.success) throw new Error(data.error);
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('predlife_session_id', data.sessionId);
                }
                await verifyPayment(data.orderId, `pay_sim_${Date.now()}`, 'test_mode_valid_signature', data.sessionId);
              } catch (err: any) {
                setError(err?.message || 'Simulator failed');
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)] border border-dashed border-[var(--border-color)] rounded-sm transition-colors cursor-pointer"
          >
            🛠️ Test Mode: Complete Checkout Simulation (Bypass Gateway)
          </button>
        </div>

        <div className="pt-2 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
            <Lock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>256-bit SSL Encryption • Official Razorpay Standard Checkout</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Supports UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking.
          </p>
        </div>
      </div>
    </div>
  );
}

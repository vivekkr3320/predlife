'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const [passKey, setPassKey] = useState('predlife_admin_pass');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/metrics?key=${passKey}`);
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to fetch admin metrics');
      }
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Unauthorized admin access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editorial-container max-w-4xl py-12 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--accent-primary)] font-bold">Internal Operations</span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            PredLife Admin Dashboard
          </h1>
        </div>

        <div className="flex gap-2">
          <input
            type="password"
            value={passKey}
            onChange={e => setPassKey(e.target.value)}
            placeholder="Admin Key"
            className="p-2 border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] rounded-sm text-xs focus:outline-[var(--accent-primary)]"
          />
          <button
            onClick={fetchMetrics}
            className="btn-editorial text-xs py-2 px-4 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-editorial p-5 space-y-1 bg-[var(--card-bg)] border border-[var(--border-color)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Total Revenue</span>
              <div className="font-serif-editorial text-2xl font-bold text-[var(--accent-primary)]">
                ₹{data.metrics.revenueINR}
              </div>
            </div>

            <div className="card-editorial p-5 space-y-1 bg-[var(--card-bg)] border border-[var(--border-color)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Paid Orders</span>
              <div className="font-serif-editorial text-2xl font-bold text-[var(--text-primary)]">
                {data.metrics.successfulPayments}
              </div>
            </div>

            <div className="card-editorial p-5 space-y-1 bg-[var(--card-bg)] border border-[var(--border-color)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Completed Reports</span>
              <div className="font-serif-editorial text-2xl font-bold text-[var(--text-primary)]">
                {data.metrics.reportsGenerated}
              </div>
            </div>

            <div className="card-editorial p-5 space-y-1 bg-[var(--card-bg)] border border-[var(--border-color)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Conversion Rate</span>
              <div className="font-serif-editorial text-2xl font-bold text-[var(--text-primary)]">
                {data.metrics.conversionRate}
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="card-editorial p-6 space-y-3 bg-[var(--card-bg)] border border-[var(--border-color)]">
            <h3 className="font-serif-editorial text-lg font-bold text-[var(--text-primary)]">System Metadata</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-[var(--text-secondary)]">
              <div>
                <span className="text-[var(--text-muted)] block">Active Methodology</span>
                <span className="font-mono text-[var(--accent-primary)] font-semibold">{data.metrics.methodologyVersion}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Total Sessions Created</span>
                <span className="font-semibold text-[var(--text-primary)]">{data.metrics.totalSessions}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Failed Payments</span>
                <span className="font-semibold text-amber-600">{data.metrics.failedPayments}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

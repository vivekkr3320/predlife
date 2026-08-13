import React from 'react';

export default function ContactPage() {
  return (
    <div className="editorial-container max-w-2xl py-12 space-y-8">
      <h1 className="font-serif-editorial text-4xl font-bold text-[#171717]">Contact & Operator Support</h1>

      <div className="card-editorial p-8 space-y-6 bg-white text-sm text-[#525252]">
        <div>
          <h3 className="font-semibold text-[#171717]">Operator Business Information</h3>
          <p className="mt-1">PredLife Health Operations</p>
          <p className="text-xs text-[#737373]">India Operations & Billing Entity</p>
        </div>

        <div>
          <h3 className="font-semibold text-[#171717]">Customer Support Email</h3>
          <p className="mt-1 text-[#0F382C] font-mono">support@predlife.com</p>
          <p className="text-xs text-[#737373]">Response time: 24–48 business hours</p>
        </div>
      </div>
    </div>
  );
}

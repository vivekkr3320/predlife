# PredLife — Personalized Longevity Assessment

**PredLife** is a paid longevity-assessment web application.

> Pay ₹199 to explore your personal longevity profile.

Built with Next.js 15 + App Router, Prisma (SQLite), Razorpay, and jsPDF.

---

## User Journey

**Landing → ₹199 Razorpay payment → 10-question assessment → calculation → Estimated Longevity Range → Personalized Report → PDF download**

No signup. No account. No mandatory email.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite via Prisma ORM
- **Payments**: Razorpay (Test + Live Mode)
- **PDF Generation**: jsPDF (10-page A4 report)
- **Methodology**: PL-1.0 (AHA Life's Essential 8 + WHO)

---

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/vivekkr3320/predlife.git
   cd predlife
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your Razorpay keys and other config
   ```

4. **Initialize the database**
   ```bash
   npx prisma db push
   ```

5. **Run locally**
   ```bash
   npm run dev
   ```

---

## Environment Variables

Create `.env.local` from `.env.example`. Required keys:

| Variable | Description |
|---|---|
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signing secret |
| `ADMIN_SECRET_KEY` | Admin dashboard access key |
| `DATA_RETENTION_DAYS` | Days before session data is purged (default: 90) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key (frontend) |

---

## Key Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/checkout` | ₹199 Razorpay checkout |
| `/assessment/consent` | DPDP 2025 consent flow |
| `/assessment/questionnaire` | 10-question interactive assessment |
| `/report` | Protected longevity report + PDF download |
| `/methodology` | PL-1.0 methodology documentation |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/refund-policy` | Refund Policy + request form |
| `/medical-disclaimer` | Statutory medical disclaimer |
| `/admin` | Protected admin dashboard |

---

## Legal & Regulatory Notice

> **PredLife provides an educational longevity assessment based on information provided by the user. It does NOT predict an exact date or age of death, diagnose medical conditions, prescribe treatment, or replace consultation with a qualified doctor.**

- Not a medical device
- Statistical estimates only — not guaranteed predictions
- Evidence-informed framework based on AHA Life's Essential 8 and WHO Guidelines
- Requires independent legal and health professional review before commercial launch

---

## Methodology

**Version**: PL-1.0

**Primary Evidence Sources**:
- [American Heart Association — Life's Essential 8](https://professional.heart.org/en/science-news/lifes-essential-8)
- [World Health Organization — Noncommunicable Diseases](https://www.who.int/)

---

## ⚠️ Before Going Live

- [ ] Replace Razorpay Test Keys with Live Keys
- [ ] Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` to live key
- [ ] Complete independent Indian legal/privacy review
- [ ] Complete independent health/scientific claims review
- [ ] Configure HTTPS on production host
- [ ] Run data retention cleanup via `/api/cron/cleanup`
- [ ] Set strong `ADMIN_SECRET_KEY`

import jsPDF from 'jspdf';

export interface ReportDataForPDF {
  score: number;
  riskBand: string;
  minAge: number;
  maxAge: number;
  strengths: Array<{ name: string; statusText: string; impactText: string; score?: number }>;
  priorityFactors: Array<{ name: string; statusText: string; impactText: string; score?: number }>;
  plan: Array<{ week: number; title: string; goals: string[] }>;
  methodologyVersion: string;
  createdAt: string;
  sessionId: string;
}

export function generatePredLifePDF(data: ReportDataForPDF) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Helper for adding standard page headers
  const addHeader = (pageNum: number, title: string) => {
    doc.setFillColor(15, 56, 44); // #0F382C
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PredLife Longevity Report', margin, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${pageNum} of 10 | ${title}`, pageWidth - margin - 45, 14);
  };

  const addFooter = (pageNum: number) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(115, 115, 115);
    doc.text(
      'PredLife PL-1.0 • Statistical Longevity Profile • Not a Medical Diagnosis or Lifespan Guarantee',
      margin,
      pageHeight - 12
    );
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(15, 56, 44);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // White inner card
  doc.setFillColor(255, 255, 255);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'F');

  doc.setTextColor(15, 56, 44);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text('PredLife', margin + 10, 60);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(82, 82, 82);
  doc.text('Personalized Longevity Profile & Health Improvement Report', margin + 10, 72);

  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 227, 220);
  doc.line(margin + 10, 85, pageWidth - margin - 10, 85);

  doc.setFontSize(10);
  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORT METADATA', margin + 10, 105);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(82, 82, 82);
  doc.text(`Methodology Version: ${data.methodologyVersion}`, margin + 10, 115);
  doc.text(`Assessment Session ID: ${data.sessionId}`, margin + 10, 123);
  doc.text(`Report Generation Date: ${data.createdAt}`, margin + 10, 131);
  doc.text(`Evidence Framework: AHA Life’s Essential 8 & WHO Guidelines`, margin + 10, 139);

  doc.setFillColor(244, 243, 239);
  doc.rect(margin + 10, 160, pageWidth - margin * 2 - 20, 50, 'F');

  doc.setTextColor(15, 56, 44);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUTORY TRANSPARENCY NOTICE', margin + 15, 173);

  doc.setTextColor(82, 82, 82);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'PredLife provides a statistical estimate based on user-supplied information. It does NOT predict an exact date or age of death, diagnose medical conditions, prescribe treatment, or replace consultation with a qualified doctor.',
    margin + 15,
    183,
    { maxWidth: pageWidth - margin * 2 - 30 }
  );

  // ==========================================
  // PAGE 2: ESTIMATED LONGEVITY RANGE
  // ==========================================
  doc.addPage();
  addHeader(2, 'Longevity Range');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Estimated Longevity Range', margin, 40);

  doc.setFillColor(244, 243, 239);
  doc.rect(margin, 48, pageWidth - margin * 2, 45, 'F');

  doc.setTextColor(15, 56, 44);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.minAge} – ${data.maxAge} Years`, margin + 12, 70);

  doc.setTextColor(82, 82, 82);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'This is a broad statistical estimate based on the information provided. It is not a guaranteed prediction of your lifespan or date of death.',
    margin + 12,
    83,
    { maxWidth: pageWidth - margin * 2 - 24 }
  );

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 23, 23);
  doc.text('How to Interpret Your Range', margin, 110);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(82, 82, 82);
  doc.text(
    'Your estimated range combines actuarial baseline data with individual score indicators from your 10 questionnaire answers. Modifiable factors such as physical activity, sleep, diet, and tobacco exposure play a significant role in where an individual tends to fall within epidemiological statistical ranges.',
    margin,
    120,
    { maxWidth: pageWidth - margin * 2 }
  );
  addFooter(2);

  // ==========================================
  // PAGE 3: PREDLIFE SCORE & PROFILE
  // ==========================================
  doc.addPage();
  addHeader(3, 'Score & Risk Profile');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PredLife Score & Risk Profile', margin, 40);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 227, 220);
  doc.rect(margin, 48, pageWidth - margin * 2, 35);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(82, 82, 82);
  doc.text('OVERALL PREDLIFE SCORE', margin + 8, 60);

  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 56, 44);
  doc.text(`${data.score} / 100`, margin + 8, 74);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 23, 23);
  doc.text(`Profile Classification: ${data.riskBand} Risk`, margin, 98);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(82, 82, 82);
  doc.text(
    data.riskBand === 'Lower'
      ? 'Your current responses indicate high alignment with protective cardiovascular longevity habits.'
      : data.riskBand === 'Moderate'
      ? 'Your responses indicate moderate protective habits with clear opportunities for lifestyle optimization.'
      : 'Your responses highlight several high-yield modifiable areas where positive habit changes can support healthier longevity.',
    margin,
    108,
    { maxWidth: pageWidth - margin * 2 }
  );
  addFooter(3);

  // ==========================================
  // PAGE 4: YOUR STRENGTHS ("What Looks Good")
  // ==========================================
  doc.addPage();
  addHeader(4, 'Your Strengths');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('4. What Looks Good (Your Strengths)', margin, 40);

  let yPos = 52;
  data.strengths.forEach((item) => {
    doc.setFillColor(244, 243, 239);
    doc.rect(margin, yPos, pageWidth - margin * 2, 28, 'F');

    doc.setTextColor(15, 56, 44);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.name}${item.score ? ` — Score: ${item.score}/100` : ''}`, margin + 6, yPos + 8);

    doc.setTextColor(23, 23, 23);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(item.statusText, margin + 6, yPos + 15);

    doc.setTextColor(82, 82, 82);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(item.impactText, margin + 6, yPos + 22, { maxWidth: pageWidth - margin * 2 - 12 });

    yPos += 34;
  });
  addFooter(4);

  // ==========================================
  // PAGE 5: PRIORITY FACTORS ("What You Could Improve")
  // ==========================================
  doc.addPage();
  addHeader(5, 'Priority Factors');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('5. What You Could Improve (Priority Factors)', margin, 40);

  yPos = 52;
  data.priorityFactors.forEach((item) => {
    doc.setFillColor(244, 243, 239);
    doc.rect(margin, yPos, pageWidth - margin * 2, 28, 'F');

    doc.setTextColor(180, 83, 9); // Amber
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.name}${item.score ? ` — Score: ${item.score}/100` : ''}`, margin + 6, yPos + 8);

    doc.setTextColor(23, 23, 23);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(item.statusText, margin + 6, yPos + 15);

    doc.setTextColor(82, 82, 82);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(item.impactText, margin + 6, yPos + 22, { maxWidth: pageWidth - margin * 2 - 12 });

    yPos += 34;
  });
  addFooter(5);

  // ==========================================
  // PAGE 6: WHY THESE FACTORS MATTER
  // ==========================================
  doc.addPage();
  addHeader(6, 'Evidence Explanation');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('6. Why These Factors Matter', margin, 40);

  const factorExplanations = [
    { name: 'Physical Activity', desc: 'Regular physical activity is associated with better cardiovascular and overall health.', source: 'Source: American Heart Association — Life’s Essential 8' },
    { name: 'Sleep Duration', desc: 'Adequate sleep (7–9 hours) promotes cellular repair, immune stability, and vascular health.', source: 'Source: American Heart Association — Life’s Essential 8' },
    { name: 'Nicotine Exposure', desc: 'Zero nicotine exposure is one of the highest impact modifiable factors for long-term health.', source: 'Source: WHO & AHA Guidelines' },
    { name: 'Dietary Quality', desc: 'Whole food nutrient-dense diets reduce systemic low-grade inflammation.', source: 'Source: AHA Essential 8 Diet Construct' },
  ];

  yPos = 52;
  factorExplanations.forEach((item) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 56, 44);
    doc.text(item.name, margin, yPos);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 82);
    doc.text(item.desc, margin, yPos + 6, { maxWidth: pageWidth - margin * 2 });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(115, 115, 115);
    doc.text(item.source, margin, yPos + 13);

    yPos += 24;
  });
  addFooter(6);

  // ==========================================
  // PAGE 7: PERSONALIZED PLAN GUIDELINES
  // ==========================================
  doc.addPage();
  addHeader(7, 'Personalized Plan');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('7. Your Personal Habits Plan', margin, 40);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(82, 82, 82);
  doc.text(
    'This plan focuses on modifiable factors associated with healthier ageing and may support healthier longevity. It does not prescribe medication or replace medical care.',
    margin,
    50,
    { maxWidth: pageWidth - margin * 2 }
  );

  const habitDomains = [
    { title: 'Sleep Hygiene', desc: 'Work toward a consistent sleep schedule and 7–9 hours nightly.' },
    { title: 'Physical Movement', desc: 'Gradually increase weekly moderate physical activity toward 150+ minutes.' },
    { title: 'Nutrition', desc: 'Emphasize whole foods, vegetables, fruits, and minimally processed ingredients.' },
    { title: 'Tobacco Cessation', desc: 'Seek evidence-based support if applicable and discuss options with a doctor.' },
    { title: 'Alcohol Moderation', desc: 'Reduce alcohol frequency, especially if intake is frequent.' }
  ];

  yPos = 70;
  habitDomains.forEach((h) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 56, 44);
    doc.text(h.title, margin, yPos);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 82);
    doc.text(h.desc, margin, yPos + 6, { maxWidth: pageWidth - margin * 2 });

    yPos += 18;
  });
  addFooter(7);

  // ==========================================
  // PAGE 8: 30-DAY IMPROVEMENT PLAN
  // ==========================================
  doc.addPage();
  addHeader(8, '30-Day Roadmap');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('8. Personalized 30-Day Improvement Plan', margin, 40);

  yPos = 52;
  data.plan.forEach((w) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 56, 44);
    doc.text(`Week ${w.week}: ${w.title}`, margin, yPos);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 82);
    w.goals.forEach((g) => {
      yPos += 6;
      doc.text(`• ${g}`, margin + 4, yPos, { maxWidth: pageWidth - margin * 2 - 8 });
    });

    yPos += 14;
  });
  addFooter(8);

  // ==========================================
  // PAGE 9: SAFETY & MEDICAL DISCLAIMER
  // ==========================================
  doc.addPage();
  addHeader(9, 'Safety & Disclaimer');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('9. Safety & Statutory Medical Disclaimer', margin, 40);

  doc.setFillColor(244, 243, 239);
  doc.rect(margin, 50, pageWidth - margin * 2, 70, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 56, 44);
  doc.text('IMPORTANT MEDICAL & REGULATORY DISCLAIMER', margin + 10, 64);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(82, 82, 82);
  doc.text(
    'PredLife is an educational longevity assessment based on information provided by the user. It does not provide a diagnosis, treatment, or guaranteed prediction of lifespan or death. If you have health concerns or abnormal medical results, speak with a qualified healthcare professional.',
    margin + 10,
    74,
    { maxWidth: pageWidth - margin * 2 - 20 }
  );

  doc.text(
    'Prohibited Output Guarantee: PredLife systems never diagnose medical conditions, dictate pharmaceutical changes, or promise guaranteed added years of life.',
    margin + 10,
    100,
    { maxWidth: pageWidth - margin * 2 - 20 }
  );
  addFooter(9);

  // ==========================================
  // PAGE 10: EVIDENCE SOURCES & METHODOLOGY
  // ==========================================
  doc.addPage();
  addHeader(10, 'Sources & Methodology');

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('10. Evidence Sources & Methodology Version', margin, 40);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 56, 44);
  doc.text('Active Model Version: PL-1.0', margin, 52);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(82, 82, 82);
  doc.text('Primary Evidence Framework Sources:', margin, 62);

  doc.text('1. American Heart Association — Life’s Essential 8:', margin + 4, 70);
  doc.setTextColor(15, 56, 44);
  doc.text('https://professional.heart.org/en/science-news/lifes-essential-8', margin + 8, 76);

  doc.setTextColor(82, 82, 82);
  doc.text('2. World Health Organization — Noncommunicable Diseases:', margin + 4, 86);
  doc.setTextColor(15, 56, 44);
  doc.text('https://www.who.int/', margin + 8, 92);

  doc.setTextColor(115, 115, 115);
  doc.setFontSize(8);
  doc.text('Report ID: ' + data.sessionId + ' | Generated: ' + data.createdAt, margin, 260);
  addFooter(10);

  // Save PDF
  doc.save(`PredLife_Longevity_Report_${data.sessionId}.pdf`);
}

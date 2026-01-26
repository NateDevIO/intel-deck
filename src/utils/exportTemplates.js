// Markdown Export
export function generateMarkdown(analysis) {
  const { companyName, pricing, positioning, features, socialProof, callsToAction, swot, talkingPoints, analyzedAt, sourceUrl } = analysis;

  let md = `# ${companyName} - Competitive Analysis\n\n`;
  md += `*Analyzed: ${new Date(analyzedAt).toLocaleDateString()}*\n\n`;

  // Tagline
  if (positioning?.tagline) {
    md += `> "${positioning.tagline}"\n\n`;
  }

  // Pricing
  if (pricing?.tiers?.length) {
    md += `## Pricing\n\n`;

    // Note about seat types if applicable
    if (pricing.hasSeatTypes && pricing.seatTypes?.length > 0) {
      md += `> **Note:** This product has ${pricing.seatTypes.length} seat types: ${pricing.seatTypes.join(', ')}\n\n`;
    }

    md += `| Tier | Price | Target | Model |\n`;
    md += `|------|-------|--------|-------|\n`;
    pricing.tiers.forEach(tier => {
      const priceDisplay = tier.billingPeriod
        ? `${tier.price} ${tier.billingPeriod}`
        : tier.price;
      md += `| ${tier.name} | ${priceDisplay} | ${tier.targetCustomer} | ${tier.priceModel} |\n`;
    });
    md += `\n`;

    // Show seat type breakdown if available
    const tiersWithSeatPrices = pricing.tiers.filter(t => t.seatPrices && Object.keys(t.seatPrices).length > 1);
    if (tiersWithSeatPrices.length > 0) {
      md += `### Pricing by Seat Type\n\n`;
      tiersWithSeatPrices.forEach(tier => {
        md += `**${tier.name}:**\n`;
        Object.entries(tier.seatPrices).forEach(([seatType, price]) => {
          md += `- ${seatType}: ${price}\n`;
        });
        md += `\n`;
      });
    }

    // Quick facts
    const facts = [];
    if (pricing.hasFreeTier) facts.push('Free tier available');
    if (pricing.trialAvailable) facts.push(`${pricing.trialDuration || 'Trial'} available`);
    if (pricing.hasEnterpriseTier) facts.push('Enterprise tier');
    if (facts.length) {
      md += facts.join(' · ') + '\n\n';
    }
  }

  // Positioning
  if (positioning) {
    md += `## Positioning\n\n`;

    if (positioning.targetCustomers?.length) {
      md += `**Target Customers:** ${positioning.targetCustomers.join(', ')}\n\n`;
    }

    if (positioning.differentiators?.length) {
      md += `**Key Differentiators:**\n`;
      positioning.differentiators.forEach(d => {
        md += `- ${d}\n`;
      });
      md += `\n`;
    }

    if (positioning.valuePropositions?.length) {
      md += `**Value Propositions:**\n`;
      positioning.valuePropositions.forEach(v => {
        md += `- ${v}\n`;
      });
      md += `\n`;
    }
  }

  // Features
  if (features?.highlighted?.length) {
    md += `## Features\n\n`;
    features.highlighted.forEach(f => {
      md += `- ${f}\n`;
    });
    md += `\n`;
  }

  // Social Proof
  if (socialProof) {
    md += `## Social Proof\n\n`;

    if (socialProof.customerLogos?.length) {
      md += `**Customers:** ${socialProof.customerLogos.join(', ')}\n\n`;
    }

    if (socialProof.metricsClaimed?.length) {
      md += `**Claims:** ${socialProof.metricsClaimed.join(' · ')}\n\n`;
    }

    if (socialProof.partnerships?.length) {
      md += `**Integrations:** ${socialProof.partnerships.join(', ')}\n\n`;
    }
  }

  // CTAs
  if (callsToAction?.primary) {
    md += `## Calls to Action\n\n`;
    md += `**Primary:** ${callsToAction.primary}\n`;
    if (callsToAction.secondary?.length) {
      md += `**Secondary:** ${callsToAction.secondary.join(', ')}\n`;
    }
    if (callsToAction.urgencyLanguage?.length) {
      md += `**Urgency/Promos:** ${callsToAction.urgencyLanguage.join(', ')}\n`;
    }
    md += `\n`;
  }

  // SWOT Analysis
  if (swot) {
    md += `## SWOT Analysis\n\n`;
    if (swot.strengths?.length) {
      md += `**Strengths:**\n`;
      swot.strengths.forEach(s => md += `- ${s}\n`);
      md += `\n`;
    }
    if (swot.weaknesses?.length) {
      md += `**Weaknesses:**\n`;
      swot.weaknesses.forEach(w => md += `- ${w}\n`);
      md += `\n`;
    }
    if (swot.opportunities?.length) {
      md += `**Opportunities:**\n`;
      swot.opportunities.forEach(o => md += `- ${o}\n`);
      md += `\n`;
    }
    if (swot.threats?.length) {
      md += `**Threats:**\n`;
      swot.threats.forEach(t => md += `- ${t}\n`);
      md += `\n`;
    }
  }

  // Talking Points
  if (talkingPoints?.length) {
    md += `## Sales Talking Points\n\n`;
    talkingPoints.forEach(tp => {
      md += `### ${tp.title}\n`;
      md += `${tp.point}\n\n`;
    });
  }

  // Source
  if (sourceUrl) {
    md += `---\n\n`;
    md += `*Source: [${sourceUrl}](${sourceUrl})*\n`;
  }

  return md;
}

// Slack Format Export (intentionally concise for Slack readability)
export function generateSlackMessage(analysis) {
  const { companyName, pricing, positioning, features, socialProof, callsToAction, swot, talkingPoints, analyzedAt, sourceUrl } = analysis;

  let msg = `:mag: *${companyName} Intel*\n\n`;

  // Pricing summary
  if (pricing?.tiers?.length) {
    msg += `:moneybag: *Pricing*\n`;
    pricing.tiers.forEach(tier => {
      const emoji = tier.priceModel === 'free' ? ':free:' :
                    tier.priceModel === 'contact_sales' ? ':telephone_receiver:' : ':dollar:';
      msg += `${emoji} ${tier.name}: ${tier.price}`;
      if (tier.billingPeriod) msg += ` (${tier.billingPeriod})`;
      msg += `\n`;
    });
    msg += `\n`;
  }

  // Key differentiators
  if (positioning?.differentiators?.length) {
    msg += `:zap: *Differentiators*\n`;
    positioning.differentiators.slice(0, 3).forEach(d => {
      msg += `• ${d}\n`;
    });
    msg += `\n`;
  }

  // Features (top 3)
  if (features?.highlighted?.length) {
    msg += `:sparkles: *Features:* ${features.highlighted.slice(0, 3).join(', ')}\n`;
  }

  // Target customers
  if (positioning?.targetCustomers?.length) {
    msg += `:dart: *Target:* ${positioning.targetCustomers.slice(0, 4).join(', ')}\n`;
  }

  // Social proof highlights
  if (socialProof?.customerLogos?.length) {
    msg += `:office: *Customers:* ${socialProof.customerLogos.slice(0, 5).join(', ')}\n`;
  }
  if (socialProof?.metricsClaimed?.length) {
    msg += `:bar_chart: ${socialProof.metricsClaimed[0]}\n`;
  }

  // Urgency/Promos
  if (callsToAction?.urgencyLanguage?.length) {
    msg += `:rotating_light: *Promos:* ${callsToAction.urgencyLanguage.slice(0, 2).join(', ')}\n`;
  }

  // SWOT highlights (just strengths/weaknesses for brevity)
  if (swot) {
    if (swot.strengths?.length) {
      msg += `\n:muscle: *Their Strengths:* ${swot.strengths.slice(0, 2).join('; ')}\n`;
    }
    if (swot.weaknesses?.length) {
      msg += `:target: *Their Weaknesses:* ${swot.weaknesses.slice(0, 2).join('; ')}\n`;
    }
  }

  // Top talking point
  if (talkingPoints?.length) {
    msg += `\n:speech_balloon: *Key Talking Point:* ${talkingPoints[0].point}\n`;
  }

  // Footer
  msg += `\n_Analyzed ${new Date(analyzedAt).toLocaleDateString()}_`;
  if (sourceUrl) {
    msg += ` | <${sourceUrl}|Source>`;
  }

  return msg;
}

// JSON Export
export function generateJSON(analysis, pretty = true) {
  const exportData = {
    meta: {
      exportedAt: new Date().toISOString(),
      toolVersion: '1.0.0',
      sourceUrl: analysis.sourceUrl || null,
      analyzedAt: analysis.analyzedAt
    },
    company: analysis.companyName,
    pricing: analysis.pricing,
    positioning: analysis.positioning,
    features: analysis.features,
    socialProof: analysis.socialProof,
    callsToAction: analysis.callsToAction,
    swot: analysis.swot || null,
    talkingPoints: analysis.talkingPoints || null
  };

  return pretty
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData);
}

// PDF HTML Template
export function generateBattlecardHTML(analysis) {
  const { companyName, pricing, positioning, features, socialProof, callsToAction, swot, talkingPoints, analyzedAt, sourceUrl } = analysis;

  const tiersHTML = pricing?.tiers?.map(tier => {
    const seatPricesHTML = tier.seatPrices && Object.keys(tier.seatPrices).length > 1
      ? `<div class="seat-prices">
          ${Object.entries(tier.seatPrices).map(([seatType, price]) =>
            `<div class="seat-price"><span class="seat-type">${seatType}:</span> <span>${price}</span></div>`
          ).join('')}
        </div>`
      : '';
    return `
    <div class="pricing-tier">
      <div class="tier-name">${tier.name}</div>
      <div class="tier-price">${tier.price}</div>
      ${tier.billingPeriod ? `<div class="tier-period">${tier.billingPeriod}</div>` : ''}
      ${seatPricesHTML}
      <div class="tier-target">${tier.targetCustomer || ''}</div>
    </div>
  `;
  }).join('') || '';

  const seatTypesNote = pricing?.hasSeatTypes && pricing?.seatTypes?.length > 0
    ? `<div class="seat-types-note">Multiple seat types: ${pricing.seatTypes.join(', ')}</div>`
    : '';

  const differentiatorsHTML = positioning?.differentiators?.map(d => `
    <div class="list-item">${d}</div>
  `).join('') || '<div class="list-item text-muted">No differentiators extracted</div>';

  const targetCustomersHTML = positioning?.targetCustomers?.map(c => `
    <span class="badge">${c}</span>
  `).join('') || '';

  const featuresHTML = features?.highlighted?.map(f => `
    <span class="badge feature">${f}</span>
  `).join('') || '';

  const customerLogosHTML = socialProof?.customerLogos?.map(c => `
    <span class="badge customer">${c}</span>
  `).join('') || '<span class="badge">None identified</span>';

  const partnershipsHTML = socialProof?.partnerships?.map(p => `
    <span class="badge partner">${p}</span>
  `).join('') || '<span class="badge">None identified</span>';

  const metricsHTML = socialProof?.metricsClaimed?.map(m => `
    <div class="list-item">${m}</div>
  `).join('') || '';

  const swotHTML = swot ? `
    <div class="section swot-section">
      <div class="section-title">SWOT Analysis</div>
      <div class="swot-grid">
        <div class="swot-quadrant strengths">
          <div class="swot-label">Strengths</div>
          ${swot.strengths?.map(s => `<div class="swot-item">${s}</div>`).join('') || '<div class="swot-item text-muted">-</div>'}
        </div>
        <div class="swot-quadrant weaknesses">
          <div class="swot-label">Weaknesses</div>
          ${swot.weaknesses?.map(w => `<div class="swot-item">${w}</div>`).join('') || '<div class="swot-item text-muted">-</div>'}
        </div>
        <div class="swot-quadrant opportunities">
          <div class="swot-label">Opportunities</div>
          ${swot.opportunities?.map(o => `<div class="swot-item">${o}</div>`).join('') || '<div class="swot-item text-muted">-</div>'}
        </div>
        <div class="swot-quadrant threats">
          <div class="swot-label">Threats</div>
          ${swot.threats?.map(t => `<div class="swot-item">${t}</div>`).join('') || '<div class="swot-item text-muted">-</div>'}
        </div>
      </div>
    </div>
  ` : '';

  const talkingPointsHTML = talkingPoints?.length ? `
    <div class="section">
      <div class="section-title">Sales Talking Points</div>
      ${talkingPoints.map(tp => `
        <div class="talking-point">
          <div class="tp-title">${tp.title}</div>
          <div class="tp-content">${tp.point}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
      background: white;
    }

    .header {
      border-bottom: 3px solid #4F46E5;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
    }

    .header .subtitle {
      color: #6b7280;
      margin-top: 4px;
      font-size: 12px;
    }

    .tagline {
      font-style: italic;
      color: #4b5563;
      font-size: 14px;
      margin-top: 8px;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #4F46E5;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e5e7eb;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .pricing-tier {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
    }

    .tier-name {
      font-weight: 600;
      font-size: 12px;
      color: #374151;
    }

    .tier-price {
      font-size: 20px;
      font-weight: 700;
      color: #4F46E5;
      margin: 4px 0;
    }

    .tier-period {
      font-size: 9px;
      color: #6b7280;
    }

    .tier-target {
      font-size: 10px;
      color: #4b5563;
      margin-top: 8px;
    }

    .seat-prices {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed #e5e7eb;
    }

    .seat-price {
      font-size: 9px;
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
    }

    .seat-type {
      color: #6b7280;
    }

    .seat-types-note {
      font-size: 10px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .list-item {
      padding: 4px 0;
      padding-left: 16px;
      position: relative;
      font-size: 11px;
    }

    .list-item::before {
      content: "•";
      position: absolute;
      left: 4px;
      color: #4F46E5;
    }

    .text-muted {
      color: #9ca3af;
    }

    .badge-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .badge {
      background: #eef2ff;
      color: #4338ca;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
    }

    .badge.customer {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge.partner {
      background: #d1fae5;
      color: #065f46;
    }

    .badge.feature {
      background: #fef3c7;
      color: #92400e;
    }

    .swot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .swot-quadrant {
      padding: 12px;
      border-radius: 6px;
    }

    .swot-quadrant.strengths { background: #d1fae5; }
    .swot-quadrant.weaknesses { background: #fee2e2; }
    .swot-quadrant.opportunities { background: #dbeafe; }
    .swot-quadrant.threats { background: #fef3c7; }

    .swot-label {
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .swot-item {
      font-size: 10px;
      padding: 2px 0;
    }

    .talking-point {
      margin-bottom: 12px;
      padding: 10px;
      background: #f9fafb;
      border-radius: 6px;
    }

    .tp-title {
      font-weight: 600;
      font-size: 11px;
      color: #4F46E5;
      margin-bottom: 4px;
    }

    .tp-content {
      font-size: 10px;
      color: #374151;
    }

    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      font-size: 9px;
      color: #9ca3af;
    }

    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${companyName}</h1>
    <div class="subtitle">Competitive Intelligence</div>
    ${positioning?.tagline ? `<div class="tagline">"${positioning.tagline}"</div>` : ''}
  </div>

  <div class="section">
    <div class="section-title">Pricing</div>
    ${seatTypesNote}
    <div class="pricing-grid">
      ${tiersHTML}
    </div>
  </div>

  <div class="two-column">
    <div class="section">
      <div class="section-title">Key Differentiators</div>
      ${differentiatorsHTML}
    </div>

    <div class="section">
      <div class="section-title">Target Customers</div>
      <div class="badge-list">
        ${targetCustomersHTML}
      </div>
    </div>
  </div>

  ${featuresHTML ? `
  <div class="section">
    <div class="section-title">Highlighted Features</div>
    <div class="badge-list">
      ${featuresHTML}
    </div>
  </div>
  ` : ''}

  <div class="two-column">
    <div class="section">
      <div class="section-title">Notable Customers</div>
      <div class="badge-list">
        ${customerLogosHTML}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Integrations</div>
      <div class="badge-list">
        ${partnershipsHTML}
      </div>
    </div>
  </div>

  ${metricsHTML ? `
    <div class="section">
      <div class="section-title">Claims & Metrics</div>
      ${metricsHTML}
    </div>
  ` : ''}

  ${swotHTML}

  ${talkingPointsHTML}

  <div class="footer">
    <div>Analyzed: ${new Date(analyzedAt).toLocaleDateString()} ${new Date(analyzedAt).toLocaleTimeString()}</div>
    ${sourceUrl ? `<div>Source: ${sourceUrl}</div>` : ''}
    <div>Generated by Intel Deck</div>
  </div>
</body>
</html>
  `;
}

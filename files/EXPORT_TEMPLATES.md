# Export Templates

Templates for generating exports in various formats.

---

## Markdown Export

Used for copying to Notion, docs, or any markdown-compatible surface.

```javascript
export function generateMarkdown(analysis) {
  const { companyName, extraction } = analysis;
  const { pricing, positioning, socialProof, callsToAction } = extraction;
  
  let md = `# ${companyName} - Competitive Analysis\n\n`;
  md += `*Analyzed: ${new Date(analysis.analyzedAt).toLocaleDateString()}*\n\n`;
  
  // Tagline
  if (positioning?.tagline) {
    md += `> "${positioning.tagline}"\n\n`;
  }
  
  // Pricing
  md += `## Pricing\n\n`;
  md += `| Tier | Price | Target | Model |\n`;
  md += `|------|-------|--------|-------|\n`;
  pricing?.tiers?.forEach(tier => {
    const priceDisplay = tier.billingPeriod 
      ? `${tier.price} ${tier.billingPeriod}` 
      : tier.price;
    md += `| ${tier.name} | ${priceDisplay} | ${tier.targetCustomer} | ${tier.priceModel} |\n`;
  });
  md += `\n`;
  
  // Quick facts
  const facts = [];
  if (pricing?.hasFreeTier) facts.push('✓ Free tier available');
  if (pricing?.trialAvailable) facts.push(`✓ ${pricing.trialDuration || 'Trial'} available`);
  if (pricing?.hasEnterpriseTier) facts.push('✓ Enterprise tier');
  if (facts.length) {
    md += facts.join(' · ') + '\n\n';
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
  
  // Source
  if (analysis.sourceUrl) {
    md += `---\n\n`;
    md += `*Source: [${analysis.sourceUrl}](${analysis.sourceUrl})*\n`;
  }
  
  return md;
}
```

### Example Output

```markdown
# Notion - Competitive Analysis

*Analyzed: 1/13/2025*

> "Your wiki, docs, & projects. Together."

## Pricing

| Tier | Price | Target | Model |
|------|-------|--------|-------|
| Free | $0 | Individuals | free |
| Plus | $10 per seat/month | Small teams | per_seat |
| Business | $18 per seat/month | Companies | per_seat |
| Enterprise | Contact sales | Large orgs | contact_sales |

✓ Free tier available · ✓ 14 days trial available · ✓ Enterprise tier

## Positioning

**Target Customers:** Individuals, Small teams, Companies, Enterprises

**Key Differentiators:**
- All-in-one workspace replacing scattered tools
- Flexible building blocks for any workflow

## Social Proof

**Customers:** Toyota, Spotify, IBM, Figma

**Claims:** 50,000+ organizations worldwide

**Integrations:** Slack, Google Drive, GitHub, Zapier

---

*Source: [https://notion.so/pricing](https://notion.so/pricing)*
```

---

## Slack Format

Optimized for readability in Slack messages. Uses emoji and compact formatting.

```javascript
export function generateSlackMessage(analysis) {
  const { companyName, extraction } = analysis;
  const { pricing, positioning, socialProof } = extraction;
  
  let msg = `🔍 *${companyName} Intel*\n\n`;
  
  // Pricing summary
  msg += `💰 *Pricing*\n`;
  pricing?.tiers?.forEach(tier => {
    const emoji = tier.priceModel === 'free' ? '🆓' : 
                  tier.priceModel === 'contact_sales' ? '📞' : '💵';
    msg += `${emoji} ${tier.name}: ${tier.price}`;
    if (tier.billingPeriod) msg += ` (${tier.billingPeriod})`;
    msg += `\n`;
  });
  msg += `\n`;
  
  // Key differentiators
  if (positioning?.differentiators?.length) {
    msg += `⚡ *Differentiators*\n`;
    positioning.differentiators.slice(0, 3).forEach(d => {
      msg += `• ${d}\n`;
    });
    msg += `\n`;
  }
  
  // Social proof highlights
  if (socialProof?.customerLogos?.length) {
    msg += `🏢 *Customers:* ${socialProof.customerLogos.slice(0, 5).join(', ')}\n`;
  }
  if (socialProof?.metricsClaimed?.length) {
    msg += `📊 ${socialProof.metricsClaimed[0]}\n`;
  }
  
  // Footer
  msg += `\n_Analyzed ${new Date(analysis.analyzedAt).toLocaleDateString()}_`;
  if (analysis.sourceUrl) {
    msg += ` | <${analysis.sourceUrl}|Source>`;
  }
  
  return msg;
}
```

### Example Output

```
🔍 *Notion Intel*

💰 *Pricing*
🆓 Free: $0
💵 Plus: $10 (per seat/month)
💵 Business: $18 (per seat/month)
📞 Enterprise: Contact sales

⚡ *Differentiators*
• All-in-one workspace replacing scattered tools
• Flexible building blocks for any workflow
• Scales from individual to enterprise

🏢 *Customers:* Toyota, Spotify, IBM, Figma
📊 50,000+ organizations worldwide

_Analyzed 1/13/2025_ | <https://notion.so/pricing|Source>
```

---

## JSON Export

Full structured data for integration with other tools.

```javascript
export function generateJSON(analysis, pretty = true) {
  const exportData = {
    meta: {
      exportedAt: new Date().toISOString(),
      toolVersion: '1.0.0',
      sourceUrl: analysis.sourceUrl,
      analyzedAt: analysis.analyzedAt
    },
    company: analysis.companyName,
    ...analysis.extraction
  };
  
  return pretty 
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData);
}
```

---

## PDF Battlecard

HTML template for PDF generation using browser print or a library like `html2pdf`.

```javascript
export function generateBattlecardHTML(analysis) {
  const { companyName, extraction, analyzedAt, sourceUrl } = analysis;
  const { pricing, positioning, socialProof } = extraction;
  
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
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
    }
    
    .header {
      border-bottom: 3px solid #4F46E5;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }
    
    .header .subtitle {
      color: #6b7280;
      margin-top: 4px;
    }
    
    .tagline {
      font-style: italic;
      color: #4b5563;
      font-size: 13px;
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
    }
    
    .tier-price {
      font-size: 18px;
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
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    
    .list-item {
      padding: 4px 0;
      padding-left: 16px;
      position: relative;
    }
    
    .list-item::before {
      content: "•";
      position: absolute;
      left: 4px;
      color: #4F46E5;
    }
    
    .badge-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .badge {
      background: #eef2ff;
      color: #4338ca;
      padding: 3px 8px;
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
    <div class="subtitle">Competitive Battlecard</div>
    ${positioning?.tagline ? `<div class="tagline">"${positioning.tagline}"</div>` : ''}
  </div>
  
  <div class="section">
    <div class="section-title">Pricing</div>
    <div class="pricing-grid">
      ${pricing?.tiers?.map(tier => `
        <div class="pricing-tier">
          <div class="tier-name">${tier.name}</div>
          <div class="tier-price">${tier.price}</div>
          ${tier.billingPeriod ? `<div class="tier-period">${tier.billingPeriod}</div>` : ''}
          <div class="tier-target">${tier.targetCustomer}</div>
        </div>
      `).join('') || ''}
    </div>
  </div>
  
  <div class="two-column">
    <div class="section">
      <div class="section-title">Key Differentiators</div>
      ${positioning?.differentiators?.map(d => `
        <div class="list-item">${d}</div>
      `).join('') || '<div class="list-item">No differentiators extracted</div>'}
    </div>
    
    <div class="section">
      <div class="section-title">Target Customers</div>
      <div class="badge-list">
        ${positioning?.targetCustomers?.map(c => `
          <span class="badge">${c}</span>
        `).join('') || ''}
      </div>
    </div>
  </div>
  
  <div class="two-column">
    <div class="section">
      <div class="section-title">Notable Customers</div>
      <div class="badge-list">
        ${socialProof?.customerLogos?.map(c => `
          <span class="badge customer">${c}</span>
        `).join('') || '<span class="badge">None identified</span>'}
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Integrations</div>
      <div class="badge-list">
        ${socialProof?.partnerships?.map(p => `
          <span class="badge partner">${p}</span>
        `).join('') || '<span class="badge">None identified</span>'}
      </div>
    </div>
  </div>
  
  ${socialProof?.metricsClaimed?.length ? `
    <div class="section">
      <div class="section-title">Claims & Metrics</div>
      ${socialProof.metricsClaimed.map(m => `
        <div class="list-item">${m}</div>
      `).join('')}
    </div>
  ` : ''}
  
  <div class="footer">
    <div>Analyzed: ${new Date(analyzedAt).toLocaleDateString()} ${new Date(analyzedAt).toLocaleTimeString()}</div>
    ${sourceUrl ? `<div>Source: ${sourceUrl}</div>` : ''}
    <div>Generated by Intel Deck</div>
  </div>
</body>
</html>
  `;
}
```

### Using html2pdf.js

```javascript
import html2pdf from 'html2pdf.js';

export async function downloadPDF(analysis) {
  const html = generateBattlecardHTML(analysis);
  
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  
  const options = {
    margin: 0,
    filename: `${analysis.companyName.toLowerCase().replace(/\s+/g, '-')}-battlecard.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  await html2pdf().set(options).from(container.firstChild).save();
  document.body.removeChild(container);
}
```

---

## Comparison Table Export

For exporting multi-competitor comparisons.

```javascript
export function generateComparisonMarkdown(competitors) {
  if (!competitors.length) return '';
  
  const categories = [
    { key: 'startingPrice', label: 'Starting Price' },
    { key: 'hasFreeTier', label: 'Free Tier' },
    { key: 'enterprise', label: 'Enterprise' },
    { key: 'differentiator', label: 'Key Differentiator' },
    { key: 'topCustomer', label: 'Notable Customer' }
  ];
  
  // Header row
  let md = `| | ${competitors.map(c => c.companyName).join(' | ')} |\n`;
  md += `|---|${competitors.map(() => '---').join('|')}|\n`;
  
  // Starting price
  md += `| Starting Price | ${competitors.map(c => {
    const paid = c.extraction.pricing?.tiers?.find(t => t.priceModel !== 'free');
    return paid ? `${paid.price}` : 'N/A';
  }).join(' | ')} |\n`;
  
  // Free tier
  md += `| Free Tier | ${competitors.map(c => 
    c.extraction.pricing?.hasFreeTier ? '✓' : '✗'
  ).join(' | ')} |\n`;
  
  // Enterprise
  md += `| Enterprise | ${competitors.map(c => 
    c.extraction.pricing?.hasEnterpriseTier ? '✓' : '✗'
  ).join(' | ')} |\n`;
  
  // Key differentiator
  md += `| Differentiator | ${competitors.map(c => 
    c.extraction.positioning?.differentiators?.[0] || 'N/A'
  ).join(' | ')} |\n`;
  
  // Top customer
  md += `| Notable Customer | ${competitors.map(c => 
    c.extraction.socialProof?.customerLogos?.[0] || 'N/A'
  ).join(' | ')} |\n`;
  
  return md;
}
```

### Example Output

```markdown
| | Notion | Asana | Monday |
|---|---|---|---|
| Starting Price | $10 | $13.49 | $12 |
| Free Tier | ✓ | ✓ | ✗ |
| Enterprise | ✓ | ✓ | ✓ |
| Differentiator | All-in-one workspace | Workflow automation | Visual project tracking |
| Notable Customer | Toyota | NASA | Hulu |
```

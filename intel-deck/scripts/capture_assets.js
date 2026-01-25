const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const DEV_SERVER = 'http://127.0.0.1:5173';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const VIEWPORT = { width: 1920, height: 1080 };

// Sample competitor data for screenshots
const sampleCompetitors = [
  {
    id: 'demo-slack',
    companyName: 'Slack',
    analyzedAt: new Date().toISOString(),
    sourceUrl: 'https://slack.com/pricing',
    pricing: {
      tiers: [
        { name: 'Free', price: '$0', features: ['90-day message history', '10 integrations', '1:1 video calls'] },
        { name: 'Pro', price: '$8.75/user/mo', priceModel: 'per seat', features: ['Unlimited history', 'Unlimited integrations', 'Group video calls', 'Custom workflows'] },
        { name: 'Business+', price: '$15/user/mo', priceModel: 'per seat', features: ['Everything in Pro', 'SAML SSO', 'Data exports', '24/7 support'] },
        { name: 'Enterprise Grid', price: 'Custom', priceModel: 'custom', features: ['Unlimited workspaces', 'Enterprise security', 'Dedicated support'] }
      ],
      hasFreeTier: true,
      hasEnterprise: true
    },
    positioning: {
      tagline: 'Where work happens',
      targetAudience: 'Teams and businesses of all sizes',
      valueProps: ['Real-time messaging', 'Deep integrations', 'Searchable history', 'Enterprise security'],
      differentiators: ['Channel-based organization', 'Extensive app ecosystem', 'Powerful search']
    },
    features: {
      categories: [
        { name: 'Communication', items: ['Channels', 'Direct messages', 'Threads', 'Voice & video'] },
        { name: 'Collaboration', items: ['File sharing', 'Canvas', 'Huddles', 'Clips'] },
        { name: 'Automation', items: ['Workflow Builder', 'Slack Connect', 'APIs'] }
      ]
    },
    socialProof: {
      customerCount: '750,000+ organizations',
      notableCustomers: ['Airbnb', 'Uber', 'Target', 'BBC'],
      testimonials: [{ quote: 'Slack has transformed how we work', source: 'Fortune 500 CTO' }]
    },
    callsToAction: {
      primary: { text: 'Get Started', url: 'https://slack.com/get-started' },
      secondary: { text: 'Talk to Sales', url: 'https://slack.com/contact-sales' }
    },
    swot: {
      strengths: ['Market leader in team messaging', 'Extensive integration ecosystem (2,400+ apps)', 'Strong brand recognition', 'Intuitive user experience'],
      weaknesses: ['Premium pricing vs competitors', 'Can be noisy without proper channel management', 'Limited native video conferencing'],
      opportunities: ['Growing remote work market', 'AI-powered features', 'Deeper workflow automation'],
      threats: ['Microsoft Teams bundling with Office 365', 'Free alternatives gaining features', 'Enterprise consolidation trends']
    },
    talkingPoints: {
      keyDifferentiators: ['Our unified platform approach vs their point solution', 'Better value at scale with our pricing model'],
      objectionHandlers: [{ objection: 'We already use Slack', response: 'Many teams find they need additional tools alongside Slack. Our platform consolidates those needs.' }],
      competitiveWins: ['Enterprise deals where integration complexity was a concern', 'Teams frustrated with Slack notification overload']
    },
    outcomes: [
      { type: 'win', date: '2024-01-15', notes: 'Won on pricing and unified platform', dealSize: '$50,000' },
      { type: 'loss', date: '2024-02-20', notes: 'Lost - customer had heavy Slack investment', dealSize: '$30,000' },
      { type: 'win', date: '2024-03-10', notes: 'Won after demo showed workflow advantages', dealSize: '$75,000' }
    ]
  },
  {
    id: 'demo-notion',
    companyName: 'Notion',
    analyzedAt: new Date(Date.now() - 86400000).toISOString(),
    sourceUrl: 'https://notion.so/pricing',
    pricing: {
      tiers: [
        { name: 'Free', price: '$0', features: ['Unlimited pages', 'Share with 10 guests', 'Basic page analytics'] },
        { name: 'Plus', price: '$10/user/mo', priceModel: 'per seat', features: ['Unlimited file uploads', 'Unlimited guests', '30-day page history'] },
        { name: 'Business', price: '$18/user/mo', priceModel: 'per seat', features: ['SAML SSO', 'Private teamspaces', '90-day history', 'PDF export'] },
        { name: 'Enterprise', price: 'Custom', priceModel: 'custom', features: ['Advanced security', 'Audit log', 'Dedicated success manager'] }
      ],
      hasFreeTier: true,
      hasEnterprise: true
    },
    positioning: {
      tagline: 'The all-in-one workspace',
      targetAudience: 'Teams seeking unified docs, wikis, and projects',
      valueProps: ['Flexible workspace', 'AI-powered writing', 'Connected wikis', 'Project management'],
      differentiators: ['Block-based editing', 'Template marketplace', 'Notion AI']
    },
    features: {
      categories: [
        { name: 'Docs', items: ['Rich text editing', 'Embedded media', 'Templates', 'Comments'] },
        { name: 'Wikis', items: ['Linked databases', 'Team spaces', 'Permissions', 'Search'] },
        { name: 'Projects', items: ['Kanban boards', 'Timelines', 'Calendars', 'Automations'] }
      ]
    },
    socialProof: {
      customerCount: '30M+ users',
      notableCustomers: ['Figma', 'Pixar', 'Nike', 'Toyota'],
      testimonials: [{ quote: 'Notion replaced 5 different tools for us', source: 'Startup Founder' }]
    },
    swot: {
      strengths: ['Highly flexible and customizable', 'Strong template ecosystem', 'Modern, clean interface', 'AI integration'],
      weaknesses: ['Steep learning curve', 'Performance with large databases', 'Limited offline support'],
      opportunities: ['Enterprise market expansion', 'AI capabilities differentiation', 'Education market'],
      threats: ['Established players adding similar features', 'Complexity scaring off simple users']
    }
  },
  {
    id: 'demo-monday',
    companyName: 'Monday.com',
    analyzedAt: new Date(Date.now() - 172800000).toISOString(),
    sourceUrl: 'https://monday.com/pricing',
    pricing: {
      tiers: [
        { name: 'Free', price: '$0', features: ['Up to 2 seats', 'Up to 3 boards', '200+ templates'] },
        { name: 'Basic', price: '$9/seat/mo', priceModel: 'per seat', features: ['Unlimited items', '5GB storage', 'Prioritized support'] },
        { name: 'Standard', price: '$12/seat/mo', priceModel: 'per seat', features: ['Timeline & Gantt', 'Calendar view', 'Guest access', '250 automations'] },
        { name: 'Pro', price: '$19/seat/mo', priceModel: 'per seat', features: ['Private boards', 'Time tracking', 'Formula column', '25,000 automations'] }
      ],
      hasFreeTier: true,
      hasEnterprise: true
    },
    positioning: {
      tagline: 'A platform built for a new way of working',
      targetAudience: 'Teams managing projects and workflows',
      valueProps: ['Visual project management', 'No-code automations', 'Multiple views', 'Integrations'],
      differentiators: ['Colorful, visual interface', 'Work OS concept', 'Strong marketing presence']
    },
    swot: {
      strengths: ['Very visual and intuitive', 'Strong automation capabilities', 'Excellent marketing', 'Multiple product offerings'],
      weaknesses: ['Can get expensive at scale', 'Minimum 3-seat requirement', 'Feature bloat'],
      opportunities: ['CRM and dev tools expansion', 'Enterprise deals', 'AI features'],
      threats: ['Notion gaining PM features', 'Free alternatives improving', 'Asana competition']
    }
  }
];

async function captureScreenshots() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  try {
    // 1. Capture landing page with onboarding banner
    console.log('1/6 Capturing landing page...');
    await page.goto(DEV_SERVER, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '01-landing.png'),
      fullPage: false
    });

    // 2. Inject sample data and capture analysis view
    console.log('2/6 Capturing analysis view with data...');
    await page.evaluate((competitors) => {
      localStorage.setItem('battlecard_competitors', JSON.stringify(competitors));
      localStorage.setItem('battlecard_onboarding_dismissed', 'true');
    }, sampleCompetitors);
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);

    // Click on first competitor in sidebar
    await page.evaluate(() => {
      const sidebarItem = document.querySelector('[class*="sidebar"] button, [class*="Sidebar"] button');
      if (sidebarItem) sidebarItem.click();
    });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '02-analysis-view.png'),
      fullPage: false
    });

    // 3. Capture comparison view
    console.log('3/6 Capturing comparison view...');
    await page.evaluate(() => {
      // Find and click compare button or tab
      const compareBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.toLowerCase().includes('compare') || b.textContent.toLowerCase().includes('comparison')
      );
      if (compareBtn) compareBtn.click();
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03-comparison-view.png'),
      fullPage: false
    });

    // 4. Capture dark mode
    console.log('4/6 Capturing dark mode...');
    await page.evaluate(() => {
      localStorage.setItem('battlecard_dark_mode', 'true');
      document.documentElement.classList.add('dark');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);

    // Click on first competitor again
    await page.evaluate(() => {
      const sidebarItem = document.querySelector('[class*="sidebar"] button, [class*="Sidebar"] button');
      if (sidebarItem) sidebarItem.click();
    });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '04-dark-mode.png'),
      fullPage: false
    });

    // 5. Capture mobile view
    console.log('5/6 Capturing mobile view...');
    await page.setViewport({ width: 390, height: 844 }); // iPhone 14 Pro
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '05-mobile.png'),
      fullPage: false
    });

    // 6. Back to desktop, capture keyboard shortcuts modal
    console.log('6/6 Capturing keyboard shortcuts...');
    await page.setViewport(VIEWPORT);
    await page.evaluate(() => {
      localStorage.setItem('battlecard_dark_mode', 'false');
      document.documentElement.classList.remove('dark');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    // Press ? to open shortcuts modal
    await page.keyboard.press('Shift');
    await page.keyboard.type('?');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '06-keyboard-shortcuts.png'),
      fullPage: false
    });

    console.log('\\nScreenshots captured successfully!');
    console.log(`Output directory: ${OUTPUT_DIR}`);
    console.log('Files:');
    fs.readdirSync(OUTPUT_DIR).forEach(file => {
      console.log(`  - ${file}`);
    });

  } catch (error) {
    console.error('Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

captureScreenshots();

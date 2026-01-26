// Sample analysis data for testing the UI without API calls
export const sampleNotionAnalysis = {
  id: "demo-notion-001",
  companyName: "Notion",
  sourceUrl: "https://notion.so/pricing",
  sourceType: "paste",
  analyzedAt: new Date().toISOString(),
  rawContent: `Notion Pricing

Free
$0
For individuals organizing their work and life.
- Unlimited pages & blocks
- Share with up to 5 guests
- Sync across devices
- 7-day page history

Plus
$10 per seat/month billed annually
$12 billed monthly
For small teams and professionals.
- Everything in Free
- Unlimited file uploads
- 30-day page history
- Invite up to 100 guests

Business
$18 per seat/month billed annually
For companies using Notion to connect teams.
- Everything in Plus
- SAML SSO
- Private teamspaces
- 90-day page history
- PDF export with subpages

Enterprise
Contact sales
For organizations needing advanced controls.
- Everything in Business
- Unlimited page history
- User provisioning (SCIM)
- Advanced security controls
- Dedicated success manager

Trusted by teams at Toyota, Spotify, IBM, and 50,000+ organizations worldwide.
"Notion is the connective tissue that keeps our fully remote team in sync." - Head of Operations, Figma`,

  pricing: {
    tiers: [
      {
        name: "Free",
        price: "$0",
        billingPeriod: null,
        priceModel: "free",
        targetCustomer: "Individuals organizing their work and life",
        keyFeatures: [
          "Unlimited pages & blocks",
          "Share with up to 5 guests",
          "Sync across devices",
          "7-day page history"
        ],
        limitations: [
          "Limited to 5 guests",
          "Only 7-day page history"
        ],
        confidence: "high"
      },
      {
        name: "Plus",
        price: "$10",
        billingPeriod: "per seat/month (billed annually)",
        priceModel: "per_seat",
        targetCustomer: "Small teams and professionals",
        keyFeatures: [
          "Everything in Free",
          "Unlimited file uploads",
          "30-day page history",
          "Invite up to 100 guests"
        ],
        limitations: [
          "Limited to 100 guests"
        ],
        confidence: "high"
      },
      {
        name: "Business",
        price: "$18",
        billingPeriod: "per seat/month (billed annually)",
        priceModel: "per_seat",
        targetCustomer: "Companies using Notion to connect teams",
        keyFeatures: [
          "Everything in Plus",
          "SAML SSO",
          "Private teamspaces",
          "90-day page history",
          "PDF export with subpages"
        ],
        limitations: [],
        confidence: "high"
      },
      {
        name: "Enterprise",
        price: "Contact sales",
        billingPeriod: null,
        priceModel: "contact_sales",
        targetCustomer: "Organizations needing advanced controls",
        keyFeatures: [
          "Everything in Business",
          "Unlimited page history",
          "User provisioning (SCIM)",
          "Advanced security controls",
          "Dedicated success manager"
        ],
        limitations: [],
        confidence: "high"
      }
    ],
    hasFreeTier: true,
    hasEnterpriseTier: true,
    trialAvailable: true,
    trialDuration: "14 days"
  },

  features: {
    highlighted: [
      "Unlimited pages & blocks",
      "Real-time collaboration",
      "SAML SSO",
      "Advanced security controls"
    ],
    byTier: {
      Free: ["Unlimited pages & blocks", "Share with 5 guests", "Sync across devices"],
      Plus: ["Unlimited file uploads", "30-day page history", "100 guests"],
      Business: ["SAML SSO", "Private teamspaces", "90-day history", "PDF export"],
      Enterprise: ["Unlimited history", "SCIM provisioning", "Dedicated success manager"]
    }
  },

  positioning: {
    tagline: "Your wiki, docs, & projects. Together.",
    targetCustomers: [
      "Individuals",
      "Small teams",
      "Growing companies",
      "Enterprise organizations"
    ],
    differentiators: [
      "All-in-one workspace replacing scattered tools",
      "Flexible building blocks for any workflow",
      "Scales from individual to enterprise"
    ],
    valuePropositions: [
      "Replace wiki, docs, and project tools with one workspace",
      "Keep remote teams in sync",
      "Customize to match any workflow"
    ]
  },

  socialProof: {
    customerLogos: [
      "Toyota",
      "Spotify",
      "IBM",
      "Figma"
    ],
    metricsClaimed: [
      "50,000+ organizations worldwide"
    ],
    caseStudies: [
      "How Figma keeps their fully remote team in sync"
    ],
    awards: [],
    partnerships: [
      "Slack",
      "Google Drive",
      "GitHub",
      "Zapier"
    ]
  },

  callsToAction: {
    primary: "Get Notion free",
    secondary: [
      "Contact sales",
      "Request a demo"
    ],
    urgencyLanguage: null
  },

  extractedQuotes: [
    {
      text: "Your wiki, docs, & projects. Together.",
      category: "positioning",
      location: "Hero section"
    },
    {
      text: "Notion is the connective tissue that keeps our fully remote team in sync.",
      category: "social_proof",
      location: "Customer testimonial"
    }
  ]
};

export const sampleTestContent = `Notion Pricing

Free
$0
For individuals organizing their work and life.
- Unlimited pages & blocks
- Share with up to 5 guests
- Sync across devices
- 7-day page history

Plus
$10 per seat/month billed annually
$12 billed monthly
For small teams and professionals.
- Everything in Free
- Unlimited file uploads
- 30-day page history
- Invite up to 100 guests

Business
$18 per seat/month billed annually
For companies using Notion to connect teams.
- Everything in Plus
- SAML SSO
- Private teamspaces
- 90-day page history
- PDF export with subpages

Enterprise
Contact sales
For organizations needing advanced controls.
- Everything in Business
- Unlimited page history
- User provisioning (SCIM)
- Advanced security controls
- Dedicated success manager

Trusted by teams at Toyota, Spotify, IBM, and 50,000+ organizations worldwide.
"Notion is the connective tissue that keeps our fully remote team in sync." - Head of Operations, Figma`;

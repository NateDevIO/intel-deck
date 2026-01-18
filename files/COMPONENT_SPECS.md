# Component Specifications

Detailed specifications for each UI component in Intel Deck.

---

## Layout Components

### Header

**File:** `src/components/layout/Header.jsx`

**Purpose:** App header with branding and navigation.

**Props:** None

**Behavior:**
- Fixed height, white background
- Logo/title on left
- Future: Settings gear icon on right

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Intel Deck                                          ⚙️     │
│  Competitive Intelligence Extractor                         │
└─────────────────────────────────────────────────────────────┘
```

**Tailwind Classes:**
```jsx
<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
  <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
```

---

### Container

**File:** `src/components/layout/Container.jsx`

**Purpose:** Consistent max-width wrapper for content.

**Props:**
```typescript
{
  children: ReactNode;
  className?: string;
}
```

**Implementation:**
```jsx
export function Container({ children, className = '' }) {
  return (
    <div className={`max-w-6xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}
```

---

## Input Components

### InputPanel

**File:** `src/components/input/InputPanel.jsx`

**Purpose:** Container for all input methods with tab switching.

**Props:**
```typescript
{
  onAnalyze: (content: string) => void;
  isLoading: boolean;
}
```

**State:**
```typescript
{
  activeTab: 'paste' | 'url' | 'file';
  content: string;
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Paste Text]  [Enter URL]  [Upload File]                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  (Active input component renders here)                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                        [Analyze Content →]  │
└─────────────────────────────────────────────────────────────┘
```

---

### TextPasteArea

**File:** `src/components/input/TextPasteArea.jsx`

**Purpose:** Large textarea for pasting competitor content.

**Props:**
```typescript
{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

**Features:**
- Character count in corner
- Clear button when content exists
- Auto-focus on mount
- Cmd+Enter keyboard shortcut hint

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Paste competitor content here...                           │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                      0 chars│
└─────────────────────────────────────────────────────────────┘
```

---

### UrlInput

**File:** `src/components/input/UrlInput.jsx`

**Purpose:** URL input with validation.

**Props:**
```typescript
{
  value: string;
  onChange: (value: string) => void;
  onFetch: () => void;
  isFetching: boolean;
}
```

**Validation:**
- Must start with http:// or https://
- Show error state for invalid URLs
- Show loading state while fetching

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  🔗  https://competitor.com/pricing              [Fetch →]  │
└─────────────────────────────────────────────────────────────┘
```

---

### FileUpload

**File:** `src/components/input/FileUpload.jsx`

**Purpose:** Drag-and-drop file upload zone.

**Props:**
```typescript
{
  onFileSelect: (file: File) => void;
  acceptedTypes: string[]; // ['.pdf', '.docx', '.txt']
}
```

**States:**
- Default: Dashed border, upload icon
- Drag over: Highlighted border, "Drop file" text
- File selected: Show filename, size, remove button

**Visual (default):**
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                                             │
│                         📄                                  │
│                                                             │
│              Drop PDF, DOCX, or TXT here                    │
│                  or click to browse                         │
│                                                             │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

---

## Analysis Components

### AnalysisView

**File:** `src/components/analysis/AnalysisView.jsx`

**Purpose:** Main container for displaying extraction results.

**Props:**
```typescript
{
  analysis: Analysis;
  onSave: () => void;
  onExport: (format: string) => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Company Name                              [Save] [Export▾] │
│  "Tagline here"                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ PricingCard │  │ PricingCard │  │ PricingCard │  ...    │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PositioningCard                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ SocialProofCard                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### PricingCard

**File:** `src/components/analysis/PricingCard.jsx`

**Purpose:** Display a single pricing tier.

**Props:**
```typescript
{
  tier: {
    name: string;
    price: string;
    billingPeriod: string | null;
    priceModel: string;
    targetCustomer: string;
    keyFeatures: string[];
    limitations: string[];
    confidence: 'high' | 'medium' | 'low';
  };
  isHighlighted?: boolean;
}
```

**Visual:**
```
┌─────────────────────────────┐
│  Plus              [●] High │
│  ─────────────────────────  │
│  $10                        │
│  per seat/month             │
│                             │
│  For small teams            │
│                             │
│  ✓ Unlimited uploads        │
│  ✓ 30-day history           │
│  ✓ 100 guests               │
│                             │
│  ⚠ Limited API access       │
│                             │
│               [Copy tier →] │
└─────────────────────────────┘
```

**Tailwind Snippet:**
```jsx
<div className="border border-gray-200 rounded-lg p-5 hover:border-primary-300 transition-colors">
  <div className="flex items-center justify-between mb-3">
    <h4 className="font-semibold text-gray-900">{tier.name}</h4>
    <ConfidenceBadge level={tier.confidence} />
  </div>
  <p className="text-3xl font-bold text-primary-600">{tier.price}</p>
  {tier.billingPeriod && (
    <p className="text-sm text-gray-500 mt-1">{tier.billingPeriod}</p>
  )}
  ...
</div>
```

---

### ConfidenceBadge

**File:** `src/components/analysis/ConfidenceBadge.jsx`

**Purpose:** Visual indicator of extraction confidence.

**Props:**
```typescript
{
  level: 'high' | 'medium' | 'low';
  showLabel?: boolean;
}
```

**Visual:**
```
High:   [● High]     bg-green-100 text-green-800
Medium: [● Medium]   bg-yellow-100 text-yellow-800
Low:    [● Low]      bg-red-100 text-red-800
```

**Implementation:**
```jsx
const styles = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-red-100 text-red-800'
};

export function ConfidenceBadge({ level, showLabel = true }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${styles[level]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {showLabel && level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}
```

---

### PositioningCard

**File:** `src/components/analysis/PositioningCard.jsx`

**Purpose:** Display extracted positioning and messaging.

**Props:**
```typescript
{
  positioning: {
    tagline: string | null;
    targetCustomers: string[];
    differentiators: string[];
    valuePropositions: string[];
  };
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Positioning                                        [Copy]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Target Customers          │  Differentiators               │
│  ┌──────────┐ ┌─────────┐  │  • All-in-one workspace        │
│  │ Startups │ │ SMBs    │  │  • Flexible building blocks    │
│  └──────────┘ └─────────┘  │  • Scales to enterprise        │
│  ┌────────────────┐        │                                │
│  │ Product teams  │        │                                │
│  └────────────────┘        │                                │
│                            │                                │
│  Value Propositions                                         │
│  "Replace your scattered tools with one workspace"          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### SocialProofCard

**File:** `src/components/analysis/SocialProofCard.jsx`

**Purpose:** Display social proof elements.

**Props:**
```typescript
{
  socialProof: {
    customerLogos: string[];
    metricsClaimed: string[];
    caseStudies: string[];
    awards: string[];
    partnerships: string[];
  };
}
```

**Visual elements:**
- Customer logos as badges (blue tint)
- Metrics as highlighted callouts
- Partnerships as badges (green tint)
- Case studies as linked references

---

## Comparison Components

### ComparisonTable

**File:** `src/components/comparison/ComparisonTable.jsx`

**Purpose:** Side-by-side competitor comparison matrix.

**Props:**
```typescript
{
  competitors: Analysis[];
  categories: string[]; // Which rows to show
  onRemoveCompetitor: (id: string) => void;
}
```

**Layout:**
```
┌───────────────┬───────────────┬───────────────┬─────────────┐
│               │ Notion        │ Asana         │ Monday      │
│               │ [×]           │ [×]           │ [×]         │
├───────────────┼───────────────┼───────────────┼─────────────┤
│ Free Tier     │ ✓ Yes         │ ✓ Yes         │ ✗ No        │
├───────────────┼───────────────┼───────────────┼─────────────┤
│ Starting      │ $10/seat      │ $13.49/seat   │ $12/seat    │
│ Price         │               │               │             │
├───────────────┼───────────────┼───────────────┼─────────────┤
│ Enterprise    │ Contact sales │ Contact sales │ Contact     │
├───────────────┼───────────────┼───────────────┼─────────────┤
│ Key           │ • All-in-one  │ • Workflows   │ • Visual    │
│ Differentiator│ • Flexible    │ • Timeline    │ • Automations│
└───────────────┴───────────────┴───────────────┴─────────────┘
```

**Features:**
- Sticky first column (category names)
- Sticky header row (competitor names)
- Highlight cells with significant differences
- Click competitor name to view full analysis

---

## Export Components

### ExportMenu

**File:** `src/components/export/ExportMenu.jsx`

**Purpose:** Dropdown menu with export format options.

**Props:**
```typescript
{
  analysis: Analysis;
  isOpen: boolean;
  onClose: () => void;
}
```

**Options:**
```
┌─────────────────────────┐
│ Export as...            │
├─────────────────────────┤
│ 📋 Copy as Markdown     │
│ 💬 Copy for Slack       │
│ 📄 Download PDF         │
│ 📊 Download JSON        │
└─────────────────────────┘
```

---

### BattlecardPreview

**File:** `src/components/export/BattlecardPreview.jsx`

**Purpose:** Preview of PDF battlecard before download.

**Props:**
```typescript
{
  analysis: Analysis;
  onDownload: () => void;
  onClose: () => void;
}
```

**Layout (A4 page preview):**
```
┌─────────────────────────────────────────┐
│  COMPETITIVE BATTLECARD                 │
│  ═══════════════════════════════════    │
│  Notion                                 │
│  Analyzed: Jan 13, 2025                 │
│                                         │
│  PRICING                                │
│  ───────                                │
│  Free    | Plus     | Business | Ent.   │
│  $0      | $10/seat | $18/seat | Custom │
│                                         │
│  KEY DIFFERENTIATORS                    │
│  ─────────────────────                  │
│  • All-in-one workspace                 │
│  • Flexible building blocks             │
│                                         │
│  SOCIAL PROOF                           │
│  ─────────────                          │
│  Toyota, Spotify, IBM                   │
│  50,000+ organizations                  │
└─────────────────────────────────────────┘
         [Download PDF]  [Cancel]
```

---

## Common Components

### Button

**File:** `src/components/common/Button.jsx`

**Props:**
```typescript
{
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
```

**Variants:**
```
Primary:   bg-primary-600 text-white hover:bg-primary-700
Secondary: bg-white border border-gray-200 text-gray-700 hover:bg-gray-50
Ghost:     bg-transparent text-gray-600 hover:bg-gray-100
```

---

### Card

**File:** `src/components/common/Card.jsx`

**Props:**
```typescript
{
  title?: string;
  subtitle?: string;
  action?: ReactNode; // Button in top-right
  children: ReactNode;
  className?: string;
}
```

**Implementation:**
```jsx
export function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
```

---

### EmptyState

**File:** `src/components/common/EmptyState.jsx`

**Props:**
```typescript
{
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}
```

**Visual:**
```
┌─────────────────────────────────────────┐
│                                         │
│               🔍                        │
│                                         │
│      No competitors analyzed yet        │
│                                         │
│   Paste content or enter a URL to       │
│   analyze your first competitor.        │
│                                         │
│        [See Example Analysis]           │
│                                         │
└─────────────────────────────────────────┘
```

---

### LoadingSpinner

**File:** `src/components/common/LoadingSpinner.jsx`

**Props:**
```typescript
{
  size: 'sm' | 'md' | 'lg';
  message?: string;
}
```

**Visual (with message):**
```
┌─────────────────────────────────────────┐
│                                         │
│              ⟳ (spinning)               │
│                                         │
│      Extracting pricing information...  │
│                                         │
└─────────────────────────────────────────┘
```

---

### Toast

**File:** `src/components/common/Toast.jsx`

**Props:**
```typescript
{
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}
```

**Visual:**
```
Success: ┌──────────────────────────────┐
         │ ✓ Copied to clipboard    [×] │
         └──────────────────────────────┘

Error:   ┌──────────────────────────────┐
         │ ⚠ Failed to export        [×] │
         └──────────────────────────────┘
```

---

## Icon Usage

Use `lucide-react` for all icons. Common icons needed:

```jsx
import {
  FileText,      // Document/analysis
  Link,          // URL input
  Upload,        // File upload
  Search,        // Search/analyze
  Download,      // Export
  Copy,          // Copy to clipboard
  Check,         // Success/checkmark
  X,             // Close/remove
  AlertCircle,   // Error
  Loader2,       // Loading (animated)
  ChevronDown,   // Dropdown
  ExternalLink,  // Open link
  RefreshCw,     // Re-analyze
  Trash2,        // Delete
  Plus,          // Add competitor
  BarChart3,     // Comparison
} from 'lucide-react';
```

Standard icon sizing:
- In buttons: `w-4 h-4`
- Standalone: `w-5 h-5`
- Empty states: `w-12 h-12`

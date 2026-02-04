# Competitive Ad Intelligence Dashboard — Build Specification

## Project Overview

Build a **single-page React web application** — an internal competitive market intelligence platform for a London-based digital marketing agency. The platform analyzes LinkedIn Ads scraped from competitor agencies via the LinkedIn Ad Library using Apify.

**Product Name:** AdIntel Pro
**Tagline:** "Competitor Ad Intelligence, Decoded."
**User:** Internal agency team (1–5 users, no auth required)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18+ with Vite |
| Styling | Tailwind CSS 3.x |
| Charts | Recharts |
| Icons | Lucide React |
| State | React useState/useReducer (no external state management) |
| Data | Static JSON import (no backend/API) |
| Routing | React Router DOM v6 (client-side only) |
| Build | Vite, deploy as static site |

**No backend. No database. No authentication.** The app loads a JSON data file at build time.

---

## Data Schema

The platform ingests JSON arrays scraped from the LinkedIn Ad Library. Every record is one ad. Below is the **complete field reference** — the app must handle all fields gracefully, including when they are absent or null.

### Core Fields (present on all/most records)

```
adId              string    — Unique ad identifier (e.g. "589965514")
adLibraryUrl      string    — Direct link to LinkedIn Ad Library detail page
advertiserLogo    string?   — URL to company logo image (100x100), may be null
advertiserName    string    — Company display name
advertiserUrl     string    — LinkedIn company page URL
body              string?   — Ad copy / description text (0-1792 chars)
clickUrl          string?   — Destination URL when user clicks the ad
ctas              string[]  — Array of CTA button labels (e.g. ["Learn more"], can be empty [])
format            string    — Ad format enum: "SINGLE_IMAGE" | "VIDEO" | "DOCUMENT" | "CAROUSEL" | "JOB" | "FOLLOW_COMPANY"
headline          string?   — Ad headline text (may contain \n newlines and "…see more")
imageUrl          string?   — Primary image URL (mainly for SINGLE_IMAGE format)
paidBy            string?   — Legal entity paying for the ad
startUrl          string    — LinkedIn Ad Library search URL for this advertiser
```

### Extended Fields (present on ~15% of records — those with transparency data)

```
availability      object?   — { start: "YYYY-MM-DD", end: "YYYY-MM-DD" } date range the ad ran
impressions       string?   — Impression range bucket: "< 1k" | "1k-5k" | "5k-10k" | "10k-20k" | "200k-300k"
impressionsPerCountry  array?  — [{ country: string, impressions: string (e.g. "20%" or "<1%") }]
targeting         object?   — { language?: string, location?: string } — targeting criteria
```

### Format-Specific Media Fields

```
videoUrl          string?   — MP4 video URL (only on VIDEO format ads)
documentUrl       string?   — PDF document URL (only on DOCUMENT format ads)
imageUrls         string[]? — Array of image URLs (on DOCUMENT format for page previews)
slides            array?    — Carousel slide objects: [{ imageUrl: string }] (only on CAROUSEL format)
```

### Current Dataset Statistics

| Metric | Value |
|--------|-------|
| Total ads | 201 |
| Unique advertisers | 7 (5 primary competitors) |
| Formats | SINGLE_IMAGE (137), VIDEO (36), DOCUMENT (12), CAROUSEL (11), JOB (4), FOLLOW_COMPANY (1) |
| Records with impressions data | 31 |
| Records with targeting data | 31 |
| Records with availability dates | 31 |
| Date range | 2024-03-01 to 2026-02-03 |
| Avg body text length | 269 chars |
| Avg headline length | 69 chars |

### Advertiser Breakdown

| Advertiser | Ad Count | Primary Formats |
|-----------|----------|----------------|
| Growthcurve | 105 | SINGLE_IMAGE, VIDEO |
| Passion Digital | 36 | SINGLE_IMAGE, VIDEO |
| prodot – Digital Passion. Driving Innovation. | 27 | SINGLE_IMAGE, JOB, FOLLOW_COMPANY |
| Target Activation Agency | 19 | SINGLE_IMAGE, DOCUMENT |
| Climbing Trees | 12 | SINGLE_IMAGE, CAROUSEL |
| Target Agency Egypt | 1 | VIDEO |
| Digital Passion P.S.A. | 1 | SINGLE_IMAGE |

### CTA Distribution

| CTA Label | Count |
|-----------|-------|
| Learn more | 52 |
| Apply | 51 |
| Join | 18 |
| Sign Up | 18 |
| Download | 10 |
| Anmelden (German) | 9 |
| Teilnehmen (German) | 4 |
| See More Jobs | 4 |
| Subscribe | 1 |
| Visit life | 1 |

---

## Design System

### Color Palette — "Purple Modern"

The entire UI uses a **dark-mode-first** purple gradient aesthetic. Clean, sleek, modern SaaS dashboard feel.

```
Primary Purple:       #7C3AED (violet-600)
Primary Light:        #A78BFA (violet-400)
Primary Dark:         #5B21B6 (violet-800)
Accent Glow:          #8B5CF6 (violet-500)

Background Dark:      #0F0B1A (near-black with purple tint)
Background Card:      #1A1425 (dark purple-gray)
Background Elevated:  #241E35 (slightly lighter card)
Background Hover:     #2D2545 (hover state)

Surface Border:       #3B3255 (subtle purple border)
Surface Border Light: #4C3D6E

Text Primary:         #F5F3FF (violet-50, almost white)
Text Secondary:       #C4B5FD (violet-300)
Text Muted:           #8B7FB5 (muted lavender)
Text Accent:          #A78BFA (violet-400)

Success:              #34D399 (emerald-400)
Warning:              #FBBF24 (amber-400)
Danger:               #F87171 (red-400)
Info:                 #60A5FA (blue-400)

Chart Colors (in order):
  #8B5CF6 (violet)
  #06B6D4 (cyan)
  #F59E0B (amber)
  #EF4444 (red)
  #10B981 (emerald)
  #EC4899 (pink)
  #3B82F6 (blue)
```

### Typography

- **Headings:** Inter or system font, font-weight 700, tracking tight
- **Body:** Inter or system font, font-weight 400
- **Monospace/Data:** JetBrains Mono or system monospace (for ad IDs, URLs)
- **Numbers/Stats:** Tabular numerals, font-weight 600

### Component Style Rules

1. **Cards** — rounded-xl, bg-[#1A1425], border border-[#3B3255], subtle shadow, hover:border-violet-500/30 transition
2. **Buttons** — Primary: bg-violet-600 hover:bg-violet-500, rounded-lg, px-4 py-2. Secondary: bg-transparent border-violet-500/50 text-violet-300
3. **Inputs/Selects** — bg-[#241E35] border-[#3B3255] text-white rounded-lg focus:ring-violet-500 focus:border-violet-500
4. **Badges/Tags** — Small rounded-full px-3 py-1 elements. Format badges use distinct colors (see below).
5. **Tables** — Striped with alternating bg-[#1A1425] and bg-[#241E35]. Header row bg-[#2D2545].
6. **Tooltips** — bg-[#2D2545] text-sm border border-[#4C3D6E]
7. **Scrollbars** — Custom styled thin purple scrollbars
8. **Transitions** — All interactive elements: transition-all duration-200

### Format Badge Colors

| Format | Badge Color |
|--------|------------|
| SINGLE_IMAGE | bg-violet-500/20 text-violet-300 |
| VIDEO | bg-cyan-500/20 text-cyan-300 |
| CAROUSEL | bg-amber-500/20 text-amber-300 |
| DOCUMENT | bg-emerald-500/20 text-emerald-300 |
| JOB | bg-blue-500/20 text-blue-300 |
| FOLLOW_COMPANY | bg-pink-500/20 text-pink-300 |

---

## Application Architecture

### Page Structure (React Router)

```
/                     → Dashboard (overview/home)
/ads                  → Ad Library (full ad browser with filters)
/ads/:adId            → Ad Detail (individual ad deep-dive)
/competitors          → Competitor Profiles (per-advertiser analysis)
/competitors/:name    → Individual Competitor Profile
/analytics            → Analytics & Insights (charts, trends, comparisons)
/geo                  → Geographic Intelligence (country/targeting analysis)
```

### Global Layout

```
┌──────────────────────────────────────────────────────┐
│  SIDEBAR (fixed left, 260px wide, collapsible)       │
│  ┌─────────────────────┐  ┌────────────────────────┐ │
│  │  Logo + Brand       │  │  MAIN CONTENT AREA     │ │
│  │  ───────────────    │  │                        │ │
│  │  📊 Dashboard       │  │  (page content here)   │ │
│  │  📑 Ad Library      │  │                        │ │
│  │  👥 Competitors     │  │                        │ │
│  │  📈 Analytics       │  │                        │ │
│  │  🌍 Geo Intel       │  │                        │ │
│  │  ───────────────    │  │                        │ │
│  │  Data: 201 ads      │  │                        │ │
│  │  Last scrape: date  │  │                        │ │
│  └─────────────────────┘  └────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

The sidebar should show:
- Logo area with "AdIntel Pro" branding and a small purple glow icon
- Navigation links with active state highlighting (left purple border + bg highlight)
- A bottom section showing dataset stats: total ads loaded, number of competitors, last data update
- A collapse/expand toggle button

---

## Page Specifications

### PAGE 1: Dashboard (Home `/`)

The executive overview. Shows KPIs, distributions, and recent activity at a glance.

#### Row 1 — KPI Stat Cards (4 cards in a row)

| Card | Value | Icon | Subtext |
|------|-------|------|---------|
| Total Ads Tracked | 201 | BarChart3 | "across {n} competitors" |
| Active Competitors | 5 | Users | "monitored advertisers" |
| Ad Formats Detected | 6 | LayoutGrid | "unique creative types" |
| Ads with Impression Data | 31 | Eye | "{pct}% of total" |

Each card: large number (text-3xl font-bold), icon top-right in a purple circle badge, subtext in text-muted below.

#### Row 2 — Two Charts Side-by-Side

**Left: Ads per Competitor (Horizontal Bar Chart)**
- Horizontal bars showing ad count per advertiser
- Sorted descending
- Each bar colored with the chart color palette
- Hover tooltip shows exact count and percentage of total
- Bar labels truncated with ellipsis if too long

**Right: Ad Format Distribution (Donut/Pie Chart)**
- Donut chart with format breakdown
- Center text shows total count
- Legend below with format badges
- Each segment uses the format badge color

#### Row 3 — Two More Panels

**Left: CTA Strategy Overview (Horizontal Bar Chart)**
- All CTA types with frequency counts
- Sorted descending

**Right: Recent/Latest Ads Feed (Scrollable List)**
- Show the 8 most recent ads (based on availability.start date where available, otherwise by position in dataset)
- Each item shows: advertiser logo (small circle), advertiser name, truncated headline (1 line), format badge, small image thumbnail if available
- Clicking any item navigates to `/ads/:adId`

#### Row 4 — Impression Distribution Panel (Full Width)

**Impression Range Breakdown (Bar Chart)**
- Show distribution across impression buckets: "< 1k", "1k-5k", "5k-10k", "10k-20k", "200k-300k"
- X-axis: impression range, Y-axis: count of ads
- Only for the 31 records that have impression data
- Include a note: "Based on {n} ads with transparency data"

---

### PAGE 2: Ad Library (`/ads`)

The core browsing experience. A filterable, searchable, sortable grid of all ads.

#### Filter Bar (Sticky Top)

A horizontal filter bar with the following controls — all filters are **combinable** (AND logic):

| Filter | Type | Options |
|--------|------|---------|
| Search | Text input | Searches across: body, headline, advertiserName, paidBy, adId |
| Competitor | Multi-select dropdown | All unique advertiserName values |
| Format | Multi-select with format badges | SINGLE_IMAGE, VIDEO, DOCUMENT, CAROUSEL, JOB, FOLLOW_COMPANY |
| CTA | Multi-select dropdown | All unique CTA values found in data |
| Has Image | Toggle | Yes/No/All |
| Has Video | Toggle | Yes/No/All |
| Has Impressions | Toggle | Yes/No/All |
| Date Range | Date picker (start/end) | Filters on availability.start and availability.end |
| Clear All | Button | Resets all filters |

Below the filter bar, show: **"Showing {filtered count} of {total} ads"** and active filter tags (removable chips).

#### View Mode Toggle

Two view modes, toggled via icon buttons in top-right:

**Grid View (Default)**
- Responsive grid: 3 columns on large, 2 on medium, 1 on small
- Each ad card shows:
  - **Image/Media Preview** (top section, 16:9 aspect ratio container):
    - SINGLE_IMAGE: show imageUrl as background image, cover fit
    - VIDEO: show a play button overlay on a purple gradient placeholder (or first frame if available)
    - CAROUSEL: show first slide image with a "1/{n} slides" badge overlay
    - DOCUMENT: show first imageUrls entry or a document icon placeholder
    - JOB: show a briefcase icon placeholder
    - FOLLOW_COMPANY: show company logo enlarged
  - **Format badge** (top-left overlay on the image)
  - **Advertiser row**: logo (24px circle) + name + "Paid by: {paidBy}" if different from advertiserName
  - **Headline**: truncated to 2 lines, text-sm font-semibold
  - **Body text**: truncated to 3 lines, text-sm text-muted
  - **CTA badges**: show all CTA labels as small tags
  - **Footer**: "Ad ID: {adId}" as monospace muted text + external link icon to adLibraryUrl
  - Entire card is clickable → navigates to `/ads/:adId`
  - Hover effect: slight scale(1.02), border glow purple

**Table View**
- Full-width sortable table
- Columns: Thumbnail (40x40), Advertiser, Headline (truncated), Format (badge), CTAs, Impressions (if available), Actions (view button)
- Sortable by: Advertiser (alpha), Format, Impressions
- Row click → navigates to `/ads/:adId`

#### Pagination

- Show 12 ads per page in grid view, 20 per page in table view
- Pagination controls at bottom: Previous / Page numbers / Next
- Show "Page {n} of {total}"

---

### PAGE 3: Ad Detail (`/ads/:adId`)

A dedicated deep-dive view for a single ad.

#### Layout: Two-Column

**Left Column (60% width) — Media & Content**

1. **Media Preview (large)**
   - SINGLE_IMAGE: full-width image display with rounded corners
   - VIDEO: embedded `<video>` player with controls, playing the videoUrl MP4
   - CAROUSEL: image gallery/slider with navigation arrows and dot indicators, showing all slides[].imageUrl
   - DOCUMENT: show all imageUrls as stacked page previews + link to download documentUrl PDF
   - JOB/FOLLOW_COMPANY: styled placeholder with format icon

2. **Ad Copy Section**
   - **Headline** — full text, styled as heading (text-xl font-semibold), render \n as line breaks
   - **Body** — full text, styled as paragraph, preserve whitespace and line breaks
   - **CTA Buttons** — render each CTA as a styled button (non-functional, just display)

3. **Destination URL**
   - Show full clickUrl as a clickable link with external-link icon
   - Extract and display the domain name prominently

**Right Column (40% width) — Metadata & Intelligence**

1. **Advertiser Card**
   - Large logo (64px), advertiser name (text-lg font-bold), "Paid by: {paidBy}"
   - Link to advertiser LinkedIn page (advertiserUrl)
   - Link to see all ads from this advertiser (startUrl)
   - Button: "View All {name}'s Ads" → links to `/competitors/:name`

2. **Ad Metadata Card**
   - Ad ID (monospace)
   - Format (with color badge)
   - LinkedIn Ad Library link (adLibraryUrl) — external link

3. **Availability Card** (only if availability data exists)
   - Start date
   - End date
   - Duration calculated (e.g. "32 days")
   - Status: "Active" (if end > today) or "Ended" with color indicator

4. **Impressions Card** (only if impressions data exists)
   - Impression range displayed prominently
   - Visual bar or gauge indicator

5. **Geographic Distribution Card** (only if impressionsPerCountry exists)
   - Horizontal bar chart of top 10 countries by impression %
   - Show country flag emoji + name + percentage
   - "Show all {n} countries" expandable

6. **Targeting Card** (only if targeting data exists)
   - Language
   - Location/regions

7. **Navigation**
   - "← Back to Ad Library" link
   - "Previous Ad" / "Next Ad" navigation (based on current filtered list)

---

### PAGE 4: Competitor Profiles (`/competitors`)

#### Competitor Overview Grid

Show each unique advertiser as a **profile card** in a responsive grid (2-3 columns).

Each competitor card:
- Large advertiser logo (80px)
- Advertiser name (heading)
- "Paid by: {paidBy}" (if available)
- Stat row: {ad count} ads | {format count} formats | {CTA count} unique CTAs
- **Mini format distribution bar** — a thin stacked horizontal bar showing proportion of each format
- **Top CTAs**: show top 3 most-used CTA labels as badges
- **Top Format**: show the most-used format with badge
- Impression data summary (if any of their ads have it): "{n} ads with impression data"
- "View Full Profile →" button → navigates to `/competitors/:name`

#### Competitor Comparison Table (Below Grid)

Full-width comparison table:

| Metric | Competitor A | Competitor B | Competitor C | ... |
|--------|-------------|-------------|-------------|-----|
| Total Ads | n | n | n | |
| SINGLE_IMAGE | n | n | n | |
| VIDEO | n | n | n | |
| CAROUSEL | n | n | n | |
| DOCUMENT | n | n | n | |
| JOB | n | n | n | |
| Unique CTAs | n | n | n | |
| Top CTA | label | label | label | |
| Avg Body Length | n chars | n chars | n chars | |
| Avg Headline Length | n chars | n chars | n chars | |
| Has Impression Data | y/n | y/n | y/n | |
| Destination Domains | n unique | n unique | n unique | |

---

### PAGE 5: Individual Competitor Profile (`/competitors/:name`)

A deep-dive page for one competitor, showing everything known about their ad strategy.

#### Header Section
- Large logo + name + paidBy
- Stat badges: Total ads, formats used, date range active
- External link to LinkedIn company page

#### Section 1: Ad Format Strategy (Chart + Table)
- Donut chart: format distribution for this competitor
- Table listing each format with count and percentage

#### Section 2: CTA Analysis
- Bar chart: CTA frequency for this competitor
- List of all unique CTAs used with counts

#### Section 3: Copy Analysis
- **Average body length** vs overall dataset average (comparison bar)
- **Average headline length** vs overall dataset average
- **Longest ad copy** — show the full text of their longest body text
- **Shortest ad copy** — show the full text of their shortest body text
- **Common words/phrases** — extract and display the 15 most frequent meaningful words from their body texts (exclude common stop words like "the", "and", "is", "to", "a", "in", "of", "for", "with", "on", "at", "by", "it")

#### Section 4: Destination URL Analysis
- Table of unique destination domains used in clickUrl
- Count of ads linking to each domain
- Full URL list (truncated with copy button)

#### Section 5: Geographic Reach (if any ads have impressionsPerCountry)
- World-style horizontal bar chart showing all countries targeted
- Aggregate country data across all their ads

#### Section 6: Timeline (if any ads have availability data)
- Gantt-style horizontal timeline showing ad start/end dates
- Visual representation of when ads were running

#### Section 7: Full Ad Gallery
- Grid of all ads for this competitor (reuse the ad card component from the Ad Library page)
- Same filter/sort controls as Ad Library but pre-filtered to this competitor

---

### PAGE 6: Analytics & Insights (`/analytics`)

The analytical deep-dive with cross-competitor comparisons and trend analysis.

#### Section 1: Competitive Landscape Overview

**Ad Volume Comparison (Bar Chart)**
- Grouped or stacked bar chart showing ad count per competitor
- Optionally group by format

**Format Strategy Radar Chart**
- Radar/spider chart with axes for each format type
- One polygon per competitor
- Shows which competitors lean into which formats

#### Section 2: Creative Strategy Analysis

**CTA Usage Heatmap**
- Matrix/heatmap: competitors (rows) × CTA types (columns)
- Cell color intensity = frequency of usage
- Shows strategic CTA differences between competitors

**Body Copy Length Distribution**
- Box plot or histogram comparing body text length across competitors
- Shows who writes long vs short copy

**Headline Length Distribution**
- Same as above but for headlines

#### Section 3: Content Intelligence

**Top Messaging Themes**
- For each competitor, extract and show top keywords/phrases from their ad copy
- Display as a styled word frequency list or simple tag cloud

**CTA Diversity Score**
- Bar chart: number of unique CTAs per competitor
- Shows strategic breadth

#### Section 4: Impression Intelligence (Based on Available Data)

**Impression Distribution by Competitor**
- Show which competitors have impression data and their ranges
- Stacked bar or grouped bar chart

**Top Countries by Total Impression Share**
- Aggregate impressionsPerCountry across all ads
- Show top 20 countries with total weighted share
- Bar chart

**Targeting Strategy Comparison**
- Table: competitor × language + regions targeted
- Shows geographic strategy differences

#### Section 5: Temporal Analysis (Based on Available Dates)

**Ad Activity Timeline**
- Gantt chart or timeline view showing all ads with availability dates
- Colored by competitor
- Shows overlapping campaigns and seasonal patterns

**Monthly Ad Volume** (where dates are available)
- Line chart showing ads started per month per competitor

---

### PAGE 7: Geographic Intelligence (`/geo`)

Dedicated geographic analysis page.

#### World Map or Top Countries Bar Chart
- Horizontal bar chart showing top 25 countries by aggregate impression share
- Color-coded by competitor who targets them most

#### Country × Competitor Matrix
- Heatmap showing which competitors target which countries
- Intensity = impression percentage

#### Targeting Strategy Cards
- One card per competitor showing their targeting.location and targeting.language values
- Visual comparison

---

## Global Features & Components

### 1. Global Search (Header)
- A search bar in the top header area of the main content
- Searches across all ad fields: body, headline, advertiserName, adId
- Shows results as a dropdown with quick navigation
- Keyboard shortcut: Cmd/Ctrl + K to focus search

### 2. Data Export
- On any page with data tables or lists, include an "Export CSV" button
- Exports the currently filtered/visible data as a downloadable CSV file
- Include all relevant columns

### 3. Responsive Design
- Full responsive layout: desktop (1280px+), tablet (768px), mobile (375px)
- Sidebar collapses to hamburger menu on mobile
- Cards reflow to single column on small screens
- Charts resize appropriately

### 4. Loading States
- Skeleton loading placeholders while data processes
- Smooth fade-in transitions for content

### 5. Empty States
- When filters return zero results, show a styled empty state with clear messaging and "Clear Filters" button
- When a data field is missing, show "N/A" or "No data" gracefully rather than blank space or errors

### 6. Image Error Handling
- All `<img>` tags must have onError fallback to a purple gradient placeholder with a generic icon
- LinkedIn CDN images may expire — handle gracefully

### 7. External Link Handling
- All external links (adLibraryUrl, clickUrl, advertiserUrl) open in new tabs with rel="noopener noreferrer"
- Style with an external-link icon from Lucide

### 8. Copy to Clipboard
- Ad IDs, URLs, and body text should have a "copy" icon button
- Show brief "Copied!" toast/feedback on click

### 9. Scroll to Top
- Floating "scroll to top" button appears when user scrolls down past 400px

---

## Data Loading Strategy

The app loads the JSON dataset at build time. Create the following data infrastructure:

### `/src/data/ads.json`
- The raw JSON array (the uploaded dataset file)
- Import directly: `import adsData from './data/ads.json'`

### `/src/utils/dataProcessing.js`

Create utility functions that compute all derived data from the raw JSON:

```javascript
// Core accessors
getAllAds()                         // Returns full array
getAdById(adId)                    // Single ad lookup
getAdsByAdvertiser(name)           // Filter by advertiser

// Aggregations
getUniqueAdvertisers()             // Array of { name, logo, adCount, ... }
getFormatDistribution()            // { format: count } object
getCTADistribution()               // { cta: count } object
getImpressionDistribution()        // { range: count } object

// Per-competitor analytics
getCompetitorStats(name)           // Full stats object for one competitor
getCompetitorComparison()          // Comparison table data
getCompetitorFormatBreakdown(name) // Format distribution for one competitor
getCompetitorCTABreakdown(name)    // CTA usage for one competitor

// Text analysis
getAverageBodyLength(ads?)         // Average body text length
getAverageHeadlineLength(ads?)     // Average headline length
getTopKeywords(ads, n=15)          // Most frequent non-stop words
getBodyLengthDistribution(ads?)    // Array of body lengths for charting

// Geographic
getCountryDistribution()           // Aggregate country impression data
getCountryByCompetitor()           // Matrix of competitor × country

// Temporal
getAdTimeline()                    // Array of { adId, start, end, advertiser } for timeline
getMonthlyVolume()                 // { month: { advertiser: count } }

// Filtering
filterAds(filters)                 // Master filter function accepting filter object
// filters = { search, competitors[], formats[], ctas[], hasImage, hasVideo, hasImpressions, dateStart, dateEnd }

// Search
searchAds(query)                   // Full-text search across body, headline, advertiserName, adId
```

### Stop Words List for Text Analysis

```javascript
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him',
  'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their', 'what',
  'which', 'who', 'whom', 'where', 'when', 'how', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'because',
  'as', 'about', 'up', 'out', 'if', 'from', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'any', 'see', 'more',
  'also', 'over', 'get', 'new', 'one', 'two', 'like', 'make', 'know',
  'take', 'come', 'think', 'look', 'want', 'give', 'use', 'find',
  'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call',
  'need', 'become', 'keep', 'let', 'begin', 'show', 'hear', 'play',
  'run', 'move', 'live', 'believe', 'bring', 'happen', 'write',
  'provide', 'sit', 'stand', 'lose', 'pay', 'meet', 'include',
  'continue', 'set', 'learn', 'change', 'lead', 'understand',
  'watch', 'follow', 'stop', 'create', 'speak', 'read', 'add',
  'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember',
  'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'die',
  'send', 'expect', 'build', 'stay', 'fall', 'oh', 'yeah',
  'well', 'back', 'going', 'now', 'still', 'even', 'way',
  'us', 'our', 're', 've', 'don', 't', 's', 'amp'
]);
```

---

## Component Structure

```
src/
├── App.jsx                           # Root with Router
├── main.jsx                          # Entry point
├── data/
│   └── ads.json                      # Raw dataset
├── utils/
│   ├── dataProcessing.js             # All data transformation functions
│   └── helpers.js                    # Formatters, truncation, date utils
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx               # Navigation sidebar
│   │   ├── Header.jsx                # Top header with search
│   │   └── Layout.jsx                # Main layout wrapper
│   ├── common/
│   │   ├── StatCard.jsx              # KPI stat card
│   │   ├── FormatBadge.jsx           # Colored format badge
│   │   ├── CTABadge.jsx              # CTA label badge
│   │   ├── AdCard.jsx                # Ad card for grid view
│   │   ├── AdImage.jsx               # Image with error fallback
│   │   ├── FilterBar.jsx             # Filter controls
│   │   ├── SearchInput.jsx           # Global search component
│   │   ├── ExportButton.jsx          # CSV export
│   │   ├── Pagination.jsx            # Page controls
│   │   ├── EmptyState.jsx            # No results display
│   │   ├── CopyButton.jsx            # Copy to clipboard
│   │   └── ScrollToTop.jsx           # Scroll to top floating button
│   ├── charts/
│   │   ├── HorizontalBarChart.jsx    # Reusable horizontal bar
│   │   ├── DonutChart.jsx            # Donut/pie chart
│   │   ├── StackedBarChart.jsx       # Stacked bars
│   │   ├── HeatmapChart.jsx          # Matrix heatmap
│   │   ├── TimelineChart.jsx         # Gantt/timeline
│   │   └── RadarChart.jsx            # Spider/radar chart
│   └── media/
│       ├── VideoPlayer.jsx           # Video embed component
│       ├── CarouselViewer.jsx        # Slide gallery with arrows
│       ├── DocumentViewer.jsx        # Document page previews
│       └── ImageGallery.jsx          # Lightbox-style image viewer
├── pages/
│   ├── Dashboard.jsx                 # Home overview page
│   ├── AdLibrary.jsx                 # Full ad browser
│   ├── AdDetail.jsx                  # Single ad view
│   ├── Competitors.jsx               # Competitor overview
│   ├── CompetitorProfile.jsx         # Individual competitor
│   ├── Analytics.jsx                 # Charts & insights
│   └── GeoIntel.jsx                  # Geographic intelligence
└── styles/
    └── index.css                     # Tailwind imports + custom scrollbar styles
```

---

## Detailed Implementation Notes

### Image Handling

LinkedIn CDN images have expiry timestamps in their URLs. The app should:
1. Attempt to load the image normally
2. On error, display a styled fallback: a gradient purple background (#5B21B6 → #7C3AED) with a centered Lucide icon (ImageOff for images, VideoOff for videos, FileText for documents)
3. Never show broken image icons

```jsx
// Example AdImage component pattern
const AdImage = ({ src, alt, format }) => {
  const [error, setError] = useState(false);
  if (error || !src) return <FallbackPlaceholder format={format} />;
  return <img src={src} alt={alt} onError={() => setError(true)} className="..." />;
};
```

### Video Player

For VIDEO format ads:
- Use native HTML5 `<video>` element with controls
- Source type: video/mp4
- Poster: purple gradient placeholder or advertiser logo
- Don't autoplay

### Carousel Viewer

For CAROUSEL format ads (slides array):
- Left/right arrow navigation
- Dot indicators at bottom
- Current slide: "2 of 4" counter
- Smooth CSS transitions between slides
- Keyboard arrow key support

### Document Viewer

For DOCUMENT format ads:
- Show each page in imageUrls as a stacked preview
- Link to open/download documentUrl (the PDF)
- Page counter

### CSV Export

The Export CSV function should:
1. Take the currently visible/filtered array of ads
2. Flatten nested objects (e.g., `targeting.language`, `targeting.location`, `availability.start`, `availability.end`)
3. Join arrays with semicolons (e.g., CTAs: "Learn more;Download")
4. Handle the impressionsPerCountry by joining as "Country:Percent" pairs
5. Trigger download as `adintel-export-{YYYY-MM-DD}.csv`

### Text Truncation Helper

```javascript
function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}
```

### Date Formatting

```javascript
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function daysBetween(start, end) {
  if (!start || !end) return null;
  const diff = new Date(end) - new Date(start);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
```

### URL Domain Extraction

```javascript
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}
```

---

## Multi-Dataset Support (Future-Proofing)

The app should be designed so that swapping in a new JSON file is trivial:

1. The JSON file is the single source of truth — drop in a new file, everything updates
2. All aggregations are computed dynamically, not hardcoded
3. Competitor names, formats, CTAs are all derived from data, not from a static list
4. The app should handle any number of records (100 to 10,000+) without breaking
5. Consider adding a simple JSON file upload UI in the future (a drag-and-drop zone on a settings page that re-loads the data context) — but do NOT build this now, just structure code to make it easy later

---

## Performance Considerations

1. **Memoize** all computed data using `useMemo` — aggregations should not recompute on every render
2. **Virtualize** the ad library table/grid if it grows beyond 500 records (react-window or native intersection observer)
3. **Lazy load** images — only load images when cards scroll into view
4. **Debounce** the search input (300ms delay)
5. **Pagination** prevents rendering all 201+ cards at once

---

## Build & Deploy

```bash
# Install dependencies
npm install react react-dom react-router-dom recharts lucide-react
npm install -D tailwindcss @tailwindcss/forms postcss autoprefixer vite @vitejs/plugin-react

# Dev
npm run dev

# Build
npm run build
# Output in dist/ — deploy anywhere as static files
```

### Tailwind Config

Extend the default config with:
- The custom color palette defined above
- Add the `@tailwindcss/forms` plugin for styled form elements
- Configure dark mode as 'class' (though the app is always dark mode)

---

## Acceptance Criteria Summary

The completed application must:

- [ ] Load and render all 201 ads from the JSON dataset without errors
- [ ] Display a functional sidebar navigation with all 6+ pages
- [ ] Show accurate KPI cards on the Dashboard
- [ ] Render all chart types (bar, donut, heatmap, timeline, radar) with real data
- [ ] Support all 6 ad formats with appropriate media previews
- [ ] Implement working multi-criteria filtering on the Ad Library page
- [ ] Support full-text search across ad content
- [ ] Show complete ad details including video playback and carousel navigation
- [ ] Display competitor comparison data with per-competitor deep dives
- [ ] Handle missing/null fields gracefully (no crashes, meaningful fallbacks)
- [ ] Handle image loading failures with styled placeholders
- [ ] Export filtered data to CSV
- [ ] Use the specified purple dark-mode color palette throughout
- [ ] Be fully responsive (desktop, tablet, mobile)
- [ ] Have smooth transitions and hover effects
- [ ] Include working pagination on list/grid views

---

## Files to Include in Claude Code Session

When starting the Claude Code session, provide:

1. **This specification document** (paste or reference)
2. **The JSON dataset file**: `dataset_linkedin-ad-library-scraper_2026-02-04_00-15-30-136.json`

Claude Code should create the complete project from scratch following this spec, starting with `npm create vite@latest adintel-pro -- --template react`, then implementing each page and component according to the detailed specifications above.

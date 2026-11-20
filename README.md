# Sinovation

Property-operations prototype for tenant feedback, with an AI chatbot and a manager dashboard.

## Overview

Sinovation is a front-end prototype for Sino Group property operations. Tenants report issues through an AI chatbot; managers monitor complaints, review AI recommendations, and import survey data. The app runs entirely in the browser with mock data so stakeholders can walk through the flows without a backend.

## Features

- Tenant chatbot with category classification, risk assessment, and ticket confirmation
- Manager complaint dashboard with filters, timeline, and status updates
- AI recommendation views (strategic, per-ticket, contractor matching, recurrence)
- Analytics dashboard for volume trends, categories, resolution rate, mystery shopper, and CSAT
- CSV import for mystery shopper reports and survey data
- Sino Group branding (dark green and gold), responsive layout

## Stack

- React 18, Vite 4
- Tailwind CSS 3, Recharts 2, Lucide React
- date-fns

## Setup

Requires Node.js 14+ and npm.

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm run preview
```

## Usage

**As a tenant**

1. Open the Chatbot tab
2. Start a conversation and select an issue category
3. Provide unit and details
4. Receive a ticket confirmation

**As a property manager**

1. Browse complaints and filter by category, risk, status, or date
2. Open a complaint for timeline, contacts, and AI suggestions
3. Update status as work progresses
4. Review analytics and recommendations
5. Import external CSVs under Import Data

### Demo scenarios

**Report an AC issue** — Chatbot → “Report an issue” → HVAC → unit `2801` → high-risk ticket.

**Monitor complaints** — Complaints → filter High Risk → open detail → update status → watch the timeline.

**Import and analyse** — Import Data → upload mystery shopper sample → Recommendations for strategic insights.

## Project layout

```
├── public/
├── src/
│   ├── components/
│   │   ├── Analytics.jsx
│   │   ├── ChatBot.jsx
│   │   ├── ComplaintDetail.jsx
│   │   ├── ComplaintsDashboard.jsx
│   │   ├── DataImport.jsx
│   │   ├── Header.jsx
│   │   └── Recommendations.jsx
│   ├── App.jsx
│   ├── mockData.js
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Design

- Colours: dark green `#1a472a`, gold `#d4af37`
- Font: Inter (system fallback)
- Responsive on mobile, tablet, and desktop

## Sample data

The prototype ships with mock complaints, tenants, mystery shopper reports, CSAT surveys, and contractors. Analytics trends are generated in the client. Data stays in `localStorage`; nothing is sent to a server.

## Key flows

**Chatbot** — category → unit/contact → description → classify and score risk → create ticket.

**Complaint lifecycle** — Submitted → Classified → Assigned → In Progress → Resolved → Closed.

**Backend hook-up (future)** — replace `mockData.js` with API calls; keep component props the same. Example endpoints:

```
GET  /api/complaints
POST /api/complaints
GET  /api/complaints/:id
PATCH /api/complaints/:id/status
GET  /api/recommendations
POST /api/import/surveys
POST /api/import/mystery-shopper
GET  /api/analytics/monthly
```

## Browser support

Chrome 90+, Safari 14+, Firefox 88+, Edge 90+.

## License

Provided as-is for Sino Group evaluation.

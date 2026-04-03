# SINO-FAS: Sino Property Intelligent Feedback Analysis System

A complete, professional web prototype for property management feedback analysis, featuring an AI chatbot for tenants, complaint management dashboard for property managers, and AI-powered recommendations system.

## 🎯 Features

### 1. **AI Chatbot** (for Tenants)
- Conversational interface for reporting issues
- Automatic issue classification (HVAC, Plumbing, Cleaning, Wayfinding, Safety, Electrical, Noise)
- Risk level assessment (Low/Medium/High)
- Instant ticket creation with confirmation
- Safety instructions for high-risk issues
- Recurring issue detection

### 2. **Complaint Management Dashboard** (for Property Managers)
- Real-time complaint monitoring
- Advanced filtering by category, risk level, status, and date
- Full complaint details with timeline view
- Tenant contact information
- Dynamic status updates
- Recurring issue alerts
- Safety incident flags
- Robot dispatch status

### 3. **AI Recommendation Engine**
- **Strategic Recommendations**: Pattern analysis and trend-based insights
- **Per-Ticket Recommendations**: Specific action items for each complaint
- **Contractor Matching**: AI-recommended contractors with ratings
- **Recurrence Scoring**: Predicts likelihood of issue reoccurrence
- **Correlation Analysis**: Links external data (surveys, mystery shopper reports) with complaints

### 4. **Analytics Dashboard**
- 12-month complaint volume trends
- Category breakdown with pie charts
- Resolution rate metrics
- Mystery shopper scores (0-100)
- Tenant CSAT scores (0-5)
- Key insights and recommendations

### 5. **Data Import**
- Drag & drop CSV import for mystery shopper reports
- Survey data (CSAT) import
- Automatic AI correlation analysis
- Sample templates provided

## 📋 Prerequisites

- Node.js 14+ and npm
- Modern web browser (Chrome, Safari, Firefox, Edge)

## 🚀 Quick Start

### Installation

```bash
cd sino-fas
npm install
```

### Development Server

```bash
npm run dev
```

The application will automatically open at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
sino-fas/
├── public/
├── src/
│   ├── components/
│   │   ├── Analytics.jsx           # Dashboard with charts & metrics
│   │   ├── ChatBot.jsx             # AI chatbot for tenants
│   │   ├── ComplaintDetail.jsx     # Detailed view of single complaint
│   │   ├── ComplaintsDashboard.jsx # Main complaints table & filtering
│   │   ├── DataImport.jsx          # CSV import interface
│   │   ├── Header.jsx              # Top navigation bar
│   │   └── Recommendations.jsx     # AI recommendations view
│   ├── App.jsx                     # Main app component & routing
│   ├── mockData.js                 # Mock data & sample complaints
│   ├── index.css                   # Global styles
│   └── main.jsx                    # React entry point
├── index.html                      # HTML template
├── package.json                    # Dependencies & scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind styling config
├── postcss.config.js               # PostCSS configuration
└── README.md                       # This file
```

## 🎨 Design & Branding

- **Color Scheme**: Dark green (#1a472a) and gold (#d4af37) (Sino Group brand colors)
- **Font**: Inter (system font as fallback)
- **Design System**: Clean, modern, professional (inspired by wetips.ai)
- **Responsive**: Fully responsive on mobile, tablet, and desktop

## 📊 Sample Data

The prototype includes realistic mock data:

- **5+ Complaints**: Mix of HVAC, plumbing, cleaning, wayfinding, and safety issues
- **3+ Tenants**: Bernice Yau, Chloe Wong, Nitya Kumar (plus 2 more)
- **2 Mystery Shopper Reports**: With scores 75/100 and 82/100
- **2 CSAT Surveys**: With scores 4.2 and 3.8 out of 5
- **5 Contractors**: Pre-configured with specialties and ratings
- **Dynamic Analytics**: Auto-generated monthly trends and insights

## 🔑 Key Components

### Chatbot Flow
1. User initiates complaint
2. Bot asks for category selection
3. Bot requests unit/contact info
4. Bot collects issue description
5. AI automatically classifies and assesses risk
6. Ticket generated and confirmation shown
7. Data pushed to central system

### Complaint Lifecycle
- **Submitted** → **Classified** → **Assigned** → **In Progress** → **Resolved** → **Closed**
- Each status change creates timeline entry
- Managers can update status via dropdown

### AI Analysis
- Pattern recognition from complaint data
- Correlation analysis with external metrics
- Seasonal trend forecasting
- Contractor performance matching
- Risk assessment & prioritization

## 🎮 How to Use

### As a Tenant
1. Click **Chatbot** tab
2. Start conversation with AI
3. Select issue category
4. Provide unit & details
5. Receive ticket confirmation

### As a Property Manager
1. View all complaints in **Complaints** tab
2. Filter by category, risk, status, date
3. Click complaint for full details
4. Update status as work progresses
5. View analytics in **Dashboard** tab
6. Review AI recommendations in **Recommendations** tab
7. Import external data in **Import Data** tab

## 🎯 Extra Polish Features

✅ **Recurrence Alert Badge** - Displayed for assets with 3+ failures
✅ **Safety Incident Flag** - Shows "Potential Safety Incident" for high-risk issues
✅ **Real-time Timeline** - Updates when status changes
✅ **Robot Status Badge** - Shows "Robocore cleaning robot dispatched"
✅ **Sino Brand Colors** - Professional dark green & gold theme
✅ **Responsive Design** - Mobile-first, works on all devices
✅ **Professional UI** - Clean, intuitive, modern interface

## 🔧 Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts 2
- **Icons**: Lucide React
- **Build Tool**: Vite 4
- **Date Handling**: date-fns

## 🎓 Production Readiness

While this is a prototype with mock data, it's structured for easy API integration:

### To Connect to Real Backend:
1. Replace `mockData.js` with API calls
2. Update `App.jsx` state management to use real endpoints
3. Replace mock contractors with database queries
4. Connect chatbot to LLM service (OpenAI, Claude, etc.)
5. Implement real file upload to backend

All components are designed to accept real data without code changes.

## 📝 Sample API Endpoints (for future implementation)

```
GET  /api/complaints              # Fetch all complaints
POST /api/complaints              # Create new complaint
GET  /api/complaints/:id          # Get complaint details
PATCH /api/complaints/:id/status  # Update complaint status
GET  /api/recommendations         # Fetch AI recommendations
POST /api/import/surveys          # Import survey data
POST /api/import/mystery-shopper  # Import shopper reports
GET  /api/analytics/monthly       # Monthly analytics data
```

## 🤝 Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## 📄 License

This prototype is provided as-is for Sino Group evaluation.

## 🎬 Demo Scenarios

### Scenario 1: Report AC Issue
1. Click Chatbot tab
2. Say "Report an issue"
3. Select "HVAC / Climate Control"
4. Enter unit "2801"
5. Describe "AC stopped working 3 days ago"
6. Receive High Risk ticket

### Scenario 2: Monitor Complaints
1. Go to Complaints tab
2. Filter by "High Risk"
3. Click complaint to view details
4. See AI recommendation & contractor
5. Update status to "Assigned"
6. Watch timeline update in real-time

### Scenario 3: Import Data & Analyze
1. Go to Import Data tab
2. Download mystery shopper template
3. Upload sample data
4. Go to Recommendations tab
5. See AI-generated strategic insights

## 🔐 Data Privacy

All data is stored in-browser (localStorage). No data is transmitted. For production:
- Implement secure authentication
- Use encrypted data transmission (HTTPS)
- Follow GDPR/PDPA compliance
- Implement proper access controls

## 📞 Support

For questions or issues with the prototype, refer to the code comments throughout the component files.

---

**Built with ❤️ for Sino Group - Property Management Excellence**

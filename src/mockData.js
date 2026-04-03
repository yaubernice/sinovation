// Mock data for SINO-FAS system - Enhanced with Rich Data

export const TENANTS = [
  { id: 'T001', name: 'Bernice Yau', unit: '2801', email: 'bernice@example.com', phone: '9123 4567', tier: 'Premium' },
  { id: 'T002', name: 'Chloe Wong', unit: '1502', email: 'chloe@example.com', phone: '9234 5678', tier: 'Standard' },
  { id: 'T003', name: 'Nitya Kumar', unit: '3201', email: 'nitya@example.com', phone: '9345 6789', tier: 'Premium' },
  { id: 'T004', name: 'David Chen', unit: '2102', email: 'david@example.com', phone: '9456 7890', tier: 'Standard' },
  { id: 'T005', name: 'Emma Martinez', unit: '1801', email: 'emma@example.com', phone: '9567 8901', tier: 'Standard' },
  { id: 'T006', name: 'James Wilson', unit: '3102', email: 'james@example.com', phone: '9678 9012', tier: 'Premium' },
  { id: 'T007', name: 'Lisa Park', unit: '2205', email: 'lisa@example.com', phone: '9789 0123', tier: 'Standard' },
  { id: 'T008', name: 'Michael Brown', unit: '1805', email: 'michael@example.com', phone: '9890 1234', tier: 'Standard' },
  { id: 'T009', name: 'Sarah Johnson', unit: '2512', email: 'sarah@example.com', phone: '9901 2345', tier: 'Premium' },
  { id: 'T010', name: 'Robert Lee', unit: '3005', email: 'robert@example.com', phone: '8012 3456', tier: 'Standard' },
]

export const CATEGORIES = {
  HVAC: { label: 'HVAC / Climate Control', icon: '❄️', keywords: ['cold', 'hot', 'temperature', 'cool', 'ac', 'heat', 'thermostat', 'fan'] },
  PLUMBING: { label: 'Plumbing / Water', icon: '🚿', keywords: ['water', 'leak', 'drain', 'pipe', 'tap', 'flush', 'wetness'] },
  CLEANING: { label: 'Cleaning / Maintenance', icon: '🧹', keywords: ['clean', 'dirty', 'dust', 'mess', 'trash', 'smell', 'odor', 'stain'] },
  WAYFINDING: { label: 'Wayfinding / Navigation', icon: '🗺️', keywords: ['sign', 'direction', 'navigate', 'find', 'locate', 'entrance', 'exit'] },
  SAFETY: { label: 'Safety / Security', icon: '🔒', keywords: ['safe', 'fire', 'alarm', 'hazard', 'risk', 'security', 'emergency'] },
  ELECTRICAL: { label: 'Electrical / Power', icon: '⚡', keywords: ['light', 'power', 'electric', 'outlet', 'switch', 'flickering', 'dark'] },
  NOISE: { label: 'Noise / Disturbance', icon: '🔊', keywords: ['noise', 'loud', 'sound', 'quiet', 'music', 'vibration', 'construction'] },
  PEST: { label: 'Pest / Infestation', icon: '🐛', keywords: ['pest', 'insect', 'cockroach', 'rat', 'mouse', 'bug', 'infestation'] },
  PARKING: { label: 'Parking / Vehicle', icon: '🚗', keywords: ['parking', 'car', 'space', 'vehicle', 'permit', 'reserved'] },
}

export const CONTRACTORS = [
  { id: 'C001', name: 'CoolTech HVAC Solutions', specialty: 'HVAC', rating: 4.8, phone: '8765 4321', email: 'contact@cooltech.com', availability: 'Available', avgResponseTime: '2 hrs', certifications: ['EPA Certified', 'ASHRAE'] },
  { id: 'C002', name: 'FlowPro Expert Plumbing', specialty: 'PLUMBING', rating: 4.6, phone: '8765 4322', email: 'contact@flowpro.com', availability: 'Available', avgResponseTime: '1.5 hrs', certifications: ['Licensed', 'Insured'] },
  { id: 'C003', name: 'SafeGuard Security & Fire', specialty: 'SAFETY', rating: 4.7, phone: '8765 4323', email: 'contact@safeguard.com', availability: 'On Site', avgResponseTime: '30 min', certifications: ['Fire Certified', 'Security Licensed'] },
  { id: 'C004', name: 'PureClean Maintenance Co', specialty: 'CLEANING', rating: 4.5, phone: '8765 4324', email: 'contact@pureclean.com', availability: 'Available', avgResponseTime: '4 hrs', certifications: ['Green Certified', 'ISO 9001'] },
  { id: 'C005', name: 'ElectriCare Professional', specialty: 'ELECTRICAL', rating: 4.9, phone: '8765 4325', email: 'contact@electricare.com', availability: 'Available', avgResponseTime: '2.5 hrs', certifications: ['Master Electrician', 'Licensed'] },
  { id: 'C006', name: 'Pest Shield Solutions', specialty: 'PEST', rating: 4.4, phone: '8765 4326', email: 'contact@pestshield.com', availability: 'Available', avgResponseTime: '3 hrs', certifications: ['EPA Registered', 'Organic Option'] },
  { id: 'C007', name: 'Parking Pro Management', specialty: 'PARKING', rating: 4.3, phone: '8765 4327', email: 'contact@parkingpro.com', availability: 'Available', avgResponseTime: '1 hr', certifications: ['Professional License', 'Insured'] },
  { id: 'C008', name: 'Elite Sound Control', specialty: 'NOISE', rating: 4.6, phone: '8765 4328', email: 'contact@elitesound.com', availability: 'Available', avgResponseTime: '5 hrs', certifications: ['Acoustic Specialist', 'Insulated'] },
  { id: 'C009', name: 'WAY Sign Design Co', specialty: 'WAYFINDING', rating: 4.2, phone: '8765 4329', email: 'contact@waysign.com', availability: 'Available', avgResponseTime: '24 hrs', certifications: ['Design Certified', 'ADA Compliant'] },
  { id: 'C010', name: 'ThermalTech HVAC Plus', specialty: 'HVAC', rating: 4.7, phone: '8765 4330', email: 'contact@thermaltech.com', availability: 'Available', avgResponseTime: '3 hrs', certifications: ['NATE Certified'] },
]

// AI Categorization Engine
export const categorizeComplaint = (description) => {
  const desc = description.toLowerCase()
  const scores = {}
  
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    scores[key] = cat.keywords.filter(keyword => desc.includes(keyword)).length
  })
  
  const maxScore = Math.max(...Object.values(scores))
  const bestMatch = Object.entries(scores).find(([_, score]) => score === maxScore && score > 0)
  
  return bestMatch ? bestMatch[0] : 'OTHER'
}

// Enhanced Complaint Generation  
const createEnhancedComplaint = (id, tenant, category, title, description, severity, dayOffset, hourOffset, status, recurring = false, resolution = null) => {
  const date = new Date()
  date.setDate(date.getDate() - dayOffset)
  date.setHours(date.getHours() - hourOffset)
  date.setMinutes(Math.floor(Math.random() * 60))
  
  return {
    id,
    tenantId: tenant.id,
    tenantName: tenant.name,
    tenantUnit: tenant.unit,
    tenantTier: tenant.tier,
    tenantEmail: tenant.email,
    category,
    title,
    description,
    riskLevel: severity,
    status,
    timestamp: date,
    responseTime: Math.floor(Math.random() * 480 + 30),
    resolutionTime: resolution || Math.floor(Math.random() * 5 * 24 * 60),
    aiSuggestion: generateAISuggestion(category, severity),
    recommendedContractor: getRecommendedContractor(category),
    alternateContractors: getAlternateContractors(category, 2),
    recurrenceScore: recurring ? 85 + Math.random() * 15 : Math.random() * 30,
    isRecurring: recurring,
    priority: severity === 'High' ? '1-Critical' : severity === 'Medium' ? '2-High' : '3-Normal',
    ticketHistory: generateTicketHistory(status, date),
    attachments: Math.random() > 0.7 ? Math.floor(Math.random() * 3 + 1) : 0,
    satisfactionRating: status === 'Closed' || status === 'Resolved' ? Math.random() * 2 + 3 : null,
  }
}

const generateAISuggestion = (category, severity) => {
  const suggestions = {
    HVAC: severity === 'High' 
      ? '🔴 CRITICAL: Assign CoolTech HVAC immediately. Possible refrigerant leak. Health hazard. ETA: 4-6 hours.'
      : '🟡 Schedule maintenance within 48hrs. Check thermostat calibration.',
    PLUMBING: severity === 'High'
      ? '🔴 CRITICAL: Emergency plumber needed NOW. Water damage risk. Est. savings: $10k+ damage prevention.'
      : '🟡 Inspect within 24hrs. Monitor closely.',
    CLEANING: '🟢 Extra cleaning 7-9am, 5-7pm. Update protocol for this area. Impact: High satisfaction.',
    WAYFINDING: '🟡 Add A-frame signage + digital nav update. Low cost, high impact.',
    SAFETY: severity === 'High'
      ? '🔴 CRITICAL: Fire team now. Compliance audit required. Regulatory mandatory.'
      : '🟡 Security review. Schedule quarterly drill.',
    ELECTRICAL: '🔴 CRITICAL: Electrical inspection within 24hrs. Fire hazard. Cost: $200-400.',
    NOISE: '🟡 Investigate source. May need soundproofing. Coordination with ops needed.',
    PEST: severity === 'High'
      ? '🔴 CRITICAL: Pest control NOW. Health hazard. Notify adjacent units.'
      : '🟡 Routine service needed. Preventive treatment recommended.',
    PARKING: '🟢 Verify permit. Resolve in 48hrs. Tenant satisfaction critical.',
  }
  return suggestions[category] || '🟡 Review and assess.'
}

const getRecommendedContractor = (category) => {
  const mapping = {
    HVAC: CONTRACTORS[0],
    PLUMBING: CONTRACTORS[1],
    SAFETY: CONTRACTORS[2],
    CLEANING: CONTRACTORS[3],
    ELECTRICAL: CONTRACTORS[4],
    PEST: CONTRACTORS[5],
    PARKING: CONTRACTORS[6],
    NOISE: CONTRACTORS[7],
    WAYFINDING: CONTRACTORS[8],
  }
  return mapping[category] || CONTRACTORS[0]
}

const getAlternateContractors = (category, count) => {
  const contractor = getRecommendedContractor(category)
  return CONTRACTORS.filter(c => c.specialty === category && c.id !== contractor.id).slice(0, count)
}

const generateTicketHistory = (status, date) => {
  const history = [
    { status: 'Submitted', timestamp: date, action: 'Complaint filed by tenant', icon: '📝' }
  ]
  
  if (status !== 'Submitted') {
    const date2 = new Date(date)
    date2.setHours(date2.getHours() + 0.5 + Math.random() * 2)
    history.push({ status: 'Classified', timestamp: date2, action: 'AI categorization complete', icon: '🤖' })
  }
  
  if (['Assigned', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
    const date3 = new Date(date)
    date3.setHours(date3.getHours() + (2 + Math.random() * 4))
    history.push({ status: 'Assigned', timestamp: date3, action: 'Contractor assigned', icon: '👷' })
  }
  
  if (['In Progress', 'Resolved', 'Closed'].includes(status)) {
    const date4 = new Date(date)
    date4.setDate(date4.getDate() + (0.5 + Math.random() * 1.5))
    history.push({ status: 'In Progress', timestamp: date4, action: 'Work started on-site', icon: '⚙️' })
  }
  
  if (['Resolved', 'Closed'].includes(status)) {
    const date5 = new Date(date)
    date5.setDate(date5.getDate() + (1 + Math.random() * 2))
    history.push({ status: 'Resolved', timestamp: date5, action: 'Issue resolved & verified', icon: '✅' })
  }
  
  if (status === 'Closed') {
    const date6 = new Date(date)
    date6.setDate(date6.getDate() + (2 + Math.random() * 2))
    history.push({ status: 'Closed', timestamp: date6, action: 'Ticket closed - Survey sent', icon: '📊' })
  }
  
  return history
}

export const COMPLAINTS = [
  createEnhancedComplaint('TK-2024-0001', TENANTS[0], 'HVAC', 'AC unit not cooling properly', 'Living room AC stopped working. Temperature at 28°C. Unit responsive but cold air weak. Grinding noise from unit.', 'High', 3, 14, 'In Progress', true, 480),
  createEnhancedComplaint('TK-2024-0002', TENANTS[1], 'PLUMBING', 'Water leak in bathroom ceiling', 'Water dripping from bathroom ceiling near toilet. Wet spot on floor expanding. Possible pipe burst. Water damage visible.', 'High', 5, 8, 'Assigned', false, 1440),
  createEnhancedComplaint('TK-2024-0003', TENANTS[2], 'CLEANING', 'Restroom maintains persistent odor', 'Common area restroom foul smell. Not usual sanitation level. Suggests sewage issue or improper cleaning.', 'Medium', 3, 10, 'Classified', false, null),
  createEnhancedComplaint('TK-2024-0004', TENANTS[3], 'WAYFINDING', 'Unclear restaurant entrance signage', 'Tenant confused about F&B zone location from lobby. Signage missing or unclear. Navigation app needs update.', 'Low', 2, 15, 'Resolved', false, 1920),
  createEnhancedComplaint('TK-2024-0005', TENANTS[4], 'SAFETY', 'Fire alarm showing irregular beeping', 'Fire alarm beeping intermittently. Last test 6 months ago. Potential malfunction. Emergency response concern.', 'High', 1, 9, 'Submitted', false, null),
  createEnhancedComplaint('TK-2024-0006', TENANTS[5], 'ELECTRICAL', 'Hallway lights flickering on 28th floor', 'Multiple hallway lights flickering every 10-15 seconds. Possible electrical short or loose connection. Safety concern.', 'Medium', 4, 7, 'Resolved', true, 2880),
  createEnhancedComplaint('TK-2024-0007', TENANTS[0], 'NOISE', 'Early morning construction noise disturbance', 'Loud renovation noise from floor below starting at 6am. Violates quiet hours. Disrupts sleep and work-from-home.', 'Medium', 2, 6, 'Assigned', false, null),
  createEnhancedComplaint('TK-2024-0008', TENANTS[1], 'CLEANING', 'Elevator 5 cleanliness problem', 'Elevator has stains, puddles, and food odor. Needs deep cleaning immediately. Poor maintenance reflection.', 'Low', 4, 12, 'Classified', false, null),
  createEnhancedComplaint('TK-2024-0009', TENANTS[2], 'PLUMBING', 'Slow kitchen sink drainage', 'Kitchen sink drains very slowly. Possible main line buildup or unit-level clog. Worsening daily.', 'Medium', 6, 11, 'In Progress', false, 720),
  createEnhancedComplaint('TK-2024-0010', TENANTS[3], 'PEST', 'Cockroach spotted in unit kitchen', 'Saw 2-3 cockroaches in kitchen. First occurrence. Infestation concern. Premium unit unexpected.', 'High', 1, 19, 'Assigned', false, null),
  createEnhancedComplaint('TK-2024-0011', TENANTS[4], 'HVAC', 'Bedroom AC making loud noise', 'AC unit produces loud squeaking/grinding when running. Possible mechanical failure. Disruptive at night.', 'Medium', 5, 18, 'Classified', false, null),
  createEnhancedComplaint('TK-2024-0012', TENANTS[5], 'PARKING', 'Assigned parking space occupied', 'Designated space A-128 occupied by unauthorized vehicle. No permit visible. Security unresponsive.', 'Medium', 2, 13, 'Resolved', false, 180),
  createEnhancedComplaint('TK-2024-0013', TENANTS[6], 'ELECTRICAL', 'Living room outlet not working', 'Power outlet fails intermittently. Affects TV/entertainment system. Possible circuit issue.', 'Low', 3, 14, 'Assigned', false, null),
  createEnhancedComplaint('TK-2024-0014', TENANTS[7], 'SAFETY', 'Emergency exit door difficult to open', 'Stairwell emergency exit on 15th floor difficult to push. Possible mechanical issue. Fire code concern.', 'High', 1, 10, 'In Progress', false, 240),
  createEnhancedComplaint('TK-2024-0015', TENANTS[8], 'NOISE', 'Late night disturbance from adjacent unit', 'Repeated loud noise from next door around 11pm-12am daily. Music/TV. Violates quiet hours.', 'Medium', 4, 23, 'Submitted', false, null),
  createEnhancedComplaint('TK-2024-0016', TENANTS[9], 'CLEANING', 'Common corridor dusty and dirty', 'Corridor on 20th floor not maintained. Visible dust on baseboards. Weekly schedule not followed.', 'Low', 5, 9, 'Classified', false, null),
  createEnhancedComplaint('TK-2024-0017', TENANTS[0], 'HVAC', 'Heat not reaching upper floors consistently', 'Upper floors reporting inadequate heating. Temperature 2-3°C below setting. Central system issue suspected.', 'High', 6, 20, 'Assigned', true, null),
  createEnhancedComplaint('TK-2024-0018', TENANTS[1], 'PLUMBING', 'Bathroom toilet running constantly', 'Toilet continues running after flush. Wasting water. 2-3 liters/minute waste.', 'Medium', 3, 16, 'Resolved', false, 300),
]

// Mystery Shopper Reports
export const MYSTERY_SHOPPER_REPORTS = [
  {
    id: 'MS-2024-001',
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
    location: 'Sino Tower Main Lobby', 
    score: 75,
    maxScore: 100,
    areas: {
      cleanliness: 70,
      signage: 65,
      staffHelpfulness: 85,
      amenities: 80,
      safety: 78,
    },
    feedback: 'Lobby clean but F&B signage needs improvement. Staff helpful. Some amenities need maintenance.',
    issues: ['Poor wayfinding signage', 'Elevator 2 smell', 'Board outdated'],
    actionItems: ['Update signage - $500', 'Deep clean elevators - $800', 'Update board - In progress']
  },
  {
    id: 'MS-2024-002',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    location: 'Sino Tower Common Areas',
    score: 82,
    maxScore: 100,
    areas: {
      cleanliness: 85,
      signage: 80,
      staffHelpfulness: 90,
      amenities: 75,
      safety: 88,
    },
    feedback: 'Good experience. Amenities maintained. Security responsive. Focus on cleaning consistency.',
    issues: [],
    actionItems: []
  },
]

// CSAT Surveys
export const SURVEYS = [
  {
    id: 'SURVEY-2024-001',
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    score: 4.2,
    maxScore: 5,
    respondents: 45,
    resolution: 'Complaints resolved',
    factors: {
      responseTime: 3.8,
      professionalism: 4.4,
      effectivenessSolution: 4.1,
      communication: 4.0,
    },
    comments: 'Satisfied but AC issues concerning. Good response time. Staff courteous.',
    trends: 'Upward trend'
  },
  {
    id: 'SURVEY-2024-002',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    score: 3.8,
    maxScore: 5,
    respondents: 52,
    resolution: 'Current period',
    factors: {
      responseTime: 3.9,
      professionalism: 4.2,
      effectivenessSolution: 3.6,
      communication: 3.9,
    },
    comments: 'Good service but faster response needed. More transparency on resolution timeline.',
    trends: 'Slight decline'
  },
]

// Analytics & Recommendations Engine
export const generateRecommendations = (complaints) => {
  const categoryCount = {}
  const statusCount = {}
  let highRiskCount = 0
  let totalResolutionTime = 0
  let resolvedCount = 0
  const categoryByRisk = {}
  
  complaints.forEach(c => {
    categoryCount[c.category] = (categoryCount[c.category] || 0) + 1
    statusCount[c.status] = (statusCount[c.status] || 0) + 1
    if (c.riskLevel === 'High') highRiskCount++
    if ((c.status === 'Resolved' || c.status === 'Closed') && c.resolutionTime) {
      resolvedCount++
      totalResolutionTime += c.resolutionTime
    }
    if (!categoryByRisk[c.category]) categoryByRisk[c.category] = { high: 0, med: 0, low: 0 }
    if (c.riskLevel === 'High') categoryByRisk[c.category].high++
    else if (c.riskLevel === 'Medium') categoryByRisk[c.category].med++
    else categoryByRisk[c.category].low++
  })
  
  const avgResolution = resolvedCount > 0 ? Math.round(totalResolutionTime / resolvedCount / 24 / 60) : 0
  const recommendations = []
  
  if (categoryCount.CLEANING >= 2) {
    recommendations.push({
      id: 'REC-001',
      type: 'strategic',
      severity: 'Medium',
      title: '🧹 Optimize Cleaning Schedule',
      description: `${categoryCount.CLEANING} cleaning complaints. 80% during peak hours (7-9am, 5-7pm). Recommend dynamic scheduling with 3x daily deep clean.`,
      impact: 'Reduce cleaning complaints 25-35%, +0.4 mystery shopper score',
      actionItems: ['Hire 2 cleaners', 'Zone-based cleaning', 'Daily audits'],
      budget: '$15,000/month',
      approved: false,
      timeline: '2 weeks',
    })
  }
  
  if (categoryCount.HVAC >= 2) {
    const hvacHighRisk = categoryByRisk.HVAC?.high || 0
    recommendations.push({
      id: 'REC-002',
      type: 'strategic',
      severity: 'High',
      title: '❄️ Preventive HVAC Maintenance',
      description: `${categoryCount.HVAC} HVAC issues, ${hvacHighRisk} High-risk. Emergency repair: $1,500-3,000 vs $200/month preventive.`,
      impact: 'Reduce incidents 60%, save $400k/year, +0.5 satisfaction',
      actionItems: ['Quarterly HVAC service', 'IoT sensors', 'Tenant education'],
      budget: '$2,400/year',
      approved: false,
      timeline: '1 week',
    })
  }
  
  if (categoryCount.SAFETY >= 1) {
    recommendations.push({
      id: 'REC-003',
      type: 'strategic',
      severity: 'Critical',
      title: '🔒 Comprehensive Safety Audit',
      description: `${categoryCount.SAFETY} safety issues. Fire alarm + emergency exit concerns. Regulatory compliance at risk.`,
      impact: 'Ensure compliance, reduce liability, +20% safety score',
      actionItems: ['Full audit', 'Monthly drills', 'Fix exits 24hrs'],
      budget: '$5,000 audit + $2,000/month',
      approved: false,
      timeline: '48 hours',
    })
  }
  
  if (categoryCount.NOISE >= 1) {
    recommendations.push({
      id: 'REC-004',
      type: 'strategic',
      severity: 'Medium',
      title: '🔊 Noise Management Protocol',
      description: `${categoryCount.NOISE} noise complaints. Enforce quiet hours + soundproofing consultations.`,
      impact: 'Better satisfaction, fewer incidents',
      actionItems: ['Enforce 10pm-8am', 'Soundproofing consultations', 'Elite Sound Control assessments'],
      budget: '$8,000-12,000/unit',
      approved: false,
      timeline: '3 weeks',
    })
  }
  
  if (avgResolution > 3) {
    recommendations.push({
      id: 'REC-005',
      type: 'operational',
      severity: 'High',
      title: '⚡ Improve Resolution Time',
      description: `Current avg: ${avgResolution} days. Target: 2 days (High), 4 days (Medium). Implement SLA tracking + dedicated team.`,
      impact: 'Faster resolution, +0.5-1.0 CSAT',
      actionItems: ['SLA tracking', 'Hot Issues team', 'Contractor bonuses'],
      budget: '$5,000/month',
      approved: false,
      timeline: 'Immediate',
    })
  }
  
  return recommendations
}

// Advanced Analytics Data - Week Trends
export const generateWeeklyAnalytics = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = new Date()
  return days.map((day, idx) => {
    const dayDate = new Date(today)
    dayDate.setDate(dayDate.getDate() - (6 - idx))
    return {
      day,
      date: dayDate.toLocaleDateString(),
      submitted: Math.floor(Math.random() * 8 + 3),
      resolved: Math.floor(Math.random() * 6 + 2),
      avgResponseTime: Math.floor(Math.random() * 120 + 60),
      satisfaction: (Math.random() * 1.2 + 3.8).toFixed(1),
    }
  })
}

// Category Trend Data
export const generateCategoryTrends = () => {
  return [
    { name: 'HVAC', thisWeek: 5, lastWeek: 3, trend: '+67%', fill: '#ff6b6b' },
    { name: 'Plumbing', thisWeek: 3, lastWeek: 2, trend: '+50%', fill: '#4ecdc4' },
    { name: 'Cleaning', thisWeek: 4, lastWeek: 4, trend: 'stable', fill: '#45b7d1' },
    { name: 'Safety', thisWeek: 2, lastWeek: 1, trend: '+100%', fill: '#f59e0b' },
    { name: 'Electrical', thisWeek: 2, lastWeek: 1, trend: '+100%', fill: '#9f7aea' },
    { name: 'Noise', thisWeek: 2, lastWeek: 2, trend: 'stable', fill: '#fb7185' },
    { name: 'Parking', thisWeek: 1, lastWeek: 0, trend: '+∞', fill: '#84cc16' },
    { name: 'Pest', thisWeek: 1, lastWeek: 1, trend: 'stable', fill: '#a78bfa' },
  ]
}

// Category breakdown for pie chart
export const generateCategoryBreakdown = () => {
  return [
    { name: 'HVAC', value: 28, fill: '#ff6b6b' },
    { name: 'Plumbing', value: 17, fill: '#4ecdc4' },
    { name: 'Cleaning', value: 22, fill: '#45b7d1' },
    { name: 'Safety', value: 11, fill: '#f59e0b' },
    { name: 'Electrical', value: 11, fill: '#9f7aea' },
    { name: 'Noise', value: 6, fill: '#fb7185' },
    { name: 'Other', value: 5, fill: '#98a7a0' },
  ]
}

// Time to Resolution Distribution
export const generateResolutionTimeData = () => {
  return [
    { name: '<2hrs', count: 3, percentage: 15 },
    { name: '2-4hrs', count: 5, percentage: 25 },
    { name: '4-8hrs', count: 4, percentage: 20 },
    { name: '1day', count: 5, percentage: 25 },
    { name: '2-3days', count: 2, percentage: 10 },
    { name: '3+days', count: 1, percentage: 5 },
  ]
}

// High-risk correlations
export const generateCorrelations = () => {
  return [
    { factor: 'Temperature > 30°C', correlation: 'HVAC +85%', severity: 'High' },
    { factor: 'Rainy weather', correlation: 'Plumbing +45%', severity: 'Medium' },
    { factor: 'Weekend evenings', correlation: 'Noise +75%', severity: 'High' },
    { factor: 'Month-end', correlation: 'Maintenance +30%', severity: 'Medium' },
    { factor: 'Building age 10+yrs', correlation: 'Electrical +60%', severity: 'High' },
  ]
}

// Customer Feedback Survey Data - REALISTIC
export const FEEDBACK_SURVEYS = [
  {
    id: 'FB-2024-001',
    date: '2024-03-15',
    rating: 4.5,
    satisfaction_score: 88,
    category: 'HVAC',
    mystery_shopper_notes: 'HVAC maintenance slow but effective. Response time 3.5 hours acceptable. Unit now functioning at normal capacity. Building temp control adequate.',
    sentiment: 'positive'
  },
  {
    id: 'FB-2024-002',
    date: '2024-03-14',
    rating: 3.2,
    satisfaction_score: 62,
    category: 'PLUMBING',
    mystery_shopper_notes: 'Plumbing response delayed 6 hours. Water damage risk high. Contractor unprepared for emergency. Better inventory planning needed. Cost: $1200.',
    sentiment: 'negative'
  },
  {
    id: 'FB-2024-003',
    date: '2024-03-13',
    rating: 4.8,
    satisfaction_score: 95,
    category: 'CLEANING',
    mystery_shopper_notes: 'Cleaning crew professional and efficient. Extra attention to detail. Restroom spotless. Staff courteous. Preventive maintenance visible.',
    sentiment: 'positive'
  },
  {
    id: 'FB-2024-004',
    date: '2024-03-12',
    rating: 2.1,
    satisfaction_score: 35,
    category: 'SAFETY',
    mystery_shopper_notes: 'Fire alarm maintenance inadequate. Emergency drill findings concerning. Security protocol outdated. Staff training required urgently. Compliance risk.'
  ,
    sentiment: 'critical'
  },
  {
    id: 'FB-2024-005',
    date: '2024-03-11',
    rating: 4.2,
    satisfaction_score: 82,
    category: 'ELECTRICAL',
    mystery_shopper_notes: 'Electrical repair prompt. Electrician knowledgeable. Work quality professional. Testing done thoroughly before handoff. Premium service.',
    sentiment: 'positive'
  },
  {
    id: 'FB-2024-006',
    date: '2024-03-10',
    rating: 3.5,
    satisfaction_score: 68,
    category: 'NOISE',
    mystery_shopper_notes: 'Noise complaint from tenant. Enforcement of quiet hours inconsistent. Soundproofing consultation offered but not followed up. Needs accountability.',
    sentiment: 'neutral'
  },
  {
    id: 'FB-2024-007',
    date: '2024-03-09',
    rating: 4.7,
    satisfaction_score: 92,
    category: 'PEST',
    mystery_shopper_notes: 'Pest control thorough. Preventive treatment applied. Crew professional and courteous. Follow-up inspection scheduled. Zero complaints.',
    sentiment: 'positive'
  },
  {
    id: 'FB-2024-008',
    date: '2024-03-08',
    rating: 4.1,
    satisfaction_score: 80,
    category: 'WAYFINDING',
    mystery_shopper_notes: 'New signage installed. Much clearer navigation. Digital display updated. Tenant feedback positive. Recommend similar updates for other zones.',
    sentiment: 'positive'
  },
  {
    id: 'FB-2024-009',
    date: '2024-03-07',
    rating: 3.8,
    satisfaction_score: 72,
    category: 'PARKING',
    mystery_shopper_notes: 'Parking management improved. Permits now tracked properly. One unauthorized vehicle issue resolved quickly. System working but needs monitoring.',
    sentiment: 'positive'
  },
  {
    id: 'FB-2024-010',
    date: '2024-03-06',
    rating: 4.3,
    satisfaction_score: 85,
    category: 'HVAC',
    mystery_shopper_notes: 'AC unit upgraded successfully. Energy consumption down 20%. Noise level reduced significantly. Tenant very satisfied with installation quality.',
    sentiment: 'positive'
  },
  {
    id: 'FB-2024-011',
    date: '2024-03-05',
    rating: 2.8,
    satisfaction_score: 52,
    category: 'CLEANING',
    mystery_shopper_notes: 'Cleaning schedule missed 2 days this week. Corridor dusty, bathrooms not stocked. Staff shortage visible. Need backup crew for peak periods.',
    sentiment: 'negative'
  },
  {
    id: 'FB-2024-012',
    date: '2024-03-04',
    rating: 4.6,
    satisfaction_score: 90,
    category: 'ELECTRICAL',
    mystery_shopper_notes: 'Complete electrical audit ordered. Identified 3 potential hazards. Corrective measures scheduled. ProActive approach appreciated by management.',
    sentiment: 'positive'
  },
]

// AI Response Generator - Uses DeepSeek API or intelligent fallbacks
export const generateAIAnalysis = async (complaint) => {
  const analysisPrompts = {
    HVAC: `A tenant reported: "${complaint.description}". As a facility management expert, provide:
1. Root cause analysis
2. Immediate action
3. Preventive measure
4. Estimated cost
Keep response concise and actionable.`,
    
    PLUMBING: `Water/plumbing issue: "${complaint.description}". Provide:
1. Severity assessment
2. Emergency procedure
3. Contractor recommendation
4. Tenant actions to take immediately
Be clear and helpful.`,
    
    SAFETY: `Safety concern: "${complaint.description}". Analyze:
1. Regulatory compliance status
2. Immediate action required
3. Risk mitigation
4. Documentation needed
Be thorough and professional.`,
    
    CLEANING: `Maintenance issue: "${complaint.description}". Suggest:
1. Root cause
2. Cleaning protocol adjustment
3. Staff training focus
4. Prevention strategy
Make it practical.`,
    
    ELECTRICAL: `Electrical issue: "${complaint.description}". Provide:
1. Safety assessment
2. Qualified contractor needs
3. Timeline to fix
4. Preventive maintenance
Be specific and safe.`,
    
    PEST: `Pest concern: "${complaint.description}". Analyze:
1. Infestation severity
2. Treatment approach
3. Prevention measures
4. Timeline
Be thorough and clear.`,
    
    NOISE: `Noise complaint: "${complaint.description}". Suggest:
1. Sound source location
2. Enforcement action
3. Permanent solution
4. Tenant communication
Make recommendations.`,
    
    PARKING: `Parking issue: "${complaint.description}". Provide:
1. Policy clarification
2. Resolution
3. Prevention
4. Timeline
Keep it straightforward.`,
    
    WAYFINDING: `Navigation issue: "${complaint.description}". Recommend:
1. Signage improvements
2. Digital nav updates
3. Staff training
4. Cost estimate
Be practical.`,
  }
  
  return analysisPrompts[complaint.category] || 'Please provide more details about the issue for analysis.'
}

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { BarChart3, ClipboardList, Lightbulb, Menu, X, LogOut, Download, TrendingUp, Users, AlertCircle, Phone, Mail, Star, Clock, LogIn, UserPlus, Eye, EyeOff, CheckCircle, AlertTriangle, Zap, FileText, LineChart as LineIcon, Send, MessageCircle, Settings, ChevronDown, Filter, Calendar, TrendingDown, Activity, MapPin, Loader, Image as ImageIcon, ExternalLink, ThumbsUp, ThumbsDown, User, Award, Briefcase, Target, TrendingUp as TrendUp, BarChart3 as BarIcon, Upload, Zap as Spark, Flame, Brain, Lightbulb as LightBulbIcon, TrendingUpIcon, BarChart2, PieChart as PieChartIcon, Wrench } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart } from 'recharts'
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from 'chart.js'
import { Doughnut, Bar as ChartJSBar, Line as ChartJSLine, PolarArea, Radar as ChartJSRadar } from 'react-chartjs-2'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { motion, AnimatePresence } from 'framer-motion'
import { COMPLAINTS, CATEGORIES, TENANTS, CONTRACTORS, generateRecommendations, generateWeeklyAnalytics, generateCategoryBreakdown, generateCategoryTrends, generateResolutionTimeData, generateCorrelations, categorizeComplaint, FEEDBACK_SURVEYS, MYSTERY_SHOPPER_REPORTS, SURVEYS, generateAIAnalysis } from './mockData'

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler)

const THEME = {
  primary: '#2c5aa0',
  secondary: '#4a7ba7',
  accent: '#0f3460',
  dark: '#0a1929',
  light: '#e8eef7',
  lightBg: '#f5f8fc',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#1f2937',
  border: '#d1d5db',
}

// Advanced AI Integration - DeepSeek with Intelligent Fallbacks & Retry Logic
const callOpenRouterAPI = async (message, retryCount = 0) => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout for OpenRouter
    
    console.log('🔄 Calling OpenRouter API with message:', message.substring(0, 50))
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://sino-fas.vercel.app',
        'X-Title': 'SINO-FAS Property Management',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [{ 
          role: 'user', 
          content: message
        }],
        temperature: 0.8,
        max_tokens: 2000,
        top_p: 0.95,
        top_k: 40,
        frequency_penalty: 0.5,
        presence_penalty: 0.1
      }),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    console.log('📡 OpenRouter Response Status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ OpenRouter API Error - Status:', response.status)
      console.error('❌ Error Details:', errorText)
      console.error('❌ API Key Used: REDACTED')
      
      if (retryCount < 2 && (response.status >= 500 || response.status === 429)) {
        console.log(`🔄 Retry attempt ${retryCount + 1}/2 for OpenRouter API...`)
        await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)))
        return callOpenRouterAPI(message, retryCount + 1)
      }
      
      const errorMsg = `OpenRouter Error ${response.status}`
      console.error('🛑 Fallback triggered:', errorMsg)
      throw new Error(errorMsg)
    }
    
    const data = await response.json()
    console.log('✅ OpenRouter API Success!')
    console.log('📊 Full Response:', JSON.stringify(data, null, 2))
    console.log('📊 Response preview:', data.choices?.[0]?.message?.content?.substring(0, 150))
    
    const content = data.choices?.[0]?.message?.content?.trim()
    
    if (!content) {
      console.error('❌ No content in API response:', data)
      throw new Error('API returned empty content')
    }
    
    if (content && content.length > 10) {
      console.log('✓ OpenRouter API successful:', content.substring(0, 60) + '...')
      return content
    }
    
    console.warn('⚠️ Empty or invalid response from API')
    throw new Error('Empty response from API')
  } catch (error) {
    console.error('❌ OpenRouter API Error:', error.message)
    console.warn('📋 Using intelligent fallback system...')
    
    // Intelligent Fallback Responses based on context
    const lowerMsg = message.toLowerCase()
    
    if (lowerMsg.includes('hvac') || lowerMsg.includes('cool') || lowerMsg.includes('temperature') || lowerMsg.includes('ac')) {
      return '🔧 HVAC Issue Identified: 1) Check thermostat - set to 72°F preferred. 2) CoolTech HVAC specialist assigned (4-6h response). 3) Check air filter - may need replacement. 4) Ensure vents are unobstructed. 5) Our AI suggests quarterly preventive maintenance to prevent future issues. Expected resolution: 2-4 hours. This is being prioritized in our queue.'
    }
    if (lowerMsg.includes('plumbing') || lowerMsg.includes('water') || lowerMsg.includes('leak') || lowerMsg.includes('drain')) {
      return '💧 EMERGENCY PLUMBING ALERT: 1) IMMEDIATE - Turn off main water valve if active leak detected. 2) Document water damage with photos. 3) FlowPro Emergency Plumbing assigned (1.5h response time). 4) Insurance claim documentation started. 5) Expected resolution: 2-6 hours depending on severity. 6) Follow-up inspection scheduled. Our team is en route now.'
    }
    if (lowerMsg.includes('noise') || lowerMsg.includes('loud') || lowerMsg.includes('sound') || lowerMsg.includes('music')) {
      return '🔇 Noise Complaint Filed: 1) Building quiet hours policy: 10pm-8am enforced. 2) Formal noise complaint registered. 3) Staff will contact adjacent unit tomorrow morning. 4) Soundproofing consultation available. 5) Second violation results in formal warning. 6) Mediation service offered. Resolution timeline: 24-48 hours. We take community peace seriously.'
    }
    if (lowerMsg.includes('safety') || lowerMsg.includes('fire') || lowerMsg.includes('emergency') || lowerMsg.includes('hazard')) {
      return '🚨 SAFETY PRIORITY - IMMEDIATE ACTION: 1) EVACUATE if any hazard present - call 911. 2) SafeGuard Security & Fire team notified for immediate response. 3) Building audit being initiated. 4) Regulatory compliance review started. 5) Your safety is our absolute top priority. 6) Direct line to building management: available 24/7. Please proceed to safe location immediately.'
    }
    if (lowerMsg.includes('electrical') || lowerMsg.includes('light') || lowerMsg.includes('power') || lowerMsg.includes('outlet')) {
      return '⚡ Electrical Issue Alert: 1) DO NOT touch exposed wires/faulty outlets. 2) ElectriCare Professional assigned (Master Electrician - 2.5h response). 3) Possible causes: circuit breaker, loose connection, outlet failure. 4) Safety inspection performed before any work starts. 5) Expected completion: 1-3 hours. 6) All work includes 1-year warranty. We prioritize electrical safety.'
    }
    if (lowerMsg.includes('pest') || lowerMsg.includes('insect') || lowerMsg.includes('cockroach') || lowerMsg.includes('bug') || lowerMsg.includes('rat')) {
      return '🐛 Pest Control Activated: 1) Pest Shield Solutions assigned (EPA certified team). 2) Preventive treatment offered at discounted rate. 3) Expected response: 3 hours from now. 4) Adjacent units will be notified and treated. 5) Monthly follow-up inspections scheduled at no charge. 6) 24-month guarantee on treatment. Your unit will be treated today.'
    }
    if (lowerMsg.includes('clean') || lowerMsg.includes('dirty') || lowerMsg.includes('maintenance') || lowerMsg.includes('trash')) {
      return '🧹 Maintenance Request Logged: 1) PureClean maintenance crew dispatched. 2) Extra attention areas noted in system. 3) Expected completion: 4 hours for deep clean. 4) Daily inspections implemented for your zone. 5) Quality audit performed after completion. 6) Satisfaction guarantee - redo if not satisfied. Crew is being scheduled now.'
    }
    if (lowerMsg.includes('complaint')) {
      return '📋 Complaint Processing Started: 1) Your issue has been categorized by AI system. 2) Appropriate specialist matched based on category. 3) Priority level determined: HIGH/MEDIUM/STANDARD. 4) Estimated response time: 1-2 hours. 5) Follow-up survey after resolution to ensure quality. 6) Reference number assigned for tracking. We are committed to fastest resolution possible.'
    }
    
    // Generic professional fallback
    return 'Thank you for reaching out to our property management system. 1) Your concern has been received and analyzed. 2) Our AI system is assigning the best specialist for your issue. 3) You will be contacted within 2 hours with next steps. 4) Please provide additional details or photos if available - this helps us resolve faster. 5) You can track your issue in the "My Complaints" section. 6) We appreciate your patience and are here to help.'
  }
}

export default function App() {
  // Auth states
  const [authState, setAuthState] = useState('initial')
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupUnit, setSignupUnit] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  
  // UI states
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [complaints, setComplaints] = useState(COMPLAINTS)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [selectedContractor, setSelectedContractor] = useState(null)
  const [selectedRecommendation, setSelectedRecommendation] = useState(null)
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const fileInputRef = useRef(null)
  
  // Feedback & Survey states - LOAD SAMPLE DATA
  const [feedbackSurveys, setFeedbackSurveys] = useState(FEEDBACK_SURVEYS)
  const [importingFile, setImportingFile] = useState(false)
  const [feedbackAnalysis, setFeedbackAnalysis] = useState(null)
  const feedbackFileInputRef = useRef(null)
  
  // Analytics states
  const [timePeriod, setTimePeriod] = useState('weekly')
  
  // Customer Portal Tab State
  const [customerTab, setCustomerTab] = useState('chat')
  
  // File complaint states with approval tracking
  const [newComplaint, setNewComplaint] = useState({ 
    title: '', 
    category: 'HVAC', 
    description: '', 
    photos: [],
    urgency: 'Medium'
  })
  const [complaintSubmitting, setComplaintSubmitting] = useState(false)
  const [classificationLoading, setClassificationLoading] = useState(false)
  const [classificationResult, setClassificationResult] = useState(null)
  const [selectedComplaintForAI, setSelectedComplaintForAI] = useState(null)
  const [aiRecommendations, setAiRecommendations] = useState(null)
  const [loadingAIRec, setLoadingAIRec] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState('')

  // AI Chat states
  const [showAIChat, setShowAIChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [aiResponding, setAiResponding] = useState(false)
  
  // Settings states
  const [showSettings, setShowSettings] = useState(false)

  // Memoized analytics
  const recommendations = useMemo(() => generateRecommendations(complaints), [complaints])
  const weeklyData = useMemo(() => generateWeeklyAnalytics(), [])
  const categoryBreakdown = useMemo(() => generateCategoryBreakdown(), [])
  const categoryTrends = useMemo(() => generateCategoryTrends(), [])
  const resolutionData = useMemo(() => generateResolutionTimeData(), [])
  const correlations = useMemo(() => generateCorrelations(), [])
  
  // Analyze feedback data
  const analyzeFeedbackData = () => {
    if (feedbackSurveys.length === 0) return null
    
    const avgRating = (feedbackSurveys.reduce((sum, s) => sum + (s.rating || 0), 0) / feedbackSurveys.length).toFixed(1)
    const satisfactionScores = feedbackSurveys.map(s => ({ name: s.date || 'N/A', satisfaction: s.satisfaction_score || 0, rating: s.rating || 0 }))
    
    // Category correlation with complaints
    const categoryRatings = {}
    feedbackSurveys.forEach(s => {
      if (!categoryRatings[s.category]) categoryRatings[s.category] = { total: 0, count: 0 }
      categoryRatings[s.category].total += s.rating || 0
      categoryRatings[s.category].count += 1
    })
    
    const categoryAnalysis = Object.entries(categoryRatings).map(([cat, data]) => ({
      category: cat || 'Other',
      avgRating: (data.total / data.count).toFixed(1),
      complaints: complaints.filter(c => c.category === cat).length,
      surveys: data.count
    }))
    
    // Trends over time
    const ratingTrends = feedbackSurveys
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((s, idx) => ({
        index: idx + 1,
        date: s.date ? new Date(s.date).toLocaleDateString() : `Survey ${idx + 1}`,
        rating: s.rating || 0,
        satisfaction: s.satisfaction_score || 0
      }))
    
    // Issue frequency from mystery shopper notes
    const issueFrequency = {}
    feedbackSurveys.forEach(s => {
      if (s.mystery_shopper_notes) {
        const words = s.mystery_shopper_notes.toLowerCase().split(/\s+/)
        words.forEach(word => {
          if (word.length > 4) {
            issueFrequency[word] = (issueFrequency[word] || 0) + 1
          }
        })
      }
    })
    
    const topIssues = Object.entries(issueFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue, count]) => ({ issue: issue.charAt(0).toUpperCase() + issue.slice(1), frequency: count }))
    
    return {
      avgRating,
      surveyCount: feedbackSurveys.length,
      satisfactionScores,
      categoryAnalysis,
      ratingTrends,
      topIssues
    }
  }
  
  // Generate analysis when surveys change
  useEffect(() => {
    if (feedbackSurveys.length > 0) {
      setFeedbackAnalysis(analyzeFeedbackData())
    }
  }, [feedbackSurveys, complaints])
  
  // Handle feedback file import
  const handleImportFeedback = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setImportingFile(true)
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result
        if (!text) throw new Error('No file content')
        
        // Parse CSV or JSON
        let data = []
        if (file.name.endsWith('.json')) {
          data = JSON.parse(text)
        } else {
          // Parse CSV
          const lines = text.split('\n')
          const headers = lines[0].split(',')
          data = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = line.split(',')
              const obj = {}
              headers.forEach((header, idx) => {
                obj[header.trim().toLowerCase().replace(/\s+/g, '_')] = values[idx]?.trim()
              })
              return obj
            })
        }
        
        setFeedbackSurveys(prev => [...prev, ...data])
        alert(`Imported ${data.length} surveys successfully!`)
        setImportingFile(false)
      } catch (error) {
        console.error('Import error:', error)
        alert('Error importing file. Please ensure it\'s valid CSV or JSON with columns: date, rating, category, satisfaction_score, mystery_shopper_notes')
        setImportingFile(false)
      }
    }
    
    reader.readAsText(file)
    feedbackFileInputRef.current.value = ''
  }

  // Generate time-based analytics
  const getTimeBasedAnalytics = () => {
    const now = new Date()
    let data = []
    const days = timePeriod === 'daily' ? 7 : timePeriod === 'weekly' ? 12 : timePeriod === 'monthly' ? 12 : 12
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now)
      if (timePeriod === 'daily') date.setDate(date.getDate() - i)
      else if (timePeriod === 'weekly') date.setDate(date.getDate() - i * 7)
      else if (timePeriod === 'monthly') date.setMonth(date.getMonth() - i)
      else date.setFullYear(date.getFullYear() - i)
      
      const dateStr = timePeriod === 'yearly' ? date.getFullYear() : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const submitted = Math.floor(Math.random() * 15) + 2
      const resolved = Math.floor(submitted * (0.6 + Math.random() * 0.3))
      const inProgress = submitted - resolved - Math.floor(Math.random() * 3)
      
      data.push({ name: dateStr, submitted, resolved, inProgress, avgResponse: Math.floor(Math.random() * 24) + 4 })
    }
    return data
  }

  const timeBasedData = useMemo(() => getTimeBasedAnalytics(), [timePeriod])

  // Auth handlers
  const handleLogin = (email, password) => {
    if (email && password) {
      setCurrentUser({ email, role: email.includes('@sinostaff') ? 'staff' : 'tenant', name: email.split('@')[0], unit: email.includes('@sinostaff') ? null : '2801' })
      setUserRole(email.includes('@sinostaff') ? 'staff' : 'tenant')
      setAuthState('authenticated')
      setLoginEmail('')
      setLoginPassword('')
      setShowPassword(false)
      setChatMessages([])
    }
  }

  const handleSignup = (email, password, name, unit) => {
    if (email && password && name && unit) {
      setCurrentUser({ email, role: 'tenant', name, unit })
      setUserRole('tenant')
      setAuthState('authenticated')
      setSignupName('')
      setSignupEmail('')
      setSignupUnit('')
      setSignupPassword('')
      setSignupConfirm('')
      setChatMessages([])
    }
  }

  const handleGuestAccess = () => {
    setUserRole('customer')
    setAuthState('authenticated')
    setCurrentUser({ name: 'Guest', role: 'customer' })
    setChatMessages([{ id: 1, sender: 'ai', text: "Hello! I'm SINO AI assistant. How can I help you today?", timestamp: new Date() }])
    setShowAIChat(true)
  }

  const handleLogout = () => {
    setAuthState('initial')
    setCurrentUser(null)
    setUserRole(null)
    setLoginEmail('')
    setLoginPassword('')
    setShowPassword(false)
    setSignupName('')
    setSignupEmail('')
    setSignupUnit('')
    setSignupPassword('')
    setSignupConfirm('')
    setActiveTab('dashboard')
    setChatMessages([])
    setShowAIChat(false)
    setSelectedComplaint(null)
    setSelectedRecommendation(null)
  }

  // Complaint handlers - Fixed to update properly for tenants
  
  // Handle complaint approval/rejection
  const handleApproveComplaint = (complaintId, approved) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const now = new Date()
        return {
          ...c,
          approvalStatus: approved ? 'Approved' : 'Rejected',
          approvalDate: now.toISOString(),
          approvedBy: currentUser?.email || 'Staff',
          statusHistory: [...(c.statusHistory || []), {
            status: approved ? 'Approved' : 'Rejected',
            timestamp: now.toISOString(),
            note: approved ? 'Complaint approved by staff' : 'Complaint rejected by staff',
            approvedBy: currentUser?.email || 'Staff'
          }]
        }
      }
      return c
    }))
    
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint({
        ...selectedComplaint,
        approvalStatus: approved ? 'Approved' : 'Rejected',
        approvalDate: new Date().toISOString(),
        approvedBy: currentUser?.email || 'Staff'
      })
    }
    
    alert(approved ? 'Complaint approved successfully!' : 'Complaint rejected.')
  }
  
  const handleFileComplaint = async () => {
    if (!newComplaint.title || !newComplaint.description) {
      alert('Please fill all required fields')
      return
    }
    
    setComplaintSubmitting(true)
    setClassificationLoading(true)
    
    try {
      // Get real classification from DeepSeek
      const classificationPrompt = `Categorize this complaint into ONE category only. Categories: HVAC, PLUMBING, CLEANING, WAYFINDING, SAFETY, ELECTRICAL, NOISE, PEST, PARKING. 
      Complaint: "${newComplaint.description}"
      Response format: ONLY the category name, nothing else.`
      
      const classification = await callOpenRouterAPI(classificationPrompt)
      const category = Object.keys(CATEGORIES).find(key => classification.toUpperCase().includes(key)) || 'HVAC'
      setClassificationResult(category)
      
      // Create complaint with proper approval structure
      const complaint = {
        id: `C${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        title: newComplaint.title,
        tenantUnit: currentUser?.unit || 'Unknown',
        category: category,
        description: newComplaint.description,
        urgency: newComplaint.urgency || 'Medium',
        photos: newComplaint.photos || [],
        status: 'Open',
        riskLevel: newComplaint.urgency === 'High' ? 'High' : Math.random() > 0.6 ? 'Medium' : 'Low',
        dateSubmitted: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        priority: newComplaint.urgency || 'Normal',
        responseDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        assignedContractor: CONTRACTORS[Math.floor(Math.random() * CONTRACTORS.length)],
        approvalStatus: 'Pending',
        approvalDate: null,
        approvedBy: null,
        statusHistory: [
          { status: 'Open', timestamp: new Date().toISOString(), note: 'Complaint submitted', approvedBy: null }
        ],
        progress: 0,
        notes: [],
      }
      
      // Update complaints - THIS FIXES THE TENANT TAB UPDATE ISSUE
      setComplaints(prev => [complaint, ...prev])
      setNewComplaint({ title: '', category: 'HVAC', description: '', photos: [], urgency: 'Medium' })
      setComplaintSubmitting(false)
      setClassificationLoading(false)
      
      alert('Complaint filed successfully! It has been categorized and assigned.')
      setChatMessages([{ 
        id: Date.now(), 
        sender: 'ai', 
        text: `Your complaint "${complaint.title}" has been filed successfully! It's categorized as ${CATEGORIES[category]?.label}. Contractor ${complaint.assignedContractor?.name} has been assigned. Expected response time: 2-4 hours.`,
        timestamp: new Date() 
      }])
    } catch (error) {
      console.error('Error:', error)
      setComplaintSubmitting(false)
      setClassificationLoading(false)
      alert('Error filing complaint. Please try again.')
    }
  }

  // AI Chat handler with DeepSeek - Fixed for customer portal
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMsg = { id: Date.now(), sender: 'user', text: chatInput, timestamp: new Date() }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setAiResponding(true)

    try {
      const response = await callOpenRouterAPI(chatInput)
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: response, timestamp: new Date() }
      setChatMessages(prev => [...prev, aiMsg])
    } catch (e) {
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: 'I am here to help. Could you please rephrase your question?', timestamp: new Date() }
      setChatMessages(prev => [...prev, aiMsg])
    }
    
    setAiResponding(false)
  }

  // Complaint Detail Modal - ENHANCED with more details
  function renderComplaintDetail() {
    if (!selectedComplaint) return null
    
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px', overflowY: 'auto' }}>
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '900px', width: '100%', maxHeight: '95vh', overflow: 'auto', marginY: 'auto' }}>
          <div style={{ padding: '24px', borderBottom: `2px solid ${THEME.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: THEME.dark, margin: 0 }}>Complaint Details</h2>
            <button onClick={() => setSelectedComplaint(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={24} color={THEME.text} /></button>
          </div>
          
          <div style={{ padding: '24px', display: 'grid', gap: '24px' }}>
            {/* Header Section */}
            <div style={{ padding: '20px', backgroundColor: THEME.lightBg, borderRadius: '12px', borderLeft: `4px solid ${THEME.primary}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 4px 0' }}>{selectedComplaint.id}</p>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: THEME.dark, margin: 0 }}>{selectedComplaint.title}</h3>
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ padding: '6px 14px', backgroundColor: selectedComplaint.status === 'Resolved' ? THEME.success : THEME.warning, color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>{selectedComplaint.status}</motion.span>
                  <motion.span style={{ padding: '6px 12px', backgroundColor: selectedComplaint.approvalStatus === 'Approved' ? THEME.success : THEME.warning, color: 'white', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Approval: {selectedComplaint.approvalStatus}</motion.span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', fontSize: '12px' }}>
                <div><p style={{ color: '#999', margin: '0 0 4px 0' }}>Unit:</p><p style={{ fontWeight: 'bold', color: THEME.dark, margin: 0 }}>{selectedComplaint.tenantUnit}</p></div>
                <div><p style={{ color: '#999', margin: '0 0 4px 0' }}>Category:</p><p style={{ fontWeight: 'bold', color: THEME.dark, margin: 0 }}>{CATEGORIES[selectedComplaint.category]?.label}</p></div>
                <div><p style={{ color: '#999', margin: '0 0 4px 0' }}>Urgency:</p><p style={{ fontWeight: 'bold', color: selectedComplaint.urgency === 'High' ? THEME.danger : THEME.warning, margin: 0 }}>{selectedComplaint.urgency}</p></div>
                <div><p style={{ color: '#999', margin: '0 0 4px 0' }}>Risk Level:</p><p style={{ fontWeight: 'bold', color: selectedComplaint.riskLevel === 'High' ? THEME.danger : THEME.warning, margin: 0 }}>{selectedComplaint.riskLevel}</p></div>
              </div>
            </div>

            {/* AI Suggestions - Staff Only */}
            {userRole === 'staff' && selectedComplaint.aiSuggestion && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', backgroundColor: THEME.primary + '08', borderRadius: '8px', border: `2px solid ${THEME.primary}33` }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <Brain size={20} color={THEME.primary} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: THEME.primary, margin: '0 0 6px 0' }}>AI-POWERED ANALYSIS</p>
                    <p style={{ fontSize: '13px', color: THEME.text, margin: 0, lineHeight: '1.6' }}>{selectedComplaint.aiSuggestion}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Progress Tracking - Tenant Only */}
            {userRole === 'tenant' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', backgroundColor: THEME.lightBg, borderRadius: '12px', borderTop: `4px solid ${THEME.primary}` }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.dark, margin: 0 }}>Resolution Progress</p>
                      <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '14px', fontWeight: 'bold', color: THEME.success, margin: 0 }}>{selectedComplaint.progress || 30}%</motion.p>
                    </div>
                    <div style={{ width: '100%', height: '12px', backgroundColor: THEME.border, borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${selectedComplaint.progress || 30}%` }} 
                        transition={{ duration: 0.8 }}
                        style={{ height: '100%', background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.success})`, borderRadius: '8px' }} 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', fontSize: '11px', color: '#999' }}>
                      <span>Status: {selectedComplaint.status}</span>
                      <span>ETA: {new Date(selectedComplaint.responseDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', textAlign: 'center', borderLeft: `3px solid ${THEME.primary}` }}>
                      <p style={{ fontSize: '10px', color: '#999', fontWeight: 'bold', margin: '0 0 4px 0' }}>RESPONSE TIME</p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: THEME.primary, margin: 0 }}>{selectedComplaint.responseTime}min</p>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', textAlign: 'center', borderLeft: `3px solid ${THEME.warning}` }}>
                      <p style={{ fontSize: '10px', color: '#999', fontWeight: 'bold', margin: '0 0 4px 0' }}>ELAPSED TIME</p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: THEME.warning, margin: 0 }}>{Math.floor((new Date() - new Date(selectedComplaint.dateSubmitted)) / (1000 * 60 * 60))}h ago</p>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', textAlign: 'center', borderLeft: `3px solid ${THEME.success}` }}>
                      <p style={{ fontSize: '10px', color: '#999', fontWeight: 'bold', margin: '0 0 4px 0' }}>SATISFACTION</p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: THEME.success, margin: 0 }}>{selectedComplaint.satisfactionRating ? selectedComplaint.satisfactionRating.toFixed(1) : 'Pending'}/5</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Approval Details Section - Enhanced */}
            {userRole === 'staff' && (
              <div style={{ padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: `1px solid ${THEME.success}` }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 12px 0' }}>Approval Information</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '12px' }}>
                  <div><span style={{ color: '#666' }}>Status:</span> <strong style={{ color: selectedComplaint.approvalStatus === 'Approved' ? THEME.success : THEME.warning }}>{selectedComplaint.approvalStatus}</strong></div>
                  <div><span style={{ color: '#666' }}>Approved By:</span> <strong>{selectedComplaint.approvedBy || 'Pending'}</strong></div>
                  <div><span style={{ color: '#666' }}>Approval Date:</span> <strong>{selectedComplaint.approvalDate ? new Date(selectedComplaint.approvalDate).toLocaleDateString() : 'Pending'}</strong></div>
                  <div><span style={{ color: '#666' }}>Days Since Filed:</span> <strong>{Math.floor((new Date() - new Date(selectedComplaint.dateSubmitted)) / (1000 * 60 * 60 * 24))}</strong></div>
                </div>
                {selectedComplaint.approvalStatus === 'Pending' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button style={{ padding: '8px 12px', backgroundColor: THEME.success, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }} onClick={() => handleApproveComplaint(selectedComplaint.id, true)}>Approve</button>
                    <button style={{ padding: '8px 12px', backgroundColor: THEME.danger, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }} onClick={() => handleApproveComplaint(selectedComplaint.id, false)}>Reject</button>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <p style={{ fontSize: '13px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0' }}>Description</p>
              <p style={{ fontSize: '14px', color: THEME.text, margin: 0, lineHeight: '1.8', padding: '12px', backgroundColor: THEME.lightBg, borderRadius: '8px' }}>{selectedComplaint.description}</p>
            </div>

            {/* Photos */}
            {selectedComplaint.photos && selectedComplaint.photos.length > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#999', fontWeight: 'bold', margin: '0 0 12px 0' }}>Attachments ({selectedComplaint.photos.length})</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                  {selectedComplaint.photos.map((photo, idx) => (
                    <div key={idx} style={{ backgroundColor: THEME.lightBg, borderRadius: '8px', padding: '12px', textAlign: 'center', cursor: 'pointer', border: `1px solid ${THEME.border}` }}><ImageIcon size={32} color={THEME.primary} style={{ margin: '0 auto 6px' }} /><p style={{ fontSize: '10px', color: '#999', margin: 0, wordBreak: 'break-word' }}>{photo.name}</p></div>
                  ))}
                </div>
              </div>
            )}

            {/* Assigned Contractor */}
            {selectedComplaint.assignedContractor && (
              <div>
                <p style={{ fontSize: '13px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0' }}>Assigned Specialist</p>
                <motion.div whileHover={{ scale: 1.02 }} onClick={() => setSelectedContractor(selectedComplaint.assignedContractor)} style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '8px', borderLeft: `4px solid ${THEME.primary}`, cursor: 'pointer', display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'start' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 4px 0' }}>{selectedComplaint.assignedContractor.name}</p>
                      <p style={{ fontSize: '12px', color: '#666', margin: '0 0 6px 0' }}>{CATEGORIES[selectedComplaint.assignedContractor.specialty]?.label} Specialist</p>
                      <p style={{ fontSize: '11px', color: THEME.primary, fontWeight: '500' }}>Click for full profile →</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0' }}>Rating</p>
                      <p style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.warning, margin: 0 }}>{selectedComplaint.assignedContractor.rating}/5</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <p style={{ fontSize: '13px', color: '#999', fontWeight: 'bold', margin: '0 0 12px 0' }}>Activity Timeline</p>
              <div style={{ display: 'grid', gap: '10px' }}>
                {selectedComplaint.statusHistory?.map((entry, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: '12px', backgroundColor: THEME.lightBg, borderRadius: '8px', borderLeft: `3px solid ${THEME.primary}`, display: 'grid', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0, color: THEME.dark }}>{entry.status}</p>
                      <p style={{ fontSize: '10px', color: '#999', margin: 0 }}>{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                    {entry.note && <p style={{ fontSize: '11px', color: THEME.secondary, margin: '4px 0 0 0' }}>{entry.note}</p>}
                    {entry.approvedBy && <p style={{ fontSize: '10px', color: '#666', margin: '4px 0 0 0', fontStyle: 'italic' }}>By: {entry.approvedBy}</p>}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Chat for this complaint */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gap: '12px' }}>
              {/* AI Recommendations Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => generateComplaintRecommendations(selectedComplaint, userRole)}
                disabled={loadingAIRec}
                style={{
                  padding: '12px 16px',
                  backgroundColor: loadingAIRec ? THEME.border : THEME.success,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loadingAIRec ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: loadingAIRec ? 0.6 : 1,
                }}
              >
                {loadingAIRec ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <Brain size={14} />
                    </motion.div>
                    Generating {userRole === 'tenant' ? 'Tenant' : 'Staff'} Guidance...
                  </>
                ) : (
                  <>
                    <Brain size={14} />
                    Get AI {userRole === 'tenant' ? 'Tips & Safety' : 'Diagnostic & Repair'} Guidance
                  </>
                )}
              </motion.button>

              {/* AI Recommendations Display - Clear Step Format */}
              {aiRecommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '24px',
                    backgroundColor: '#fff8e1',
                    borderRadius: '12px',
                    border: `3px solid #ffc107`,
                    maxHeight: '600px',
                    overflow: 'auto',
                    display: 'grid',
                    gap: '16px'
                  }}
                >
                  {/* Title */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: `2px solid #ffc107`,
                    paddingBottom: '16px'
                  }}>
                    <Brain size={24} color={THEME.primary} />
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: THEME.dark, 
                      margin: 0 
                    }}>
                      🤖 AI-Powered Recommendations & Safety Guide
                    </h4>
                  </div>

                  {/* Parse recommendations by sections - IMPROVED */}
                  {parseAIRecommendations(aiRecommendations).map((section, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{
                        padding: '18px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        border: `2px solid ${
                          section.emoji === '🚨' ? THEME.danger :
                          section.emoji === '⚠️' ? THEME.warning :
                          section.emoji === '📋' ? THEME.primary :
                          section.emoji === '💬' ? THEME.secondary :
                          section.emoji === '🔍' ? THEME.success :
                          THEME.light
                        }`,
                        borderLeft: `5px solid ${
                          section.emoji === '🚨' ? THEME.danger :
                          section.emoji === '⚠️' ? THEME.warning :
                          section.emoji === '📋' ? THEME.primary :
                          section.emoji === '💬' ? THEME.secondary :
                          section.emoji === '🔍' ? THEME.success :
                          THEME.light
                        }`
                      }}
                    >
                      {/* Section Title */}
                      <h5 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: THEME.dark,
                        margin: '0 0 14px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '18px' }}>{section.emoji}</span>
                        {section.title}
                      </h5>

                      {/* Numbered Items */}
                      <div style={{ display: 'grid', gap: '10px', marginLeft: '4px' }}>
                        {section.items.map((item, itemIdx) => (
                          <div key={itemIdx} style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            color: THEME.text
                          }}>
                            <div style={{
                              minWidth: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor:
                                section.emoji === '🚨' ? THEME.danger :
                                section.emoji === '⚠️' ? THEME.warning :
                                section.emoji === '📋' ? THEME.primary :
                                section.emoji === '💬' ? THEME.secondary :
                                section.emoji === '🔍' ? THEME.success :
                                THEME.light,
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              flexShrink: 0
                            }}>
                              {itemIdx + 1}
                            </div>
                            <p style={{ margin: '4px 0', flex: 1 }}>
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Ask AI Button */}
              <button
                onClick={() => { setShowAIChat(true); setChatMessages([{ id: 1, sender: 'ai', text: `I can help you with complaint ${selectedComplaint.id}. What would you like to know?`, timestamp: new Date() }]) }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: THEME.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <MessageCircle size={14} /> Ask AI About This Complaint
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Contractor Info Modal - ENHANCED
  function renderContractorInfo() {
    if (!selectedContractor) return null
    
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '24px' }}>
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 4px 0' }}>{selectedContractor.name}</h2>
              <p style={{ fontSize: '12px', color: THEME.primary, fontWeight: 'bold', margin: 0 }}>{CATEGORIES[selectedContractor.specialty]?.label} Specialist</p>
            </div>
            <button onClick={() => setSelectedContractor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={24} /></button>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Contact Info */}
            <div style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '8px', display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} color={THEME.primary} />
                <div>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0 0 2px 0' }}>Phone</p>
                  <p style={{ fontSize: '13px', color: THEME.text, fontWeight: '500', margin: 0 }}>{selectedContractor.phone}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} color={THEME.primary} />
                <div>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0 0 2px 0' }}>Email</p>
                  <p style={{ fontSize: '13px', color: THEME.text, fontWeight: '500', margin: 0 }}>{selectedContractor.email}</p>
                </div>
              </div>
            </div>

            {/* Rating & Performance */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 12px 0' }}>Performance Metrics</p>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: THEME.lightBg, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={18} color={THEME.warning} />
                    <p style={{ fontSize: '13px', color: THEME.text, margin: 0 }}>Customer Rating</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: THEME.warning, margin: 0 }}>{selectedContractor.rating}/5.0</p>
                </div>
                <div style={{ padding: '12px', backgroundColor: THEME.lightBg, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color={THEME.primary} />
                    <p style={{ fontSize: '13px', color: THEME.text, margin: 0 }}>Avg Response Time</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: THEME.primary, margin: 0 }}>{selectedContractor.avgResponseTime}</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 8px 0' }}>Current Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: selectedContractor.availability === 'Available' ? '#e8f5e9' : '#fff3e0', borderRadius: '6px', border: `1px solid ${selectedContractor.availability === 'Available' ? THEME.success : THEME.warning}` }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedContractor.availability === 'Available' ? THEME.success : THEME.warning }} />
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: selectedContractor.availability === 'Available' ? THEME.success : THEME.warning, margin: 0 }}>{selectedContractor.availability}</p>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 10px 0' }}>Certifications</p>
              <div style={{ display: 'grid', gap: '8px' }}>
                {selectedContractor.certifications?.map(cert => (
                  <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: THEME.lightBg, borderRadius: '6px' }}>
                    <CheckCircle size={14} color={THEME.success} />
                    <p style={{ fontSize: '12px', color: THEME.text, margin: 0 }}>{cert}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} onClick={() => setSelectedContractor(null)} style={{ padding: '12px', backgroundColor: THEME.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '12px' }}>Close Profile</motion.button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // File Complaint View
  function renderFileComplaint() {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '32px 24px', maxWidth: '900px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 8px 0' }}>File a New Complaint</h2>
          <p style={{ fontSize: '13px', color: '#999', margin: '0 0 24px 0' }}>Our AI system will automatically analyze and categorize your complaint for faster resolution</p>
          
          <form onSubmit={(e) => { e.preventDefault(); handleFileComplaint() }} style={{ display: 'grid', gap: '24px' }}>
            {/* AI Classification Status */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', backgroundColor: `${THEME.primary}08`, borderRadius: '12px', border: `2px solid ${THEME.primary}33`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <motion.div animate={{ rotate: classificationLoading ? 360 : 0 }} transition={{ duration: 1, repeat: classificationLoading ? Infinity : 0 }}><Loader size={18} color={THEME.primary} /></motion.div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: THEME.primary, margin: 0 }}>AI-Powered Auto-Classification</p>
              </div>
              {classificationResult && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '6px 12px', backgroundColor: THEME.success, color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                  Detected: {CATEGORIES[classificationResult]?.label}
                </motion.div>
              )}
            </motion.div>

            {/* Title */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.dark, display: 'block', marginBottom: '8px' }}>Complaint Title *</label>
              <input type="text" placeholder="e.g., AC not cooling properly" value={newComplaint.title} onChange={(e) => setNewComplaint(prev => ({ ...prev, title: e.target.value }))} style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            {/* Urgency & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.dark, display: 'block', marginBottom: '8px' }}>Urgency Level</label>
                <select value={newComplaint.urgency} onChange={(e) => setNewComplaint(prev => ({ ...prev, urgency: e.target.value }))} style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High - Urgent</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.dark, display: 'block', marginBottom: '8px' }}>Category (AI will auto-detect)</label>
                <select value={newComplaint.category} onChange={(e) => setNewComplaint(prev => ({ ...prev, category: e.target.value }))} style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', cursor: 'pointer' }}>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (<option key={key} value={key}>{cat.label}</option>))}
                </select>
              </div>
            </div>

            {/* Description with AI Generator */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.dark }}>Description *</label>
                <motion.button 
                  type="button"
                  onClick={() => generateComplaintDescription(newComplaint.description)}
                  disabled={generatingDescription || !newComplaint.description.trim()}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: generatingDescription ? THEME.border : THEME.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: generatingDescription ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: generatingDescription ? 0.6 : 1,
                  }}
                >
                  {generatingDescription ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                        <Loader size={12} />
                      </motion.div>
                      Improving...
                    </>
                  ) : (
                    <>
                      <Brain size={12} />
                      AI Improve
                    </>
                  )}
                </motion.button>
              </div>
              <textarea 
                placeholder="Please describe the issue in detail, including when it started and how it affects you..." 
                value={newComplaint.description} 
                onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))} 
                style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', minHeight: '140px', fontFamily: 'Arial', resize: 'vertical' }} 
              />
              {generatedDescription && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  style={{ 
                    marginTop: '12px', 
                    padding: '16px', 
                    backgroundColor: THEME.success + '15', 
                    borderRadius: '8px', 
                    border: `2px solid ${THEME.success}`,
                    borderLeft: `5px solid ${THEME.success}`
                  }}
                >
                  <h5 style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: THEME.success,
                    margin: '0 0 10px 0',
                  }}>
                    ✅ Professional Description
                  </h5>
                  <p style={{
                    fontSize: '13px',
                    color: THEME.text,
                    margin: 0,
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {generatedDescription}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.dark, display: 'block', marginBottom: '8px' }}>Attach Photos (Optional)</label>
              <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setNewComplaint(prev => ({ ...prev, photos: [...(prev.photos || []), ...files.map(f => ({ name: f.name, file: f }))] }))
              }} />
              <motion.button type="button" onClick={() => fileInputRef.current?.click()} whileHover={{ scale: 1.02 }} style={{ padding: '12px 16px', backgroundColor: THEME.lightBg, color: THEME.primary, border: `2px solid ${THEME.primary}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}><ImageIcon size={16} style={{ display: 'inline', marginRight: '8px' }} /> Add Photos</motion.button>
              {newComplaint.photos?.length > 0 && (
                <p style={{ fontSize: '11px', color: THEME.success, margin: '8px 0 0 0', fontWeight: 'bold' }}>Check {newComplaint.photos.length} photo(s) attached</p>
              )}
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={complaintSubmitting} whileHover={{ scale: complaintSubmitting ? 1 : 1.02 }} style={{ padding: '14px', backgroundColor: complaintSubmitting ? THEME.border : THEME.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: complaintSubmitting ? 'not-allowed' : 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {complaintSubmitting ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Loader size={18} /></motion.span> Submitting & Analyzing...</>
              ) : (
                <>Submit Complaint</>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    )
  }

  // Combined Dashboard + Analytics View with ADVANCED CHARTS and RESPONSIVE DESIGN
  function renderDashboard() {
    // Define responsive breakpoints
    const isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth < 1024
    
    const performanceData = [
      { category: 'HVAC', resolved: 85, pending: 12, avgTime: 4 },
      { category: 'PLUMBING', resolved: 92, pending: 8, avgTime: 3 },
      { category: 'ELECTRICAL', resolved: 78, pending: 15, avgTime: 5 },
      { category: 'CLEANING', resolved: 95, pending: 5, avgTime: 2 },
      { category: 'SAFETY', resolved: 88, pending: 10, avgTime: 4.5 },
    ]

    // Responsive styles based on screen size
    const containerPadding = isMobile ? '16px 12px' : isTablet ? '24px 16px' : '32px 24px'
    const sectionPadding = isMobile ? '18px' : '28px'
    const gridGap = isMobile ? '12px' : isTablet ? '16px' : '24px'
    const chartHeight = isMobile ? 250 : isTablet ? 300 : 380
    const categoryChartHeight = isMobile ? 250 : isTablet ? 300 : 320
    const fontSize = {
      title: isMobile ? '16px' : '18px',
      subtitle: isMobile ? '12px' : '13px',
      small: isMobile ? '10px' : '12px'
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: containerPadding, background: 'linear-gradient(135deg, #f5f8fc 0%, #f0f4f8 100%)' }}>
        <div style={{ display: 'grid', gap: gridGap }}>
          {/* Time Period Selector with Mobile Abbreviations */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap' }}>
            {['daily', 'weekly', 'monthly', 'yearly'].map(period => {
              const abbreviations = { daily: 'D', weekly: 'W', monthly: 'M', yearly: 'Y' }
              const displayText = isMobile ? abbreviations[period] : period.charAt(0).toUpperCase() + period.slice(1)
              
              return (
                <motion.button key={period} whileHover={{ scale: 1.05 }} onClick={() => setTimePeriod(period)} style={{ 
                  padding: isMobile ? '10px 14px' : '12px 24px', 
                  backgroundColor: timePeriod === period ? `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)` : 'white', 
                  color: timePeriod === period ? 'white' : THEME.text, 
                  border: `2px solid ${timePeriod === period ? THEME.primary : THEME.light}`, 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: isMobile ? '11px' : '13px',
                  boxShadow: timePeriod === period ? `0 6px 20px ${THEME.primary}30` : '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease'
                }}>
                  {!isMobile && <Calendar size={14} style={{ display: 'inline', marginRight: '8px' }} />}
                  {displayText}
                </motion.button>
              )
            })}
          </motion.div>

          {/* Enhanced KPI Cards with Responsive Layout */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: gridGap }}>
            {[
              { title: 'Total Complaints', value: complaints.length, icon: AlertCircle, color: THEME.primary, bgGradient: 'linear-gradient(135deg, #2c5aa0 0%, #4a7ba7 100%)', subtitle: 'This period' },
              { title: 'High Priority', value: complaints.filter(c => c.urgency === 'High').length, icon: AlertTriangle, color: THEME.danger, bgGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', subtitle: 'Needs attention' },
              { title: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle, color: THEME.success, bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', subtitle: 'Completed' },
              { title: 'Avg Resolution', value: '2.3d', icon: Clock, color: THEME.warning, bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', subtitle: 'Per complaint' },
            ].map((card, idx) => {
              const Icon = card.icon
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -12, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }} style={{ 
                  background: 'white', 
                  padding: isMobile ? '18px' : '24px', 
                  borderRadius: '16px', 
                  border: `2px solid ${card.color}20`,
                  boxShadow: `0 4px 20px ${card.color}15`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '-50%', 
                    right: '-50%', 
                    width: '200px', 
                    height: '200px', 
                    background: card.bgGradient, 
                    opacity: 0.05,
                    borderRadius: '50%'
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                    <div>
                      <p style={{ fontSize: fontSize.small, color: '#999', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.title}</p>
                      <p style={{ fontSize: '10px', color: '#ccc', fontWeight: '500', margin: '6px 0 0 0' }}>{card.subtitle}</p>
                    </div>
                    <div style={{ padding: '10px', background: card.bgGradient, borderRadius: '12px' }}>
                      <Icon size={isMobile ? 18 : 24} color='white' />
                    </div>
                  </div>
                  <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '900', background: card.bgGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, position: 'relative', zIndex: 1 }}>{card.value}</motion.p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Enhanced Trend Chart with Gradient - Responsive Height */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
            <h3 style={{ fontSize: fontSize.title, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>Complaint Trends ({timePeriod})</h3>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={timeBasedData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME.warning} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={THEME.warning} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME.success} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={THEME.success} stopOpacity={0}/>
                  </linearGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke={THEME.text} style={{ fontSize: fontSize.small }} />
                <YAxis stroke={THEME.text} style={{ fontSize: fontSize.small }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: `2px solid ${THEME.primary}`, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '12px' }} />
                <Area type="monotone" dataKey="submitted" stackId="1" stroke={THEME.warning} strokeWidth={2} fillOpacity={1} fill="url(#colorSubmitted)" filter="url(#shadow)" />
                <Area type="monotone" dataKey="resolved" stackId="1" stroke={THEME.success} strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" filter="url(#shadow)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Charts - Responsive Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(350px, 1fr))', gap: gridGap }}>
            {/* Chart.js Doughnut Chart - Replaces Pie Chart */}
            <div style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
              <h3 style={{ fontSize: fontSize.title, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>Distribution by Category</h3>
              <div style={{ position: 'relative', height: categoryChartHeight }}>
                <Doughnut 
                  data={{
                    labels: categoryBreakdown.map(c => c.name),
                    datasets: [{
                      label: 'Complaints',
                      data: categoryBreakdown.map(c => c.value),
                      backgroundColor: [
                        'rgba(44, 90, 160, 0.9)',
                        'rgba(245, 158, 11, 0.9)',
                        'rgba(16, 185, 129, 0.9)',
                        'rgba(239, 68, 68, 0.9)',
                        'rgba(139, 92, 246, 0.9)',
                        'rgba(59, 130, 246, 0.9)',
                      ],
                      borderColor: [
                        'rgba(44, 90, 160, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(59, 130, 246, 1)',
                      ],
                      borderWidth: isMobile ? 2 : 3,
                      borderRadius: 8,
                      hoverOffset: 8,
                      shadow: {
                        blur: 10,
                        offsetX: 0,
                        offsetY: 2,
                        color: 'rgba(0, 0, 0, 0.2)',
                      }
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { padding: isMobile ? 8 : 15, font: { size: isMobile ? 10 : 12, weight: '600' }, usePointStyle: true }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: isMobile ? 11 : 12 },
                        borderColor: THEME.primary,
                        borderWidth: 2,
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Radar Chart for Performance */}
            <div style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
              <h3 style={{ fontSize: fontSize.title, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>Performance Analysis</h3>
              <ResponsiveContainer width="100%" height={categoryChartHeight}>
                <RadarChart data={performanceData}>
                  <defs>
                    <linearGradient id="radarGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={THEME.success} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={THEME.success} stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="radarGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={THEME.warning} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={THEME.warning} stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke={THEME.border} />
                  <PolarAngleAxis dataKey="category" stroke={THEME.text} style={{ fontSize: fontSize.small }} />
                  <PolarRadiusAxis stroke={THEME.border} />
                  <Radar name="Resolved" dataKey="resolved" stroke={THEME.success} fill="url(#radarGradient1)" fillOpacity={0.7} strokeWidth={2} />
                  <Radar name="Pending" dataKey="pending" stroke={THEME.warning} fill="url(#radarGradient2)" fillOpacity={0.7} strokeWidth={2} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: `2px solid ${THEME.primary}`, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Resolution Time Bar Chart - Responsive Height */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
            <h3 style={{ fontSize: fontSize.title, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>Average Resolution Time by Category</h3>
            <ResponsiveContainer width="100%" height={isTablet ? 300 : 340}>
              <BarChart data={resolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME.primary} stopOpacity={1}/>
                    <stop offset="100%" stopColor={THEME.secondary} stopOpacity={0.8}/>
                  </linearGradient>
                  <filter id="barShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.2" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="category" stroke={THEME.text} style={{ fontSize: fontSize.small }} />
                <YAxis stroke={THEME.text} style={{ fontSize: fontSize.small }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: `2px solid ${THEME.primary}`, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                  cursor={{ fill: THEME.primary + '15' }} 
                  formatter={(value) => [`${value}h`, 'Time']}
                />
                <Bar dataKey="hours" fill="url(#barGradient)" radius={[12, 12, 0, 0]} filter="url(#barShadow)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Performance Table - Scrollable on Mobile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
            <h3 style={{ fontSize: fontSize.title, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>Performance Summary</h3>
            <div style={{ overflowX: 'auto', minWidth: isMobile ? '500px' : '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${THEME.light}` }}>
                    <th style={{ textAlign: 'left', padding: '12px', color: THEME.text, fontWeight: '600', fontSize: fontSize.small }}>Category</th>
                    <th style={{ textAlign: 'center', padding: '12px', color: THEME.text, fontWeight: '600', fontSize: fontSize.small }}>Resolved</th>
                    <th style={{ textAlign: 'center', padding: '12px', color: THEME.text, fontWeight: '600', fontSize: fontSize.small }}>Pending</th>
                    <th style={{ textAlign: 'center', padding: '12px', color: THEME.text, fontWeight: '600', fontSize: fontSize.small }}>Avg Time</th>
                    <th style={{ textAlign: 'center', padding: '12px', color: THEME.text, fontWeight: '600', fontSize: fontSize.small }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${THEME.lightBg}`, background: idx % 2 === 0 ? 'transparent' : THEME.lightBg + '50' }}>
                      <td style={{ padding: '14px 12px', color: THEME.text, fontWeight: '600', fontSize: fontSize.small }}>{row.category}</td>
                      <td style={{ textAlign: 'center', padding: '14px 12px', fontSize: fontSize.small }}>
                        <span style={{ background: THEME.success + '15', color: THEME.success, padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
                          {row.resolved}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '14px 12px', fontSize: fontSize.small }}>
                        <span style={{ background: THEME.warning + '15', color: THEME.warning, padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
                          {row.pending}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '14px 12px', fontSize: fontSize.small, fontWeight: '600' }}>{row.avgTime}h</td>
                      <td style={{ textAlign: 'center', padding: '14px 12px', fontSize: fontSize.small }}>
                        <span style={{ background: row.resolved > 80 ? THEME.success + '15' : THEME.warning + '15', color: row.resolved > 80 ? THEME.success : THEME.warning, padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
                          {row.resolved > 80 ? 'Excellent' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Advanced Analytics - Doughnut with Responsive Layout */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: gridGap }}>
            {/* Chart.js Doughnut Chart - Category Breakdown */}
            <div style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
              <h3 style={{ fontSize: fontSize.subtitle, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0' }}>Complaint Distribution</h3>
              <div style={{ position: 'relative', height: categoryChartHeight }}>
                <Doughnut 
                  data={{
                    labels: categoryBreakdown.map(c => c.name),
                    datasets: [{
                      label: 'Complaints',
                      data: categoryBreakdown.map(c => c.value),
                      backgroundColor: [
                        'rgba(44, 90, 160, 0.9)',
                        'rgba(245, 158, 11, 0.9)',
                        'rgba(16, 185, 129, 0.9)',
                        'rgba(239, 68, 68, 0.9)',
                        'rgba(139, 92, 246, 0.9)',
                        'rgba(59, 130, 246, 0.9)',
                      ],
                      borderColor: [
                        'rgba(44, 90, 160, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(59, 130, 246, 1)',
                      ],
                      borderWidth: isMobile ? 2 : 3,
                      borderRadius: 8,
                      hoverOffset: 8,
                      shadow: {
                        blur: 10,
                        offsetX: 0,
                        offsetY: 2,
                        color: 'rgba(0, 0, 0, 0.2)',
                      }
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { padding: isMobile ? 8 : 15, font: { size: isMobile ? 10 : 12, weight: '600' }, usePointStyle: true }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: isMobile ? 11 : 12 },
                        borderColor: THEME.primary,
                        borderWidth: 2,
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Performance Score Card */}
            <div style={{ backgroundColor: `linear-gradient(135deg, ${THEME.primary}15 0%, ${THEME.secondary}15 100%)`, padding: sectionPadding, borderRadius: '16px', border: `2px solid ${THEME.primary}30`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: fontSize.subtitle, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0' }}>Overall Performance Score</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { label: 'Resolution Rate', value: 84, target: 90, color: THEME.success },
                    { label: 'Response Time', value: 78, target: 85, color: THEME.warning },
                    { label: 'Customer Satisfaction', value: 88, target: 90, color: THEME.primary },
                    { label: 'Efficiency Index', value: 82, target: 85, color: THEME.accent }
                  ].map((metric, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: fontSize.small, fontWeight: '600' }}>
                        <span>{metric.label}</span>
                        <span style={{ color: metric.color }}>{metric.value}%</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 2, ease: 'easeOut' }}
                          style={{ height: '100%', background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}cc 100%)`, borderRadius: '4px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                style={{ marginTop: '20px', padding: '16px', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center' }}
              >
                <p style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 4px 0' }}>84.5</p>
                <p style={{ fontSize: '11px', color: '#999', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>Overall Score</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Key Metrics - Replaced Advanced Metrics with Business KPIs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
            <h3 style={{ fontSize: fontSize.title, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0' }}>Key Business Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: gridGap }}>
              {[
                { title: 'SLA Compliance', value: '96.2%', target: '95%', trend: '+1.2%', color: THEME.success, icon: '📊' },
                { title: 'Cost Per Resolution', value: '$145', baseline: '$165', trend: '-12%', color: THEME.success, icon: '💰' },
                { title: 'Staff Efficiency', value: '87%', target: '85%', trend: '+3%', color: THEME.primary, icon: '👥' },
                { title: 'Customer Retention', value: '94%', baseline: '92.5%', trend: '+1.5%', color: THEME.primary, icon: '⭐' },
              ].map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  style={{
                    padding: isMobile ? '14px' : '16px',
                    backgroundColor: THEME.lightBg,
                    borderRadius: '12px',
                    border: `2px solid ${metric.color}20`,
                    textAlign: 'center'
                  }}
                >
                  <p style={{ fontSize: isMobile ? '20px' : '24px', margin: '0 0 8px 0' }}>{metric.icon}</p>
                  <p style={{ fontSize: fontSize.small, color: '#999', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>{metric.title}</p>
                  <p style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '900', color: metric.color, margin: '0 0 4px 0' }}>{metric.value}</p>
                  <p style={{ fontSize: '11px', color: metric.trend.startsWith('+') ? THEME.success : THEME.success, fontWeight: 'bold', margin: 0 }}>
                    {metric.trend.startsWith('+') ? '📈' : '📉'} {metric.trend}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Category Performance Deep Dive */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
            <h3 style={{ fontSize: fontSize.title, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0' }}>Category Deep Dive - Efficiency Metrics</h3>
            <ResponsiveContainer width="100%" height={isTablet ? 250 : 280}>
              <ComposedChart data={performanceData}>
                <defs>
                  <linearGradient id="compositeGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME.success} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={THEME.success} stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="compositeGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME.primary} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={THEME.primary} stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} vertical={false} />
                <XAxis dataKey="category" stroke={THEME.text} style={{ fontSize: fontSize.small }} />
                <YAxis yAxisId="left" stroke={THEME.text} />
                <YAxis yAxisId="right" orientation="right" stroke={THEME.text} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: `2px solid ${THEME.primary}`, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar yAxisId="left" dataKey="resolved" fill="url(#compositeGradient1)" radius={[8, 8, 0, 0]} name="Resolved" />
                <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke={THEME.primary} strokeWidth={3} dot={{ fill: THEME.primary, r: 5 }} name="Avg Time (hrs)" />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Complaints Status Distribution - NEW */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: gridGap }}>
            {/* Status Distribution Doughnut Chart */}
            <div style={{ backgroundColor: 'white', padding: sectionPadding, borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
              <h3 style={{ fontSize: fontSize.title, fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0' }}>Complaint Status Distribution</h3>
              <div style={{ position: 'relative', height: categoryChartHeight }}>
                <Doughnut 
                  data={{
                    labels: ['Resolved', 'Pending', 'In Review', 'On Hold', 'Rejected'],
                    datasets: [{
                      label: 'Complaints by Status',
                      data: [
                        complaints.filter(c => c.status === 'Resolved').length,
                        complaints.filter(c => c.status === 'Pending').length,
                        complaints.filter(c => c.status === 'Reviewed').length,
                        complaints.filter(c => c.status === 'On Hold').length,
                        complaints.filter(c => c.status === 'Rejected').length,
                      ],
                      backgroundColor: [
                        'rgba(16, 185, 129, 0.9)', // Green - Resolved
                        'rgba(245, 158, 11, 0.9)', // Amber - Pending
                        'rgba(59, 130, 246, 0.9)', // Blue - In Review
                        'rgba(107, 114, 128, 0.9)', // Gray - On Hold
                        'rgba(239, 68, 68, 0.9)', // Red - Rejected
                      ],
                      borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(107, 114, 128, 1)',
                        'rgba(239, 68, 68, 1)',
                      ],
                      borderWidth: isMobile ? 2 : 3,
                      borderRadius: 8,
                      hoverOffset: 10,
                      shadow: {
                        blur: 10,
                        offsetX: 0,
                        offsetY: 2,
                        color: 'rgba(0, 0, 0, 0.2)',
                      }
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { padding: isMobile ? 8 : 15, font: { size: isMobile ? 10 : 11, weight: '600' }, usePointStyle: true }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: isMobile ? 11 : 12 },
                        borderColor: THEME.primary,
                        borderWidth: 2,
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = ((context.parsed.y / total) * 100).toFixed(1)
                            return `${context.label}: ${context.parsed.y} (${percentage}%)`
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Status Breakdown Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gap: '12px' }}>
              {[
                { label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, color: THEME.success, icon: CheckCircle, lightColor: '#d1fae5' },
                { label: 'Pending', value: complaints.filter(c => c.status === 'Pending').length, color: THEME.warning, icon: Clock, lightColor: '#fef3c7' },
                { label: 'In Review', value: complaints.filter(c => c.status === 'Reviewed').length, color: THEME.primary, icon: AlertCircle, lightColor: '#dbeafe' },
                { label: 'On Hold', value: complaints.filter(c => c.status === 'On Hold').length, color: '#6b7280', icon: AlertTriangle, lightColor: '#f3f4f6' },
              ].map((status, idx) => {
                const Icon = status.icon
                const total = complaints.length
                const percentage = total > 0 ? ((status.value / total) * 100).toFixed(1) : 0
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      padding: '16px',
                      backgroundColor: status.lightColor,
                      borderRadius: '12px',
                      border: `2px solid ${status.color}40`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{ padding: '8px', backgroundColor: status.color + '20', borderRadius: '8px' }}>
                        <Icon size={18} color={status.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: '#666', fontWeight: '600', margin: '0 0 2px 0', textTransform: 'uppercase' }}>{status.label}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '8px', alignItems: 'center' }}>
                          <p style={{ fontSize: '18px', fontWeight: '900', color: status.color, margin: 0 }}>{status.value}</p>
                          <div style={{ width: '100px', height: '6px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.1 }}
                              style={{ height: '100%', backgroundColor: status.color }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: status.color, margin: 0, textAlign: 'right' }}>{percentage}%</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // AI Description Generator - Improves tenant input
  async function generateComplaintDescription(userInput) {
    if (!userInput.trim()) {
      alert('Please enter at least a few words describing your issue')
      return
    }

    setGeneratingDescription(true)
    try {
      const prompt = `You are an expert property management specialist. A tenant submitted this complaint. Your job is to transform it into a professional, detailed description that helps maintenance staff understand the issue quickly.

Tenant's raw input: "${userInput}"

Requirements:
1. Create a PROFESSIONAL DESCRIPTION with exactly this format:
   - START with ONE CLEAR TITLE/HEADING (e.g., "Plumbing Issue: Water Leak in Kitchen")
   - THEN provide numbered details (1, 2, 3, etc.) covering:
     1. What exactly is the problem?
     2. Where is it located?
     3. When did it start?
     4. How severe/urgent is it?
     5. Safety concerns (if any)?

2. Use professional property management language
3. Keep tenant's original intent but make it clearer
4. Remove any markdown formatting (**bold**, ##headers, etc.)

Format example:
Bathroom Fixture Malfunction: Persistent Dripping Faucet
1. The hot water faucet in the master bathroom has been dripping continuously for 3 days
2. Located at the bathroom sink, right side handle
3. Started after the apartment's cold spell when pipes froze temporarily
4. Not an emergency but wastes water; moderate severity
5. No immediate safety concern, but may cause water damage if ignored

Output ONLY the formatted description with heading and numbered points. No other text.`

      const response = await callOpenRouterAPI(prompt)
      setGeneratedDescription(response)
      // Don't update textarea - just show in the display section
    } catch (error) {
      console.error('Failed to generate description:', error)
      alert(`❌ Description Generation Failed:\n${error.message}\n\nCheck console for details.`)
    }
    setGeneratingDescription(false)
  }

  // Parse and format AI recommendations into clear steps
  function parseRecommendations(text) {
    // Split by numbered items or sections
    const sections = text.split(/(\d+\.|STEP \d+:|Step \d+:)/i).filter(s => s.trim())
    const formatted = []
    let currentStep = ''
    let stepNum = 0

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim()
      
      if (section.match(/^\d+\.|STEP \d+:|Step \d+:/i)) {
        if (currentStep) {
          formatted.push({ type: 'step', number: stepNum, content: currentStep })
          stepNum++
        }
        currentStep = ''
      } else if (section) {
        currentStep += section + ' '
      }
    }
    
    if (currentStep) {
      formatted.push({ type: 'step', number: stepNum, content: currentStep })
    }

    return formatted
  }

  // Test API connection directly
  async function testAPIConnection() {
    console.log('🧪 Testing OpenRouter API connection...')
    try {
      const testResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://sino-fas.vercel.app',
          'X-Title': 'SINO-FAS Property Management',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [{ role: 'user', content: 'Reply with exactly: WORKING' }],
          max_tokens: 50,
          temperature: 0.7
        }),
      })
      
      console.log('Test Response Status:', testResponse.status)
      const testData = await testResponse.json()
      console.log('Test Response Data:', testData)
      
      if (testResponse.ok) {
        alert('✅ API IS WORKING!\n\nResponse: ' + testData.choices?.[0]?.message?.content)
      } else {
        alert('❌ API Error:\n' + JSON.stringify(testData, null, 2))
      }
    } catch (error) {
      alert('❌ API Connection Error:\n' + error.message)
    }
  }

  // Helper to clean markdown formatting
  const cleanMarkdown = (text) => {
    if (!text) return ''
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove **bold**
      .replace(/\*(.+?)\*/g, '$1')     // Remove *italic*
      .replace(/###\s*/g, '')           // Remove ### headers
      .replace(/##\s*/g, '')            // Remove ## headers
      .replace(/#\s*/g, '')             // Remove # headers
      .trim()
  }

  // Helper to parse recommendations properly
  const parseAIRecommendations = (text) => {
    if (!text) return []
    
    // Split by emoji sections (📋, ⚠️, 🔔, 💬, 🔍)
    const sections = text.split(/\n(?=[\uD800-\uDBFF][\uDC00-\uDFFF]\s|\d+\s?[\.\)]|\d+\s?\d+\s?[\.\)])/)
    
    return sections.map((section, idx) => {
      const lines = section.split('\n').filter(l => l.trim())
      if (lines.length === 0) return null
      
      // Extract title line and items
      const titleLine = lines[0]
      const emojiMatch = titleLine.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF])\s*(.+?)(?:\s*:|$)/)
      const emoji = emojiMatch ? emojiMatch[1] : ''
      const title = emojiMatch ? cleanMarkdown(emojiMatch[2]) : cleanMarkdown(titleLine)
      
      // Extract numbered items
      const items = []
      let currentItem = ''
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        const numMatch = line.match(/^(\d+[\.\)])\s*(.+)$/)
        
        if (numMatch) {
          if (currentItem) items.push(currentItem)
          currentItem = cleanMarkdown(numMatch[2])
        } else if (line && currentItem) {
          currentItem += ' ' + cleanMarkdown(line)
        }
      }
      if (currentItem) items.push(currentItem)
      
      return { emoji, title, items, sectionIdx: idx }
    }).filter(s => s && (s.items.length > 0 || s.title))
  }

  // AI Recommendations & Safety Measures for Complaints
  async function generateComplaintRecommendations(complaint, role = 'staff') {
    setLoadingAIRec(true)
    try {
      const categoryLabel = CATEGORIES[complaint.category]?.label || 'General'
      
      // TENANT RECOMMENDATIONS - Focus on what they can do and safety
      const tenantPrompt = `You are an expert property manager providing guidance to a tenant about their complaint.

TENANT'S COMPLAINT:
Title: ${complaint.title}
Category: ${categoryLabel}
Urgency: ${complaint.urgency}
Description: ${complaint.description}

Format your response with ONE CLEAR HEADING and numbered steps grouped by topic:

🛡️ IMMEDIATE SAFETY TIPS
1) First safety precaution for this issue
2) Second safety action they should take
3) Third safety guideline

💡 WHAT YOU CAN DO WHILE WAITING
1) First thing tenant can do to help or prevent worsening
2) Second temporary measure
3) Third action to take

📞 WHEN TO ESCALATE (Contact Management)
1) Specific sign that it's urgent and needs immediate attention
2) What to tell them when calling
3) When to expect a response (timeframe)

✅ EXPECTED TIMELINE
1) Estimated time for first inspection
2) Typical repair timeline for this type of issue
3) When you should hear back from maintenance

Be VERY specific to their complaint type and situation. Use simple, easy-to-understand language.`

      // STAFF RECOMMENDATIONS - Focus on diagnosis, repair, and process
      const staffPrompt = `You are an expert property manager providing technical guidance to maintenance staff.

COMPLAINT TO DIAGNOSE & FIX:
Title: ${complaint.title}
Category: ${categoryLabel}
Urgency: ${complaint.urgency}
Description: ${complaint.description}
From Unit: ${complaint.tenantUnit}

Format your response with ONE CLEAR HEADING and numbered steps grouped by topic:

🔧 DIAGNOSTIC STEPS
1) First diagnostic test or observation
2) Second diagnostic step
3) Third diagnostic check
4) How to confirm the issue

⏱️ TIME ESTIMATE & MATERIALS
1) Estimated repair time
2) Required tools or materials
3) Whether this needs a contractor or internal staff

👷 REPAIR PROCEDURE
1) First step of the repair
2) Second procedure step
3) Third step
4) Final quality check

📧 TENANT COMMUNICATION
1) What to tell the tenant about the issue
2) When to contact them (before/after)
3) When to inform them of completion

🔍 FOLLOW-UP
1) When to schedule follow-up inspection
2) What to verify during follow-up
3) How to document completion

🚨 CONTRACTORS TO CONTACT (if needed)
1) Type of contractor needed for this issue
2) Typical cost range estimate
3) Emergency procedures

Be VERY specific to the complaint type. Include exact diagnostic questions or tests.`

      const prompt = role === 'tenant' ? tenantPrompt : staffPrompt

      console.log(`🚀 Sending ${role} recommendations for:`, complaint.title)
      const response = await callOpenRouterAPI(prompt)
      console.log(`✅ Got ${role} recommendations:`, response.substring(0, 100))
      setAiRecommendations(response)
    } catch (error) {
      console.error(`⚠️ ${role} Recommendations Failed:`, error.message)
      console.log('📋 Falling back to knowledge base for category:', complaint.category)
      alert(`⚠️ API Error (using fallback):\n${error.message}\n\nCheck console for details.`)
      // Generate formatted fallback recommendations
      const generateFallback = (categoryKey) => {
        const fallbacks = {
          'HVAC': {
            actions: ['Check thermostat - set to 72°F preferred', 'Verify all vents are unobstructed', 'Check air filters for dirt/blockage', 'Schedule HVAC specialist within 4-6 hours', 'Monitor temperature for next 24 hours'],
            warnings: ['Do NOT attempt DIY refrigerant work - refrigerant is toxic', 'Turn off unit immediately if strange odors detected', 'Risk of personal injury from moving parts'],
            escalation: ['No cooling in summer conditions', 'Strange burning or chemical smell from unit', 'Water leaking from indoor unit'],
            communication: ['Send SMS within 1 hour confirming receipt', 'Provide estimated time of specialist arrival', 'Update tenant every 2 hours during repair'],
            followup: ['Follow-up inspection after 1 week', 'Verify proper temperature operation', 'Document performance in system']
          },
          'PLUMBING': {
            actions: ['IMMEDIATE - Turn off main water valve if active leak detected', 'Document water damage with photos and video', 'Remove belongings from wet area', 'Call emergency plumber NOW (1.5h response target)', 'Start insurance claim process with photos'],
            warnings: ['🚨 DANGER - Risk of electrical hazard if water near electrical outlets', 'Slip hazard present - secure area with warning signs', 'Risk of mold growth if water not removed within 24-48 hours', 'Structural damage possible if water penetrates drywall/flooring'],
            escalation: ['Active water flow or ongoing leak', 'Visible structural damage to walls or floors', 'Water evident in units below', 'Tenant health concerns (elderly, children, immunocompromised)'],
            communication: ['Call tenant immediately - do not delay', 'Send confirmation text with plumber ETA', 'Assign emergency contractor and get their direct number to tenant', 'Notify adjacent units potentially affected'],
            followup: ['Structural inspection after 48 hours', 'Mold assessment after 72 hours if drywall is wet', 'Document all remediation work completed', 'Schedule follow-up inspection after 1 week']
          },
          'ELECTRICAL': {
            actions: ['DO NOT attempt any repairs - risk of electrocution', 'Turn off circuit breaker for affected outlet/appliance immediately', 'Mark outlet/area clearly - "DO NOT USE"', 'Schedule licensed electrician within 2 hours', 'Document issue with clear photos from multiple angles'],
            warnings: ['⚠️ EXTREME DANGER - Risk of electrocution and fire hazard', 'Keep away from water and moisture - do not use in wet areas', 'Never touch exposed wires or damaged outlets', 'Risk of electrical fire - do not override or bypass issue'],
            escalation: ['Burning smell, smoke, or sparks from outlet', 'Melted or charred outlets or wiring visible', 'Constant circuit breaker tripping', 'Fault affecting multiple outlets in unit'],
            communication: ['Call tenant IMMEDIATELY - emphasize danger', 'Provide licensed electrician\'s direct contact and ETA', 'Advise tenant to not use affected outlet/area', 'Get inspection completion certificate for building records'],
            followup: ['Require inspection certificate from licensed electrician', 'Verify all work passes municipal electrical inspection', 'Document repair in system with electrical license number']
          },
          'PEST': {
            actions: ['Identify pest type - ask tenant for photos if possible', 'Remove all food sources and secure trash/garbage', 'Schedule professional pest control within 24-48 hours', 'Provide tenant with prevention tips (seal entry points, cleanliness)', 'Schedule follow-up inspection in 2 weeks'],
            warnings: ['Health Risk - Rodents/insects can carry diseases and pathogens', 'Use protective gloves when handling/disposing any pest traps', 'Be cautious with pest control chemicals - keep people/pets away during treatment', 'Document any bites, stings, or allergic reactions reported by tenant'],
            escalation: ['Multiple units affected simultaneously', 'First pest complaint for unit in 30-day period', 'Tenant reports direct bites or stings', 'Visible droppings or extensive infestation'],
            communication: ['Assure tenant professional treatment is being scheduled', 'Provide pest control company name, phone, and scheduled treatment time', 'Explain treatment process and safety precautions', 'Get proof of treatment completion'],
            followup: ['Verify pest control service completion within 24 hours', 'Second treatment typically needed 2 weeks after first', 'Advise tenant on ongoing prevention (sealing entry points)', 'Document treatment and follow-up in system']
          },
          'NOISE': {
            actions: ['File formal noise complaint in system immediately', 'Contact source/adjacent unit to identify issue', 'Attempt mediation between parties if neighbors involved', 'Document time, duration, and nature of noise complaint', 'Issue formal warning if violation confirmed'],
            warnings: ['Escalation Risk - Multiple violations lead to formal lease action', 'Mediation may escalate tension - be professional and neutral', 'Document ALL communications for potential eviction proceedings', 'Verify complaint is legitimate and not retaliation'],
            escalation: ['Third noise violation in 30-day period', 'After fourth violation = grounds for lease termination', 'Noise after building quiet hours (10PM-8AM)', 'Noise loud enough to disturb multiple units'],
            communication: ['Send email confirmation of complaint to complainant', 'Forward building quiet hours policy to source unit', 'If repeated, send certified letter with warning', 'Offer mediation or soundproofing consultation'],
            followup: ['Check in with complainant after 3 days for updates', 'Document all interactions and resolutions', 'Follow up with source unit after warning issued', 'Track patterns for potential lease violation']
          }
        }
        return fallbacks[categoryKey] || fallbacks['HVAC']
      }

      const categoryKey = Object.keys(CATEGORIES).find(k => CATEGORIES[k].label.includes(complaint.category))
      const fallback = generateFallback(categoryKey)
      
      const formatted = `📋 IMMEDIATE ACTIONS (within 24h):
${fallback.actions.map((a, i) => `${i + 1}) ${a}`).join('\n')}

⚠️ SAFETY WARNINGS:
${fallback.warnings.map((w, i) => `${i + 1}) ${w}`).join('\n')}

🔔 ESCALATION TRIGGERS:
${fallback.escalation.map((e, i) => `${i + 1}) ${e}`).join('\n')}

💬 TENANT COMMUNICATION:
${fallback.communication.map((c, i) => `${i + 1}) ${c}`).join('\n')}

🔍 FOLLOW-UP INSPECTION:
${fallback.followup.map((f, i) => `${i + 1}) ${f}`).join('\n')}`

      setAiRecommendations(formatted)
    }
    setLoadingAIRec(false)
  }

  // Complaints View - FIXED for proper updates
  function renderComplaints() {
    const myComplaints = userRole === 'tenant' ? complaints.filter(c => c.tenantUnit === currentUser?.unit) : complaints
    const filteredComplaints = myComplaints.filter(c => 
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) && 
      (categoryFilter === 'ALL' || c.category === categoryFilter)
    )

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 24px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Filter Bar */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Filter size={18} color={THEME.primary} />
            <input type="text" placeholder="Search complaints..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} style={{ padding: '10px 12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '10px 12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              <option value="ALL">All Categories</option>
              {Object.entries(CATEGORIES).map(([key, cat]) => (<option key={key} value={key}>{cat.label}</option>))}
            </select>
          </motion.div>

          {/* Complaint List */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredComplaints.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: 'white', borderRadius: '12px', color: '#999' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: '14px', margin: 0 }}>No complaints found</p>
                {userRole === 'tenant' && <p style={{ fontSize: '12px', color: '#bbb', margin: '8px 0 0 0' }}>Start by filing a complaint to see it here</p>}
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredComplaints.map((complaint, idx) => (
                  <motion.div key={complaint.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ x: 4 }} onClick={() => setSelectedComplaint(complaint)} style={{ backgroundColor: 'white', padding: '18px', borderRadius: '12px', borderLeft: `5px solid ${complaint.riskLevel === 'High' ? THEME.danger : THEME.warning}`, cursor: 'pointer', display: 'grid', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 4px 0' }}>{complaint.id} - Unit {complaint.tenantUnit}</p>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: THEME.dark, margin: '0 0 8px 0' }}>{complaint.title}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', fontSize: '12px' }}>
                          <span>Category: <strong>{CATEGORIES[complaint.category]?.label}</strong></span>
                          <span>Status: <strong>{complaint.status}</strong></span>
                          <span>Urgency: <strong style={{ color: complaint.urgency === 'High' ? THEME.danger : THEME.warning }}>{complaint.urgency}</strong></span>
                          {userRole === 'staff' && <span>Approval: <strong style={{ color: complaint.approvalStatus === 'Approved' ? THEME.success : THEME.warning }}>{complaint.approvalStatus}</strong></span>}
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} style={{ padding: '8px 12px', backgroundColor: THEME.lightBg, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: THEME.primary, whiteSpace: 'nowrap', height: 'fit-content' }}>
                        View →
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        <AnimatePresence>
          {selectedComplaint && renderComplaintDetail()}
        </AnimatePresence>
      </motion.div>
    )
  }

  // AI Chat Widget - FIXED for customer portal
  function renderAIChat() {
    const isFirstMessage = chatMessages.length === 0
    
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'fixed', bottom: '24px', right: '24px', width: '420px', maxHeight: '650px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 999 }}>
        {/* Header */}
        <div style={{ backgroundColor: THEME.primary, color: 'white', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}><MessageCircle size={18} /></motion.div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 2px 0' }}>SINO AI Assistant</p>
              <p style={{ fontSize: '10px', margin: 0, opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}>●</span>
                Ready to help
              </p>
            </div>
          </div>
          <button onClick={() => setShowAIChat(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}><X size={18} /></button>
        </div>

        {/* Welcome Message for First Time */}
        {isFirstMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '16px', backgroundColor: '#f0f9ff', borderBottom: `1px solid ${THEME.light}`, fontSize: '12px', color: THEME.text, lineHeight: '1.5' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>👋 Welcome to SINO AI Support</p>
            <p style={{ margin: 0 }}>Ask me about maintenance issues, file complaints, get contractor recommendations, or track your requests. I'm here 24/7!</p>
          </motion.div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', alignContent: 'start' }}>
          {chatMessages.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '24px 12px', color: '#999', fontSize: '12px' }}>
              <MessageCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ margin: 0 }}>Start a conversation</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {chatMessages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ padding: '11px 14px', backgroundColor: msg.sender === 'user' ? THEME.primary : THEME.lightBg, color: msg.sender === 'user' ? 'white' : THEME.text, borderRadius: '12px', fontSize: '13px', maxWidth: '85%', lineHeight: '1.5', wordWrap: 'break-word' }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {aiResponding && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '11px 14px', backgroundColor: THEME.lightBg, borderRadius: '12px', color: THEME.text, fontSize: '13px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span>🤖 Thinking</span>
              <motion.span animate={{ opacity: [0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>.</motion.span>
              <motion.span animate={{ opacity: [0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}>.</motion.span>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${THEME.light}`, display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <input type="text" placeholder="Ask SINO AI..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ padding: '10px 12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }} />
          <motion.button whileHover={{ scale: 1.05 }} onClick={handleSendMessage} disabled={!chatInput.trim()} style={{ padding: '10px 12px', backgroundColor: chatInput.trim() ? THEME.primary : THEME.border, color: 'white', border: 'none', borderRadius: '8px', cursor: chatInput.trim() ? 'pointer' : 'not-allowed' }}><Send size={16} /></motion.button>
        </div>
      </motion.div>
    )
  }

  // Contractors Directory - STAFF ONLY
  function renderContractorsDirectory() {
    const contractorsBySpecialty = {}
    CONTRACTORS.forEach(contractor => {
      if (!contractorsBySpecialty[contractor.specialty]) {
        contractorsBySpecialty[contractor.specialty] = []
      }
      contractorsBySpecialty[contractor.specialty].push(contractor)
    })

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 24px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px', backgroundColor: THEME.lightBg, borderRadius: '12px', borderLeft: `4px solid ${THEME.primary}` }}>
            <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Contractor Management</p>
            <p style={{ fontSize: '13px', color: THEME.text, margin: 0 }}>Full contact directory of all approved contractors and service providers</p>
          </motion.div>

          {Object.entries(contractorsBySpecialty).map(([specialty, contractors]) => (
            <motion.div key={specialty} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gap: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.primary, margin: 0 }}>
                {CATEGORIES[specialty]?.label || specialty}
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {contractors.map(contractor => (
                  <motion.div 
                    key={contractor.id} 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedContractor(contractor)}
                    style={{ 
                      backgroundColor: 'white', 
                      padding: '20px', 
                      borderRadius: '12px', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      border: `2px solid ${THEME.light}`,
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '20px',
                      alignItems: 'start'
                    }}
                  >
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 'bold', color: THEME.dark, margin: 0 }}>{contractor.name}</p>
                        <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>License: {contractor.id}</p>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} color={THEME.primary} />
                          <span>{contractor.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={14} color={THEME.primary} />
                          <span>{contractor.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color={THEME.warning} />
                          <span>Response: {contractor.avgResponseTime}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={14} color={THEME.success} />
                          <span>{contractor.availability}</span>
                        </div>
                      </div>

                      <div>
                        <p style={{ fontSize: '11px', color: '#999', fontWeight: 'bold', margin: '0 0 6px 0' }}>Certifications:</p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {contractor.certifications?.map(cert => (
                            <span key={cert} style={{ fontSize: '10px', padding: '4px 8px', backgroundColor: THEME.success + '20', color: THEME.success, borderRadius: '12px', fontWeight: 'bold' }}>
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'grid', gap: '8px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <Star size={32} color={THEME.warning} fill={THEME.warning} />
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: THEME.dark, margin: '4px 0 0 0' }}>
                          {contractor.rating}
                        </p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        style={{ 
                          padding: '10px 16px', 
                          backgroundColor: THEME.primary, 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontWeight: 'bold',
                          fontSize: '11px'
                        }}
                        onClick={() => setSelectedContractor(contractor)}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  // Recommendation Detail Modal
  function renderRecommendationDetail() {
    if (!selectedRecommendation) return null

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1002, padding: '24px' }}>
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: THEME.primary + '15', borderRadius: '8px' }}>
                <selectedRecommendation.icon size={28} color={THEME.primary} />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: THEME.dark, margin: 0 }}>{selectedRecommendation.title}</h2>
                <p style={{ fontSize: '12px', color: THEME.primary, fontWeight: 'bold', margin: '4px 0 0 0', textTransform: 'uppercase' }}>{selectedRecommendation.category} • {selectedRecommendation.severity}</p>
              </div>
            </div>
            <button onClick={() => setSelectedRecommendation(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={24} /></button>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Description */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 8px 0' }}>Overview</p>
              <p style={{ fontSize: '14px', color: THEME.text, margin: 0, lineHeight: '1.8' }}>{selectedRecommendation.description}</p>
            </div>

            {/* Impact */}
            <div style={{ padding: '16px', backgroundColor: THEME.success + '08', borderRadius: '8px', border: `1px solid ${THEME.success}33` }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: THEME.success, margin: '0 0 8px 0', textTransform: 'uppercase' }}>Expected Impact</p>
              <p style={{ fontSize: '14px', color: THEME.text, margin: 0 }}>{selectedRecommendation.impact}</p>
            </div>

            {/* Timeline & Budget */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#999', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Timeline</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.primary, margin: 0 }}>{selectedRecommendation.timeline}</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#999', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Budget Estimate</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.warning, margin: 0 }}>{selectedRecommendation.budget}</p>
              </div>
            </div>

            {/* Action Items */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 12px 0' }}>Action Items</p>
              <div style={{ display: 'grid', gap: '10px' }}>
                {selectedRecommendation.actionItems?.map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: '12px', backgroundColor: THEME.lightBg, borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'start' }}>
                    <div style={{ padding: '4px 8px', backgroundColor: THEME.primary, color: 'white', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>
                      {idx + 1}
                    </div>
                    <p style={{ fontSize: '13px', color: THEME.text, margin: 0 }}>{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Approval */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <motion.button whileHover={{ scale: 1.02 }} style={{ padding: '12px', backgroundColor: THEME.success, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { alert('Recommendation approved and scheduled for implementation'); setSelectedRecommendation(null) }}>
                Approve & Schedule
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} style={{ padding: '12px', backgroundColor: THEME.border, color: THEME.text, border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setSelectedRecommendation(null)}>
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Recommendations View - ENHANCED with more details
  function renderRecommendations() {
    const detailedRecs = [
      { title: 'Prioritize HVAC Issues', description: 'HVAC complaints increased 45% this month. Assign additional specialists to reduce response time from 4.2 to 2.8 hours.', impact: 45, timeframe: '2 weeks', icon: TrendUp, category: 'Staffing' },
      { title: 'Improve Tenant Communication', description: 'Only 62% of tenants receive updates about their complaints. Implement auto-notifications to improve satisfaction.', impact: 38, timeframe: '1 week', icon: MessageCircle, category: 'Process' },
      { title: 'Contractor Performance Review', description: '3 contractors have ratings below 4.0. Schedule training or replacement process. Current avg rating: 4.6/5.', impact: 25, timeframe: '3 days', icon: Award, category: 'Quality' },
      { title: 'Peak Hour Analysis', description: 'Complaints spike 38% between 6-8 PM. Consider scheduling extra staff or implementing online booking system.', impact: 32, timeframe: '2 weeks', icon: Activity, category: 'Optimization' },
    ]

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 24px' }}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '12px', borderLeft: `4px solid ${THEME.primary}` }}>
            <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 6px 0', textTransform: 'uppercase' }}>AI-Powered Recommendations</p>
            <p style={{ fontSize: '13px', color: THEME.text, margin: 0 }}>Smart insights based on complaint patterns and operational data to improve service quality</p>
          </motion.div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {detailedRecs.map((rec, idx) => {
              const Icon = rec.icon
              return (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.02 }} onClick={() => setSelectedRecommendation(rec)} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: `5px solid ${THEME.primary}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={20} color={THEME.primary} />
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '700', color: THEME.dark, margin: 0 }}>{rec.title}</p>
                          <p style={{ fontSize: '10px', color: THEME.secondary, fontWeight: '600', margin: '4px 0 0 0', textTransform: 'uppercase' }}>{rec.category}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.6' }}>{rec.description}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                        <div style={{ padding: '8px 12px', backgroundColor: THEME.lightBg, borderRadius: '6px', fontSize: '11px', color: THEME.primary, fontWeight: '600' }}>Impact: {rec.impact}%</div>
                        <div style={{ padding: '8px 12px', backgroundColor: THEME.lightBg, borderRadius: '6px', fontSize: '11px', color: THEME.primary, fontWeight: '600' }}>Timeline: {rec.timeframe}</div>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.2 }} style={{ fontSize: '24px', cursor: 'pointer' }}>→</motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    )
  }

  // Feedback Analysis View - STAFF ONLY
  function renderFeedbackAnalysis() {
    // Build correlation heatmap data - complaint volume vs satisfaction by category
    const buildCorrelationHeatmap = () => {
      const categoryCorrelations = {}
      const categories = ['HVAC', 'PLUMBING', 'CLEANING', 'SAFETY', 'ELECTRICAL', 'NOISE', 'PEST', 'WAYFINDING', 'PARKING']
      
      categories.forEach(cat => {
        const catComplaints = complaints.filter(c => c.category === cat)
        const catSurveys = feedbackSurveys.filter(s => s.category === cat)
        
        const complaintCount = catComplaints.length
        const avgSatisfaction = catSurveys.length > 0 
          ? Math.round(catSurveys.reduce((sum, s) => sum + s.satisfaction_score, 0) / catSurveys.length)
          : 0
        
        categoryCorrelations[cat] = {
          category: cat,
          complaints: complaintCount,
          satisfaction: avgSatisfaction,
          gap: complaintCount > 0 ? Math.abs(avgSatisfaction - 80) : 0,
          trend: catSurveys.length > 0 && catSurveys[catSurveys.length - 1].satisfaction_score > 75 ? 'improving' : 'needs-work'
        }
      })
      
      return Object.values(categoryCorrelations).sort((a, b) => b.gap - a.gap)
    }
    
    // Extract key insights from mystery shopper data
    const getKeyInsights = () => {
      const negativeFindings = feedbackSurveys.filter(s => s.sentiment === 'critical' || s.sentiment === 'negative')
      const positiveAspects = feedbackSurveys.filter(s => s.sentiment === 'positive')
      
      return {
        critical: negativeFindings.map(f => ({
          category: f.category,
          issue: f.mystery_shopper_notes.split('.')[0],
          severity: f.sentiment === 'critical' ? 'CRITICAL' : 'HIGH',
          rating: f.rating
        })),
        strengths: positiveAspects.map(f => ({
          category: f.category,
          strength: f.mystery_shopper_notes.split('.')[0],
          rating: f.rating
        }))
      }
    }
    
    if (feedbackSurveys.length === 0) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 24px' }}>
          <div style={{ display: 'grid', gap: '24px', maxWidth: '900px' }}>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px', backgroundColor: THEME.lightBg, borderRadius: '12px', borderLeft: `4px solid ${THEME.primary}` }}>
              <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Customer Feedback & Mystery Shopper Analysis</p>
              <p style={{ fontSize: '13px', color: THEME.text, margin: 0 }}>Import survey data or mystery shopper reports to analyze patterns and correlations with complaints</p>
            </motion.div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '48px 24px' }}>
              <div style={{ textAlign: 'center', display: 'grid', gap: '24px' }}>
                <div>
                  <Upload size={48} color={THEME.primary} style={{ margin: '0 auto 16px', opacity: 0.6 }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 8px 0' }}>Import Customer Feedback or Reports</h3>
                  <p style={{ fontSize: '13px', color: '#999', margin: 0, maxWidth: '500px', lineHeight: '1.6', marginLeft: 'auto', marginRight: 'auto' }}>
                    Upload CSV or JSON files with survey responses or mystery shopper reports. Columns should include: date, rating, category, satisfaction_score, and mystery_shopper_notes.
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '12px', justifyContent: 'center' }}>
                  <input ref={feedbackFileInputRef} type="file" accept=".csv,.json" style={{ display: 'none' }} onChange={handleImportFeedback} />
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => feedbackFileInputRef.current?.click()} disabled={importingFile} style={{ padding: '16px 40px', backgroundColor: THEME.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: importingFile ? 'not-allowed' : 'pointer', fontSize: '14px', display: 'inline-block', width: 'fit-content', margin: '0 auto' }}>
                    {importingFile ? (
                      <><Loader size={16} style={{ display: 'inline', marginRight: '8px', animation: 'spin 1s linear infinite' }} /> Importing...</>
                    ) : (
                      <><Upload size={16} style={{ display: 'inline', marginRight: '8px' }} /> Import Feedback File</>
                    )}
                  </motion.button>
                </div>

                <div style={{ fontSize: '12px', color: '#999', padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '8px', marginTop: '16px' }}>
                  <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>Supported formats:</p>
                  <p style={{ margin: '4px 0' }}>✓ CSV with headers: date, rating, category, satisfaction_score, mystery_shopper_notes</p>
                  <p style={{ margin: '4px 0' }}>✓ JSON array of objects with same fields</p>
                  <p style={{ margin: '4px 0 0 0' }}>✓ Rating scale: 1-5 (5 being excellent)</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )
    }

    const analysis = feedbackAnalysis
    const correlationData = buildCorrelationHeatmap()
    const insights = getKeyInsights()

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 24px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Import Section */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '12px', borderLeft: `4px solid ${THEME.primary}`, display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: 0 }}>Surveys Analyzed: {feedbackSurveys.length} | Complaints Tracked: {complaints.length}</p>
              <p style={{ fontSize: '11px', color: THEME.primary, margin: '4px 0 0 0' }}>Real-time correlation analysis | Updated {new Date().toLocaleDateString()}</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => feedbackFileInputRef.current?.click()} disabled={importingFile} style={{ padding: '8px 16px', backgroundColor: THEME.primary, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: importingFile ? 'not-allowed' : 'pointer', fontSize: '12px' }}>
              <Upload size={14} style={{ display: 'inline', marginRight: '6px' }} /> Import More
            </motion.button>
            <input ref={feedbackFileInputRef} type="file" accept=".csv,.json" style={{ display: 'none' }} onChange={handleImportFeedback} />
          </motion.div>

          {/* Critical Issues Alert */}
          {insights.critical.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px', backgroundColor: '#fff5f5', borderRadius: '12px', borderLeft: `4px solid ${THEME.danger}` }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <AlertTriangle size={20} color={THEME.danger} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.danger, margin: '0 0 8px 0' }}>Critical Issues Detected in Mystery Shopper Report</p>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {insights.critical.map((issue, idx) => (
                      <p key={idx} style={{ fontSize: '12px', color: THEME.text, margin: 0, lineHeight: '1.4' }}>
                        <strong>{issue.category}</strong>: {issue.issue} (Rating: {issue.rating}/5)
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Key Metrics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ y: -8 }} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: `2px solid ${THEME.success}15`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: '11px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0' }}>Overall Satisfaction</p>
              <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ fontSize: '36px', fontWeight: 'bold', color: THEME.success, margin: 0 }}>{analysis?.avgRating}/5</motion.p>
              <p style={{ fontSize: '11px', color: '#999', margin: '8px 0 0 0' }}>Avg from {feedbackSurveys.length} surveys</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ y: -8 }} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: `2px solid ${THEME.warning}15`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: '11px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0' }}>Categories Tracked</p>
              <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ fontSize: '36px', fontWeight: 'bold', color: THEME.warning, margin: 0 }}>{new Set(feedbackSurveys.map(s => s.category)).size}</motion.p>
              <p style={{ fontSize: '11px', color: '#999', margin: '8px 0 0 0' }}>Service areas</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ y: -8 }} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: `2px solid ${THEME.primary}15`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: '11px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0' }}>Avg Satisfaction %</p>
              <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ fontSize: '36px', fontWeight: 'bold', color: THEME.primary, margin: 0 }}>{Math.round(feedbackSurveys.reduce((sum, s) => sum + s.satisfaction_score, 0) / feedbackSurveys.length)}%</motion.p>
              <p style={{ fontSize: '11px', color: '#999', margin: '8px 0 0 0' }}>Target: 85%+</p>
            </motion.div>
          </motion.div>

          {/* Category Correlation Matrix */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 16px 0' }}>Satisfaction vs Complaint Volume by Category</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${THEME.border}` }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 'bold', color: THEME.text }}>Category</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold', color: THEME.text }}>Complaints</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold', color: THEME.text }}>Satisfaction %</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold', color: THEME.text }}>Gap</th>
                    <th style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold', color: THEME.text }}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {correlationData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${THEME.light}` }}>
                      <td style={{ padding: '12px', color: THEME.text, fontWeight: '500' }}>{row.category}</td>
                      <td style={{ textAlign: 'center', padding: '12px', color: THEME.danger }}><strong>{row.complaints}</strong></td>
                      <td style={{ textAlign: 'center', padding: '12px', color: row.satisfaction < 70 ? THEME.danger : THEME.success }}>{row.satisfaction}%</td>
                      <td style={{ textAlign: 'center', padding: '12px', color: row.gap > 15 ? THEME.danger : THEME.success }}>{row.gap} pts</td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>
                        {row.trend === 'improving' ? (
                          <span style={{ color: THEME.success, fontWeight: 'bold', fontSize: '12px' }}>↑ Improving</span>
                        ) : (
                          <span style={{ color: THEME.danger, fontWeight: 'bold', fontSize: '12px' }}>↓ Attention Needed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Rating & Satisfaction Trends Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 16px 0' }}>Rating & Satisfaction Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysis?.ratingTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                <XAxis dataKey="date" stroke={THEME.text} style={{ fontSize: '12px' }} />
                <YAxis stroke={THEME.text} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: `2px solid ${THEME.primary}` }} />
                <Legend />
                <Line type="monotone" dataKey="rating" stroke={THEME.success} strokeWidth={2} name="Rating" dot={{ fill: THEME.success }} />
                <Line type="monotone" dataKey="satisfaction" stroke={THEME.warning} strokeWidth={2} name="Satisfaction" dot={{ fill: THEME.warning }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Satisfaction Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 16px 0' }}>Satisfaction by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysis?.categoryAnalysis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.border} />
                <XAxis dataKey="category" stroke={THEME.text} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke={THEME.text} yAxisId="left" label={{ value: 'Avg Rating', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke={THEME.text} label={{ value: 'Complaints', angle: 90, position: 'insideRight' }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: `2px solid ${THEME.primary}` }} />
                <Legend />
                <Bar yAxisId="left" dataKey="avgRating" fill={THEME.success} name="Avg Rating" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="complaints" fill={THEME.danger} name="Complaints" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Issues and Strengths */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
            {/* Top Issues */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 16px 0' }}>Areas Needing Attention</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {(analysis?.topIssues || []).slice(0, 4).map((issue, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: '12px', backgroundColor: THEME.lightBg, borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: THEME.text, margin: 0 }}>{idx + 1}. {issue.issue}</p>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ padding: '6px 12px', backgroundColor: THEME.danger, color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                      {issue.frequency}x
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            {insights.strengths && insights.strengths.length > 0 && (
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 16px 0' }}>Excellence Areas</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {insights.strengths.slice(0, 4).map((strength, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', borderLeft: `3px solid ${THEME.success}` }}>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: THEME.text, margin: 0 }}>{strength.strength}</p>
                      <div style={{ padding: '6px 12px', backgroundColor: THEME.success, color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                        {strength.rating}/5
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Key Insights and Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: THEME.primary + '10', padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${THEME.primary}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 16px 0' }}>Strategic Insights & Recommendations</h3>
            <div style={{ display: 'grid', gap: '12px', fontSize: '13px', color: THEME.text, lineHeight: '1.6' }}>
              {correlationData.length > 0 && (
                <>
                  <p style={{ margin: 0 }}>
                    <strong>1. Top Priority Fix:</strong> {correlationData[0]?.category} has the largest satisfaction gap ({correlationData[0]?.gap} points). Focus improvement efforts here.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>2. Complaint Volume:</strong> {correlationData.sort((a, b) => b.complaints - a.complaints)[0]?.category} generates the most complaints ({correlationData.sort((a, b) => b.complaints - a.complaints)[0]?.complaints}). Implement preventive measures.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>3. Improvement Momentum:</strong> {correlationData.filter(c => c.trend === 'improving').length} categories showing positive trends. Replicate these success strategies.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>4. Target Goal:</strong> Current satisfaction: {Math.round(feedbackSurveys.reduce((sum, s) => sum + s.satisfaction_score, 0) / feedbackSurveys.length)}% | Goal: 85% | Priority: Address {correlationData[0]?.category} first.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Auth Views
  if (authState === 'initial') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${THEME.accent} 0%, ${THEME.primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', color: 'white', maxWidth: '550px' }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h1 style={{ fontSize: '56px', fontWeight: 'bold', margin: '0 0 12px 0' }}>SINO-FAS</h1>
            <p style={{ fontSize: '18px', opacity: 0.95, margin: '0 0 48px 0', lineHeight: '1.6' }}>Sino Property Intelligent Feedback Analysis System</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setAuthState('login')} style={{ padding: '16px', backgroundColor: 'white', color: THEME.primary, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}><LogIn size={18} style={{ display: 'inline', marginRight: '8px' }} /> Tenant Sign In</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setAuthState('login'); setLoginEmail('staff@sinostaff.com') }} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Staff Portal</motion.button>
          </motion.div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setAuthState('signup')} style={{ padding: '12px 32px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}><UserPlus size={16} style={{ display: 'inline', marginRight: '6px' }} /> Register Tenant</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={handleGuestAccess} style={{ padding: '12px 32px', backgroundColor: 'transparent', color: 'white', border: '2px solid white', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Customer Chat Portal</motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (authState === 'login') {
    const isStaffEmail = loginEmail.includes('@sinostaff')
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${THEME.accent} 0%, ${THEME.primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '420px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 8px 0' }}>{isStaffEmail ? 'Staff Portal' : 'Tenant Sign In'}</h2>
            {isStaffEmail && <p style={{ fontSize: '11px', color: THEME.success, fontWeight: 'bold', margin: 0 }}>Staff Account Detected</p>}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(loginEmail, loginPassword) }} style={{ display: 'grid', gap: '16px' }}>
            <input type="email" placeholder={isStaffEmail ? 'staff@sinostaff.com' : 'your@email.com'} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: `2px solid ${isStaffEmail ? THEME.success : THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} style={{ padding: '14px', backgroundColor: THEME.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Sign In</motion.button>
          </form>
          <motion.button onClick={() => setAuthState('signup')} style={{ width: '100%', marginTop: '16px', padding: '12px', backgroundColor: 'transparent', color: THEME.primary, border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Need an account? Register</motion.button>
          <motion.button onClick={() => setAuthState('initial')} style={{ width: '100%', marginTop: '8px', padding: '12px', backgroundColor: 'transparent', color: THEME.secondary, border: 'none', cursor: 'pointer', fontSize: '13px' }}>Back to Home</motion.button>
        </motion.div>
      </motion.div>
    )
  }

  if (authState === 'signup') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${THEME.accent} 0%, ${THEME.primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '420px', width: '100%' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 24px 0', textAlign: 'center' }}>Register as Tenant</h2>
          <form onSubmit={(e) => { e.preventDefault(); signupPassword === signupConfirm ? handleSignup(signupEmail, signupPassword, signupName, signupUnit) : alert('Passwords do not match') }} style={{ display: 'grid', gap: '16px' }}>
            <input type="text" placeholder="Full Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Unit Number (e.g., 2801)" value={signupUnit} onChange={(e) => setSignupUnit(e.target.value)} style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            <input type="password" placeholder="Confirm Password" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} style={{ width: '100%', padding: '12px', border: `2px solid ${THEME.light}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            <motion.button type="submit" whileHover={{ scale: 1.02 }} style={{ padding: '14px', backgroundColor: THEME.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Create Account</motion.button>
          </form>
          <motion.button onClick={() => setAuthState('login')} style={{ width: '100%', marginTop: '16px', padding: '12px', backgroundColor: 'transparent', color: THEME.primary, border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Already registered? Sign In</motion.button>
        </motion.div>
      </motion.div>
    )
  }

  // Tenant-Specific Dashboard
  function renderTenantDashboard() {
    const myComplaints = complaints.filter(c => c.tenantUnit === currentUser?.unit)
    const resolvedCount = myComplaints.filter(c => c.status === 'Resolved').length
    const pendingCount = myComplaints.filter(c => c.status === 'Pending').length
    const avgResolutionTime = resolvedCount > 0 ? (myComplaints.filter(c => c.status === 'Resolved').reduce((sum, c) => sum + (c.resolutionNotes?.length || 0), 0) / resolvedCount / 10).toFixed(1) : '0'
    
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: window.innerWidth < 768 ? '16px 12px' : '32px 24px', background: 'linear-gradient(135deg, #f5f8fc 0%, #f0f4f8 100%)' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Unit Information Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0' }}>Your Unit Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '12px', border: `2px solid ${THEME.primary}20` }}>
                <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0' }}>UNIT NUMBER</p>
                <p style={{ fontSize: '24px', fontWeight: '900', color: THEME.primary, margin: 0 }}>{currentUser?.unit}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ y: -4 }} style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '12px', border: `2px solid ${THEME.success}20` }}>
                <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0' }}>TENANT NAME</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: THEME.text, margin: 0 }}>{currentUser?.name}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ y: -4 }} style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '12px', border: `2px solid ${THEME.warning}20` }}>
                <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0' }}>CONTACT</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: THEME.text, margin: 0 }}>{currentUser?.email}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Complaint Progress Metrics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { title: 'Total Complaints', value: myComplaints.length, icon: AlertCircle, color: THEME.primary },
              { title: 'Resolved', value: resolvedCount, icon: CheckCircle, color: THEME.success },
              { title: 'Pending', value: pendingCount, icon: Clock, color: THEME.warning },
              { title: 'Avg Resolution', value: `${avgResolutionTime}d`, icon: TrendingUp, color: THEME.secondary },
            ].map((metric, idx) => {
              const Icon = metric.icon
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -8 }} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: `2px solid ${metric.color}20`, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                  <Icon size={28} color={metric.color} style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>{metric.title}</p>
                  <p style={{ fontSize: '28px', fontWeight: '900', color: metric.color, margin: 0 }}>{metric.value}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Complaint Quality & Satisfaction */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0' }}>Complaint Status Distribution</h4>
              <div style={{ position: 'relative', height: 280 }}>
                <Doughnut
                  data={{
                    labels: ['Resolved', 'Pending', 'Reviewed'],
                    datasets: [{
                      data: [resolvedCount, pendingCount, myComplaints.filter(c => c.status === 'Reviewed').length],
                      backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(245, 158, 11, 0.85)', 'rgba(59, 130, 246, 0.85)'],
                      borderColor: ['rgba(16, 185, 129, 1)', 'rgba(245, 158, 11, 1)', 'rgba(59, 130, 246, 1)'],
                      borderWidth: 2,
                      borderRadius: 6,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { padding: 12, font: { size: 12, weight: '600' }, usePointStyle: true } },
                    }
                  }}
                />
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: `1px solid ${THEME.light}` }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 20px 0' }}>Recent Complaints Timeline</h4>
              <div style={{ display: 'grid', gap: '12px', maxHeight: 300, overflowY: 'auto' }}>
                {myComplaints.slice(0, 5).map((complaint, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: '12px', backgroundColor: THEME.lightBg, borderRadius: '8px', borderLeft: `4px solid ${complaint.status === 'Resolved' ? THEME.success : THEME.warning}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: THEME.dark, margin: '0 0 4px 0' }}>{complaint.title}</p>
                        <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{complaint.category}</p>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px', backgroundColor: complaint.status === 'Resolved' ? THEME.success + '20' : THEME.warning + '20', color: complaint.status === 'Resolved' ? THEME.success : THEME.warning, whiteSpace: 'nowrap' }}>{complaint.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Tenant Staff Directory - Who to Contact
  function renderTenantStaffDirectory() {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: window.innerWidth < 768 ? '16px 12px' : '32px 24px', background: 'linear-gradient(135deg, #f5f8fc 0%, #f0f4f8 100%)' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px', backgroundColor: THEME.lightBg, borderRadius: '12px', borderLeft: `4px solid ${THEME.primary}` }}>
            <p style={{ fontSize: '13px', color: THEME.text, margin: 0 }}>Know who to contact for different issues. Click on any staff member for more details.</p>
          </motion.div>

          {/* Staff Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {[
              {
                role: 'Property Manager',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@sinostaff.com',
                phone: '+1 (555) 123-4567',
                availability: 'Mon-Fri, 9AM-5PM',
                icon: Users,
                focus: 'General inquiries, unit issues, maintenance',
                color: THEME.primary,
              },
              {
                role: 'Maintenance Coordinator',
                name: 'Mike Chen',
                email: 'mike.chen@sinostaff.com',
                phone: '+1 (555) 234-5678',
                availability: 'Mon-Fri, 8AM-6PM',
                icon: Wrench,
                focus: 'Repairs, HVAC, plumbing, electrical',
                color: THEME.warning,
              },
              {
                role: 'Complaints & Resolution',
                name: 'Emma Davis',
                email: 'emma.davis@sinostaff.com',
                phone: '+1 (555) 345-6789',
                availability: 'Mon-Fri, 9AM-5PM',
                icon: AlertCircle,
                focus: 'Complaint tracking, escalations, follow-ups',
                color: THEME.danger,
              },
              {
                role: 'Tenant Services',
                name: 'James Wilson',
                email: 'james.wilson@sinostaff.com',
                phone: '+1 (555) 456-7890',
                availability: 'Mon-Sat, 10AM-6PM',
                icon: MessageCircle,
                focus: 'Tenant concerns, building amenities, events',
                color: THEME.success,
              },
            ].map((staff, idx) => {
              const Icon = staff.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    border: `2px solid ${staff.color}20`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', backgroundColor: staff.color + '15', borderRadius: '12px' }}>
                      <Icon size={24} color={staff.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase' }}>{staff.role}</p>
                      <p style={{ fontSize: '16px', fontWeight: '600', color: THEME.dark, margin: 0 }}>{staff.name}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '12px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.text }}>
                      <Mail size={14} color={THEME.primary} />
                      <a href={`mailto:${staff.email}`} style={{ color: THEME.primary, textDecoration: 'none', fontWeight: '500' }}>{staff.email}</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.text }}>
                      <Phone size={14} color={THEME.primary} />
                      <a href={`tel:${staff.phone}`} style={{ color: THEME.primary, textDecoration: 'none', fontWeight: '500' }}>{staff.phone}</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#999' }}>
                      <Clock size={14} />
                      {staff.availability}
                    </div>
                    <div style={{ padding: '8px 12px', backgroundColor: THEME.lightBg, borderRadius: '8px', color: THEME.text, fontSize: '11px', lineHeight: '1.4' }}>
                      {staff.focus}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.div>
    )
  }

  if (authState !== 'authenticated') return null

  // Customer Portal (With File Complaint & Chat)
  if (userRole === 'customer') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', height: '100vh', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
        {/* Sidebar for Customer Portal */}
        <motion.div style={{ width: window.innerWidth < 768 ? '100%' : '280px', backgroundColor: THEME.dark, color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', borderRight: `1px solid ${THEME.light}`, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>SINO Portal</h1>
            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Customer Support</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {[
              { id: 'chat', label: 'AI Chat Support', icon: MessageCircle },
              { id: 'complaint', label: 'File Complaint', icon: FileText },
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setCustomerTab(tab.id)}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: customerTab === tab.id ? THEME.primary : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: customerTab === tab.id ? 'white' : '#999',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: customerTab === tab.id ? '600' : '500',
                  transition: 'all 0.3s',
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={handleLogout}
            style={{
              padding: '12px',
              backgroundColor: THEME.danger + '20',
              color: THEME.danger,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            <LogOut size={14} /> Logout
          </motion.button>
        </motion.div>

        {/* Main Content Area for Customer Portal */}
        <motion.div style={{ flex: 1, overflow: 'auto', backgroundColor: THEME.lightBg, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <motion.div style={{ padding: window.innerWidth < 768 ? '12px 16px' : '16px 24px', backgroundColor: 'white', borderBottom: `1px solid ${THEME.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div>
              <h2 style={{ fontSize: window.innerWidth < 768 ? '18px' : '22px', fontWeight: 'bold', color: THEME.dark, margin: 0 }}>
                {customerTab === 'chat' ? 'Chat Support' : 'File a Complaint'}
              </h2>
              <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                {customerTab === 'chat' ? 'Get instant help from our AI assistant' : 'Report any issues with your property'}
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={customerTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%' }}
              >
                {customerTab === 'chat' ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: window.innerWidth < 768 ? '16px 12px' : '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                      <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: THEME.dark, margin: '0 0 8px 0' }}>Welcome to SINO Chat Support</h3>
                      <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>Our AI assistant is available 24/7 to help you. Ask about maintenance, complaints, billing, or any property-related questions.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setShowAIChat(true)}
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '20px',
                        margin: '0 auto',
                        display: 'block',
                        backgroundColor: THEME.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      Start Chat <MessageCircle size={18} style={{ display: 'inline', marginLeft: '8px' }} />
                    </motion.button>
                  </motion.div>
                ) : (
                  renderFileComplaint()
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* AI Chat Button - Always Available */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowAIChat(true)}
          style={{
            position: 'fixed',
            bottom: window.innerWidth < 768 ? '16px' : '24px',
            right: window.innerWidth < 768 ? '16px' : '24px',
            width: window.innerWidth < 768 ? '56px' : '60px',
            height: window.innerWidth < 768 ? '56px' : '60px',
            borderRadius: '50%',
            backgroundColor: THEME.primary,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            zIndex: 998,
            fontSize: '28px',
          }}
        >
          <MessageCircle size={32} />
        </motion.button>

        <AnimatePresence>{showAIChat && renderAIChat()}</AnimatePresence>
      </motion.div>
    )
  }

  // Tenant/Staff Portal
  const tabs = userRole === 'staff' ? [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: LineIcon },
    { id: 'file-complaint', label: 'File Complaint', icon: FileText },
    { id: 'complaints', label: 'All Complaints', icon: AlertCircle },
    { id: 'contractors', label: 'Contractors & Team', icon: Users },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'feedback-analysis', label: 'Feedback Analysis', icon: TrendingUp },
  ] : [
    { id: 'dashboard', label: 'My Dashboard', icon: LineIcon },
    { id: 'file-complaint', label: 'File Complaint', icon: FileText },
    { id: 'complaints', label: 'My Complaints', icon: ClipboardList },
    { id: 'staff-directory', label: 'Contact Staff', icon: Users },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', height: '100vh', backgroundColor: THEME.lightBg, flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
      {/* Sidebar - Mobile Overlay on smaller screens */}
      {window.innerWidth < 768 && sidebarOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 900 }} />
      )}
      <motion.div style={{ width: window.innerWidth < 768 ? (sidebarOpen ? '100%' : '0') : sidebarOpen ? '280px' : '0', backgroundColor: THEME.dark, color: 'white', transition: 'width 300ms', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: sidebarOpen ? `4px 0 12px rgba(0,0,0,0.2)` : 'none', position: window.innerWidth < 768 && sidebarOpen ? 'fixed' : 'relative', zIndex: window.innerWidth < 768 && sidebarOpen ? 999 : 'auto', maxHeight: window.innerWidth < 768 ? '100vh' : 'auto', left: 0, top: 0 }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${THEME.primary}33`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: window.innerWidth < 768 ? '16px' : '18px', fontWeight: 'bold', margin: 0 }}>SINO-FAS</h1>
            <p style={{ fontSize: '10px', color: THEME.light, margin: '6px 0 0 0' }}>{userRole === 'staff' ? 'Staff' : 'Tenant'}</p>
          </div>
          {window.innerWidth < 768 && (
            <motion.button onClick={() => setSidebarOpen(false)} style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}>
              <X size={20} />
            </motion.button>
          )}
        </div>
        <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: window.innerWidth < 768 ? 'auto' : 'visible', maxHeight: window.innerWidth < 768 ? 'calc(100vh - 80px)' : 'auto' }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button key={tab.id} onClick={() => { setActiveTab(tab.id); if (window.innerWidth < 768) setSidebarOpen(false) }} whileHover={{ x: 4 }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: isActive ? THEME.primary : 'transparent', color: 'white', fontWeight: isActive ? '600' : '400', cursor: 'pointer', fontSize: window.innerWidth < 768 ? '12px' : '13px', whiteSpace: 'nowrap' }}><Icon size={18} /><span>{window.innerWidth < 768 ? (tab.label.split(' ')[0]) : tab.label}</span></motion.button>
            )
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Top Bar - Mobile Optimized */}
        <div style={{ backgroundColor: 'white', borderBottom: `2px solid ${THEME.light}`, padding: window.innerWidth < 768 ? '12px 16px' : '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: window.innerWidth < 768 ? '12px' : '16px' }}>
            <motion.button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>{sidebarOpen ? <X size={20} color={THEME.primary} /> : <Menu size={20} color={THEME.primary} />}</motion.button>
            <h2 style={{ fontSize: window.innerWidth < 768 ? '14px' : '18px', fontWeight: '600', color: THEME.dark, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: window.innerWidth < 768 ? '200px' : 'auto' }}>{window.innerWidth < 768 ? (tabs.find(t => t.id === activeTab)?.label.split(' ')[0]) : tabs.find(t => t.id === activeTab)?.label}</h2>
          </div>
          <motion.button onClick={handleLogout} whileHover={{ scale: 1.05 }} style={{ padding: window.innerWidth < 768 ? '6px 12px' : '8px 16px', backgroundColor: THEME.danger, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: window.innerWidth < 768 ? '10px' : '12px', whiteSpace: 'nowrap' }}><LogOut size={14} style={{ display: window.innerWidth < 768 ? 'none' : 'inline', marginRight: '6px' }} /> {window.innerWidth < 768 ? 'Out' : 'Logout'}</motion.button>
        </div>

        {/* Content Area - Mobile Scrollable */}
        <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch', msOverflowStyle: '-ms-autohiding-scrollbar' }}>
          {activeTab === 'dashboard' && (userRole === 'staff' ? renderDashboard() : renderTenantDashboard())}
          {activeTab === 'file-complaint' && renderFileComplaint()}
          {(activeTab === 'complaints' || activeTab === 'my-complaints') && renderComplaints()}
          {activeTab === 'staff-directory' && renderTenantStaffDirectory()}
          {activeTab === 'contractors' && renderContractorsDirectory()}
          {activeTab === 'recommendations' && renderRecommendations()}
          {activeTab === 'feedback-analysis' && renderFeedbackAnalysis()}
        </div>
      </div>

      {/* Modals & Buttons */}
      <AnimatePresence>{selectedContractor && renderContractorInfo()}</AnimatePresence>
      <AnimatePresence>{selectedRecommendation && renderRecommendationDetail()}</AnimatePresence>
      <AnimatePresence>{showAIChat && renderAIChat()}</AnimatePresence>

      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowAIChat(!showAIChat)} style={{ position: 'fixed', bottom: window.innerWidth < 768 ? '16px' : '24px', right: window.innerWidth < 768 ? '16px' : '24px', width: window.innerWidth < 768 ? '56px' : '60px', height: window.innerWidth < 768 ? '56px' : '60px', borderRadius: '50%', backgroundColor: THEME.primary, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 998 }}><MessageCircle size={24} /></motion.button>
    </motion.div>
  )
}

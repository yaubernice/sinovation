import React, { useState } from 'react'
import { Send, MessageCircle, Check, AlertTriangle, Lightbulb } from 'lucide-react'
import { CATEGORIES, TENANTS, generateRecommendations } from '../mockData'

export default function ChatBot({ onComplaintSubmitted }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 Welcome to SINO Property Feedback System. I\'m here to help you report issues or ask questions. What can I assist you with today?',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [conversationState, setConversationState] = useState('initial')
  const [formData, setFormData] = useState({
    category: null,
    title: null,
    description: null,
    unit: null,
    tenantId: null,
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [ticketId, setTicketId] = useState(null)

  const botResponses = {
    initial: {
      responses: ['Report an issue', 'Ask a question', 'View my tickets'],
      messages: {
        'Report an issue': 'Sure! What type of issue are you reporting?',
        'Ask a question': 'I can help! What do you need to know?',
        'View my tickets': 'You can view your tickets in the Complaints section.',
      },
    },
    category_selection: {
      options: Object.entries(CATEGORIES).map(([key, val]) => ({
        id: key,
        label: val.label,
      })),
      message: 'Please select the category that best describes your issue:',
    },
    unit_input: {
      message: 'Which unit are you calling from? (e.g., 2801)',
    },
    description: {
      message: 'Please describe the issue in detail. When did it start?',
    },
    summary: {
      message: 'Thank you for reporting. Let me summarize and create a ticket for you.',
    },
  }

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      type: 'user',
      text,
    }
    setMessages([...messages, userMsg])
    setInputValue('')

    // Process conversation flow
    setTimeout(() => processUserInput(text), 600)
  }

  const processUserInput = (input) => {
    let nextState = conversationState
    let botMessage = ''
    let newFormData = { ...formData }

    switch (conversationState) {
      case 'initial':
        if (
          input.toLowerCase().includes('report') ||
          input.toLowerCase().includes('issue')
        ) {
          nextState = 'category_selection'
          botMessage = '📋 Great! What type of issue are you experiencing?\n\nSelect from the options below:'
        } else if (input.toLowerCase().includes('question')) {
          botMessage = '❓ Sure! What would you like to know? (Operating hours, contractor info, building amenities, etc.)'
        } else {
          botMessage = 'I can help you report an issue or answer questions. How can I assist?'
        }
        break

      case 'category_selection':
        const selectedCategory = Object.keys(CATEGORIES).find(key =>
          input.toUpperCase().includes(key) || input.toLowerCase().includes(CATEGORIES[key].label.toLowerCase())
        )
        if (selectedCategory) {
          newFormData.category = selectedCategory
          nextState = 'unit_input'
          botMessage = `✓ ${CATEGORIES[selectedCategory].label} issue noted.\n\nWhat's your unit number?`
        } else {
          botMessage = 'Could you please select one of the categories above?'
        }
        break

      case 'unit_input':
        newFormData.unit = input
        // Auto-detect tenant or prompt for phone
        const tenant = TENANTS.find(t => t.unit === input)
        if (tenant) {
          newFormData.tenantId = tenant.id
          nextState = 'description'
          botMessage = `📍 Unit ${input} verified.\n\nNow, please describe the issue in detail. When did it start?`
        } else {
          botMessage = `Unit ${input} not found in system. Could you provide your phone number? (e.g., 9123 4567)`
          if (input.match(/\d{4}\s?\d{4}/)) {
            nextState = 'description'
            botMessage = `✓ Phone recorded.\n\nPlease describe the issue in detail. When did it start?`
          }
        }
        break

      case 'description':
        newFormData.description = input
        const titleSuggestion = generateTitle(newFormData.category, input)
        newFormData.title = titleSuggestion
        nextState = 'summary'
        botMessage = `✓ Thank you for the details.\n\nLet me create your ticket now...`
        break

      case 'summary':
        // Create the ticket
        createTicket(newFormData)
        return

      default:
        botMessage = 'How can I help you?'
    }

    setConversationState(nextState)
    setFormData(newFormData)

    // Add bot message
    const botMsg = {
      id: messages.length + 2,
      type: 'bot',
      text: botMessage,
      options: getOptions(nextState),
    }
    setMessages(prev => [...prev, botMsg])
  }

  const generateTitle = (category, description) => {
    const keywords = {
      HVAC: ['cooling', 'heating', 'ac', 'temperature', 'cold', 'hot'].some(k =>
        description.toLowerCase().includes(k)
      )
        ? 'AC Unit Not Working'
        : 'HVAC Issue',
      PLUMBING: description.toLowerCase().includes('leak')
        ? 'Pipe Leak Detected'
        : 'Plumbing Issue',
      CLEANING: 'Cleaning Required',
      WAYFINDING: 'Navigation Issue',
      SAFETY: 'Safety Concern',
    }
    return keywords[category] || 'Issue Report'
  }

  const getOptions = (state) => {
    if (state === 'category_selection') {
      return Object.entries(CATEGORIES).map(([key, val]) => ({
        id: key,
        label: val.label,
      }))
    }
    return null
  }

  const createTicket = (data) => {
    const complaint = {
      id: `TK-2024-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      tenantId: data.tenantId || 'T-WALK-IN',
      tenantName: TENANTS.find(t => t.id === data.tenantId)?.name || 'Guest',
      tenantUnit: data.unit,
      category: data.category,
      title: data.title,
      description: data.description,
      riskLevel: assessRisk(data.category, data.description),
      status: 'Submitted',
      timestamp: new Date(),
      aiSuggestion: generateAISuggestion(data.category),
      recommendedContractor: null,
      recurrenceScore: Math.random() * 30,
      isRecurring: false,
      ticketHistory: [
        {
          status: 'Submitted',
          timestamp: new Date(),
          action: 'Complaint filed via AI chatbot',
        },
      ],
    }

    setTicketId(complaint.id)
    setShowConfirmation(true)

    // Call parent callback
    onComplaintSubmitted(complaint)
  }

  const assessRisk = (category, description) => {
    const highRiskKeywords = ['leak', 'fire', 'dangerous', 'broken', 'emergency', 'safety', 'hazard']
    const mediumRiskKeywords = ['not working', 'issue', 'problem', 'broken']

    const desc = description.toLowerCase()
    if (highRiskKeywords.some(k => desc.includes(k)) || category === 'SAFETY') {
      return 'High'
    }
    if (mediumRiskKeywords.some(k => desc.includes(k))) {
      return 'Medium'
    }
    return 'Low'
  }

  const generateAISuggestion = (category) => {
    const suggestions = {
      HVAC: 'Priority: Assign to CoolTech HVAC within 24 hours',
      PLUMBING: 'Priority: Emergency dispatch recommended',
      CLEANING: 'Schedule extra cleaning session',
      WAYFINDING: 'Update signage/app navigation',
      SAFETY: 'URGENT: Notify safety team immediately',
    }
    return suggestions[category] || 'Review and prioritize'
  }

  const handleOptionClick = (option) => {
    handleSendMessage(option.label || option)
  }

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: '✅ Ticket created successfully! You can track your complaint in the Complaints section. Is there anything else I can help you with?',
      },
    ])
    setConversationState('initial')
    setFormData({
      category: null,
      title: null,
      description: null,
      unit: null,
      tenantId: null,
    })
    setShowConfirmation(false)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg rounded-2xl px-5 py-3 ${
                msg.type === 'user'
                  ? 'bg-sino-dark text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              {msg.options && (
                <div className="mt-3 space-y-2">
                  {msg.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt)}
                      className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-sino-gold hover:text-sino-dark text-gray-700 rounded-lg text-sm font-medium transition"
                    >
                      • {opt.label || opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Confirmation screen */}
        {showConfirmation && ticketId && (
          <div className="mx-auto max-w-lg mt-6 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-300">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-500 rounded-full text-white">
                <Check size={32} />
              </div>
            </div>
            <h3 className="text-center text-xl font-bold text-green-900 mb-2">Ticket Created!</h3>
            <p className="text-center text-green-800 font-mono text-lg mb-4">{ticketId}</p>
            <div className="bg-white/80 p-4 rounded-lg mb-4 text-sm text-green-900 space-y-2">
              <p><strong>Category:</strong> {CATEGORIES[formData.category]?.label}</p>
              <p><strong>Risk Level:</strong> {formData.description?.length > 50 ? 'High' : 'Medium'}</p>
              <p><strong>Topic:</strong> {formData.title}</p>
            </div>
            <p className="text-center text-sm text-green-800 mb-4">
              Our team has been notified. You'll receive updates via SMS and email.
            </p>
            <button
              onClick={resetChat}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
            >
              Report Another Issue
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      {!showConfirmation && (
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sino-dark"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-6 py-3 bg-sino-dark hover:bg-sino-dark/90 text-white rounded-full transition flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  PhoneCall,
  Mail,
  Calendar,
  Clock,
  Users,
  Star,
  ChevronDown,
} from 'lucide-react'
import { formatDate, formatDistanceToNow } from 'date-fns'
import { CATEGORIES, CONTRACTORS } from '../mockData'

export default function ComplaintDetail({ complaint, onBack, onStatusUpdate }) {
  const [showTimeline, setShowTimeline] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState(complaint.status)

  const statusOptions = [
    'Submitted',
    'Classified',
    'Assigned',
    'In Progress',
    'Resolved',
    'Closed',
  ]

  const handleStatusChange = newStatus => {
    onStatusUpdate(complaint.id, newStatus)
    setSelectedStatus(newStatus)
  }

  const getRiskBadgeColor = risk => {
    const colors = {
      High: 'bg-risk-high text-white',
      Medium: 'bg-risk-medium text-white',
      Low: 'bg-risk-low text-white',
    }
    return colors[risk]
  }

  const getTimelineColor = status => {
    const colors = {
      Submitted: 'bg-blue-100 text-blue-800 border-blue-300',
      Classified: 'bg-blue-100 text-blue-800 border-blue-300',
      Assigned: 'bg-orange-100 text-orange-800 border-orange-300',
      'In Progress': 'bg-orange-100 text-orange-800 border-orange-300',
      Resolved: 'bg-green-100 text-green-800 border-green-300',
      Closed: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return colors[status] || 'bg-gray-100'
  }

  const recommendedContractor = complaint.recommendedContractor || CONTRACTORS[0]

  return (
    <div className="h-full overflow-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={18} />
          Back to Complaints
        </button>
        <span className={`px-4 py-2 rounded-full font-bold text-white ${getRiskBadgeColor(complaint.riskLevel)}`}>
          {complaint.riskLevel} Risk
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6">
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ticket ID</p>
              <p className="font-mono text-2xl font-bold text-sino-dark">{complaint.id}</p>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h1>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Category</p>
                <p className="text-sm font-medium text-gray-900">{CATEGORIES[complaint.category]?.label}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={e => handleStatusChange(e.target.value)}
                    className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sino-dark cursor-pointer"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-3 text-gray-600 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{complaint.description}</p>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>Reported:</strong> {formatDate(complaint.timestamp, 'PPpp')}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Timeline</h2>
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="text-sm font-semibold text-sino-dark hover:text-sino-dark/80"
              >
                {showTimeline ? 'Hide' : 'Show'}
              </button>
            </div>

            {showTimeline && (
              <div className="space-y-4">
                {complaint.ticketHistory.map((entry, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${getTimelineColor(entry.status)}`}>
                        <Clock size={16} />
                      </div>
                      {idx < complaint.ticketHistory.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-gray-900">{entry.status}</p>
                      <p className="text-sm text-gray-600">{entry.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(entry.timestamp, 'PPpp')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety Flag */}
          {complaint.riskLevel === 'High' && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 flex gap-4">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-red-900 mb-2">⚠️ Potential Safety Incident</h3>
                <p className="text-sm text-red-800">
                  This high-risk issue requires immediate attention. Consider prioritizing
                  contractor dispatch and safety team notification.
                </p>
              </div>
            </div>
          )}

          {/* Recurrence Alert */}
          {complaint.isRecurring && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 flex gap-4">
              <TrendingUp className="text-orange-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-orange-900 mb-2">🔄 Recurrence Alert</h3>
                <p className="text-sm text-orange-800">
                  This asset has failed 3+ times in the past 90 days. Recommend upgrading
                  or replacing the component to prevent further issues.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tenant Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Tenant Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Name</p>
                <p className="font-semibold text-gray-900">{complaint.tenantName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Unit</p>
                <p className="font-semibold text-gray-900">Unit {complaint.tenantUnit}</p>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition">
                  <PhoneCall size={16} />
                  Call Tenant
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition">
                  <Mail size={16} />
                  Email Tenant
                </button>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gradient-to-br from-sino-gold/10 to-yellow-50 rounded-xl border-2 border-sino-gold/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-sino-gold" size={20} />
              <h3 className="font-bold text-gray-900">AI Suggestion</h3>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">{complaint.aiSuggestion}</p>
          </div>

          {/* Recommended Contractor */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Recommended Contractor</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{recommendedContractor.name}</p>
                <p className="text-sm text-gray-600">{recommendedContractor.specialty}</p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-900">{recommendedContractor.rating}</span>
                <span className="text-sm text-gray-600">• {recommendedContractor.availability}</span>
              </div>
              <button className="w-full px-4 py-2 bg-sino-dark hover:bg-sino-dark/90 text-white font-semibold rounded-lg transition mt-3">
                Assign Contractor
              </button>
            </div>
          </div>

          {/* Recurrence Score */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Recurrence Score</h3>
            <div className="relative pt-2">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    complaint.recurrenceScore > 70
                      ? 'bg-risk-high'
                      : complaint.recurrenceScore > 40
                        ? 'bg-risk-medium'
                        : 'bg-risk-low'
                  }`}
                  style={{ width: `${complaint.recurrenceScore}%` }}
                ></div>
              </div>
              <p className="text-center font-bold text-gray-900 mt-2">
                {complaint.recurrenceScore.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-600 text-center mt-1">
                {complaint.recurrenceScore > 70
                  ? 'Very likely to recur'
                  : complaint.recurrenceScore > 40
                    ? 'Moderately likely to recur'
                    : 'Low recurrence risk'}
              </p>
            </div>
          </div>

          {/* Robot Status */}
          {complaint.robotStatus && (
            <div className="bg-blue-50 rounded-xl border border-blue-300 p-6">
              <h3 className="font-bold text-blue-900 mb-3">🤖 Robot Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-900">{complaint.robotStatus}</span>
                </div>
                <p className="text-xs text-blue-800 mt-2">
                  Robocore cleaning robot is en route to the location
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

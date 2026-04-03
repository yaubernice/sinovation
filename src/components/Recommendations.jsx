import React, { useState } from 'react'
import {
  Lightbulb,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react'
import { CATEGORIES, CONTRACTORS } from '../mockData'

export default function Recommendations({
  recommendations,
  complaints,
  onAction,
}) {
  const [expandedRec, setExpandedRec] = useState(null)

  const strategicRecommendations = recommendations.filter(r => r.type === 'strategic')
  const perTicketRecommendations = complaints.slice(0, 3).map(c => ({
    ticketId: c.id,
    title: c.title,
    category: c.category,
    suggestion: c.aiSuggestion,
    contractor: CONTRACTORS.find(
      ctr => ctr.specialty === c.category
    ) || CONTRACTORS[0],
    riskLevel: c.riskLevel,
  }))

  const handleApprove = (recId) => {
    onAction(recId, 'approve')
  }

  const handleReject = (recId) => {
    onAction(recId, 'reject')
  }

  const getSeverityColor = severity => {
    const colors = {
      High: 'bg-risk-high/10 text-risk-high border-risk-high',
      Medium: 'bg-risk-medium/10 text-risk-medium border-risk-medium',
      Low: 'bg-risk-low/10 text-risk-low border-risk-low',
    }
    return colors[severity] || colors.Low
  }

  const getSeverityIcon = severity => {
    if (severity === 'High') return <AlertTriangle size={16} />
    if (severity === 'Medium') return <Zap size={16} />
    return <TrendingUp size={16} />
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-white p-6">
      {/* Strategic Recommendations */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-sino-dark" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Strategic Recommendations</h2>
        </div>
        <p className="text-gray-600 mb-4">
          AI-analyzed opportunities to improve operations and prevent issues
        </p>

        {strategicRecommendations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Lightbulb className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-gray-500 font-medium">No recommendations yet</p>
            <p className="text-sm text-gray-400">More data will generate recommendations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {strategicRecommendations.map(rec => (
              <div
                key={rec.id}
                className={`bg-white rounded-xl border-2 ${getSeverityColor(rec.severity)}`}
              >
                <button
                  onClick={() =>
                    setExpandedRec(expandedRec === rec.id ? null : rec.id)
                  }
                  className="w-full p-6 text-left hover:bg-gray-50/50 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${getSeverityColor(rec.severity)}`}>
                          {getSeverityIcon(rec.severity)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{rec.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      size={20}
                      className={`flex-shrink-0 transition ${
                        expandedRec === rec.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {expandedRec === rec.id && (
                    <div className="mt-4 pt-4 border-t border-current/20 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Expected Impact</p>
                        <div className="bg-white/50 rounded-lg px-4 py-3 text-sm text-gray-800">
                          {rec.impact}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Implementation</p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Schedule immediate action</li>
                          <li>• Assign to appropriate department</li>
                          <li>• Monitor progress weekly</li>
                          <li>• Report results in 30 days</li>
                        </ul>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={() => handleApprove(rec.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                        >
                          <Check size={16} />
                          Approve & Execute
                        </button>
                        <button
                          onClick={() => handleReject(rec.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </div>

                      {rec.approved && (
                        <div className="mt-3 p-3 bg-green-100/50 rounded-lg flex items-center gap-2 text-sm text-green-900 font-semibold">
                          <Check size={16} />
                          ✓ Approved - Queued for execution
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Per-Ticket Recommendations */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="text-sino-dark" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Per-Ticket Recommendations</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Specific action items for individual complaints
        </p>

        {perTicketRecommendations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Lightbulb className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-gray-500 font-medium">No complaints available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {perTicketRecommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-mono text-sm font-semibold text-sino-dark">{rec.ticketId}</p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{rec.title}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    rec.riskLevel === 'High'
                      ? 'bg-risk-high/10 text-risk-high'
                      : rec.riskLevel === 'Medium'
                        ? 'bg-risk-medium/10 text-risk-medium'
                        : 'bg-risk-low/10 text-risk-low'
                  }`}>
                    {rec.riskLevel} Risk
                  </div>
                </div>

                {/* Suggestion Box */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-4 mb-4">
                  <p className="text-sm font-semibold text-blue-900 flex items-start gap-2">
                    <Lightbulb size={16} className="mt-0.5 flex-shrink-0" />
                    {rec.suggestion}
                  </p>
                </div>

                {/* Contractor Recommendation */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Recommended Contractor</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{rec.contractor.name}</p>
                      <p className="text-sm text-gray-600">{rec.contractor.specialty}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-bold text-gray-900">{rec.contractor.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">{rec.contractor.availability}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-sino-dark hover:bg-sino-dark/90 text-white font-semibold rounded-lg transition">
                    Approve & Dispatch
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How AI Works */}
      <div className="mt-8 bg-gradient-to-br from-sino-dark/5 to-sino-gold/5 rounded-xl border-2 border-sino-dark/20 p-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Lightbulb className="text-sino-gold" size={20} />
          How AI Recommendations Work
        </h3>
        <ul className="text-sm text-gray-800 space-y-2">
          <li>
            <strong>Pattern Recognition:</strong> Analyzes complaint data to identify trends and
            recurring issues
          </li>
          <li>
            <strong>Correlation Analysis:</strong> Compares mystery shopper reports with complaint
            data for root cause identification
          </li>
          <li>
            <strong>Predictive Insights:</strong> Forecasts seasonal peaks and resource
            requirements
          </li>
          <li>
            <strong>Contractor Matching:</strong> Recommends best-fit contractors based on
            specialty, rating, and availability
          </li>
        </ul>
      </div>
    </div>
  )
}

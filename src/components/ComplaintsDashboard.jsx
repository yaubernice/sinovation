import React, { useState } from 'react'
import {
  Filter,
  Search,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import { formatDistanceToNow, formatDate } from 'date-fns'
import { CATEGORIES } from '../mockData'
import ComplaintDetail from './ComplaintDetail'

export default function ComplaintsDashboard({
  complaints,
  onStatusUpdate,
  onSelectComplaint,
  selectedComplaint,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Filter and search
  let filtered = complaints.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tenantName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === 'all' || c.category === filterCategory
    const matchesRisk = filterRisk === 'all' || c.riskLevel === filterRisk
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus

    return matchesSearch && matchesCategory && matchesRisk && matchesStatus
  })

  // Sort
  if (sortBy === 'recent') {
    filtered.sort((a, b) => b.timestamp - a.timestamp)
  } else if (sortBy === 'high-risk') {
    const riskOrder = { High: 0, Medium: 1, Low: 2 }
    filtered.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel])
  }

  const getRiskColor = risk => {
    const colors = {
      High: 'text-risk-high bg-risk-high/10',
      Medium: 'text-risk-medium bg-risk-medium/10',
      Low: 'text-risk-low bg-risk-low/10',
    }
    return colors[risk] || colors.Low
  }

  const getStatusIcon = status => {
    const icons = {
      Submitted: <Clock size={16} className="text-blue-500" />,
      Classified: <AlertCircle size={16} className="text-blue-500" />,
      Assigned: <Zap size={16} className="text-orange-500" />,
      'In Progress': <AlertCircle size={16} className="text-orange-500" />,
      Resolved: <CheckCircle size={16} className="text-green-500" />,
      Closed: <CheckCircle size={16} className="text-green-600" />,
    }
    return icons[status] || icons.Submitted
  }

  const getStatusColor = status => {
    const colors = {
      Submitted: 'bg-blue-50 border-blue-200',
      Classified: 'bg-blue-50 border-blue-200',
      Assigned: 'bg-orange-50 border-orange-200',
      'In Progress': 'bg-orange-50 border-orange-200',
      Resolved: 'bg-green-50 border-green-200',
      Closed: 'bg-gray-50 border-gray-200',
    }
    return colors[status] || colors.Submitted
  }

  if (selectedComplaint) {
    return (
      <ComplaintDetail
        complaint={selectedComplaint}
        onBack={() => onSelectComplaint(null)}
        onStatusUpdate={onStatusUpdate}
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-6 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ticket ID, title, or tenant..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sino-dark"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sino-dark"
          >
            <option value="recent">Most Recent</option>
            <option value="high-risk">High Risk First</option>
          </select>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Filter size={16} />
              Category
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-max">
              <button
                onClick={() => setFilterCategory('all')}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  filterCategory === 'all' ? 'bg-sino-gold/20 font-semibold' : ''
                }`}
              >
                All Categories
              </button>
              {Object.entries(CATEGORIES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilterCategory(key)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    filterCategory === key ? 'bg-sino-gold/20 font-semibold' : ''
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <AlertTriangle size={16} />
              Risk Level
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {['all', 'High', 'Medium', 'Low'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilterRisk(level)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 whitespace-nowrap ${
                    filterRisk === level ? 'bg-sino-gold/20 font-semibold' : ''
                  }`}
                >
                  {level === 'all' ? 'All Levels' : level}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Clock size={16} />
              Status
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-max">
              {['all', 'Submitted', 'Classified', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map(
                status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      filterStatus === status ? 'bg-sino-gold/20 font-semibold' : ''
                    }`}
                  >
                    {status === 'all' ? 'All Statuses' : status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
        Showing {filtered.length} of {complaints.length} complaints
      </div>

      {/* Complaints Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">No complaints found</p>
            <p className="text-sm">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filtered.map(complaint => (
              <div
                key={complaint.id}
                onClick={() => onSelectComplaint(complaint)}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition ${getStatusColor(complaint.status)} border-l-4`}
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                  {/* Ticket ID & Title */}
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-3">
                      {complaint.isRecurring && (
                        <div
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded"
                          title="Recurring issue"
                        >
                          ⚠️ RECURRING
                        </div>
                      )}
                      <div>
                        <p className="font-mono text-sm font-semibold text-sino-dark">{complaint.id}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{complaint.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{complaint.tenantName} • Unit {complaint.tenantUnit}</p>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Category</p>
                    <p className="text-sm font-medium text-gray-900">{CATEGORIES[complaint.category]?.label}</p>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Risk</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(
                        complaint.riskLevel
                      )}`}
                    >
                      {complaint.riskLevel}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status)}
                      <span className="text-sm font-medium text-gray-900">{complaint.status}</span>
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Time</p>
                    <p className="text-sm text-gray-600">{formatDistanceToNow(complaint.timestamp, { addSuffix: true })}</p>
                  </div>
                </div>

                {/* Robot Status Badge */}
                {complaint.robotStatus && (
                  <div className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    🤖 {complaint.robotStatus}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

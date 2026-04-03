import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, AlertTriangle, Clock, CheckCircle, Zap } from 'lucide-react'
import { generateMonthlyData, generateCategoryBreakdown } from '../mockData'

export default function Analytics({
  complaints,
  mysteryShopperReports,
  surveys,
}) {
  const monthlyData = generateMonthlyData()
  const categoryData = generateCategoryBreakdown()

  // Calculate metrics
  const totalComplaints = complaints.length
  const highRiskCount = complaints.filter(c => c.riskLevel === 'High').length
  const resolvedCount = complaints.filter(
    c => c.status === 'Resolved' || c.status === 'Closed'
  ).length
  const avgResolutionDays = resolvedCount > 0 ? 2.5 : 0 // Mock

  const avgMysteryScore =
    mysteryShopperReports.length > 0
      ? (
          mysteryShopperReports.reduce((sum, r) => sum + r.score, 0) /
          mysteryShopperReports.length
        ).toFixed(1)
      : 0

  const avgSurveyScore =
    surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + s.score, 0) / surveys.length).toFixed(1)
      : 0

  const resolutionRate = totalComplaints > 0 ? ((resolvedCount / totalComplaints) * 100).toFixed(0) : 0

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-white p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Total Complaints</p>
              <p className="text-3xl font-bold text-sino-dark mt-2">{totalComplaints}</p>
            </div>
            <AlertTriangle className="text-sino-dark/20" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">High Risk</p>
              <p className="text-3xl font-bold text-risk-high mt-2">{highRiskCount}</p>
            </div>
            <AlertTriangle className="text-risk-high/20" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Resolution Rate</p>
              <p className="text-3xl font-bold text-risk-low mt-2">{resolutionRate}%</p>
            </div>
            <CheckCircle className="text-risk-low/20" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Avg Resolution</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{avgResolutionDays}</p>
              <p className="text-xs text-gray-600 mt-1">days</p>
            </div>
            <Clock className="text-blue-600/20" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Tenant Satisfaction</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{avgSurveyScore}</p>
              <p className="text-xs text-gray-600 mt-1">out of 5</p>
            </div>
            <Zap className="text-green-600/20" size={40} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Complaint Volume Trend (12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="complaints"
                stroke="#1a472a"
                strokeWidth={2}
                dot={{ fill: '#d4af37' }}
                activeDot={{ r: 6 }}
                name="Total Complaints"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
                name="Resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {['Submitted', 'Classified', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map(
              status => {
                const count = complaints.filter(c => c.status === status).length
                const percentage = totalComplaints > 0 ? ((count / totalComplaints) * 100).toFixed(0) : 0
                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{status}</span>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          status === 'Closed'
                            ? 'bg-green-600'
                            : status === 'Resolved'
                              ? 'bg-green-500'
                              : status === 'In Progress'
                                ? 'bg-orange-500'
                                : status === 'Assigned'
                                  ? 'bg-blue-500'
                                  : status === 'Classified'
                                    ? 'bg-blue-400'
                                    : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </div>

        {/* Mystery Shopper & Survey Scores */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quality Metrics</h3>
          <div className="space-y-6">
            {/* Mystery Shopper */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Mystery Shopper Avg</span>
                <span className="text-lg font-bold text-blue-600">{avgMysteryScore}/100</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${avgMysteryScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {mysteryShopperReports.length} reports • Evaluates cleanliness, signage, staff helpfulness
              </p>
            </div>

            {/* Survey Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Tenant CSAT Score</span>
                <span className="text-lg font-bold text-green-600">{avgSurveyScore}/5.0</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(avgSurveyScore / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {surveys.length} surveys • Based on tenant satisfaction feedback
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-sino-gold/10 to-yellow-50 rounded-xl border-2 border-sino-gold/30 p-6">
        <div className="flex items-start gap-4">
          <TrendingUp className="text-sino-gold flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Key Insights</h3>
            <ul className="text-sm text-gray-800 space-y-2">
              <li>
                • <strong>Seasonal Peak:</strong> Complaint volume typically increases in summer months
                due to HVAC and plumbing issues.
              </li>
              <li>
                • <strong>HVAC Issues Dominate:</strong> 40% of all complaints are HVAC-related. Consider
                preventive maintenance program.
              </li>
              <li>
                • <strong>Resolution Gap:</strong> Average resolution time is {avgResolutionDays} days, but some tickets take
                longer. Investigate bottlenecks.
              </li>
              <li>
                • <strong>Satisfaction Stable:</strong> Tenant satisfaction remains healthy at {avgSurveyScore}/5.0,
                but monitor closely.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

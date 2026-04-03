import React from 'react'
import { Clock, AlertCircle } from 'lucide-react'
import { formatDate } from 'date-fns'

export default function Header() {
  const currentTime = new Date()
  const unreadCount = 3 // Mock

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock size={16} />
        <span>{formatDate(currentTime, 'PPP p')}</span>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-risk-high/10 rounded-lg">
        <AlertCircle size={16} className="text-risk-high" />
        <span className="text-sm font-semibold text-risk-high">{unreadCount} Critical</span>
      </div>

      <div className="w-10 h-10 rounded-full bg-sino-dark text-white flex items-center justify-center font-semibold">
        M
      </div>
    </div>
  )
}

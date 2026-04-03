import React, { useState } from 'react'
import { Upload, FileUp, Check, AlertCircle, Database } from 'lucide-react'

export default function DataImport({ onImport }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedType, setSelectedType] = useState('mystery-shopper')

  const handleDrag = e => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = e => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = files => {
    // Mock file processing
    const newFiles = Array.from(files).map(file => {
      let mockData = []
      
      if (selectedType === 'mystery-shopper') {
        // Generate mock mystery shopper data
        mockData = [
          {
            id: `MS-${Date.now()}-1`,
            date: new Date(),
            location: file.name.replace('.csv', ''),
            score: Math.floor(Math.random() * 20 + 75),
            maxScore: 100,
            areas: {
              cleanliness: Math.floor(Math.random() * 20 + 75),
              signage: Math.floor(Math.random() * 20 + 70),
              staffHelpfulness: Math.floor(Math.random() * 20 + 80),
              amenities: Math.floor(Math.random() * 20 + 75),
            },
            feedback: 'Report based on import: ' + file.name,
            issues: [],
          },
        ]
      } else if (selectedType === 'survey') {
        // Generate mock survey data
        mockData = [
          {
            id: `SURVEY-${Date.now()}-1`,
            date: new Date(),
            score: (Math.random() * 1 + 3.5).toFixed(1),
            maxScore: 5,
            respondents: Math.floor(Math.random() * 50 + 30),
            comments: 'Survey results imported from ' + file.name,
          },
        ]
      }

      // Simulate onImport
      setTimeout(() => {
        onImport(selectedType, mockData)
      }, 1000)

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadTime: new Date().toLocaleTimeString(),
        status: 'processing',
        dataCount: selectedType === 'mystery-shopper' ? 1 : 1,
      }
    })

    setUploadedFiles(prev => {
      // Mark previous files as completed
      const updated = prev.map(f => ({ ...f, status: 'completed' }))
      // Add new files with processing status
      newFiles.forEach(f => {
        setTimeout(() => {
          setUploadedFiles(prevFiles =>
            prevFiles.map(file =>
              file.name === f.name ? { ...file, status: 'completed' } : file
            )
          )
        }, 1000)
      })
      return [...updated, ...newFiles]
    })
  }

  const sampleFormats = {
    'mystery-shopper': `location,score,cleanliness,signage,staff,amenities,feedback
Sino Tower Lobby,78,80,75,82,76,Excellent service
Sino Tower F&B,82,85,80,88,80,Good overall`,
    survey: `date,score,respondents,comments
2024-03-20,4.2,45,Good service overall
2024-04-05,3.8,52,Maintenance could be faster`,
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-50 to-white p-6">
      {/* Type Selection */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Import Data</h2>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedType('mystery-shopper')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition ${
              selectedType === 'mystery-shopper'
                ? 'bg-sino-dark text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Mystery Shopper Reports
          </button>
          <button
            onClick={() => setSelectedType('survey')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition ${
              selectedType === 'survey'
                ? 'bg-sino-dark text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Survey Data (CSAT)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          {/* Drag & Drop */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-12 text-center transition ${
              dragActive
                ? 'bg-sino-dark/5 border-sino-dark'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              id="file-input"
              onChange={handleChange}
              multiple
              accept=".csv,.xlsx"
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="flex justify-center mb-3">
                <FileUp
                  size={48}
                  className={`${dragActive ? 'text-sino-dark' : 'text-gray-400'}`}
                />
              </div>
              <p className="text-lg font-bold text-gray-900 mb-1">
                Drag & drop your CSV file here
              </p>
              <p className="text-sm text-gray-600 mb-3">or click to browse</p>
              <p className="text-xs text-gray-500">Supported formats: CSV, XLSX</p>
            </label>
          </div>

          {/* Upload Stats */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Database size={18} />
                Uploaded Files ({uploadedFiles.length})
              </h3>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    {file.status === 'processing' && (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-sino-dark animate-spin mt-0.5"></div>
                    )}
                    {file.status === 'completed' && (
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {file.size} bytes • {file.uploadTime}
                      </p>
                      {file.status === 'completed' && (
                        <p className="text-xs text-green-600 font-semibold mt-1">
                          ✓ Imported: {file.dataCount} record{file.dataCount > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Format Guide */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle size={18} />
              CSV Format
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              {selectedType === 'mystery-shopper'
                ? 'Required columns for mystery shopper reports'
                : 'Required columns for survey data'}
            </p>
            <pre className="bg-white rounded-lg p-3 text-xs overflow-x-auto text-gray-700 border border-blue-100">
              {sampleFormats[selectedType]}
            </pre>
            <button
              onClick={() => {
                const csv = sampleFormats[selectedType]
                const element = document.createElement('a')
                element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
                element.setAttribute(
                  'download',
                  `sample_${selectedType}.csv`
                )
                element.style.display = 'none'
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
              }}
              className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Download Template
            </button>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl border border-green-200 p-6">
            <h3 className="font-bold text-green-900 mb-3">Benefits of Importing</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Correlate external data with complaints</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Generate AI insights & recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Track quality metrics holistically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Identify improvement opportunities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-gradient-to-r from-sino-gold/10 to-yellow-50 rounded-xl border-2 border-sino-gold/30 p-6">
        <h3 className="font-bold text-gray-900 mb-3">Data Integration & AI Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <p className="font-semibold text-gray-900 mb-2">How Your Data Is Used:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• Cross-referenced with complaint data</li>
              <li>• Analyzed for correlations & patterns</li>
              <li>• Used to generate strategic recommendations</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-2">AI Generates Insights Like:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• "Cleaning complaints up 40% after shopper score drop"</li>
              <li>• "HVAC failures correlate with guest satisfaction decline"</li>
              <li>• "Recommend preventive maintenance for next season"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

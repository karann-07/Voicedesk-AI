import { getPdfDownloadUrl } from '../services/api'

export default function OutputPreview({ result }) {
  if (!result) return null

  const { transcript, title, formattedContent, pdfDownloadUrl } = result

  const handleDownload = () => {
    const url = getPdfDownloadUrl(pdfDownloadUrl)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || 'voicedesk-document'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderMarkdown = (text) => {
    if (!text) return null
    const lines = text.split('\n')
    return lines.map((line, i) => {
      const trimmed = line.trim()
      if (!trimmed) return <div key={i} className="h-3" />
      if (trimmed.startsWith('# ')) {
        return <h1 key={i} className="text-xl font-bold text-white mt-4 mb-2">{trimmed.slice(2)}</h1>
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={i} className="text-lg font-semibold text-[#4f7bff] mt-4 mb-1">{trimmed.slice(3)}</h2>
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={i} className="text-base font-semibold text-gray-200 mt-3 mb-1">{trimmed.slice(4)}</h3>
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
        return (
          <div key={i} className="flex gap-2 text-gray-300 text-sm leading-relaxed py-0.5">
            <span className="text-[#4f7bff] mt-0.5 flex-shrink-0">•</span>
            <span>{trimmed.replace(/^[-*•]\s*/, '')}</span>
          </div>
        )
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={i} className="text-white font-semibold text-sm leading-relaxed">{trimmed.slice(2, -2)}</p>
      }
      return <p key={i} className="text-gray-300 text-sm leading-relaxed">{trimmed}</p>
    })
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Success badge */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-emerald-400 text-sm font-medium">Processing complete</span>
      </div>

      {/* Raw Transcript */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            </svg>
          </div>
          <h3 className="font-semibold text-white text-sm">Raw Transcript</h3>
          <span className="ml-auto text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">AI Transcription</span>
        </div>
        <div className="bg-[#0d1117] rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-sm leading-relaxed font-mono">{transcript}</p>
        </div>
      </div>

      {/* Formatted Document */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4f7bff]/15 border border-[#4f7bff]/25 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f7bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="16" y2="17"/>
                <line x1="8" y1="9" x2="10" y2="9"/>
              </svg>
            </div>
            <h3 className="font-semibold text-white text-sm">Formatted Document</h3>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">AI Engine</span>
          </div>

          {/* Download Button */}
          {pdfDownloadUrl && (
            <button
              onClick={handleDownload}
              className="btn-success text-sm px-4 py-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          )}
        </div>

        {/* Document card */}
        <div className="bg-white rounded-xl p-6 shadow-xl">
          {title && (
            <div className="border-b border-gray-200 pb-4 mb-5">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-400 mt-1">Generated by VoiceDesk AI</p>
            </div>
          )}
          <div className="space-y-1 [&>*]:!text-gray-800 [&_h1]:!text-gray-900 [&_h2]:!text-blue-700 [&_h3]:!text-gray-800 [&_p]:!text-gray-700 [&_span]:!text-blue-600">
            {renderMarkdown(formattedContent)}
          </div>
        </div>
      </div>
    </div>
  )
}

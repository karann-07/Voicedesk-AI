import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ACCEPTED_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.webm', '.ogg']

export default function FileUpload({ onFileSelected, disabled }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const inputRef = useRef(null)

  const validate = file => {
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ACCEPTED_EXTENSIONS.includes(ext)) return `Unsupported format. Use: ${ACCEPTED_EXTENSIONS.join(', ')}`
    if (file.size > 50 * 1024 * 1024) return 'File too large — max 50MB'
    return null
  }

  const handleFile = file => {
    setError(null)
    const err = validate(file)
    if (err) { setError(err); return }
    setSelectedFile(file)
    onFileSelected(file)
  }

  const handleDrop = e => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const formatSize = b => b < 1024 * 1024 ? `${(b/1024).toFixed(1)} KB` : `${(b/(1024*1024)).toFixed(1)} MB`

  return (
    <div style={{ width: '100%' }}>
      <motion.div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        animate={{
          borderColor: dragging ? 'rgba(99,102,241,0.7)'
            : selectedFile ? 'rgba(16,185,129,0.4)'
            : 'rgba(255,255,255,0.07)',
          backgroundColor: dragging ? 'rgba(99,102,241,0.06)'
            : selectedFile ? 'rgba(16,185,129,0.04)'
            : 'rgba(255,255,255,0.02)',
          scale: dragging ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{
          border: '2px dashed rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '48px 32px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <input ref={inputRef} type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
          style={{ display: 'none' }} disabled={disabled}
        />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div key="selected"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <div>
                <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{selectedFile.name}</p>
                <p style={{ color: '#64748B', fontSize: 13 }}>{formatSize(selectedFile.size)}</p>
              </div>
              {!disabled && <p style={{ color: '#334155', fontSize: 12 }}>Click to change file</p>}
            </motion.div>
          ) : dragging ? (
            <motion.div key="dragging"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ duration: 1, repeat: Infinity }}
                style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </motion.div>
              <p style={{ color: '#818CF8', fontWeight: 600, fontSize: 15 }}>Drop it here</p>
            </motion.div>
          ) : (
            <motion.div key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <p style={{ color: '#94A3B8', fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
                  Drop your audio file here
                </p>
                <p style={{ color: '#475569', fontSize: 13 }}>
                  or <span style={{ color: '#6366F1' }}>click to browse</span>
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {ACCEPTED_EXTENSIONS.map(ext => (
                  <span key={ext} style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, fontSize: 11.5, color: '#475569', fontFamily: 'monospace' }}>{ext}</span>
                ))}
              </div>
              <p style={{ color: '#334155', fontSize: 12 }}>Max 50MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }}
            style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ color: '#FCA5A5', fontSize: 13 }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

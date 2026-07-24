import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import ProcessingLoader from '../components/ProcessingLoader'
import OutputPreview from '../components/OutputPreview'
import { uploadAudio } from '../services/api'

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [stage, setStage] = useState('uploading')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelected = file => {
    setSelectedFile(file); setResult(null); setError(null)
  }

  const handleProcess = async () => {
    if (!selectedFile) return
    setError(null); setResult(null); setProcessing(true); setUploadProgress(0)
    try {
      setStage('uploading')
      const data = await uploadAudio(selectedFile, selectedFile.name, pct => {
        setUploadProgress(pct)
        if (pct >= 100) setStage('transcribing')
      })
      setStage('formatting')
      await new Promise(r => setTimeout(r, 300))
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Processing failed.')
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null); setResult(null); setError(null); setProcessing(false); setUploadProgress(0)
  }

  return (
    <div style={{ background: '#080B14', minHeight: 'calc(100vh - 64px)', fontFamily: 'Inter, sans-serif' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 13, textDecoration: 'none', marginBottom: 40, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
            onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
          style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#F1F5F9', margin: 0, letterSpacing: '-0.02em' }}>
              Upload Audio
            </h1>
          </div>
          <p style={{ color: '#475569', fontSize: 14, margin: 0, paddingLeft: 48, lineHeight: 1.6 }}>
            Drop any audio file and let the AI pipeline handle everything from transcription to formatting.
          </p>
        </motion.div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div key="uploader"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ background: 'rgba(14,19,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, overflow: 'hidden' }}>

              {/* Card header */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#334155', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>File Upload</span>
                <span style={{ color: '#334155', fontSize: 11.5 }}>MP3 · WAV · M4A · WebM · OGG</span>
              </div>

              <div style={{ padding: '28px' }}>
                {processing ? (
                  <>
                    <ProcessingLoader stage={stage} />
                    {/* Upload progress bar */}
                    <AnimatePresence>
                      {stage === 'uploading' && uploadProgress > 0 && uploadProgress < 100 && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ marginTop: 8, padding: '0 4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ color: '#334155', fontSize: 12 }}>Uploading…</span>
                            <span style={{ color: '#6366F1', fontSize: 12, fontWeight: 600 }}>{uploadProgress}%</span>
                          </div>
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ ease: 'easeOut' }}
                              style={{ height: '100%', background: 'linear-gradient(90deg, #6366F1, #818CF8)', borderRadius: 2 }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <FileUpload onFileSelected={handleFileSelected} disabled={processing} />

                    <AnimatePresence>
                      {selectedFile && (
                        <motion.button
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          whileHover={{ scale: 1.01, boxShadow: '0 0 32px rgba(99,102,241,0.35)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleProcess}
                          style={{
                            width: '100%', padding: '16px', border: 'none', borderRadius: 14, cursor: 'pointer',
                            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                            color: 'white', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: '0 0 24px rgba(99,102,241,0.25)',
                          }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                          Process with AI
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Supported formats info footer */}
              {!processing && !selectedFile && (
                <div style={{ padding: '14px 28px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {['Any audio format supported', 'Up to 50MB per file', 'No quality loss in processing'].map((tip, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#6366F1', flexShrink: 0 }} />
                      <span style={{ color: '#334155', fontSize: 12 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: 20, display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#FCA5A5', fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>Processing failed</p>
                <p style={{ color: '#F87171', fontSize: 13, opacity: 0.7, marginBottom: 10 }}>{error}</p>
                <button onClick={handleReset} style={{ fontSize: 12, color: '#FCA5A5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                  Try again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div key="result"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <OutputPreview result={result} />
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#94A3B8', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                  </svg>
                  Upload another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

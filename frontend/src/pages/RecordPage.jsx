import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import RecordButton from '../components/RecordButton'
import ProcessingLoader from '../components/ProcessingLoader'
import OutputPreview from '../components/OutputPreview'
import { recordAudio } from '../services/api'

export default function RecordPage() {
  const [processing, setProcessing] = useState(false)
  const [stage, setStage] = useState('uploading')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleRecordingComplete = async (blob) => {
    if (!blob || blob.size === 0) return
    setError(null); setResult(null); setProcessing(true)
    try {
      setStage('uploading')
      await new Promise(r => setTimeout(r, 400))
      setStage('transcribing')
      const data = await recordAudio(blob)
      setStage('formatting')
      await new Promise(r => setTimeout(r, 300))
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Something went wrong.')
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => { setResult(null); setError(null); setProcessing(false) }

  return (
    <div style={{ background: '#080B14', minHeight: 'calc(100vh - 64px)', fontFamily: 'Inter, sans-serif' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

        {/* Back link */}
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
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#F1F5F9', margin: 0, letterSpacing: '-0.02em' }}>
              Voice Recording
            </h1>
          </div>
          <p style={{ color: '#475569', fontSize: 14, margin: 0, paddingLeft: 48, lineHeight: 1.6 }}>
            Speak clearly — the AI pipeline handles transcription and formatting automatically.
          </p>
        </motion.div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div key="recorder"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ background: 'rgba(14,19,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, overflow: 'hidden' }}>

              {/* Card header */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#334155', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Studio</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ color: '#334155', fontSize: 11.5 }}>Ready</span>
                </div>
              </div>

              {/* Record content */}
              <div style={{ padding: '12px 28px 36px' }}>
                {processing ? (
                  <ProcessingLoader stage={stage} />
                ) : (
                  <RecordButton onRecordingComplete={handleRecordingComplete} />
                )}
              </div>

              {/* Tips */}
              {!processing && (
                <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {['Speak clearly at a steady pace', 'Quiet environment works best', 'Any length — seconds to minutes'].map((tip, i) => (
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
              initial={{ opacity: 0, y: 8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: 8, height: 0 }}
              style={{ marginTop: 20, display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#FCA5A5', fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>Processing failed</p>
                <p style={{ color: '#F87171', fontSize: 13, opacity: 0.7, marginBottom: 10 }}>{error}</p>
                <button onClick={handleReset}
                  style={{ fontSize: 12, color: '#FCA5A5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
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
                  Record another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

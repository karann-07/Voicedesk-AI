import { useState, useEffect, useRef } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { motion, AnimatePresence } from 'framer-motion'

export default function RecordButton({ onRecordingComplete }) {
  const [seconds, setSeconds] = useState(0)
  const [bars, setBars] = useState(Array(28).fill(20))
  const timerRef = useRef(null)
  const waveRef = useRef(null)

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: (_blobUrl, blob) => onRecordingComplete(blob, _blobUrl),
    })

  const isRecording = status === 'recording'
  const isStopped = status === 'stopped'

  // Timer
  useEffect(() => {
    if (isRecording) {
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  // Animate waveform bars while recording
  useEffect(() => {
    if (isRecording) {
      waveRef.current = setInterval(() => {
        setBars(Array(28).fill(0).map(() => Math.random() * 80 + 10))
      }, 100)
    } else {
      clearInterval(waveRef.current)
      setBars(Array(28).fill(20))
    }
    return () => clearInterval(waveRef.current)
  }, [isRecording])

  const formatTime = s => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleStart = () => {
    clearBlobUrl?.()
    setSeconds(0)
    startRecording()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, padding: '32px 0' }}>

      {/* Mic button with rings */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 220, height: 220 }}>

        {/* Pulse rings — only when recording */}
        <AnimatePresence>
          {isRecording && [1, 2, 3].map(i => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                border: '1.5px solid rgba(239,68,68,0.4)',
              }}
              initial={{ width: 110, height: 110, opacity: 0.8 }}
              animate={{ width: 110 + i * 44, height: 110 + i * 44, opacity: 0 }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Idle rings */}
        {!isRecording && [1, 2, 3].map(i => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              border: '1px solid rgba(99,102,241,0.15)',
              width: 110 + i * 35,
              height: 110 + i * 35,
            }}
            animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Main button */}
        <motion.button
          onClick={isRecording ? stopRecording : handleStart}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            position: 'relative',
            zIndex: 10,
            width: 110,
            height: 110,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            background: isRecording
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            boxShadow: isRecording
              ? '0 0 40px rgba(239,68,68,0.45), 0 0 80px rgba(239,68,68,0.15)'
              : '0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15)',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        >
          <AnimatePresence mode="wait">
            {isRecording ? (
              <motion.div key="stop"
                initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="6" width="12" height="12" rx="2.5"/>
                </svg>
              </motion.div>
            ) : (
              <motion.div key="mic"
                initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em' }}>
            {isRecording ? 'STOP' : 'RECORD'}
          </span>
        </motion.button>
      </div>

      {/* Status area */}
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div key="recording"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444' }}
              />
              <span style={{ color: '#EF4444', fontWeight: 600, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Recording</span>
            </div>
            <span style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 40, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {formatTime(seconds)}
            </span>
            <span style={{ color: '#475569', fontSize: 12 }}>Tap the button to stop</span>
          </motion.div>
        ) : isStopped ? (
          <motion.div key="stopped"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ color: '#10B981', fontWeight: 600, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Ready</span>
            </div>
            <span style={{ color: '#64748B', fontSize: 13 }}>Sending to AI pipeline…</span>
          </motion.div>
        ) : (
          <motion.div key="idle"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: 14 }}>Tap to start recording</span>
            <span style={{ color: '#334155', fontSize: 12 }}>Make sure your microphone is allowed</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waveform */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 48 }}>
        {bars.map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: isRecording ? h * 0.48 : 4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              width: 3,
              borderRadius: 4,
              background: isRecording
                ? `rgba(239,68,68,${0.4 + (h / 100) * 0.6})`
                : 'rgba(99,102,241,0.15)',
              minHeight: 4,
            }}
          />
        ))}
      </div>

    </div>
  )
}

import { motion } from 'framer-motion'

const STAGES = [
  { key: 'uploading',     label: 'Uploading audio',           sub: 'Sending your file securely',                icon: '⬆' },
  { key: 'transcribing',  label: 'AI Transcription',          sub: 'Converting speech to text',                  icon: '🎙' },
  { key: 'formatting',    label: 'Document Intelligence',     sub: 'Structuring and formatting content',         icon: '✦' },
  { key: 'generating',    label: 'Generating PDF',            sub: 'Building your professional document',        icon: '📄' },
]

export default function ProcessingLoader({ stage = 'uploading' }) {
  const currentIndex = STAGES.findIndex(s => s.key === stage)
  const current = STAGES[currentIndex] || STAGES[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 40 }}>

      {/* Spinner */}
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.04)' }} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#6366F1' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'rgba(99,102,241,0.3)' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          {current.icon}
        </div>
      </div>

      {/* Stage label */}
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center' }}>
        <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 16, marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>
          {current.label}
        </p>
        <p style={{ color: '#64748B', fontSize: 13 }}>{current.sub}</p>
      </motion.div>

      {/* Step timeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {STAGES.map((s, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          return (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                initial={false}
                animate={{
                  background: done ? '#6366F1' : active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                  borderColor: done ? '#6366F1' : active ? '#6366F1' : 'rgba(255,255,255,0.08)',
                  scale: active ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '1.5px solid',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: done ? 13 : 11,
                  color: done || active ? '#F1F5F9' : '#334155',
                  fontWeight: 600,
                  position: 'relative',
                }}>
                {done ? '✓' : i + 1}
                {active && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1px solid rgba(99,102,241,0.4)' }}
                  />
                )}
              </motion.div>
              {i < STAGES.length - 1 && (
                <motion.div
                  animate={{ background: done ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.06)' }}
                  style={{ width: 36, height: 1 }}
                />
              )}
            </div>
          )
        })}
      </div>

      <p style={{ color: '#334155', fontSize: 12 }}>This usually takes 10–30 seconds</p>
    </div>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const location = useLocation()
  const isActive = path => location.pathname === path

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(8,11,20,0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 50,
        fontFamily: 'Inter, sans-serif',
      }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(99,102,241,0.35)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#F1F5F9', fontSize: 15, letterSpacing: '-0.01em' }}>
            VoiceDesk <span style={{ color: '#6366F1' }}>AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ label: 'Record', path: '/record' }, { label: 'Upload', path: '/upload' }].map(({ label, path }) => (
            <Link key={path} to={path}
              style={{
                padding: '7px 14px', borderRadius: 9, fontSize: 13.5, fontWeight: 500, textDecoration: 'none',
                color: isActive(path) ? '#818CF8' : '#475569',
                background: isActive(path) ? 'rgba(99,102,241,0.1)' : 'transparent',
                border: isActive(path) ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive(path)) { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}}
              onMouseLeave={e => { if (!isActive(path)) { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent' }}}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

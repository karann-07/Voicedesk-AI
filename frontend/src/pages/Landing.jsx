import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Animated soundwave ring component
function SoundwaveRing() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Outermost ring */}
      <div className="absolute rounded-full border border-indigo-500/10" style={{ width: 280, height: 280, animation: 'ring-pulse 3s ease-in-out infinite' }} />
      <div className="absolute rounded-full border border-indigo-500/15" style={{ width: 240, height: 240, animation: 'ring-pulse 3s ease-in-out infinite 0.3s' }} />
      <div className="absolute rounded-full border border-indigo-500/20" style={{ width: 200, height: 200, animation: 'ring-pulse 3s ease-in-out infinite 0.6s' }} />
      <div className="absolute rounded-full border border-indigo-500/30" style={{ width: 160, height: 160, animation: 'ring-pulse 3s ease-in-out infinite 0.9s' }} />

      {/* Glow blob */}
      <div className="absolute rounded-full" style={{
        width: 120, height: 120,
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        animation: 'glow-breathe 3s ease-in-out infinite'
      }} />

      {/* Center button */}
      <Link to="/record" className="relative z-10 flex flex-col items-center justify-center rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 group"
        style={{
          width: 110, height: 110,
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          boxShadow: '0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15)',
        }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
        </svg>
        <span style={{ fontSize: 11, letterSpacing: '0.05em', opacity: 0.9 }}>START</span>
      </Link>
    </div>
  )
}

// Feature card
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div className="feature-card rounded-2xl p-6 flex flex-col gap-3" style={{ animationDelay: delay }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
        {icon}
      </div>
      <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 15 }}>{title}</h3>
      <p style={{ color: '#64748B', fontSize: 13.5, lineHeight: 1.65 }}>{desc}</p>
    </div>
  )
}

// Step component
function Step({ number, title, desc, isLast }) {
  return (
    <div className="flex flex-col items-center text-center relative">
      <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-4"
        style={{
          background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
          color: 'white',
          boxShadow: '0 0 20px rgba(99,102,241,0.3)',
          fontSize: 13
        }}>
        {number}
      </div>
      {!isLast && (
        <div className="absolute top-6 left-1/2 w-full h-px" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0.1) 100%)', marginLeft: '24px' }} />
      )}
      <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{title}</h3>
      <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

// Stat card
function StatCard({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span style={{ fontSize: 32, fontWeight: 700, color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}>{value}</span>
      <span style={{ fontSize: 12.5, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  )
}

export default function Landing() {
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.fade-up').forEach(el => {
      observerRef.current.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div style={{ background: '#080B14', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.7; }
        }

        @keyframes glow-breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes float-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-card {
          background: rgba(14, 19, 32, 0.8);
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.2s, transform 0.2s;
        }

        .feature-card:hover {
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-2px);
        }

        .hero-badge {
          animation: float-up 0.6s ease forwards;
        }

        .hero-headline {
          animation: float-up 0.6s ease 0.15s forwards;
          opacity: 0;
        }

        .hero-sub {
          animation: float-up 0.6s ease 0.3s forwards;
          opacity: 0;
        }

        .hero-wave {
          animation: float-up 0.7s ease 0.45s forwards;
          opacity: 0;
        }

        .hero-ctas {
          animation: float-up 0.6s ease 0.6s forwards;
          opacity: 0;
        }

        .gradient-text {
          background: linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .accent-text {
          background: linear-gradient(135deg, #818CF8 0%, #6366F1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta-primary {
          background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14.5px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 0 24px rgba(99,102,241,0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-family: Inter, sans-serif;
        }

        .cta-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 36px rgba(99,102,241,0.45);
        }

        .cta-secondary {
          background: rgba(255,255,255,0.04);
          color: #94A3B8;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 14.5px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-family: Inter, sans-serif;
        }

        .cta-secondary:hover {
          background: rgba(255,255,255,0.07);
          color: #F1F5F9;
          border-color: rgba(255,255,255,0.14);
        }

        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366F1;
          margin-bottom: 12px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 60px', position: 'relative' }}>

        {/* Background gradients */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '30%', left: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 65%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)', borderRadius: '50%' }} />
        </div>

        {/* Badge */}
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.08)', marginBottom: 32 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', animation: 'glow-breathe 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 500, letterSpacing: '0.03em' }}>AI Document Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="hero-headline" style={{ textAlign: 'center', maxWidth: 680, marginBottom: 20, fontFamily: 'Space Grotesk, sans-serif' }}>
          <span className="gradient-text" style={{ display: 'block', fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em' }}>
            Speak once.
          </span>
          <span className="accent-text" style={{ display: 'block', fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em' }}>
            Get a document.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub" style={{ textAlign: 'center', maxWidth: 480, fontSize: 17, color: '#64748B', lineHeight: 1.7, marginBottom: 56 }}>
          Record your voice or drop an audio file — VoiceDesk turns it into a structured, professional document ready to download in seconds.
        </p>

        {/* Soundwave CTA */}
        <div className="hero-wave" style={{ marginBottom: 48 }}>
          <SoundwaveRing />
        </div>

        {/* Secondary CTA */}
        <div className="hero-ctas" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/upload" className="cta-secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload audio file
          </Link>
          <span style={{ color: '#1E293B', fontSize: 13 }}>or tap the button to record</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="fade-up" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 48, padding: '48px', background: 'rgba(14,19,32,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20 }}>
          <StatCard value="< 30s" label="Processing time" />
          <StatCard value="95%+" label="Transcription accuracy" />
          <StatCard value="5+" label="Audio formats" />
          <StatCard value="100%" label="Private & local" />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="section-label">How it works</p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Three steps from voice<br />to finished document
          </h2>
        </div>

        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, position: 'relative' }}>
          <Step number="01" title="Capture your audio" desc="Record live using your microphone, or drag and drop any audio file — MP3, WAV, M4A, or WebM." />
          <Step number="02" title="AI processes it" desc="The audio is transcribed and passed through our document intelligence engine, which structures and formats the content." />
          <Step number="03" title="Download your document" desc="Preview the result on screen. Edit if needed, then export a professionally formatted PDF instantly." isLast />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-label">Features</p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Everything you need.<br />Nothing you don't.
          </h2>
        </div>

        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>}
            title="Live voice recording"
            desc="Capture directly in your browser with a real-time timer and waveform. No software to install."
          />
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
            title="Drag & drop upload"
            desc="Drop any audio file and it validates format and size instantly before sending to the AI pipeline."
          />
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
            title="Intelligent formatting"
            desc="The AI engine organises raw speech into titled sections, bullet points, and clean paragraphs automatically."
          />
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>}
            title="PDF export"
            desc="Download a professionally styled PDF with headings, structure, and branding — ready to share."
          />
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            title="Fast turnaround"
            desc="From upload to formatted document in under 30 seconds. The full pipeline runs end to end without manual steps."
          />
          <FeatureCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            title="No account needed"
            desc="No signup, no login, no tracking. Paste your key, run the app, and your audio never leaves your own pipeline."
          />
        </div>
      </section>

      {/* ── FUTURE IMPROVEMENTS ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-label">Roadmap</p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            What's coming next
          </h2>
          <p style={{ color: '#64748B', fontSize: 15, marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
            The core AI pipeline is working. Here's what gets built on top of it.
          </p>
        </div>

        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            {
              tag: 'UX',
              tagColor: '#818CF8',
              tagBg: 'rgba(99,102,241,0.1)',
              title: 'Editable output',
              desc: 'Let users tweak the AI-generated title and content directly in the preview before exporting to PDF — no re-processing needed.',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
            },
            {
              tag: 'Export',
              tagColor: '#34D399',
              tagBg: 'rgba(16,185,129,0.1)',
              title: 'Save As dialog',
              desc: 'Native OS file picker when downloading — users choose their own filename and save location instead of the file going straight to Downloads.',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
            },
            {
              tag: 'Reliability',
              tagColor: '#FBBF24',
              tagBg: 'rgba(245,158,11,0.1)',
              title: 'Smart retry',
              desc: 'Automatic retry with exponential backoff when the transcription or formatting API times out, instead of showing a hard error to the user.',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
            },
            {
              tag: 'Export',
              tagColor: '#818CF8',
              tagBg: 'rgba(99,102,241,0.1)',
              title: 'Multiple PDF styles',
              desc: 'Choose from different export templates — minimal, formal report, meeting notes — so the output matches the context of the recording.',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
            },
            {
              tag: 'Platform',
              tagColor: '#F472B6',
              tagBg: 'rgba(236,72,153,0.1)',
              title: 'User accounts & history',
              desc: 'Save past documents, access them from any device, and manage your recording history — requires adding auth and a database layer.',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
            },
            {
              tag: 'Platform',
              tagColor: '#34D399',
              tagBg: 'rgba(16,185,129,0.1)',
              title: 'Live deployment',
              desc: 'Frontend on Vercel, backend on Render — a shareable public URL so anyone can use VoiceDesk without cloning or running code locally.',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
            },
          ].map((item, i) => (
            <div key={i} className="feature-card rounded-2xl p-6 flex flex-col gap-3">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: item.tagBg, color: item.tagColor, letterSpacing: '0.04em' }}>
                  {item.tag}
                </span>
              </div>
              <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 15 }}>{item.title}</h3>
              <p style={{ color: '#64748B', fontSize: 13.5, lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="fade-up" style={{ padding: '0 24px 120px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '64px 48px', background: 'rgba(14,19,32,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
          {/* Glow */}
          <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <p className="section-label" style={{ marginBottom: 16 }}>Get started</p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 12 }}>
            Ready to turn your voice into documents?
          </h2>
          <p style={{ color: '#64748B', fontSize: 14.5, lineHeight: 1.65, marginBottom: 36 }}>
            No account required. Just record or upload and let the AI do the rest.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/record" className="cta-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              Start recording
            </Link>
            <Link to="/upload" className="cta-secondary">
              Upload a file
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#F1F5F9', fontSize: 14 }}>VoiceDesk AI</span>
        </div>
        <p style={{ color: '#334155', fontSize: 12.5 }}>
          Built with Spring Boot · React · AI Document Intelligence
        </p>
      </footer>

    </div>
  )
}

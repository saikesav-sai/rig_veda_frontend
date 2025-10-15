export default function Hero({ navigateToPage }) {
  return (
    <section className="hero-root">
      <div className="hero-canvas" aria-hidden="true">
        {/* Lightweight decorative SVG/Canvas placeholder for a 3D mandala/particle field.
            Replace with react-three-fiber or Lottie for full 3D effect later. */}
        <svg className="mandala-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="g1" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#ffedd5" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g1)" />
          <g className="mandala-rotor">
            <circle cx="400" cy="200" r="120" fill="rgba(255,255,255,0.02)" stroke="rgba(255,215,102,0.06)" />
            <g className="mandala-layer">
              <path d="M400 80 C480 80 520 120 520 200 C520 280 480 320 400 320 C320 320 280 280 280 200 C280 120 320 80 400 80 Z" fill="rgba(102,126,234,0.04)" />
            </g>
          </g>
        </svg>
      </div>

      <div className="hero-content">
        <h1 className="hero-title gradient-text">Rig Veda Explorer</h1>
        <p className="hero-subtitle">Explore ancient hymns with modern AI — search by meaning, ask questions, and listen to recitations.</p>

        <div className="hero-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button className="cta-pill" onClick={() => navigateToPage('search')}>Search the Veda</button>
          <button className="cta-pill" onClick={() => navigateToPage('explorer')}>Browse Mandalas</button>
          <button className="cta-pill ghost" onClick={() => navigateToPage('chat')}>Ask the Veda</button>
        </div>
      </div>
    </section>
  );
}

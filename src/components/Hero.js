import { useState } from 'react';
import styles from './Hero.module.css';

export default function Hero({ navigateToPage }) {
  const [reduceMotion] = useState(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    return mq ? mq.matches : false;
  });

  return (
    <section className={styles.heroRoot} aria-label="Rig Veda Explorer hero">
      <div className={styles.heroGraphic} aria-hidden="true">
        <svg viewBox="0 0 600 600" className={`${styles.mandala} ${reduceMotion ? styles.reducedMotion : ''}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="mg" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#c7b6ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#eef2ff" stopOpacity="0.02" />
            </radialGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="8" result="coloredBlur"/></filter>
          </defs>

          <g className={styles.rotor} transform-origin="300 300">
            <circle cx="300" cy="300" r="140" fill="url(#mg)" className={styles.innerCircle} />
            <g className={styles.petals}>
              {[...Array(12)].map((_, i) => (
                <ellipse key={i} cx="300" cy="120" rx="40" ry="14" fill="rgba(118,75,162,0.06)" transform={`rotate(${(i / 12) * 360} 300 300)`} />
              ))}
            </g>
          </g>
        </svg>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {/* <span className={styles.vedaIcon}>📚</span> */}
          Rig Veda Explorer
        </h1>
        <p className={styles.heroSubtitle}>Discover the ancient wisdom, hear sacred recitations, and explore timeless verses from the world's oldest scripture</p>

        <div className={styles.heroActions}>
          <button className={`${styles.ctaPrimary} ${styles.btnShine}`} onClick={() => navigateToPage('search')}>
            <span className={styles.btnIcon}>🔍</span>
            Search the Veda
          </button>
          <button className={`${styles.ctaGhost} ${styles.btnHover}`} onClick={() => navigateToPage('explorer')}>
            <span className={styles.btnIcon}>📖</span>
            Browse Mandalas
          </button>
        </div>
      </div>
    </section>
  );
}

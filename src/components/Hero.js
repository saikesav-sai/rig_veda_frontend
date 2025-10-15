import { useEffect, useState } from 'react';
import styles from './Hero.module.css';

const INSIGHTS = [
  {
    id: 1,
    title: 'Dawn Hymns — Agni & Ushas',
    snippet: 'Search “dawn” to find hymns invoking Ushas and the dawn’s light as a cosmic force.'
  },
  {
    id: 2,
    title: 'Fire & Ritual',
    snippet: 'Try “fire” or “sacrifice” for core ritual passages and references to Agni.'
  },
  {
    id: 3,
    title: 'Cosmic Order (Rta)',
    snippet: 'Explore verses about Rta — the principle of natural order and truth.'
  }
];

export default function Hero({ navigateToPage }) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mq ? mq.matches : false;
    setReduceMotion(isReduced);

    if (isReduced) return undefined; // do not start carousel

    const t = setInterval(() => setIndex((i) => (i + 1) % INSIGHTS.length), 4200);
    return () => clearInterval(t);
  }, []);

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
        <h1 className={styles.heroTitle}>Rig Veda Explorer</h1>
        <p className={styles.heroSubtitle}>One beautiful place to search meaning, hear recitations, and discover verses that mattered to the ancients.</p>

        <div className={styles.heroActions}>
          <button className={styles.ctaPrimary} onClick={() => navigateToPage('search')}>Search the Veda</button>
          <button className={styles.ctaGhost} onClick={() => navigateToPage('explorer')}>Browse Mandalas</button>
        </div>

        <div className={styles.insightCard} aria-live="polite">
          <h4 className={styles.insightTitle}>{INSIGHTS[index].title}</h4>
          <p className={styles.insightSnippet}>{INSIGHTS[index].snippet}</p>
          <div className={styles.insightActions}>
            <button className={styles.small} onClick={() => navigateToPage('search')}>Explore related</button>
            <button className={styles.smallGhost} onClick={() => navigateToPage('chat')}>Ask about this</button>
          </div>
        </div>
      </div>
    </section>
  );
}

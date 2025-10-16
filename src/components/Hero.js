import styles from './Hero.module.css';

export default function Hero({ navigateToPage }) {
  return (
    <section className={styles.heroRoot} aria-label="Rig Veda Explorer hero">
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

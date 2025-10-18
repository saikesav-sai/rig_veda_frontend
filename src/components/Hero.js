import styles from './Hero.module.css';

export default function Hero({ navigateToPage }) {
  return (
    <section className={styles.heroRoot} aria-label="Rig Veda Explorer hero">
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <img src="/book.png" alt="Rig Veda" className={styles.vedaIcon} />
          Eternal Veda (Rig Veda)
        </h1>
        <p className={styles.heroSubtitle}>Discover the ancient wisdom, hear sacred recitations, and explore timeless verses from the world's oldest scripture</p>

        <div className={styles.heroActions}>
          <button className={`${styles.ctaPrimary} ${styles.btnShine}`} onClick={() => navigateToPage('explorer')}>
            <img src="/mandala.png" alt="Browse" className={styles.btnIcon} style={{ width: "1.3rem", height: "1.3rem" }} />
            Browse Mandalas
          </button>
          <button className={`${styles.ctaGhost} ${styles.btnHover}`} onClick={() => navigateToPage('search')}>
            <img src="/search2.png" alt="Search" className={styles.btnIcon} style={{ width: "1.3rem", height: "1.3rem" }} />
            Search the Veda
          </button>
          
        </div>
      </div>
    </section>
  );
}

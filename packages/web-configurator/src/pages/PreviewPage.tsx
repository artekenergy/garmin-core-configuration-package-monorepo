import styles from './NewPreviewPage.module.css';

export default function PreviewPage() {

  // Coming Soon state
  return (
    <div className={styles.container}>
      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>🚀</div>
        <h2>Preview Coming Soon</h2>
        <p>We're working on bringing you an interactive preview of your HMI interface.</p>
        <p className={styles.comingSoonHint}>
          In the meantime, you can export your configuration and test it on your device.
        </p>
      </div>
    </div>
  );
}

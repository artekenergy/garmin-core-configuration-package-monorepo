import { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSchema } from '../context/SchemaContext';
import { useAuth } from '../context/AuthContext';
import ErrorModal from './ErrorModal';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const NAV_LINKS = [
  { to: '/hardware', label: 'Hardware' },
  { to: '/power', label: 'Power' },
  { to: '/hvac', label: 'HVAC' },
  { to: '/plumbing', label: 'Plumbing' },
  { to: '/accessories', label: 'Accessories' },
  { to: '/theme', label: 'Theme' },
  { to: '/editor', label: 'Editor' },
  { to: '/preview', label: 'Preview' },
  { to: '/export', label: 'Export' },
];

const getNavLinkClassName = ({
  isActive,
}: {
  isActive: boolean;
  isPending: boolean;
  isTransitioning: boolean;
}) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink);

export default function Layout({ children }: LayoutProps) {
  const { schema, validationResult, channelErrors } = useSchema();
  const { logout } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const hasErrors = (validationResult && !validationResult.success) || channelErrors.length > 0;
  const schemaErrorCount =
    validationResult && !validationResult.success ? validationResult.errors.length : 0;
  const totalErrorCount = schemaErrorCount + channelErrors.length;

  return (
    <div className={styles.layout}>
      <div className={styles.stickyHeader}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <img src="/logo.svg" alt="Garmin Logo" className={styles.logo} />
              <h1 className={styles.title}>Garmin CORE Graphics Configurator</h1>
            </div>

            <div className={styles.status}>
              {schema && (
                <div className={styles.schemaInfo}>
                  <span className={styles.schemaName}>{schema.metadata.name}</span>
                  <span className={styles.schemaVersion}>v{schema.metadata.version}</span>
                </div>
              )}

              {hasErrors && (
                <button
                  className={styles.errorBadge}
                  onClick={() => setShowErrorModal(true)}
                  title="Click to view error details"
                >
                  ⚠️ {totalErrorCount} {totalErrorCount === 1 ? 'error' : 'errors'}
                </button>
              )}

              {validationResult && validationResult.success && channelErrors.length === 0 && (
                <div className={styles.successBadge}>✓ Valid</div>
              )}

              <button
                className={styles.logoutButton}
                onClick={logout}
                title="Sign out"
                aria-label="Sign out"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </header>

        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className={getNavLinkClassName}>
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>
          Garmin Core Graphics Configurator v0.1.0 | Schema v0.1.0 |{' '}
          <a href="https://github.com/yourusername/gcg" target="_blank" rel="noopener noreferrer">
            Documentation
          </a>
        </p>
      </footer>

      {/* Error Modal */}
      {showErrorModal && hasErrors && validationResult && (
        <ErrorModal
          validationResult={validationResult}
          channelErrors={channelErrors}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
}

import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.handle} />
        <div style={styles.header}>
          <h2 className="display" style={{ fontSize: 22 }}>{title}</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Inchide">✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end'
  },
  sheet: {
    width: '100%',
    maxHeight: '88vh',
    background: 'var(--vesta-charcoal)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.25s ease',
    paddingBottom: 'env(safe-area-inset-bottom)'
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    background: 'var(--vesta-line)',
    margin: '10px auto 0'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px 8px'
  },
  closeBtn: {
    background: 'var(--vesta-panel)',
    border: 'none',
    color: 'var(--vesta-warm-white)',
    width: 32,
    height: 32,
    borderRadius: '50%',
    fontSize: 14,
    cursor: 'pointer'
  },
  body: {
    padding: '0 20px 24px',
    overflowY: 'auto'
  }
}

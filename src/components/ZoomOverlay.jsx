export default function ZoomOverlay({ item, onClose }) {
  if (!item) return null

  return (
    <div style={styles.overlay} onClick={onClose}>
      <img src={item.imageUrl} alt={item.name} style={styles.img} />
      <div style={styles.caption}>
        <p style={styles.name}>{item.name}</p>
        {item.color && <p style={styles.color}>{item.color}</p>}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(6, 6, 5, 0.92)',
    zIndex: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    animation: 'fadeIn 0.18s ease'
  },
  img: {
    maxWidth: '88vw',
    maxHeight: '72vh',
    objectFit: 'contain',
    borderRadius: 16
  },
  caption: {
    marginTop: 16,
    textAlign: 'center'
  },
  name: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--vesta-warm-white)'
  },
  color: {
    fontSize: 12.5,
    color: 'var(--vesta-gray)',
    marginTop: 2
  }
}

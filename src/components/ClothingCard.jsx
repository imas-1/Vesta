import { useRef } from 'react'

const LONG_PRESS_MS = 450

export default function ClothingCard({ item, onClick, onToggleFavorite, onLongPress, large }) {
  const timerRef = useRef(null)
  const firedRef = useRef(false)

  function startPress() {
    firedRef.current = false
    if (!onLongPress) return
    timerRef.current = setTimeout(() => {
      firedRef.current = true
      onLongPress(item)
    }, LONG_PRESS_MS)
  }

  function cancelPress() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function handleClick(e) {
    if (firedRef.current) {
      e.preventDefault()
      firedRef.current = false
      return
    }
    onClick?.()
  }

  return (
    <div className="card" style={{ ...styles.card, ...(large ? styles.cardLarge : {}) }}>
      <button
        style={styles.cardBtn}
        onClick={handleClick}
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        onContextMenu={(e) => onLongPress && e.preventDefault()}
      >
        <div style={{ ...styles.imgWrap, ...(large ? styles.imgWrapLarge : {}) }}>
          <img src={item.imageUrl} alt={item.name} style={{ ...styles.img, ...(large ? styles.imgLarge : {}) }} loading="lazy" />
        </div>
        <div style={{ ...styles.info, ...(large ? styles.infoLarge : {}) }}>
          <p style={{ ...styles.name, ...(large ? styles.nameLarge : {}) }}>{item.name}</p>
          {item.color && <p style={styles.color}>{item.color}</p>}
        </div>
      </button>
      {onToggleFavorite && (
        <button
          style={styles.favBtn}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
          aria-label="Favorit"
        >
          {item.favorite ? '⭐' : '☆'}
        </button>
      )}
    </div>
  )
}

const styles = {
  card: {
    padding: 0,
    border: '1px solid var(--vesta-line)',
    position: 'relative',
    minWidth: 0
  },
  cardLarge: {},
  cardBtn: {
    width: '100%',
    background: 'none',
    border: 'none',
    padding: 0,
    textAlign: 'left',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent'
  },
  imgWrap: {
    width: '100%',
    aspectRatio: '1',
    overflow: 'hidden',
    background: 'var(--vesta-charcoal)'
  },
  imgWrapLarge: {
    aspectRatio: '4 / 5',
    background: 'var(--vesta-charcoal)'
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imgLarge: {
    objectFit: 'contain'
  },
  info: {
    padding: '10px 12px 12px'
  },
  infoLarge: {
    padding: '14px 16px 16px'
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--vesta-warm-white)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  nameLarge: {
    fontSize: 15
  },
  color: {
    fontSize: 11,
    color: 'var(--vesta-gray)',
    marginTop: 2
  },
  favBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(10,10,10,0.55)',
    border: 'none',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

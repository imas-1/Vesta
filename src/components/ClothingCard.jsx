export default function ClothingCard({ item, onClick, onToggleFavorite }) {
  return (
    <div className="card" style={styles.card}>
      <button style={styles.cardBtn} onClick={onClick}>
        <div style={styles.imgWrap}>
          <img src={item.imageUrl} alt={item.name} style={styles.img} loading="lazy" />
        </div>
        <div style={styles.info}>
          <p style={styles.name}>{item.name}</p>
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
  cardBtn: {
    width: '100%',
    background: 'none',
    border: 'none',
    padding: 0,
    textAlign: 'left',
    cursor: 'pointer'
  },
  imgWrap: {
    width: '100%',
    aspectRatio: '1',
    overflow: 'hidden',
    background: 'var(--vesta-charcoal)'
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  info: {
    padding: '10px 12px 12px'
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--vesta-warm-white)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
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

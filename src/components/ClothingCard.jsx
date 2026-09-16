export default function ClothingCard({ item, onClick }) {
  return (
    <button className="card" style={styles.card} onClick={onClick}>
      <div style={styles.imgWrap}>
        <img src={item.imageUrl} alt={item.name} style={styles.img} />
      </div>
      <div style={styles.info}>
        <p style={styles.name}>{item.name}</p>
        {item.color && <p style={styles.color}>{item.color}</p>}
      </div>
    </button>
  )
}

const styles = {
  card: {
    padding: 0,
    border: '1px solid var(--vesta-line)',
    textAlign: 'left',
    cursor: 'pointer',
    minWidth: 0
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
  }
}

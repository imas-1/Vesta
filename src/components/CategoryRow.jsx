import { categoryIcon } from '../utils/categoryIcons'

export default function CategoryRow({ category, items, onSeeAll }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button style={styles.header} onClick={onSeeAll}>
        <span style={styles.title}>{categoryIcon(category)} {category}</span>
        <span style={styles.count}>{items.length} {'>'}</span>
      </button>
      <div style={styles.scrollRow}>
        {items.map((item) => (
          <div key={item.id} style={styles.tile}>
            <img src={item.imageUrl} alt={item.name} style={styles.tileImg} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'none',
    border: 'none',
    padding: 0
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--vesta-warm-white)'
  },
  count: {
    fontSize: 12,
    color: 'var(--vesta-gray-dim)'
  },
  scrollRow: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 2
  },
  tile: {
    flexShrink: 0,
    width: 84,
    height: 84,
    borderRadius: 14,
    background: 'var(--vesta-panel)',
    border: '1px solid var(--vesta-line)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tileImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
}

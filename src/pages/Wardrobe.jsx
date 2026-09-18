import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import { subscribeToItems, addItem, updateItem, deleteItem, CATEGORIES } from '../firebase/items'
import { categoryIcon } from '../utils/categoryIcons'
import ClothingCard from '../components/ClothingCard'
import ZoomOverlay from '../components/ZoomOverlay'
import Modal from '../components/Modal'
import ItemForm from '../components/ItemForm'

export default function Wardrobe() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [items, setItems] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Toate')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('recente')
  const [addOpen, setAddOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [toast, setToast] = useState('')
  const [view, setView] = useState('grid')
  const [zoomItem, setZoomItem] = useState(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToItems(user.uid, setItems)
    return unsubscribe
  }, [user])

  useEffect(() => {
    if (location.state?.openAdd) {
      setAddOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
    if (location.state?.filterCategory) {
      setActiveCategory(location.state.filterCategory)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2000)
    return () => clearTimeout(t)
  }, [toast])

  const filteredItems = useMemo(() => {
    if (!items) return []
    let result = items

    if (activeCategory === 'Favorite') {
      result = result.filter((item) => item.favorite)
    } else if (activeCategory !== 'Toate') {
      result = result.filter((item) => item.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((item) =>
        [item.name, item.color, item.brand].some((v) => v?.toLowerCase().includes(q))
      )
    }

    result = [...result]
    if (sortBy === 'nume') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'purtate') {
      result.sort((a, b) => (b.lastWorn?.seconds || 0) - (a.lastWorn?.seconds || 0))
    }

    return result
  }, [items, activeCategory, search, sortBy])

  async function handleAdd(data) {
    await addItem(user.uid, data)
    setAddOpen(false)
    setToast('Haina a fost adaugata')
  }

  async function handleUpdate(data) {
    await updateItem(selectedItem.id, data)
    setSelectedItem(null)
    setEditing(false)
    setToast('Modificarile au fost salvate')
  }

  async function handleToggleFavorite(item) {
    await updateItem(item.id, { favorite: !item.favorite })
    setSelectedItem((prev) => (prev ? { ...prev, favorite: !prev.favorite } : prev))
  }

  async function handleMarkWorn(item) {
    await updateItem(item.id, { lastWorn: new Date() })
    setToast('Marcata ca purtata azi')
  }

  async function handleDelete() {
    await deleteItem(selectedItem.id)
    setSelectedItem(null)
    setConfirmDelete(false)
    setToast('Haina a fost stearsa')
  }

  return (
    <div className="vesta-screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="display" style={{ fontSize: 28 }}>Garderoba mea</h1>
        <button className="btn btn-primary" style={styles.addBtn} onClick={() => setAddOpen(true)}>+ Adauga</button>
      </div>

      <div className="field">
        <input
          type="text"
          placeholder="Cauta dupa nume, culoare sau brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--vesta-gray)' }}>Sorteaza:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.sortSelect}
        >
          <option value="recente">Cele mai recente</option>
          <option value="nume">Nume A-Z</option>
          <option value="purtate">Purtate recent</option>
        </select>

        <div style={styles.viewToggle}>
          <button
            style={{ ...styles.viewBtn, ...(view === 'grid' ? styles.viewBtnActive : {}) }}
            onClick={() => setView('grid')}
            aria-label="Grid"
          >
            ▦
          </button>
          <button
            style={{ ...styles.viewBtn, ...(view === 'closet' ? styles.viewBtnActive : {}) }}
            onClick={() => setView('closet')}
            aria-label="Closet"
          >
            ▤
          </button>
        </div>
      </div>

      <div style={styles.chipsRow}>
        <Chip label="Toate" active={activeCategory === 'Toate'} onClick={() => setActiveCategory('Toate')} />
        <Chip label="⭐ Favorite" active={activeCategory === 'Favorite'} onClick={() => setActiveCategory('Favorite')} />
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={`${categoryIcon(cat)} ${cat}`}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {items === null ? (
        <div className="loading-screen" style={{ minHeight: 'auto', flex: 1 }}>
          <div className="spinner" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: 14 }}>
            {items.length === 0 ? 'Garderoba ta e goala.' : 'Niciun rezultat.'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--vesta-gray-dim)' }}>
            {items.length === 0 ? 'Apasa „+ Adauga" pentru prima ta haina.' : 'Incearca alt filtru sau alta cautare.'}
          </p>
        </div>
      ) : (
        <div style={view === 'closet' ? styles.closetGrid : styles.grid}>
          {filteredItems.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              large={view === 'closet'}
              onClick={() => setSelectedItem(item)}
              onToggleFavorite={() => handleToggleFavorite(item)}
              onLongPress={(it) => setZoomItem(it)}
            />
          ))}
        </div>
      )}

      <ZoomOverlay item={zoomItem} onClose={() => setZoomItem(null)} />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Haina noua">
        <ItemForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} submitLabel="Salveaza" />
      </Modal>

      <Modal
        open={!!selectedItem && !editing}
        onClose={() => { setSelectedItem(null); setConfirmDelete(false) }}
        title={selectedItem?.name || ''}
      >
        {selectedItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <img src={selectedItem.imageUrl} alt={selectedItem.name} style={styles.detailImg} />
              <button style={styles.favoriteBtn} onClick={() => handleToggleFavorite(selectedItem)}>
                {selectedItem.favorite ? '⭐' : '☆'}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <DetailRow label="Categorie" value={`${categoryIcon(selectedItem.category)} ${selectedItem.category}`} />
              {selectedItem.color && <DetailRow label="Culoare" value={selectedItem.color} />}
              {selectedItem.brand && <DetailRow label="Brand" value={selectedItem.brand} />}
              {selectedItem.season && <DetailRow label="Sezon" value={selectedItem.season} />}
            </div>

            <button className="btn btn-secondary btn-block" onClick={() => handleMarkWorn(selectedItem)}>
              Marcheaza ca purtata azi
            </button>

            {!confirmDelete ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditing(true)}>
                  Editeaza
                </button>
                <button className="btn btn-secondary" style={{ flex: 1, color: '#e0a48b' }} onClick={() => setConfirmDelete(true)}>
                  Sterge
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: 13, color: 'var(--vesta-gray)', textAlign: 'center' }}>
                  Sigur vrei sa stergi „{selectedItem.name}"? Nu poate fi anulat.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmDelete(false)}>
                    Anuleaza
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, background: '#e0a48b' }} onClick={handleDelete}>
                    Da, sterge
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={!!selectedItem && editing}
        onClose={() => setEditing(false)}
        title="Editeaza haina"
      >
        {selectedItem && (
          <ItemForm
            initial={selectedItem}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            submitLabel="Salveaza modificarile"
          />
        )}
      </Modal>

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  )
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.chip,
        background: active ? 'var(--vesta-cream)' : 'var(--vesta-panel)',
        color: active ? 'var(--vesta-black)' : 'var(--vesta-gray)',
        borderColor: active ? 'var(--vesta-cream)' : 'var(--vesta-line)'
      }}
    >
      {label}
    </button>
  )
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--vesta-line)' }}>
      <span style={{ color: 'var(--vesta-gray)', fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
    </div>
  )
}

const styles = {
  addBtn: {
    padding: '10px 16px',
    fontSize: 13
  },
  sortSelect: {
    background: 'var(--vesta-panel)',
    border: '1px solid var(--vesta-line)',
    borderRadius: 8,
    color: 'var(--vesta-warm-white)',
    fontSize: 12.5,
    padding: '6px 8px'
  },
  chipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -8
  },
  chip: {
    padding: '8px 14px',
    borderRadius: 999,
    border: '1px solid',
    fontSize: 12.5,
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12
  },
  closetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: 14
  },
  viewToggle: {
    display: 'flex',
    marginLeft: 'auto',
    border: '1px solid var(--vesta-line)',
    borderRadius: 8,
    overflow: 'hidden'
  },
  viewBtn: {
    background: 'var(--vesta-panel)',
    border: 'none',
    color: 'var(--vesta-gray)',
    fontSize: 14,
    padding: '6px 10px',
    cursor: 'pointer',
    lineHeight: 1
  },
  viewBtnActive: {
    background: 'var(--vesta-cream)',
    color: 'var(--vesta-black)'
  },
  detailImg: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)'
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(10,10,10,0.6)',
    border: 'none',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toast: {
    position: 'fixed',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--vesta-cream)',
    color: 'var(--vesta-black)',
    padding: '10px 18px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    zIndex: 200,
    boxShadow: '0 6px 18px rgba(0,0,0,0.4)'
  }
}

import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import { subscribeToItems, addItem, updateItem, deleteItem, CATEGORIES } from '../firebase/items'
import ClothingCard from '../components/ClothingCard'
import Modal from '../components/Modal'
import ItemForm from '../components/ItemForm'

export default function Wardrobe() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [items, setItems] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Toate')
  const [addOpen, setAddOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editing, setEditing] = useState(false)

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
  }, [location, navigate])

  const filteredItems = useMemo(() => {
    if (!items) return []
    if (activeCategory === 'Toate') return items
    return items.filter((item) => item.category === activeCategory)
  }, [items, activeCategory])

  async function handleAdd(data) {
    await addItem(user.uid, data)
    setAddOpen(false)
  }

  async function handleUpdate(data) {
    await updateItem(selectedItem.id, data)
    setSelectedItem(null)
    setEditing(false)
  }

  async function handleDelete() {
    await deleteItem(selectedItem.id)
    setSelectedItem(null)
  }

  return (
    <div className="vesta-screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="display" style={{ fontSize: 28 }}>Garderoba mea</h1>
        <button className="btn btn-primary" style={styles.addBtn} onClick={() => setAddOpen(true)}>+ Adauga</button>
      </div>

      <div style={styles.chipsRow}>
        <Chip label="Toate" active={activeCategory === 'Toate'} onClick={() => setActiveCategory('Toate')} />
        {CATEGORIES.map((cat) => (
          <Chip key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
        ))}
      </div>

      {items === null ? (
        <div className="loading-screen" style={{ minHeight: 'auto', flex: 1 }}>
          <div className="spinner" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: 14 }}>
            {items.length === 0 ? 'Garderoba ta e goala.' : 'Nicio haina in aceasta categorie.'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--vesta-gray-dim)' }}>
            Apasa „+ Adauga" pentru prima ta haina.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((item) => (
            <ClothingCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Haina noua">
        <ItemForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} submitLabel="Salveaza" />
      </Modal>

      <Modal
        open={!!selectedItem && !editing}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || ''}
      >
        {selectedItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <img src={selectedItem.imageUrl} alt={selectedItem.name} style={styles.detailImg} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <DetailRow label="Categorie" value={selectedItem.category} />
              {selectedItem.color && <DetailRow label="Culoare" value={selectedItem.color} />}
              {selectedItem.brand && <DetailRow label="Brand" value={selectedItem.brand} />}
              {selectedItem.season && <DetailRow label="Sezon" value={selectedItem.season} />}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditing(true)}>
                Editeaza
              </button>
              <button className="btn btn-secondary" style={{ flex: 1, color: '#e0a48b' }} onClick={handleDelete}>
                Sterge
              </button>
            </div>
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
  detailImg: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)'
  }
}

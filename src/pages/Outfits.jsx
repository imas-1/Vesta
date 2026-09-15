import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import { subscribeToItems } from '../firebase/items'
import { subscribeToOutfits, addOutfit, updateOutfit, deleteOutfit } from '../firebase/outfits'
import Modal from '../components/Modal'
import OutfitForm from '../components/OutfitForm'

export default function Outfits() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [outfits, setOutfits] = useState(null)
  const [items, setItems] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!user) return
    const unsub1 = subscribeToOutfits(user.uid, setOutfits)
    const unsub2 = subscribeToItems(user.uid, setItems)
    return () => {
      unsub1()
      unsub2()
    }
  }, [user])

  useEffect(() => {
    if (location.state?.openAdd) {
      setAddOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  const itemsById = useMemo(() => {
    const map = {}
    items.forEach((item) => { map[item.id] = item })
    return map
  }, [items])

  async function handleAdd(data) {
    await addOutfit(user.uid, data)
    setAddOpen(false)
  }

  async function handleUpdate(data) {
    await updateOutfit(selectedOutfit.id, data)
    setSelectedOutfit(null)
    setEditing(false)
  }

  async function handleDelete() {
    await deleteOutfit(selectedOutfit.id)
    setSelectedOutfit(null)
  }

  return (
    <div className="vesta-screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="display" style={{ fontSize: 28 }}>Outfits</h1>
        <button className="btn btn-primary" style={styles.addBtn} onClick={() => setAddOpen(true)}>+ Tinuta noua</button>
      </div>

      {outfits === null ? (
        <div className="loading-screen" style={{ minHeight: 'auto', flex: 1 }}>
          <div className="spinner" />
        </div>
      ) : outfits.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: 14 }}>Nu ai nicio tinuta salvata.</p>
          <p style={{ fontSize: 13, color: 'var(--vesta-gray-dim)' }}>
            Apasa „+ Tinuta noua" pentru a combina prima ta tinuta.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {outfits.map((outfit) => (
            <button key={outfit.id} className="card" style={styles.outfitCard} onClick={() => setSelectedOutfit(outfit)}>
              <div style={styles.thumbRow}>
                {outfit.itemIds.slice(0, 4).map((id) => {
                  const item = itemsById[id]
                  return item ? (
                    <img key={id} src={item.imageUrl} alt={item.name} style={styles.thumb} />
                  ) : null
                })}
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{outfit.name}</p>
                {outfit.description && (
                  <p style={{ color: 'var(--vesta-gray)', fontSize: 12.5, marginTop: 2 }}>{outfit.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Tinuta noua">
        <OutfitForm items={items} onSubmit={handleAdd} onCancel={() => setAddOpen(false)} submitLabel="Salveaza" />
      </Modal>

      <Modal
        open={!!selectedOutfit && !editing}
        onClose={() => setSelectedOutfit(null)}
        title={selectedOutfit?.name || ''}
      >
        {selectedOutfit && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {selectedOutfit.description && (
              <p style={{ color: 'var(--vesta-gray)', fontSize: 13.5 }}>{selectedOutfit.description}</p>
            )}
            <div style={styles.detailGrid}>
              {selectedOutfit.itemIds.map((id) => {
                const item = itemsById[id]
                if (!item) return null
                return (
                  <div key={id} style={styles.detailItem}>
                    <img src={item.imageUrl} alt={item.name} style={styles.detailImg} />
                    <p style={styles.detailName}>{item.name}</p>
                  </div>
                )
              })}
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
        open={!!selectedOutfit && editing}
        onClose={() => setEditing(false)}
        title="Editeaza tinuta"
      >
        {selectedOutfit && (
          <OutfitForm
            items={items}
            initial={selectedOutfit}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            submitLabel="Salveaza modificarile"
          />
        )}
      </Modal>
    </div>
  )
}

const styles = {
  addBtn: {
    padding: '10px 16px',
    fontSize: 13
  },
  outfitCard: {
    padding: 0,
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%'
  },
  thumbRow: {
    display: 'flex',
    height: 90
  },
  thumb: {
    flex: 1,
    height: '100%',
    objectFit: 'cover',
    borderRight: '1px solid var(--vesta-black)'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  detailImg: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: 10
  },
  detailName: {
    fontSize: 11,
    color: 'var(--vesta-gray)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}

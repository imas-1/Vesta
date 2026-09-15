import { useState } from 'react'

export default function OutfitForm({ items, initial, onSubmit, onCancel, submitLabel }) {
  const [selectedIds, setSelectedIds] = useState(initial?.itemIds || [])
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggleItem(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (selectedIds.length === 0) {
      setError('Selecteaza cel putin o haina.')
      return
    }
    if (!name.trim()) {
      setError('Introdu numele tinutei.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        itemIds: selectedIds
      })
    } catch (err) {
      setError('Nu am putut salva tinuta. Incearca din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="field">
        <label>Nume tinuta</label>
        <input
          type="text"
          placeholder="ex: Casual de weekend"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Descriere (optional)</label>
        <textarea
          rows={2}
          placeholder="Cateva cuvinte despre aceasta tinuta"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Alege hainele ({selectedIds.length} selectate)</label>
        {items.length === 0 ? (
          <p style={{ color: 'var(--vesta-gray-dim)', fontSize: 13 }}>
            Adauga mai intai haine in Garderoba.
          </p>
        ) : (
          <div style={styles.itemsGrid}>
            {items.map((item) => {
              const selected = selectedIds.includes(item.id)
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  style={{
                    ...styles.itemThumb,
                    borderColor: selected ? 'var(--vesta-gold)' : 'var(--vesta-line)',
                    opacity: selected ? 1 : 0.6
                  }}
                >
                  <img src={item.imageUrl} alt={item.name} style={styles.itemImg} />
                  {selected && <div style={styles.checkBadge}>✓</div>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
          Anuleaza
        </button>
        <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
          {loading ? 'Se salveaza...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

const styles = {
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8
  },
  itemThumb: {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: 12,
    overflow: 'hidden',
    border: '2px solid',
    padding: 0,
    background: 'var(--vesta-panel)'
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: 'var(--vesta-gold)',
    color: 'var(--vesta-black)',
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700
  }
}

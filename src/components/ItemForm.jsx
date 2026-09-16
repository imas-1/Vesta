import { useState, useRef } from 'react'
import { CATEGORIES } from '../firebase/items'
import { compressImage } from '../utils/imageCompress'

export default function ItemForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [photo, setPhoto] = useState(initial?.imageUrl || null)
  const [name, setName] = useState(initial?.name || '')
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0])
  const [color, setColor] = useState(initial?.color || '')
  const [brand, setBrand] = useState(initial?.brand || '')
  const [season, setSeason] = useState(initial?.season || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [processingPhoto, setProcessingPhoto] = useState(false)
  const fileInputRef = useRef(null)

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setProcessingPhoto(true)
    setError('')
    try {
      const compressed = await compressImage(file)
      setPhoto(compressed)
    } catch (err) {
      setError('Nu am putut procesa fotografia. Incearca alta poza.')
    } finally {
      setProcessingPhoto(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!photo) {
      setError('Adauga o fotografie.')
      return
    }
    if (!name.trim()) {
      setError('Introdu numele articolului.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        imageUrl: photo,
        name: name.trim(),
        category,
        color: color.trim(),
        brand: brand.trim(),
        season: season.trim()
      })
    } catch (err) {
      setError('Nu am putut salva articolul. Incearca din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handlePhotoChange}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        style={styles.photoPicker}
      >
        {processingPhoto ? (
          <div className="spinner" />
        ) : photo ? (
          <img src={photo} alt="Previzualizare" style={styles.previewImg} />
        ) : (
          <span style={{ color: 'var(--vesta-gray)', fontSize: 14 }}>Adauga o fotografie</span>
        )}
      </button>
      {photo && !processingPhoto && (
        <button
          type="button"
          className="btn-text"
          style={{ alignSelf: 'center', padding: 0 }}
          onClick={() => fileInputRef.current?.click()}
        >
          Schimba fotografia
        </button>
      )}

      <div className="field">
        <label>Nume articol</label>
        <input
          type="text"
          placeholder="ex: Tricou alb basic"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Categorie</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Culoare</label>
        <input
          type="text"
          placeholder="ex: Alb"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
        <div className="field" style={{ flex: 1, minWidth: 0 }}>
          <label>Brand (optional)</label>
          <input
            type="text"
            placeholder="ex: Zara"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="field" style={{ flex: 1, minWidth: 0 }}>
          <label>Sezon (optional)</label>
          <input
            type="text"
            placeholder="ex: Vara"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
          Anuleaza
        </button>
        <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading || processingPhoto}>
          {loading ? 'Se salveaza...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

const styles = {
  photoPicker: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--vesta-panel)',
    border: '1px dashed var(--vesta-line)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
}

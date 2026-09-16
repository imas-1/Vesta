import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase/config'
import { useAuth } from '../firebase/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')

  async function handleLogout() {
    await signOut(auth)
    navigate('/bun-venit')
  }

  async function handleExport() {
    setExporting(true)
    setExportError('')
    try {
      const itemsQ = query(collection(db, 'items'), where('userId', '==', user.uid))
      const outfitsQ = query(collection(db, 'outfits'), where('userId', '==', user.uid))
      const [itemsSnap, outfitsSnap] = await Promise.all([getDocs(itemsQ), getDocs(outfitsQ)])

      const backup = {
        exportedAt: new Date().toISOString(),
        items: itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        outfits: outfitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vesta-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setExportError('Nu am putut exporta datele. Incearca din nou.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="vesta-screen">
      <h1 className="display" style={{ fontSize: 28 }}>Profil</h1>

      <div className="card" style={{ padding: 20 }}>
        <p style={{ color: 'var(--vesta-gray)', fontSize: 12, marginBottom: 4 }}>Email</p>
        <p style={{ fontSize: 15 }}>{user?.email}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-secondary btn-block" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Se exporta...' : 'Exporta backup (JSON)'}
        </button>
        {exportError && <p className="error-text">{exportError}</p>}
        <p style={{ fontSize: 12, color: 'var(--vesta-gray-dim)', textAlign: 'center' }}>
          Descarca o copie a garderobei si tinutelor tale, ca plasa de siguranta.
        </p>
      </div>

      <button className="btn btn-secondary btn-block" onClick={handleLogout}>
        Deconectare
      </button>
    </div>
  )
}

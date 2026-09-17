import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import { subscribeToItems, CATEGORIES } from '../firebase/items'
import EmailVerificationBanner from '../components/EmailVerificationBanner'
import CategoryRow from '../components/CategoryRow'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.email?.split('@')[0] || ''
  const [items, setItems] = useState(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToItems(user.uid, setItems)
    return unsubscribe
  }, [user])

  const grouped = useMemo(() => {
    if (!items) return []
    return CATEGORIES
      .map((cat) => ({ category: cat, items: items.filter((i) => i.category === cat) }))
      .filter((g) => g.items.length > 0)
  }, [items])

  return (
    <div className="vesta-screen">
      <div>
        <p style={{ color: 'var(--vesta-gold)', fontSize: 11, letterSpacing: '0.25em' }}>VESTA</p>
        <h1 className="display" style={{ fontSize: 30, marginTop: 6 }}>
          Buna, {firstName}
        </h1>
      </div>

      <EmailVerificationBanner user={user} />

      {items === null ? (
        <div className="loading-screen" style={{ minHeight: 'auto', flex: 1 }}>
          <div className="spinner" />
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--vesta-gray)', fontSize: 14, lineHeight: 1.6 }}>
            Garderoba ta te asteapta.<br />
            Adauga haine si combina-le in tinute.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            onClick={() => navigate('/garderoba', { state: { openAdd: true } })}
          >
            + Adauga prima haina
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {grouped.map((g) => (
            <CategoryRow
              key={g.category}
              category={g.category}
              items={g.items}
              onSeeAll={() => navigate('/garderoba', { state: { filterCategory: g.category } })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import { subscribeToItems, CATEGORIES } from '../firebase/items'
import { subscribeToOutfits } from '../firebase/outfits'
import { suggestOutfit } from '../utils/outfitSuggest'
import EmailVerificationBanner from '../components/EmailVerificationBanner'
import CategoryRow from '../components/CategoryRow'

const DAYS = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata']
const MONTHS = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie']

function formatToday() {
  const d = new Date()
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

function wornThisMonthCount(items) {
  const now = new Date()
  return items.filter((i) => {
    if (!i.lastWorn?.seconds) return false
    const d = new Date(i.lastWorn.seconds * 1000)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
}

function neglectedItems(items, limit = 8) {
  const THIRTY_DAYS = 30 * 24 * 60 * 60
  const now = Date.now() / 1000
  return [...items]
    .filter((i) => !i.lastWorn?.seconds || now - i.lastWorn.seconds > THIRTY_DAYS)
    .sort((a, b) => (a.lastWorn?.seconds || 0) - (b.lastWorn?.seconds || 0))
    .slice(0, limit)
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.email?.split('@')[0] || ''
  const [items, setItems] = useState(null)
  const [outfits, setOutfits] = useState(null)
  const [suggestSeed, setSuggestSeed] = useState(0)

  useEffect(() => {
    if (!user) return
    const unsubItems = subscribeToItems(user.uid, setItems)
    const unsubOutfits = subscribeToOutfits(user.uid, setOutfits)
    return () => {
      unsubItems()
      unsubOutfits()
    }
  }, [user])

  const grouped = useMemo(() => {
    if (!items) return []
    return CATEGORIES
      .map((cat) => ({ category: cat, items: items.filter((i) => i.category === cat) }))
      .filter((g) => g.items.length > 0)
  }, [items])

  const suggestedIds = useMemo(() => {
    if (!items || items.length === 0) return null
    return suggestOutfit(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, suggestSeed])

  const suggestedItems = useMemo(() => {
    if (!suggestedIds || !items) return []
    return suggestedIds.map((id) => items.find((i) => i.id === id)).filter(Boolean)
  }, [suggestedIds, items])

  const neglected = useMemo(() => (items ? neglectedItems(items) : []), [items])

  const loading = items === null || outfits === null

  return (
    <div className="vesta-screen">
      <div className="stagger-item" style={{ animationDelay: '0ms' }}>
        <p style={{ color: 'var(--vesta-gold)', fontSize: 11, letterSpacing: '0.25em' }}>VESTA</p>
        <h1 className="display" style={{ fontSize: 30, marginTop: 6 }}>
          Buna, {firstName}
        </h1>
        <p style={{ color: 'var(--vesta-gray-dim)', fontSize: 13, marginTop: 4, textTransform: 'capitalize' }}>
          {formatToday()}
        </p>
      </div>

      <EmailVerificationBanner user={user} />

      {loading ? (
        <HomeSkeleton />
      ) : items.length === 0 ? (
        <div className="card stagger-item" style={{ padding: 24, textAlign: 'center', animationDelay: '80ms' }}>
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
        <>
          <div className="stagger-item" style={{ ...styles.statsRow, animationDelay: '80ms' }}>
            <StatBlock value={items.length} label="haine" />
            <StatBlock value={outfits.length} label="tinute" />
            <StatBlock value={wornThisMonthCount(items)} label="purtate luna asta" />
          </div>

          {suggestedItems.length >= 2 && (
            <div className="card stagger-item" style={{ ...styles.suggestCard, animationDelay: '140ms' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.suggestLabel}>Tinuta sugerata azi</span>
                <button style={styles.refreshBtn} onClick={() => setSuggestSeed((s) => s + 1)}>
                  ↻ Alt outfit
                </button>
              </div>
              <div style={styles.suggestRow}>
                {suggestedItems.map((item) => (
                  <div key={item.id} style={styles.suggestTile}>
                    <img src={item.imageUrl} alt={item.name} style={styles.suggestImg} loading="lazy" />
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-block" onClick={() => navigate('/outfits')}>
                Vezi in Outfits
              </button>
            </div>
          )}

          {neglected.length > 0 && (
            <div className="stagger-item" style={{ animationDelay: '200ms' }}>
              <div style={styles.sectionHeader}>Nepurtate de un timp</div>
              <div style={styles.scrollRow}>
                {neglected.map((item) => (
                  <div
                    key={item.id}
                    style={styles.neglectedTile}
                    onClick={() => navigate('/garderoba', { state: { filterCategory: item.category } })}
                  >
                    <img src={item.imageUrl} alt={item.name} style={styles.tileImg} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {grouped.map((g, i) => (
              <div key={g.category} className="stagger-item" style={{ animationDelay: `${260 + i * 40}ms` }}>
                <CategoryRow
                  category={g.category}
                  items={g.items}
                  onSeeAll={() => navigate('/garderoba', { state: { filterCategory: g.category } })}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function StatBlock({ value, label }) {
  return (
    <div style={styles.statBlock}>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  )
}

function HomeSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div style={styles.statsRow}>
        <div className="skeleton" style={{ height: 62, flex: 1, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 62, flex: 1, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 62, flex: 1, borderRadius: 16 }} />
      </div>
      <div className="skeleton" style={{ height: 180, borderRadius: 22 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 6 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="skeleton" style={{ height: 84, width: 84, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 84, width: 84, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 84, width: 84, borderRadius: 14 }} />
        </div>
      </div>
    </div>
  )
}

const styles = {
  statsRow: {
    display: 'flex',
    gap: 10
  },
  statBlock: {
    flex: 1,
    background: 'var(--vesta-panel)',
    border: '1px solid var(--vesta-line)',
    borderRadius: 16,
    padding: '14px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: 24,
    fontWeight: 600,
    color: 'var(--vesta-warm-white)'
  },
  statLabel: {
    fontSize: 11,
    color: 'var(--vesta-gray-dim)',
    textAlign: 'center'
  },
  suggestCard: {
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  suggestLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--vesta-gold)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  refreshBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--vesta-gray)',
    fontSize: 12.5,
    fontWeight: 500,
    cursor: 'pointer',
    padding: 4
  },
  suggestRow: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 2
  },
  suggestTile: {
    flexShrink: 0,
    width: 96,
    height: 96,
    borderRadius: 14,
    background: 'var(--vesta-charcoal)',
    border: '1px solid var(--vesta-line)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  suggestImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--vesta-warm-white)',
    marginBottom: 10
  },
  scrollRow: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 2
  },
  neglectedTile: {
    flexShrink: 0,
    width: 84,
    height: 84,
    borderRadius: 14,
    background: 'var(--vesta-panel)',
    border: '1px solid var(--vesta-line)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  tileImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
}

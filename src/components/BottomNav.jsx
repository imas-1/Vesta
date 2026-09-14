import { NavLink, useNavigate } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/garderoba', label: 'Garderoba', icon: WardrobeIcon },
  { to: '/outfits', label: 'Outfits', icon: OutfitIcon },
  { to: '/profil', label: 'Profil', icon: ProfileIcon }
]

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav style={styles.nav}>
      {items.slice(0, 2).map((item) => (
        <NavItem key={item.to} item={item} />
      ))}

      <button style={styles.addBtn} onClick={() => navigate('/adauga')} aria-label="Adauga">
        <PlusIcon />
      </button>

      {items.slice(2).map((item) => (
        <NavItem key={item.to} item={item} />
      ))}
    </nav>
  )
}

function NavItem({ item }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      style={({ isActive }) => ({
        ...styles.item,
        color: isActive ? 'var(--vesta-cream)' : 'var(--vesta-gray-dim)'
      })}
    >
      <Icon />
      <span style={styles.label}>{item.label}</span>
    </NavLink>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '10px 8px calc(10px + env(safe-area-inset-bottom))',
    background: 'rgba(10,10,10,0.88)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--vesta-line)',
    zIndex: 50
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    fontWeight: 500,
    flex: 1,
    padding: '4px 0'
  },
  label: {
    fontSize: 10.5,
    letterSpacing: '0.02em'
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'var(--vesta-cream)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
    flexShrink: 0
  }
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WardrobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M12 3v18" />
    </svg>
  )
}

function OutfitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 4h1.5a1.5 1.5 0 0 0 3 0H15l4 4-3 2v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10L5 8Z" strokeLinejoin="round" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 5-5.5 7.5-5.5s6 1.5 7.5 5.5" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

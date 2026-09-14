import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'

export default function Welcome() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="vesta-screen-center">
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <p style={{ color: 'var(--vesta-gold)', fontSize: 11, letterSpacing: '0.3em', marginBottom: 14 }}>
          GARDEROBA TA DIGITALA
        </p>
        <h1 className="display" style={{ fontSize: 56, lineHeight: 1 }}>VESTA</h1>
        <p style={{ color: 'var(--vesta-gray)', fontSize: 15, marginTop: 16, lineHeight: 1.5 }}>
          Organizeaza-ti hainele.<br />Creeaza tinute. Cu stil.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        <Link to="/inregistrare" className="btn btn-primary btn-block">Creeaza cont</Link>
        <Link to="/autentificare" className="btn btn-secondary btn-block">Am deja cont</Link>
      </div>
    </div>
  )
}

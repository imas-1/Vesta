import { useAuth } from '../firebase/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const firstName = user?.email?.split('@')[0] || ''

  return (
    <div className="vesta-screen">
      <div>
        <p style={{ color: 'var(--vesta-gold)', fontSize: 11, letterSpacing: '0.25em' }}>VESTA</p>
        <h1 className="display" style={{ fontSize: 30, marginTop: 6 }}>
          Buna, {firstName}
        </h1>
      </div>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ color: 'var(--vesta-gray)', fontSize: 14, lineHeight: 1.6 }}>
          Garderoba ta te asteapta.<br />
          Adauga haine si combina-le in tinute.
        </p>
      </div>
    </div>
  )
}

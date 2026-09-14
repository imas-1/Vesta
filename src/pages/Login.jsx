import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(mapAuthError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="vesta-screen-center">
      <h1 className="display" style={{ fontSize: 32, marginBottom: 4 }}>Bine ai revenit</h1>
      <p style={{ color: 'var(--vesta-gray)', fontSize: 14, marginBottom: 12 }}>
        Autentifica-te in contul tau VESTA.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="nume@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Parola</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Parola ta"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div style={{ textAlign: 'right', marginTop: -8 }}>
          <Link to="/resetare-parola" style={{ color: 'var(--vesta-gray)', fontSize: 13 }}>
            Ai uitat parola?
          </Link>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Se autentifica...' : 'Autentificare'}
        </button>
      </form>

      <p style={{ textAlign: 'center', color: 'var(--vesta-gray)', fontSize: 13, marginTop: 8 }}>
        Nu ai cont? <Link to="/inregistrare" style={{ color: 'var(--vesta-cream)', fontWeight: 600 }}>Creeaza unul</Link>
      </p>
    </div>
  )
}

function mapAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email sau parola incorecte.'
    case 'auth/invalid-email':
      return 'Email invalid.'
    case 'auth/too-many-requests':
      return 'Prea multe incercari. Incearca mai tarziu.'
    default:
      return 'A aparut o eroare. Incearca din nou.'
  }
}

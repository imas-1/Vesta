import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth } from '../firebase/config'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Parola trebuie sa aiba cel putin 6 caractere.')
      return
    }

    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await sendEmailVerification(cred.user)
      navigate('/')
    } catch (err) {
      setError(mapAuthError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="vesta-screen-center">
      <h1 className="display" style={{ fontSize: 32, marginBottom: 4 }}>Creeaza cont</h1>
      <p style={{ color: 'var(--vesta-gray)', fontSize: 14, marginBottom: 12 }}>
        Incepe-ti garderoba digitala VESTA.
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
            autoComplete="new-password"
            placeholder="Minim 6 caractere"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Se creeaza...' : 'Creeaza cont'}
        </button>
      </form>

      <p style={{ textAlign: 'center', color: 'var(--vesta-gray)', fontSize: 13, marginTop: 8 }}>
        Ai deja cont? <Link to="/autentificare" style={{ color: 'var(--vesta-cream)', fontWeight: 600 }}>Autentifica-te</Link>
      </p>
    </div>
  )
}

function mapAuthError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Acest email este deja folosit.'
    case 'auth/invalid-email':
      return 'Email invalid.'
    case 'auth/weak-password':
      return 'Parola este prea slaba.'
    default:
      return 'A aparut o eroare. Incearca din nou.'
  }
}

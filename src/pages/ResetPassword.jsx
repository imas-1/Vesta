import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/config'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setSent(true)
    } catch (err) {
      setError('Nu am putut trimite email-ul. Verifica adresa introdusa.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="vesta-screen-center">
      <h1 className="display" style={{ fontSize: 30, marginBottom: 4 }}>Resetare parola</h1>
      <p style={{ color: 'var(--vesta-gray)', fontSize: 14, marginBottom: 12 }}>
        Iti trimitem un link de resetare pe email.
      </p>

      {sent ? (
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 14 }}>Am trimis un email catre <strong>{email}</strong>. Verifica inbox-ul (si folderul de spam).</p>
        </div>
      ) : (
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

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Se trimite...' : 'Trimite link de resetare'}
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', color: 'var(--vesta-gray)', fontSize: 13, marginTop: 8 }}>
        <Link to="/autentificare" style={{ color: 'var(--vesta-cream)', fontWeight: 600 }}>Inapoi la autentificare</Link>
      </p>
    </div>
  )
}

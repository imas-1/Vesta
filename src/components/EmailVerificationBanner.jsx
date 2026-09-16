import { useState } from 'react'
import { sendEmailVerification } from 'firebase/auth'

export default function EmailVerificationBanner({ user }) {
  const [sent, setSent] = useState(false)

  if (!user || user.emailVerified) return null

  async function handleResend() {
    try {
      await sendEmailVerification(user)
      setSent(true)
    } catch (err) {
      // silently ignore - Firebase rate-limits repeated sends
    }
  }

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        {sent
          ? 'Email de verificare retrimis. Verifica inbox-ul.'
          : 'Contul tau nu e verificat inca.'}
      </p>
      {!sent && (
        <button style={styles.link} onClick={handleResend}>
          Retrimite email
        </button>
      )}
    </div>
  )
}

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    background: 'var(--vesta-panel)',
    border: '1px solid var(--vesta-gold)',
    borderRadius: 12,
    padding: '10px 14px'
  },
  text: {
    fontSize: 12.5,
    color: 'var(--vesta-warm-white)'
  },
  link: {
    background: 'none',
    border: 'none',
    color: 'var(--vesta-gold)',
    fontSize: 12.5,
    fontWeight: 600,
    whiteSpace: 'nowrap'
  }
}

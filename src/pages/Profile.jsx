import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import { useAuth } from '../firebase/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut(auth)
    navigate('/bun-venit')
  }

  return (
    <div className="vesta-screen">
      <h1 className="display" style={{ fontSize: 28 }}>Profil</h1>

      <div className="card" style={{ padding: 20 }}>
        <p style={{ color: 'var(--vesta-gray)', fontSize: 12, marginBottom: 4 }}>Email</p>
        <p style={{ fontSize: 15 }}>{user?.email}</p>
      </div>

      <button className="btn btn-secondary btn-block" onClick={handleLogout}>
        Deconectare
      </button>
    </div>
  )
}

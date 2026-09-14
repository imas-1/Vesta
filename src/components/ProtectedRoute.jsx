import { Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/bun-venit" replace />
  }

  return children
}

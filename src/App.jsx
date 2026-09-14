import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './firebase/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'

import Welcome from './pages/Welcome'
import Register from './pages/Register'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Wardrobe from './pages/Wardrobe'
import Outfits from './pages/Outfits'
import Profile from './pages/Profile'
import AddNew from './pages/AddNew'

function Layout({ children }) {
  const location = useLocation()
  const hideNav = ['/bun-venit', '/autentificare', '/inregistrare', '/resetare-parola'].includes(location.pathname)

  return (
    <>
      {children}
      {!hideNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/bun-venit" element={<Welcome />} />
            <Route path="/inregistrare" element={<Register />} />
            <Route path="/autentificare" element={<Login />} />
            <Route path="/resetare-parola" element={<ResetPassword />} />

            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/garderoba" element={<ProtectedRoute><Wardrobe /></ProtectedRoute>} />
            <Route path="/outfits" element={<ProtectedRoute><Outfits /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/adauga" element={<ProtectedRoute><AddNew /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

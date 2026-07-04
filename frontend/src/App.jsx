import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BoardPage from './pages/BoardPage'

function Protected({ children }) {
  const user = useAuthStore((s) => s.user)
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/boards/:id" element={<Protected><BoardPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

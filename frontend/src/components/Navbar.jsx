import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="border-b border-ink-700 bg-ink-900/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-display font-700 text-lg tracking-tight">
          <span className="text-peri-400">Task</span>Flow
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400 hidden sm:inline">Hola, {user?.name}</span>
          <button
            className="btn-ghost !py-1.5"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}

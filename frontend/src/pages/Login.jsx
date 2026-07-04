import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setTokens = useAuthStore((s) => s.setTokens)
  const navigate = useNavigate()

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const form = new URLSearchParams({ username: email, password })
      const { data } = await api.post('/auth/login', form)
      setTokens(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudo iniciar sesión. Revisa tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-bold text-3xl text-center mb-1">
          <span className="text-peri-400">Task</span>Flow
        </h1>
        <p className="text-slate-400 text-sm text-center mb-8">
          Organiza tus proyectos, una tarjeta a la vez
        </p>

        <div className="space-y-3">
          <input className="input" type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Contraseña" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()} />
          {error && <p className="text-rose-400 text-sm">{error}</p>}
          <button className="btn-primary w-full" onClick={submit} disabled={loading}>
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </div>

        <p className="text-sm text-slate-400 text-center mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-peri-300 hover:underline">Regístrate</Link>
        </p>
      </div>
    </main>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/auth'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setTokens = useAuthStore((s) => s.setTokens)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      setTokens(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-bold text-2xl text-center mb-8">
          Crea tu cuenta en <span className="text-peri-400">Task</span>Flow
        </h1>

        <div className="space-y-3">
          <input className="input" placeholder="Nombre" value={form.name} onChange={set('name')} />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={set('email')} />
          <input className="input" type="password" placeholder="Contraseña (mín. 6 caracteres)"
            value={form.password} onChange={set('password')}
            onKeyDown={(e) => e.key === 'Enter' && submit()} />
          {error && <p className="text-rose-400 text-sm">{error}</p>}
          <button className="btn-primary w-full" onClick={submit} disabled={loading}>
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </div>

        <p className="text-sm text-slate-400 text-center mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-peri-300 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}

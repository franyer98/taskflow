import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const [boards, setBoards] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await api.get('/boards')
    setBoards(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const createBoard = async () => {
    if (!title.trim()) return
    await api.post('/boards', { title })
    setTitle('')
    load()
  }

  const removeBoard = async (id) => {
    if (!confirm('¿Eliminar este tablero y todas sus tareas?')) return
    await api.delete(`/boards/${id}`)
    load()
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="font-display font-bold text-2xl mt-4 mb-6">Mis tableros</h1>

        <div className="flex gap-2 mb-8 max-w-md">
          <input className="input" placeholder="Nombre del nuevo tablero" value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createBoard()} />
          <button className="btn-primary shrink-0" onClick={createBoard}>Crear</button>
        </div>

        {loading ? (
          <p className="text-slate-400">Cargando…</p>
        ) : boards.length === 0 ? (
          <p className="text-slate-500">Aún no tienes tableros. Crea el primero arriba 👆</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((b) => (
              <div key={b.id}
                className="group rounded-2xl bg-ink-900 border border-ink-700 hover:border-peri-400/60 transition-colors p-4">
                <Link to={`/boards/${b.id}`} className="block">
                  <h2 className="font-display font-semibold">{b.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Creado el {new Date(b.created_at).toLocaleDateString('es')}
                  </p>
                </Link>
                <button
                  className="text-xs text-slate-600 hover:text-rose-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeBoard(b.id)}>
                  Eliminar tablero
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

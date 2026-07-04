import { useState } from 'react'
import { useBoardStore } from '../store/board'

export default function TaskModal({ task, columnId, onClose }) {
  const isEdit = Boolean(task)
  const { createTask, updateTask, deleteTask } = useBoardStore()
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'media',
    due_date: task?.due_date || ''
  })
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (isEdit) {
        await updateTask(task.id, { ...form, due_date: form.due_date || null })
      } else {
        await createTask({ ...form, due_date: form.due_date || null, column_id: columnId })
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-ink-900 border border-ink-600 rounded-2xl w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display font-semibold mb-4">
          {isEdit ? 'Editar tarea' : 'Nueva tarea'}
        </h3>

        <div className="space-y-3">
          <input
            className="input"
            placeholder="Título de la tarea"
            value={form.title}
            onChange={set('title')}
            autoFocus
          />
          <textarea
            className="input min-h-20 resize-y"
            placeholder="Descripción (opcional)"
            value={form.description}
            onChange={set('description')}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Prioridad</label>
              <select className="input" value={form.priority} onChange={set('priority')}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Fecha límite</label>
              <input type="date" className="input" value={form.due_date} onChange={set('due_date')} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          {isEdit ? (
            <button
              className="text-sm text-rose-400 hover:text-rose-300"
              onClick={async () => {
                await deleteTask(task.id)
                onClose()
              }}
            >
              Eliminar
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving || !form.title.trim()}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

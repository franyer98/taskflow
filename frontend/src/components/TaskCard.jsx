import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const PRIORITY_STYLE = {
  alta: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  media: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  baja: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
}

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `task-${task.id}`, data: { task } })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`rounded-xl bg-ink-800 border border-ink-600 p-3 cursor-grab
        active:cursor-grabbing hover:border-peri-400/60 transition-colors
        ${isDragging ? 'opacity-40' : ''}`}
    >
      <p className="text-sm font-medium leading-snug">{task.title}</p>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full border ${PRIORITY_STYLE[task.priority]}`}
        >
          {task.priority}
        </span>
        {task.due_date && (
          <span className="text-[11px] text-slate-500">📅 {task.due_date}</span>
        )}
      </div>
    </div>
  )
}

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

export default function ColumnView({ column, onTaskClick, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { column }
  })

  return (
    <div className="w-72 shrink-0 flex flex-col max-h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="font-display font-semibold text-sm text-slate-300">
          {column.title}
        </h2>
        <span className="text-xs text-slate-500 bg-ink-800 rounded-full px-2 py-0.5">
          {column.tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 rounded-2xl p-2 min-h-[120px] overflow-y-auto
          border border-dashed transition-colors
          ${isOver ? 'border-peri-400 bg-peri-500/5' : 'border-ink-700 bg-ink-900/50'}`}
      >
        <SortableContext
          items={column.tasks.map((t) => `task-${t.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
        {column.tasks.length === 0 && (
          <p className="text-xs text-slate-600 text-center py-4">
            Arrastra tareas aquí
          </p>
        )}
      </div>

      <button
        onClick={onAddTask}
        className="mt-2 text-sm text-slate-400 hover:text-peri-300 transition-colors text-left px-2 py-1"
      >
        + Añadir tarea
      </button>
    </div>
  )
}

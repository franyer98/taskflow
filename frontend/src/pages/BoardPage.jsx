import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ColumnView from '../components/ColumnView'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { useBoardStore } from '../store/board'

export default function BoardPage() {
  const { id } = useParams()
  const { board, loading, fetchBoard, moveTask } = useBoardStore()
  const [modal, setModal] = useState(null) // { task } | { columnId }
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  useEffect(() => { fetchBoard(id) }, [id])

  const onDragStart = ({ active }) => setActiveTask(active.data.current?.task || null)

  const onDragEnd = ({ active, over }) => {
    setActiveTask(null)
    if (!over) return
    const task = active.data.current?.task
    if (!task) return

    // Soltar sobre una columna o sobre otra tarea
    let toColumnId, position
    if (String(over.id).startsWith('column-')) {
      toColumnId = over.data.current.column.id
      const tasks = board.columns.find((c) => c.id === toColumnId)?.tasks || []
      position = (tasks.at(-1)?.position ?? 0) + 1
    } else {
      const overTask = over.data.current.task
      toColumnId = overTask.column_id
      position = overTask.position - 0.5
    }
    if (toColumnId === task.column_id && over.id === `task-${task.id}`) return
    moveTask(task.id, toColumnId, position)
  }

  if (loading || !board) {
    return (
      <>
        <Navbar />
        <p className="text-slate-400 p-6">Cargando tablero…</p>
      </>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-hidden flex flex-col max-w-6xl w-full mx-auto px-4">
        <div className="flex items-center gap-3 py-4">
          <Link to="/" className="text-slate-500 hover:text-peri-300 text-sm">← Tableros</Link>
          <h1 className="font-display font-bold text-xl">{board.title}</h1>
        </div>

        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6 flex-1 items-start">
            {board.columns.map((col) => (
              <ColumnView
                key={col.id}
                column={col}
                onTaskClick={(task) => setModal({ task })}
                onAddTask={() => setModal({ columnId: col.id })}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} onClick={() => {}} />}
          </DragOverlay>
        </DndContext>
      </main>

      {modal && (
        <TaskModal
          task={modal.task}
          columnId={modal.columnId}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

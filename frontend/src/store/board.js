import { create } from 'zustand'
import api from '../api/client'

export const useBoardStore = create((set, get) => ({
  board: null,
  loading: false,

  fetchBoard: async (id) => {
    set({ loading: true })
    try {
      const { data } = await api.get(`/boards/${id}`)
      set({ board: data })
    } finally {
      set({ loading: false })
    }
  },

  createTask: async (payload) => {
    const { data } = await api.post('/tasks', payload)
    set((s) => ({
      board: {
        ...s.board,
        columns: s.board.columns.map((c) =>
          c.id === data.column_id ? { ...c, tasks: [...c.tasks, data] } : c
        )
      }
    }))
  },

  updateTask: async (taskId, payload) => {
    const { data } = await api.patch(`/tasks/${taskId}`, payload)
    get().fetchBoard(get().board.id)
    return data
  },

  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`)
    set((s) => ({
      board: {
        ...s.board,
        columns: s.board.columns.map((c) => ({
          ...c,
          tasks: c.tasks.filter((t) => t.id !== taskId)
        }))
      }
    }))
  },

  // Movimiento optimista: actualiza la UI al instante y persiste en el backend
  moveTask: async (taskId, toColumnId, position) => {
    set((s) => {
      let moved
      const columns = s.board.columns.map((c) => {
        const found = c.tasks.find((t) => t.id === taskId)
        if (found) moved = { ...found, column_id: toColumnId, position }
        return { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
      })
      return {
        board: {
          ...s.board,
          columns: columns.map((c) =>
            c.id === toColumnId
              ? {
                  ...c,
                  tasks: [...c.tasks, moved].sort((a, b) => a.position - b.position)
                }
              : c
          )
        }
      }
    })
    await api.patch(`/tasks/${taskId}`, { column_id: toColumnId, position })
  }
}))

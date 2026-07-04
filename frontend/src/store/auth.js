import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setTokens: (data) =>
        set({
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null })
    }),
    { name: 'taskflow-auth' }
  )
)

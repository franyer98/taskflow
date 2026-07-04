import axios from 'axios'
import { useAuthStore } from '../store/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Renueva el access token automáticamente cuando expira (401)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const { refreshToken, setTokens, logout } = useAuthStore.getState()
    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true
      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refresh_token: refreshToken }
        )
        setTokens(data)
        original.headers.Authorization = `Bearer ${data.access_token}`
        return api(original)
      } catch {
        logout()
      }
    }
    return Promise.reject(error)
  }
)

export default api

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '~/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (data) => {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          error: null,
        })
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login(credentials)
          get().setAuth(response.data)
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed'
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register(userData)
          get().setAuth(response.data)
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed'
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore

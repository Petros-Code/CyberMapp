import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface User {
  id: number
  username: string
  email: string
  avatar_url?: string | null
}

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  setAuth: (token: string, user: User) => Promise<void>
  updateAvatar: (avatar_url: string) => Promise<void>
  logout: () => Promise<void>
  loadSession: () => Promise<void>
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  setAuth: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ token, user })
  },

  updateAvatar: async (avatar_url) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, avatar_url } : null
      if (updatedUser) AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
      return { user: updatedUser }
    })
  },

  logout: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY)
    await AsyncStorage.removeItem(USER_KEY)
    set({ token: null, user: null })
  },

  loadSession: async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY)
      const storedUser = await AsyncStorage.getItem(USER_KEY)

      if (storedToken && storedUser) {
        set({ token: storedToken, user: JSON.parse(storedUser) })
      }
    } catch (error) {
      console.error('Failed to load session:', error)
    } finally {
      set({ isLoading: false })
    }
  },
}))

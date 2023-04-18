import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UserState {
  isLogged: boolean
  token: string
  refreshToken: string
  setToken: (token: string) => void
  setRefreshToken: (refreshToken: string) => void
  setLogged: (state: boolean) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        isLogged: false,
        token: '',
        refreshToken: '',
        setToken: (token) => set(() => ({ token: token })),
        setRefreshToken: (refreshToken) => set(() => ({ refreshToken: refreshToken })),
        setLogged: (state) => set(() => ({ isLogged: state })),
      }),
      {
        name: 'UserStore',
      }
    )
  )
)
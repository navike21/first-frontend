import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface NetworkState {
  isOnline: boolean
}

interface NetworkActions {
  setOnline: () => void
  setOffline: () => void
}

type NetworkStore = NetworkState & NetworkActions

export const useNetworkStore = create<NetworkStore>()(
  devtools(
    (set) => ({
      isOnline: navigator.onLine,
      setOnline: () => set({ isOnline: true }, false, 'network/setOnline'),
      setOffline: () => set({ isOnline: false }, false, 'network/setOffline'),
    }),
    { name: 'NetworkStore' },
  ),
)

import { describe, it, expect } from 'vitest'
import { createStore } from '../createStore'
import { PersistOptions } from 'zustand/middleware'

interface ITestState {
  count: number
  increment: () => void
}

describe('createStore', () => {
  it('creates a store without persistence', () => {
    const useTestStore = createStore<ITestState>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }))

    const state1 = useTestStore.getState()
    expect(state1.count).toBe(0)

    state1.increment()
    const state2 = useTestStore.getState()
    expect(state2.count).toBe(1)
  })

  it('creates a store with persistence', () => {
    const persistConfig: PersistOptions<ITestState> = {
      name: 'test-store',
    }

    const useTestStore = createStore<ITestState>(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      persistConfig
    )

    const state1 = useTestStore.getState()
    expect(state1.count).toBe(0)

    state1.increment()
    const state2 = useTestStore.getState()
    expect(state2.count).toBe(1)
  })
})

import { useSyncExternalStore } from 'react'

/**
 * SSR-safe mount flag.
 * Returns `false` on the first render (server snapshot),
 * then `true` after the component mounts on the client.
 *
 * Use this to guard portals or browser-only APIs when components
 * may be rendered in an SSR environment (Next.js, etc.).
 *
 * Uses `useSyncExternalStore` to avoid the react-hooks/set-state-in-effect
 * lint rule while remaining fully SSR-compatible.
 */

// subscribe is a no-op: the store never updates externally
const subscribe = () => () => {}

export const useMounted = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true, // client snapshot — always mounted on the browser
    () => false // server snapshot — never mounted during SSR
  )

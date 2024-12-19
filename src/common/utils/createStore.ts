import { create, StateCreator, StoreApi } from 'zustand'
import { persist, devtools, PersistOptions } from 'zustand/middleware'

/**
 * @description
 * Generic utility to create a store with persistence and devtools.
 *
 * @param {StateCreator<T, [], []>} config - The configuration for the store, defining the state and actions.
 * @param {PersistOptions<T>} persistConfig - The configuration for persistence (mandatory).
 *
 * @requires
 * The `persistConfig` must be provided if you wish to use the persistence middleware.
 * If persistence is not needed, you can skip passing it, but `devtools` will still be applied.
 *
 * @returns {StoreApi<T>} A store with the provided configuration, enhanced with persistence and devtools.
 *
 * @example
 * ```tsx
 * import { createStore } from "./common/utils";
 * import { EThemeBrowser } from "./enums";
 * import { getSystemTheme } from "./utils";
 *
 * export const useThemeStore = createStore<IThemeState>(
 *   (set, get) => ({
 *     theme: EThemeBrowser.SYSTEM,
 *     themeValue: getSystemTheme(),
 *     setTheme: ({ theme, themeValue }) => {
 *       set({
 *         theme,
 *         themeValue: theme === EThemeBrowser.SYSTEM ? getSystemTheme() : themeValue,
 *       });
 *     },
 *   }),
 *   {
 *     name: "theme-storage", // Store key for persistence
 *   }
 * );
 * ```
 *
 * @see https://github.com/pmndrs/zustand for more information on Zustand.
 * @see https://github.com/pmndrs/zustand/blob/master/middleware.md for details on devtools and persist middleware.
 */

export const createStore = <T>(
  config: StateCreator<T, [], []>,
  persistConfig?: PersistOptions<T>
): StoreApi<T> => {
  let enhancedConfig: StateCreator<T, [], []>

  if (persistConfig) {
    const withPersist = persist(config, persistConfig)
    enhancedConfig = devtools(withPersist) as StateCreator<T, [], []>
  } else {
    enhancedConfig = devtools(config) as StateCreator<T, [], []>
  }

  return create<T>(enhancedConfig)
}

export const getItemLocalStorage = (key: string): string | null =>
  localStorage.getItem(key)

export const setItemLocalStorage = (key: string, value: string): void =>
  localStorage.setItem(key, value)

export const removeItemLocalStorage = (key: string): void =>
  localStorage.removeItem(key)

export const clearLocalStorage = (): void => localStorage.clear()

export const getItemLocalStorageObject = (key: string) => {
  const item = getItemLocalStorage(key)
  try {
    return item ? JSON.parse(item) : {}
  } catch {
    return {}
  }
}

export const setItemLocalStorageObject = (
  key: string,
  value: Record<string, unknown>
): void => setItemLocalStorage(key, JSON.stringify(value))

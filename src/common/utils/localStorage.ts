export const getLocalStorage = (key: string): string | null =>
  localStorage.getItem(key)

export const setLocalStorage = (key: string, value: string): void =>
  localStorage.setItem(key, value)

export const removeLocalStorage = (key: string): void =>
  localStorage.removeItem(key)

export const clearLocalStorage = (): void => localStorage.clear()

export const getLocalStorageObject = (key: string) => {
  const item = getLocalStorage(key)
  return item ? JSON.parse(item) : {}
}

export const setLocalStorageObject = (
  key: string,
  value: Record<string, unknown>
): void => setLocalStorage(key, JSON.stringify(value))

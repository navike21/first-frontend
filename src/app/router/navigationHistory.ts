let _lastValidPath = '/'

export const getLastValidPath = (): string => _lastValidPath

export const setLastValidPath = (path: string): void => {
  _lastValidPath = path
}

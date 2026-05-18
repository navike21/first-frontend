type Handler = () => void
let _handler: Handler | null = null

export function registerUnauthorizedHandler(fn: Handler): void {
  _handler = fn
}

export function handleUnauthorized(): void {
  _handler?.()
}

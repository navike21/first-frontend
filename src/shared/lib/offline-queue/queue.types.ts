import type { HttpMethod, JsonBody } from '../../api'

export interface QueuedRequest {
  id: string
  api: string
  method: HttpMethod
  body?: JsonBody
  timestamp: number
}

import { EHttpMethod } from '@Enums/httpMethod'
import { TApiResponse } from '@Types/fetchApi'

class FetchError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const handleFetchResponse = async (
  response: Response
): Promise<TApiResponse> => {
  if (!response.ok) {
    const errorText = await response.text()
    const error = new FetchError(errorText, response.status)
    throw error
  }
  return {
    ...(await response.json()),
    status: response.status,
  }
}

export const fetchData = async <TBody>(
  path: string,
  method: EHttpMethod,
  language: string,
  body?: TBody
) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Language': language,
  }

  const config: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  }

  const response = await fetch(path, config)
  return handleFetchResponse(response)
}

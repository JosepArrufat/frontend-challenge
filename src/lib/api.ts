import { API_TIMEOUT_MS } from '../constants'

export class ApiError extends Error {
  status?: number
  code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface FetchJsonOptions {
  timeoutMs?: number
  signal?: AbortSignal
}

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const { timeoutMs = API_TIMEOUT_MS, signal: externalSignal } = options
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  const relayAbort = () => controller.abort()
  externalSignal?.addEventListener('abort', relayAbort)

  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) {
      throw new ApiError(`Request failed with status ${res.status}`, res.status, 'http')
    }
    return (await res.json()) as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      if (timedOut) {
        throw new ApiError(
          'The weather service took too long to respond. Try again.',
          undefined,
          'timeout',
        )
      }
      throw err
    }
    throw new ApiError(
      'Could not reach the weather service. Check your connection and try again.',
      undefined,
      'network',
    )
  } finally {
    clearTimeout(timer)
    externalSignal?.removeEventListener('abort', relayAbort)
  }
}

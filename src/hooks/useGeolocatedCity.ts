import { useEffect, useRef, useState } from 'react'
import { GEOLOCATION_TIMEOUT_MS } from '../constants'
import { reverseGeocodeCity } from '../lib/reverseGeocoding'
import type { City } from '../types'

export type GeolocatedCityStatus =
  'idle' | 'loading' | 'success' | 'denied' | 'unavailable' | 'error'

export function useGeolocatedCity(enabled: boolean) {
  const [city, setCity] = useState<City | null>(null)
  const [status, setStatus] = useState<GeolocatedCityStatus>('idle')
  const requestedRef = useRef(false)

  useEffect(() => {
    if (!enabled || requestedRef.current) return
    requestedRef.current = true

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unavailable')
      return
    }

    let cancelled = false
    const controller = new AbortController()
    setStatus('loading')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const nextCity = await reverseGeocodeCity(
            position.coords.latitude,
            position.coords.longitude,
            controller.signal,
          )

          if (cancelled) return
          setCity(nextCity)
          setStatus('success')
        } catch (error) {
          if (cancelled) return
          if (error instanceof DOMException && error.name === 'AbortError') return
          setStatus('error')
        }
      },
      (error) => {
        if (cancelled) return
        setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'error')
      },
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: 300000,
      },
    )

    return () => {
      cancelled = true
      controller.abort()
      requestedRef.current = false
    }
  }, [enabled])

  return { city, status }
}

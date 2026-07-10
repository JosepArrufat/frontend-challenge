import { useQuery } from '@tanstack/react-query'
import { getForecast, type ForecastParams } from '../lib/forecast'
import { FORECAST_STALE_TIME } from '../constants'

export function useForecast(params: ForecastParams | null) {
  return useQuery({
    queryKey: ['forecast', params?.latitude, params?.longitude],
    queryFn: ({ signal }) => getForecast(params!, signal),
    enabled: !!params,
    staleTime: FORECAST_STALE_TIME,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  })
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { buildQueryParams, HotelApiError, getHotels } from '../services/hotelService'

function createFallbackError(error) {
  if (error instanceof HotelApiError) {
    return error
  }

  if (error instanceof Error) {
    return new HotelApiError(error.message, {
      kind: 'unknown',
      cause: error,
    })
  }

  return new HotelApiError('An unexpected error occurred while loading hotels.', {
    kind: 'unknown',
    cause: error,
  })
}

export function useHotels(params = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshToken, setRefreshToken] = useState(0)
  const requestIdRef = useRef(0)
  const lastRequestKeyRef = useRef('')
  const paramsKey = buildQueryParams(params)

  const fetchHotels = useCallback(async (activeParams) => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)

    try {
      const hotels = await getHotels(activeParams)

      if (requestId !== requestIdRef.current) {
        return
      }

      setData(Array.isArray(hotels) ? hotels : [])
    } catch (caughtError) {
      if (requestId !== requestIdRef.current) {
        return
      }

      const normalizedError = createFallbackError(caughtError)
      setError(normalizedError)
      setData([])
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const requestKey = `${paramsKey}::${refreshToken}`

    if (lastRequestKeyRef.current === requestKey) {
      return
    }

    lastRequestKeyRef.current = requestKey
    fetchHotels(params)
  }, [fetchHotels, params, paramsKey, refreshToken])

  const refetch = useCallback(() => {
    setRefreshToken((currentToken) => currentToken + 1)
  }, [])

  return { loading, error, data, refetch }
}

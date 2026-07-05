import { useCallback, useEffect, useRef, useState } from 'react'
import { HotelApiError, getHotelById, getHotels } from '../services/hotelService'

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

  return new HotelApiError('An unexpected error occurred while loading the hotel details.', {
    kind: 'unknown',
    cause: error,
  })
}

export function useHotelDetails(id) {
  const [hotel, setHotel] = useState(null)
  const [relatedHotels, setRelatedHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedError, setRelatedError] = useState(null)
  const [refreshToken, setRefreshToken] = useState(0)
  const requestIdRef = useRef(0)
  const lastRequestKeyRef = useRef('')

  const fetchDetails = useCallback(async (hotelId) => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)
    setRelatedError(null)

    try {
      const hotelDetails = await getHotelById(hotelId)

      if (requestId !== requestIdRef.current) {
        return
      }

      if (!hotelDetails) {
        throw new HotelApiError('Hotel not found.', {
          kind: 'not-found',
          status: 404,
        })
      }

      setHotel(hotelDetails)

      let nextRelatedHotels = []
      if (hotelDetails.location) {
        try {
          const hotels = await getHotels({ location: hotelDetails.location })
          nextRelatedHotels = hotels.filter((entry) => String(entry.id) !== String(hotelDetails.id))
        } catch (relatedFetchError) {
          if (requestId === requestIdRef.current) {
            setRelatedError(createFallbackError(relatedFetchError))
          }
        }
      }

      if (requestId === requestIdRef.current) {
        setRelatedHotels(nextRelatedHotels)
      }
    } catch (caughtError) {
      if (requestId !== requestIdRef.current) {
        return
      }

      const normalizedError = createFallbackError(caughtError)
      setError(normalizedError)
      setHotel(null)
      setRelatedHotels([])
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError(
        new HotelApiError('A hotel id is required.', {
          kind: 'invalid-request',
        }),
      )
      setHotel(null)
      setRelatedHotels([])
      return undefined
    }

    const requestKey = `${id}::${refreshToken}`

    if (lastRequestKeyRef.current === requestKey) {
      return undefined
    }

    lastRequestKeyRef.current = requestKey
    fetchDetails(id)
    return undefined
  }, [fetchDetails, id, refreshToken])

  const refetch = useCallback(() => {
    setRefreshToken((currentToken) => currentToken + 1)
  }, [])

  return {
    hotel,
    relatedHotels,
    loading,
    error,
    relatedError,
    refetch,
  }
}

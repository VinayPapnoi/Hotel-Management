import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_HOTEL_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('VITE_HOTEL_API_BASE_URL is not defined.')
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

const requestCache = new Map()

class HotelApiError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'HotelApiError'
    this.kind = options.kind || 'unknown'
    this.status = options.status
    this.cause = options.cause
  }
}

function buildQueryParams(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') {
            searchParams.append(key, String(item))
          }
        })
        return
      }

      searchParams.set(key, String(value))
    })

  return searchParams.toString()
}

function buildUrl(path = '', params = {}) {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`
  const url = new URL(path, baseUrl)
  const queryString = buildQueryParams(params)

  if (queryString) {
    url.search = queryString
  }

  return url.toString()
}

function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to reach the hotel service. Please check your network connection.'
    }

    const status = error.response.status
    if (status === 404) {
      return 'No hotel was found for the requested resource.'
    }

    return `Hotel service responded with status ${status}.`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred while loading hotels.'
}

function normalizeHotel(rawHotel) {
  if (!rawHotel || typeof rawHotel !== 'object') {
    throw new HotelApiError('Invalid hotel data received from the API.', {
      kind: 'invalid-response',
    })
  }

  return {
    ...rawHotel,
    id: rawHotel.id ?? rawHotel.hotel_id ?? rawHotel.pk ?? null,
    name: rawHotel.name ?? rawHotel.hotel_name ?? rawHotel.title ?? 'Unnamed hotel',
    location: rawHotel.location ?? rawHotel.city ?? rawHotel.address ?? 'Location unavailable',
    rating: rawHotel.rating ?? rawHotel.review_score ?? null,
    price: rawHotel.price ?? rawHotel.amount ?? null,
    image:
      rawHotel.image ??
      rawHotel.image_url ??
      rawHotel.thumbnail ??
      rawHotel.photo ??
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  }
}

function normalizeHotelList(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizeHotel)
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) {
      return payload.data.map(normalizeHotel)
    }

    if (Array.isArray(payload.results)) {
      return payload.results.map(normalizeHotel)
    }

    if (Array.isArray(payload.hotels)) {
      return payload.hotels.map(normalizeHotel)
    }
  }

  if (payload === null || payload === undefined) {
    return []
  }

  throw new HotelApiError('Invalid hotel list response received from the API.', {
    kind: 'invalid-response',
  })
}

function normalizeSingleHotel(payload) {
  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      return null
    }

    return normalizeHotel(payload[0])
  }

  if (!payload) {
    return null
  }

  if (typeof payload === 'object') {
    if (Array.isArray(payload.data)) {
      if (payload.data.length === 0) {
        return null
      }

      return normalizeHotel(payload.data[0])
    }

    if (Array.isArray(payload.results)) {
      if (payload.results.length === 0) {
        return null
      }

      return normalizeHotel(payload.results[0])
    }

    return normalizeHotel(payload)
  }

  throw new HotelApiError('Invalid hotel detail response received from the API.', {
    kind: 'invalid-response',
  })
}

async function requestHotels(path = '', params = {}) {
  const url = buildUrl(path, params)
  const cacheKey = `GET:${url}`

  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)
  }

  const requestPromise = axiosInstance
    .get(url)
    .then((response) => {
      if (!response || typeof response !== 'object' || !('data' in response)) {
        throw new HotelApiError('The hotel service returned an invalid response.', {
          kind: 'invalid-response',
        })
      }

      return response.data
    })
    .finally(() => {
      requestCache.delete(cacheKey)
    })

  requestCache.set(cacheKey, requestPromise)
  return requestPromise
}

async function handleListRequest(path = '', params = {}) {
  try {
    const data = await requestHotels(path, params)
    return normalizeHotelList(data)
  } catch (error) {
    if (error instanceof HotelApiError) {
      throw error
    }

    throw new HotelApiError(getErrorMessage(error), {
      kind: axios.isAxiosError(error) && !error.response ? 'network' : 'unknown',
      status: error?.response?.status,
      cause: error,
    })
  }
}

async function handleDetailRequest(path = '', params = {}) {
  try {
    const data = await requestHotels(path, params)
    return normalizeSingleHotel(data)
  } catch (error) {
    if (error instanceof HotelApiError) {
      throw error
    }

    throw new HotelApiError(getErrorMessage(error), {
      kind: axios.isAxiosError(error) && !error.response ? 'network' : 'unknown',
      status: error?.response?.status,
      cause: error,
    })
  }
}

export async function getHotels(params = {}) {
  return handleListRequest('', params)
}

export async function getHotelById(id) {
  if (id === undefined || id === null || id === '') {
    throw new HotelApiError('A hotel id is required.', {
      kind: 'invalid-request',
    })
  }

  return handleDetailRequest(`${id}/`)
}

export async function searchHotels(search) {
  return handleListRequest('', { search })
}

export async function filterHotels(filters = {}) {
  return handleListRequest('', filters)
}

export async function sortHotels(orderBy) {
  return handleListRequest('', { order_by: orderBy })
}

export async function paginateHotels(limit, skip) {
  return handleListRequest('', { limit, skip })
}

export { HotelApiError, buildQueryParams, normalizeHotel }

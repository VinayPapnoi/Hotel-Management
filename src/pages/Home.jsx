import { useMemo, useState } from 'react'
import './Home.css'
import HotelCard from '../components/HotelCard'
import HotelFilters from '../components/HotelFilters'
import LoadingSpinner from '../components/LoadingSpinner'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useHotels } from '../hooks/useHotels'

const INITIAL_FILTERS = {
  location: '',
  price: '',
  minPrice: '',
  maxPrice: '',
  rating: '',
  minRating: '',
  maxRating: '',
  orderBy: '',
  limit: '',
  skip: '',
}

function buildQuery(filters, searchValue) {
  return {
    search: searchValue.trim() || undefined,
    location: filters.location || undefined,
    price: filters.price || undefined,
    min_price: filters.minPrice || undefined,
    max_price: filters.maxPrice || undefined,
    rating: filters.rating || undefined,
    min_rating: filters.minRating || undefined,
    max_rating: filters.maxRating || undefined,
    order_by: filters.orderBy || undefined,
    limit: filters.limit || undefined,
    skip: filters.skip || undefined,
  }
}

function Home() {
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const debouncedSearchValue = useDebouncedValue(searchValue, 500)

  const queryParams = useMemo(
    () => buildQuery(filters, debouncedSearchValue),
    [debouncedSearchValue, filters],
  )

  const { data: hotels, loading, error, refetch } = useHotels(queryParams)

  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }))
  }

  return (
    <div className="home">
      <div className="home__shell">
        <HotelFilters
          searchValue={searchValue}
          filters={filters}
          onSearchChange={setSearchValue}
          onFilterChange={handleFilterChange}
        />

        <div className="hotels-section">
          {loading ? (
            <div className="status-message status-message--loading">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="status-message status-message--error">
              <p>We could not load the hotel list.</p>
              <p>{error.message}</p>
              <button type="button" className="filter-btn" onClick={refetch}>
                Retry
              </button>
            </div>
          ) : hotels.length === 0 ? (
            <p className="status-message">No hotels matched your request.</p>
          ) : (
            <div className="hotels-grid">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id ?? `${hotel.name}-${hotel.location}`}
                  hotel={hotel}
                  to={`/hotel/${hotel.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home

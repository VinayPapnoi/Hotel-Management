import { useState } from 'react'
import './Home.css'
import HotelCard from '../components/HotelCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useHotels } from '../hooks/useHotels'

function Home() {
  const [searchValue, setSearchValue] = useState('')
  const { data: hotels, loading, error, refetch } = useHotels()

  const handleSubmit = (event) => {
    event.preventDefault()
    refetch({
      search: searchValue.trim() || undefined,
      skip: 0,
    })
  }

  return (
    <div className="home">
      <form className="search-section" onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search hotels by name or location..."
            className="search-input"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <button type="submit" className="filter-btn">Filter</button>
        </div>
      </form>
      <div className="hotels-section">
        {loading ? (
          <div className="status-message status-message--loading">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="status-message status-message--error">
            <p>We could not load the hotel list.</p>
            <p>{error.message}</p>
            <button type="button" className="filter-btn" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        ) : hotels.length === 0 ? (
          <p className="status-message">No hotels matched your request.</p>
        ) : (
          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id ?? `${hotel.name}-${hotel.location}`} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

import { useState } from 'react'
import './HotelFilters.css'

const LOCATION_OPTIONS = ['Ahmedabad', 'Bengaluru', 'Chennai', 'Delhi', 'Goa', 'Gurgaon', 'Hyderabad', 'Jaipur', 'Kolkata', 'Mumbai', 'Noida', 'Pune']

const SORT_OPTIONS = [
  { label: 'Highest Price', value: '-price' },
  { label: 'Lowest Price', value: 'price' },
  { label: 'Highest Rating', value: '-rating' },
  { label: 'Lowest Rating', value: 'rating' },
  { label: 'Alphabetical', value: 'name' },
]

function HotelFilters({ searchValue, filters, onSearchChange, onFilterChange }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="filters-panel" aria-label="Hotel search and filters">
      <div className="search-bar">
        <div className="search-bar__field">
          <span className="search-bar__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M10.5 4a6.5 6.5 0 1 1 4.11 11.55l4.42 4.42-1.41 1.41-4.42-4.42A6.5 6.5 0 0 1 10.5 4Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
            </svg>
          </span>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search hotels by name or location"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <button
          type="button"
          className="filters-toggle"
          aria-expanded={isExpanded}
          aria-controls="advanced-filters"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
        >
          <span className="filters-toggle__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M4 6h16v2H4V6Zm3 5h10v2H7v-2Zm3 5h4v2h-4v-2Z" />
            </svg>
          </span>
          <span>Filters</span>
        </button>
      </div>

      <div id="advanced-filters" className={`filters-panel__collapse ${isExpanded ? 'is-open' : ''}`}>
        <div className="filters-panel__content">
          <div className="filters-panel__grid">
            <label className="field">
              <span>Location</span>
              <select
                className="field__control"
                value={filters.location}
                onChange={(event) => onFilterChange('location', event.target.value)}
              >
                <option value="">All locations</option>
                {LOCATION_OPTIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Price</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                className="field__control"
                placeholder="Exact price"
                value={filters.price}
                onChange={(event) => onFilterChange('price', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Price min</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                className="field__control"
                placeholder="Minimum price"
                value={filters.minPrice}
                onChange={(event) => onFilterChange('minPrice', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Price max</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                className="field__control"
                placeholder="Maximum price"
                value={filters.maxPrice}
                onChange={(event) => onFilterChange('maxPrice', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Rating</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                inputMode="decimal"
                className="field__control"
                placeholder="Exact rating"
                value={filters.rating}
                onChange={(event) => onFilterChange('rating', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Rating min</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                inputMode="decimal"
                className="field__control"
                placeholder="Minimum rating"
                value={filters.minRating}
                onChange={(event) => onFilterChange('minRating', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Rating max</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                inputMode="decimal"
                className="field__control"
                placeholder="Maximum rating"
                value={filters.maxRating}
                onChange={(event) => onFilterChange('maxRating', event.target.value)}
              />
            </label>

            <label className="field">
              <span>Sorting</span>
              <select
                className="field__control"
                value={filters.orderBy}
                onChange={(event) => onFilterChange('orderBy', event.target.value)}
              >
                <option value="">Default</option>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HotelFilters

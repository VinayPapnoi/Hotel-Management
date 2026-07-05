import { Link, useParams } from 'react-router-dom'
import HotelCard from '../components/HotelCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useHotelDetails } from '../hooks/useHotelDetails'
import './HotelDetails.css'

function formatAmenities(hotel) {
  const rawAmenities =
    hotel?.amenities ??
    hotel?.facilities ??
    hotel?.features ??
    hotel?.services ??
    hotel?.amenity ??
    []

  if (Array.isArray(rawAmenities)) {
    return rawAmenities.filter(Boolean)
  }

  if (typeof rawAmenities === 'string') {
    return rawAmenities
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (rawAmenities && typeof rawAmenities === 'object') {
    return Object.values(rawAmenities).filter(Boolean).map(String)
  }

  return []
}

function HotelDetails() {
  const { id } = useParams()
  const { hotel, relatedHotels, loading, error, relatedError, refetch } = useHotelDetails(id)
  const amenities = formatAmenities(hotel)

  if (loading) {
    return (
      <main className="hotel-details">
        <div className="hotel-details__shell">
          <div className="hotel-details__loading">
            <LoadingSpinner label="Loading hotel details" />
          </div>
        </div>
      </main>
    )
  }

  if (error?.status === 404 || error?.kind === 'not-found') {
    return (
      <main className="hotel-details">
        <div className="hotel-details__shell">
          <section className="hotel-details__state hotel-details__state--not-found">
            <h1>Hotel not found</h1>
            <p>That hotel may have been removed or the link may be incorrect.</p>
            <Link className="filter-btn" to="/">
              Back to hotels
            </Link>
          </section>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="hotel-details">
        <div className="hotel-details__shell">
          <section className="hotel-details__state hotel-details__state--error">
            <h1>We could not load the hotel</h1>
            <p>{error.message}</p>
            <div className="hotel-details__state-actions">
              <button type="button" className="filter-btn" onClick={refetch}>
                Retry
              </button>
              <Link className="hotel-details__back-link" to="/">
                Back
              </Link>
            </div>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="hotel-details">
      <div className="hotel-details__shell">
        <div className="hotel-details__topbar">
          <Link className="hotel-details__back-link" to="/">
            Back
          </Link>
        </div>

        <section className="hotel-details__hero">
          <div className="hotel-details__image-wrap">
            <img className="hotel-details__image" src={hotel.image} alt={hotel.name} />
          </div>

          <div className="hotel-details__content">
            <p className="hotel-details__eyebrow">Hotel Details</p>
            <h1 className="hotel-details__title">{hotel.name}</h1>
            <p className="hotel-details__location">{hotel.location}</p>

            <div className="hotel-details__stats">
              <div>
                <span>Price</span>
                <strong>Rs. {hotel.price ?? 'N/A'}</strong>
              </div>
              <div>
                <span>Rating</span>
                <strong>{hotel.rating ?? 'N/A'}</strong>
              </div>
            </div>

            <div className="hotel-details__description">
              <h2>Description</h2>
              <p>{hotel.description || 'No description is available for this hotel.'}</p>
            </div>

            <div className="hotel-details__amenities">
              <h2>Amenities</h2>
              {amenities.length > 0 ? (
                <ul className="hotel-details__amenity-list">
                  {amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
              ) : (
                <p>No amenities were provided by the API.</p>
              )}
            </div>
          </div>
        </section>

        <section className="hotel-details__related">
          <div className="hotel-details__section-head">
            <h2>Related hotels</h2>
            {relatedError ? <p className="hotel-details__muted">Related hotels could not be loaded.</p> : null}
          </div>

          {relatedHotels.length > 0 ? (
            <div className="hotel-details__related-grid">
              {relatedHotels.map((relatedHotel) => (
                <HotelCard
                  key={relatedHotel.id ?? `${relatedHotel.name}-${relatedHotel.location}`}
                  hotel={relatedHotel}
                  to={`/hotel/${relatedHotel.id}`}
                />
              ))}
            </div>
          ) : (
            <p className="hotel-details__muted">No related hotels found.</p>
          )}
        </section>
      </div>
    </main>
  )
}

export default HotelDetails

import { Link } from 'react-router-dom'
import './HotelCard.css'

function HotelCard({ hotel, to }) {
  const price = hotel.price ?? 'N/A'
  const rating = hotel.rating ?? 'N/A'

  return (
    <div className="hotel-card">
      <div className="hotel-image">
        <img src={hotel.image} alt={hotel.name} />
      </div>
      <div className="hotel-info">
        <h3 className="hotel-name">{hotel.name}</h3>
        <p className="hotel-location">{hotel.location}</p>
        <div className="hotel-rating">
          <span className="rating-star">*</span>
          <span>{rating}</span>
        </div>
        <div className="hotel-price">
          <span className="price-label">Price:</span>
          <span className="price-amount">Rs. {price}</span>
        </div>
        {to ? (
          <Link className="view-details-btn" to={to}>
            View Details
          </Link>
        ) : (
          <span className="view-details-btn">View Details</span>
        )}
      </div>
    </div>
  )
}

export default HotelCard

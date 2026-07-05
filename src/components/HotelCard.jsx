import './HotelCard.css'

function HotelCard({ hotel }) {
  return (
    <div className="hotel-card">
      <div className="hotel-image">
        <img src={hotel.image} alt={hotel.name} />
      </div>
      <div className="hotel-info">
        <h3 className="hotel-name">{hotel.name}</h3>
        <p className="hotel-location">{hotel.location}</p>
        <div className="hotel-rating">
          <span className="rating-star">★</span>
          <span>{hotel.rating}</span>
        </div>
        <div className="hotel-price">
          <span className="price-label">Price:</span>
          <span className="price-amount">₹{hotel.price}</span>
        </div>
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  )
}

export default HotelCard

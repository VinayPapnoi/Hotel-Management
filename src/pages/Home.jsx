import './Home.css'
import HotelCard from '../components/HotelCard'

const dummyHotels = [
  {
    id: 1,
    name: 'Grand Palace Hotel',
    location: 'Mumbai, Maharashtra',
    rating: 4.8,
    price: 5000,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20hotel%20exterior%20modern%20architecture&image_size=landscape_16_9'
  },
  {
    id: 2,
    name: 'Beach Resort & Spa',
    location: 'Goa',
    rating: 4.5,
    price: 3500,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beach%20resort%20tropical%20vibes&image_size=landscape_16_9'
  },
  {
    id: 3,
    name: 'City Center Inn',
    location: 'Delhi',
    rating: 4.2,
    price: 2500,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20city%20hotel%20downtown&image_size=landscape_16_9'
  },
  {
    id: 4,
    name: 'Mountain View Lodge',
    location: 'Shimla',
    rating: 4.6,
    price: 4000,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20lodge%20scenic%20view&image_size=landscape_16_9'
  },
  {
    id: 5,
    name: 'Heritage Haveli',
    location: 'Jaipur',
    rating: 4.7,
    price: 4500,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=heritage%20hotel%20rajasthan%20architecture&image_size=landscape_16_9'
  },
  {
    id: 6,
    name: 'Business Suites',
    location: 'Bangalore',
    rating: 4.3,
    price: 3000,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=business%20hotel%20modern%20interior&image_size=landscape_16_9'
  }
]

function Home() {
  return (
    <div className="home">
      <div className="search-section">
        <div className="search-container">
          <input type="text" placeholder="Search hotels by name or location..." className="search-input" />
          <button className="filter-btn">Filter</button>
        </div>
      </div>
      <div className="hotels-section">
        <div className="hotels-grid">
          {dummyHotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

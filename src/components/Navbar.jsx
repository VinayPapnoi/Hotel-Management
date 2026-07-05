import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Hotel Search</h1>
        </div>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`}>
            Home
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

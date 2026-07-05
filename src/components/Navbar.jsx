import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Hotel Search</h1>
        </div>
        <div className="navbar-links">
          <a href="/" className="navbar-link">Home</a>
          <a href="/" className="navbar-link">About</a>
          <a href="/" className="navbar-link">Contact</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

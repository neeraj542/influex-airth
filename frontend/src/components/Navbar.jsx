import { Link } from 'react-router-dom'
import { UserCircle } from 'lucide-react'
import '../styles/Navbar.css'

export default function Navbar({ isAuthenticated }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Influex
      </div>
      <div className="navbar-menu">
        <Link to="/#services" className="nav-link">Services</Link>
        <Link to="/#about" className="nav-link">About</Link>
        {isAuthenticated ? (
          <Link to="/dashboard" className="profile-link">
            <UserCircle className="profile-icon" />
          </Link>
        ) : (
          <button className="login-btn">Login</button>
        )}
      </div>
    </nav>
  )
}


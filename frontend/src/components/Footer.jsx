import { Instagram, Twitter, Linkedin } from 'lucide-react'
import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Influix</h3>
          <p>Empowering creators to reach new heights</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="#" className="social-link">
              <Instagram />
            </a>
            <a href="#" className="social-link">
              <Twitter />
            </a>
            <a href="#" className="social-link">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Influix. All rights reserved.</p>
      </div>
    </footer>
  )
}


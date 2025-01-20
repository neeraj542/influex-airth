import { Instagram } from 'lucide-react'
import '../styles/LandingPage.css'

export default function LandingPage({ onLogin }) {
  return (
    <section className="landing">
      <div className="hero">
      <h1 className=""></h1>

        <button className="instagram-login" onClick={onLogin}>
          <Instagram className="instagram-icon" />
            Continue with Instagram
        </button>
      </div>
    </section>
  )
}


import { TrendingUp, Users, BarChart } from 'lucide-react'
import '../styles/Services.css'

export default function Services() {
  return (
    <section id="services" className="services">
      <h2 className="section-title">Our Services</h2>
      <div className="services-grid">
        <div className="service-card">
          <TrendingUp className="service-icon" />
          <h3>Growth Analytics</h3>
          <p>Advanced metrics and insights to boost your engagement</p>
          <button className="learn-more">Learn More</button>
        </div>
        <div className="service-card">
          <Users className="service-icon" />
          <h3>Audience Insights</h3>
          <p>Understand your followers better with AI-powered analytics</p>
          <button className="learn-more">Learn More</button>
        </div>
        <div className="service-card">
          <BarChart className="service-icon" />
          <h3>Performance Tracking</h3>
          <p>Track your growth and optimize your content strategy</p>
          <button className="learn-more">Learn More</button>
        </div>
      </div>
    </section>
  )
}


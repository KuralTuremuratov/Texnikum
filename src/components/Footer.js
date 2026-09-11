import { Link } from "react-router-dom"
import { MapPin, Phone, Navigation } from "lucide-react"

const Footer = () => (
  <footer className="footer">
    <div className="container footer-content">
      {/* Левая секция */}
      <div className="footer-info">
        <div className="footer-brand">
          <img src="/logo.png" alt="Texnikum logotipi" />
          <div>
            <p className="footer-brand-name">Xo'jayli texnikumi</p>
            <p className="footer-brand-subtitle">Xizmat ko'rsatish va servis</p>
          </div>
        </div>

        <div className="footer-message">
          <h3>Yangi imkoniyatlar sizni kutmoqda.</h3>
        </div>

        <div className="footer-links">
          <Link to="/schedule">Dars jadvali</Link>
          <Link to="/teacher-schedule">Navbatchilik</Link>
          <Link to="/gallery">Foto galereya</Link>
        </div>

        <div className="footer-contact">
          <a href="tel:+998551062067" className="contact-item">
            <Phone size={18} />
            <span>+998 55 106 20 67</span>
          </a>
          <div className="contact-item">
            <MapPin size={18} />
            <span>Xo'jayli tumani, Bag'man MFY, Buyuk kelajak ko'chasi</span>
          </div>
        </div>
      </div>

      {/* Правая секция - Google Maps */}
      <div className="footer-map">
        <div className="map-header">
          <Navigation size={20} />
          <h3>Bizning manzil</h3>
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2911.7634891234567!2d59.50248!3d42.434587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDLCsDI2JzA0LjUiTiA1OcKwMzAnMTcuOSJF!5e0!3m2!1suz!2s!4v1234567890!5m2!1suz!2s"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "12px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Xo'jayli texnikumi manzili"
          ></iframe>
        </div>
      </div>
    </div>

    <div className="container footer-bottom">
      <p>© {new Date().getFullYear()} Xo'jayli Texnikumi. Barcha huquqlar himoyalangan.</p>
      <Link to="/login" className="admin-link">Admin kirish</Link>
    </div>
  </footer>
)

export default Footer

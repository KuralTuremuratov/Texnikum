import { Link } from "react-router-dom"

const Footer = () => (
  <footer className="footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <img src="/logo.png" alt="Texnikum logotipi" />
        <p>Xo'jayli xizmat ko'rsatish va servis texnikumi</p>
      </div>
      <div className="footer-links">
        <Link to="/schedule">Dars jadvali</Link>
        <Link to="/teacher-schedule">Navbatchilik</Link>
        <Link to="/gallery">Foto galereya</Link>
      </div>
      <div className="footer-contact">
        <a href="tel:+998551062067">+998 55 106 20 67</a>
        <span>Xo'jayli tumani, Buyuk kelajak ko'chasi</span>
      </div>
    </div>
    <div className="container footer-bottom">© {new Date().getFullYear()} Xo'jayli Texnikumi. Barcha huquqlar himoyalangan.</div>
  </footer>
)

export default Footer

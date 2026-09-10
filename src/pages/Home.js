import { ArrowRight, BookOpen, CalendarDays, FileText, ImageIcon, MapPin, Sparkles, Target } from "lucide-react"
import { Link } from "react-router-dom"

const routeCards = [
  {
    icon: FileText,
    title: "Yo'nalishlar",
    items: [
      "50320203 – Kutubxonashunoslik va bibliografiya",
      "50610201 – Dasturiy injiniring",
      "40110104 – Maktabgacha ta'lim muassasasi tarbiyachisi",
      "40110104 – Maktabgacha ta'lim muassasasi yordamchi tarbiyachisi",
      "40110201 – Maktabgacha ta'lim muassasasi musiqa rahbari",
    ],
  },
  {
    icon: Target,
    title: "Dual-ta'lim yo'nalishlari",
    items: [
      "40110104 – Maktabgacha ta'lim muassasasi tarbiyachisi",
      "40110201 – Maktabgacha ta'lim muassasasi musiqa rahbari",
    ],
  },
]

const Home = () => {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={16} /> Kasb sari dadil qadam</span>
            <h1>Kelajagingiz uchun <em>mustahkam</em> ta'lim.</h1>
            <p>Xo'jayli xizmat ko'rsatish va servis texnikumi — bilim, amaliyot va yangi imkoniyatlar makoni.</p>
            <div className="hero-actions">
              <Link to="/schedule" className="button button-primary">Dars jadvali <ArrowRight size={18} /></Link>
              <Link to="/gallery" className="button button-secondary">Texnikum hayoti</Link>
            </div>
            <div className="hero-note"><span>01</span> Zamonaviy kasblar, real natijalar</div>
          </div>
          <div className="hero-visual">
            <div className="hero-sun" />
            <img src="/1.jpg" alt="Xo'jayli xizmat ko'rsatish va servis texnikumi binosi" />
            <div className="hero-card hero-card-top"><span>Amaliy</span><strong>ta'lim</strong></div>
            <div className="hero-card hero-card-bottom"><span>Bugun</span><strong>kelajakni quring</strong></div>
          </div>
        </div>
      </section>

      <section className="quick-links-section">
        <div className="container quick-links">
          <Link to="/schedule" className="quick-link"><span className="quick-icon blue"><CalendarDays /></span><span><small>O'quv jarayoni</small><strong>Dars jadvali</strong></span><ArrowRight size={19} /></Link>
          <Link to="/teacher-schedule" className="quick-link"><span className="quick-icon orange"><BookOpen /></span><span><small>Ma'lumotlar</small><strong>Navbatchilik</strong></span><ArrowRight size={19} /></Link>
          <Link to="/gallery" className="quick-link"><span className="quick-icon blue"><ImageIcon /></span><span><small>Texnikum hayoti</small><strong>Foto galereya</strong></span><ArrowRight size={19} /></Link>
        </div>
      </section>

      <section className="route-cards-section">
        <div className="container route-cards-grid">
          {routeCards.map(({ icon: Icon, title, items }) => (
            <article className="route-card" key={title}>
              <div className="route-card-icon">
                <Icon size={42} strokeWidth={2.2} />
              </div>
              <h3>{title}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="visit-section">
        <div className="container visit-layout">
          <div>
            <span className="eyebrow"><MapPin size={16} /> Bizning manzil</span>
            <h2>Yangi imkoniyatlar<br />sizni kutmoqda.</h2>
            <p>Xo'jayli tumani, Bag'man MFY, Buyuk kelajak ko'chasi.</p>
            <a className="text-link" href="tel:+998551062067">+998 55 106 20 67 <ArrowRight size={17} /></a>
          </div>
          <img src="/2.jpg" alt="Texnikum o'quv muhiti" />
        </div>
      </section>
    </main>
  )
}

export default Home

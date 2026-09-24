import { ArrowRight, BookOpen, CalendarDays, GraduationCap, Users, Briefcase, ImageIcon, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

const routeCards = [
  {
    icon: GraduationCap,
    title: "11-sinf bitiruvchilari uchun qabul yo'nalishlari",
    subtitle: "Oliy o'quv yurtiga suhbat asosida 2-kursdan boshlab qabul qilinish imkoniyati bilan",
    items: [
      "50610203 – Dasturiy injiniring",
    ],
  },
  {
    icon: Users,
    title: "9-sinf bitiruvchilari uchun qabul yo'nalishlari",
    items: [
      "30610105 – Grafika va dizayn texnologiyasi",
      "30730311 – Qurilish materiallarini ishlab chiqarish operatori",
      "30710311 – Qayta tiklanuvchi energiya manbalariga xizmat ko'rsatish",
      "30730207 – Turar-joy infratuzilmasi",
      "30730310 – Bino va qurilish pardozlash ustasi",
      "30711605 – Avtomobil servisi",
    ],
  },
  {
    icon: Briefcase,
    title: "Dual ta'lim turiga qabul",
    subtitle: "Haftada 2 kun o'qib, 4 kun ish joyida ishlashni davom ettirish imkoniyati bilan",
    items: [
      "50320203 – Kutubxonashunoslik va bibliografiya",
      "40711616 – Avtomobil servis texnigi",
      "50730202 – Qurilish materiallarini ishlab chiqarish texnigi (turlari bo'yicha)",
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
            <span className="eyebrow"><Sparkles size={16} /> Kasbga qadam qo'ying</span>
            <h1>Kelajagingiz uchun <em>mustahkam</em> bilim va ko'nikma.</h1>

            <div className="hero-actions">
              <Link to="/schedule" className="button button-primary">Dars jadvali <ArrowRight size={18} /></Link>
              <Link to="/gallery" className="button button-secondary">Texnikum hayoti</Link>
            </div>
            <div className="hero-note"><span>01</span> Amaliy bilim, haqiqiy natijalar</div>
          </div>
          <div className="hero-visual">
            <div className="hero-sun" />
            <img src="/homepage_main.jpg" alt="Xo'jayli tumani 3-sonli texnikumi binosi" />
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
          {routeCards.map(({ icon: Icon, title, subtitle, items }) => (
            <article className="route-card" key={title}>
              <div className="route-card-icon">
                <Icon size={42} strokeWidth={2.2} />
              </div>
              <h3>{title}</h3>
              {subtitle && <p className="route-card-subtitle">{subtitle}</p>}
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

    </main>
  )
}

export default Home

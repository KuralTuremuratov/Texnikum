import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

const navigation = [
  { path: "/", label: "Bosh sahifa" },
  { path: "/teacher-schedule", label: "Navbatchilik" },
  { path: "/schedule", label: "Dars jadvali" },
  { path: "/gallery", label: "Foto galereya" },
]

const Header = () => {
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="Bosh sahifa">
          <span className="brand-mark"><img src="/logo.png" alt="" /></span>
          <span className="brand-text"><strong>Xo'jayli</strong><small>Xizmat ko'rsatish va servis texnikumi</small></span>
        </Link>

        <nav className={`site-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Asosiy menyu">
          {navigation.map(({ path, label }) => (
            <Link key={path} to={path} onClick={closeMenu} className={location.pathname === path ? "active" : ""}>{label}</Link>
          ))}
          <Link to="/login" onClick={closeMenu} className="nav-admin">Admin kirish</Link>
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Rang mavzusini o'zgartirish">{isDark ? <Sun size={19} /> : <Moon size={19} />}</button>
          <button className="menu-toggle" onClick={() => setIsMenuOpen((open) => !open)} aria-label="Menyuni ochish" aria-expanded={isMenuOpen}>{isMenuOpen ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
    </header>
  )
}

export default Header

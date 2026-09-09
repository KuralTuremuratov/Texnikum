"use client"
import { Link, useLocation } from "react-router-dom"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"

const Header = () => {
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className="top-header">
        <div className="container header-container">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Texnikum logotipi" />
          </Link>
          <div className="scrolling-text">
            <span>Xo'jayli xizmat ko'rsatish va servis texnikumi</span>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      <nav className="header-menu">
        <div className="container">
          <ul className="main-menu">
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Bosh sahifa
              </Link>
            </li>
            <li>
              <Link to="/teacher-schedule" className={isActive("/teacher-schedule") ? "active" : ""}>
                Navbatchilik
              </Link>
            </li>
            <li>
              <Link to="/schedule" className={isActive("/schedule") ? "active" : ""}>
                Dars jadvali
              </Link>
            </li>
            <li>
              <Link to="/gallery" className={isActive("/gallery") ? "active" : ""}>
                Foto
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Header

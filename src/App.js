"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { ThemeProvider } from "./contexts/ThemeContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Schedule from "./pages/Schedule"
import TeacherSchedule from "./pages/TeacherSchedule"
import Gallery from "./pages/Gallery"
import Xodimlar from "./pages/Xodimlar"
import Login from "./pages/Login"
import Admin from "./pages/Admin"
import Loader from "./components/Loader"
import "./App.css"
import { supabase } from "./lib/supabase"

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error("Ошибка проверки аутентификации:", error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Слушаем изменения аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <Loader />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Компонент для отображения Loader при смене маршрута
const RouteChangeLoader = () => {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [location.pathname])

  if (!loading) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Loader />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Header />
          <RouteChangeLoader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/teacher-schedule" element={<TeacherSchedule />} />
            <Route path="/xodimlar" element={<Xodimlar />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

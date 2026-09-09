"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Foydalanuvchi allaqachon autentifikatsiya qilinganligini tekshirish
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        navigate("/admin", { replace: true })
      }
    }

    checkExistingSession()
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      navigate("/admin")
    } catch (error) {
      setError("Kirish xatoligi: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container content-section">
      <div className="login-container">
        <h2>Kirish (faqat admin)</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Kirish..." : "Kirish"}
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </main>
  )
}

export default Login

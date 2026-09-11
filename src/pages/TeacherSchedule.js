"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Search, Users } from "lucide-react"

const TeacherSchedule = () => {
  const [teacherSchedule, setTeacherSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadTeacherSchedule()
  }, [])

  const loadTeacherSchedule = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("teacher_schedules").select("*").order("id")

      if (error) throw error
      setTeacherSchedule(data || [])
    } catch (error) {
      console.error("Error loading teacher schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  // Фильтрация по поиску
  const filteredSchedule = teacherSchedule.filter(row => 
    row.teacher?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <main className="container content-section">
        <div className="loading">Yuklanmoqda...</div>
      </main>
    )
  }

  return (
    <main className="container content-section">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link to="/">Bosh sahifa</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Navbatchilik jadvali</span>
      </nav>

      <h2><Users size={28} />Navbatchilik jadvali</h2>
      <p className="section-description">
        O'qituvchilar konsultatsiya jadvali — har kuni kim navbatchi ekanligini ko'ring
      </p>

      {/* Поиск */}
      <div className="schedule-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="O'qituvchi nomi bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {searchQuery && (
        <div className="search-results-info">
          <p>Topildi: <strong>{filteredSchedule.length}</strong> o'qituvchi</p>
        </div>
      )}

      <div className="schedule-wrapper">
        <table className="teacher-schedule enhanced">
          <thead>
            <tr>
              <th>O'qituvchi</th>
              <th>Dushanba</th>
              <th>Seshanba</th>
              <th>Chorshanba</th>
              <th>Payshanba</th>
              <th>Juma</th>
              <th>Shanba</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{row.teacher}</td>
                <td data-label="Dushanba">{row.dushanba}</td>
                <td data-label="Seshanba">{row.seshanba}</td>
                <td data-label="Chorshanba">{row.chorshanba}</td>
                <td data-label="Payshanba">{row.payshanba}</td>
                <td data-label="Juma">{row.juma}</td>
                <td data-label="Shanba">{row.shanba}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSchedule.length === 0 && (
        <div className="no-results">
          <p>Hech qanday o'qituvchi topilmadi.</p>
        </div>
      )}
    </main>
  )
}

export default TeacherSchedule

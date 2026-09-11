"use client"

import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Search, Filter, Calendar, Book } from "lucide-react"

const Schedule = () => {
  const [course1Schedule, setCourse1Schedule] = useState([])
  const [course2Schedule, setCourse2Schedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      setLoading(true)

      // Загрузка расписания 1 курса
      const { data: course1Data, error: course1Error } = await supabase
        .from("course_schedules")
        .select("*")
        .eq("course_number", 1)
        .order("id")

      if (course1Error) throw course1Error

      // Загрузка расписания 2 курса
      const { data: course2Data, error: course2Error } = await supabase
        .from("course_schedules")
        .select("*")
        .eq("course_number", 2)
        .order("id")

      if (course2Error) throw course2Error

      setCourse1Schedule(course1Data || [])
      setCourse2Schedule(course2Data || [])
    } catch (error) {
      console.error("Error loading schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  // Объединённый список для поиска
  const allSchedules = useMemo(() => {
    return [
      ...course1Schedule.map(s => ({ ...s, course: 1 })),
      ...course2Schedule.map(s => ({ ...s, course: 2 }))
    ]
  }, [course1Schedule, course2Schedule])

  // Фильтрация
  const filteredSchedules = useMemo(() => {
    let result = allSchedules

    // Фильтр по курсу
    if (selectedCourse !== "all") {
      result = result.filter(s => s.course === parseInt(selectedCourse))
    }

    // Поиск по группе или предмету
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(s => 
        s.day?.toLowerCase().includes(query) ||
        s.para1?.toLowerCase().includes(query) ||
        s.para2?.toLowerCase().includes(query) ||
        s.para3?.toLowerCase().includes(query) ||
        s.para4?.toLowerCase().includes(query) ||
        s.para5?.toLowerCase().includes(query)
      )
    }

    return result
  }, [allSchedules, searchQuery, selectedCourse])

  // Разделяем отфильтрованные результаты по курсам
  const filtered1Course = filteredSchedules.filter(s => s.course === 1)
  const filtered2Course = filteredSchedules.filter(s => s.course === 2)

  // Цвета для дней недели
  const dayColors = {
    "Dushanba": "#3b82f6",
    "Seshanba": "#8b5cf6", 
    "Chorshanba": "#ec4899",
    "Payshanba": "#f59e0b",
    "Juma": "#10b981"
  }

  if (loading) {
    return (
      <main className="container content-section">
        <div className="loading">Yuklanmoqda...</div>
      </main>
    )
  }

  const renderScheduleTable = (schedules, courseNum) => {
    if (schedules.length === 0) {
      return (
        <div className="no-results">
          <p>Hech qanday natija topilmadi.</p>
        </div>
      )
    }

    return (
      <div className="schedule-wrapper">
        <table className="course-schedule enhanced">
          <thead>
            <tr>
              <th>Guruh</th>
              <th><span className="day-badge" style={{background: dayColors["Dushanba"]}}>Dushanba</span></th>
              <th><span className="day-badge" style={{background: dayColors["Seshanba"]}}>Seshanba</span></th>
              <th><span className="day-badge" style={{background: dayColors["Chorshanba"]}}>Chorshanba</span></th>
              <th><span className="day-badge" style={{background: dayColors["Payshanba"]}}>Payshanba</span></th>
              <th><span className="day-badge" style={{background: dayColors["Juma"]}}>Juma</span></th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td data-label="Guruh">
                  <div className="group-cell">
                    <Book size={16} />
                    <strong>{row.day}</strong>
                  </div>
                </td>
                <td data-label="Dushanba">{row.para1}</td>
                <td data-label="Seshanba">{row.para2}</td>
                <td data-label="Chorshanba">{row.para3}</td>
                <td data-label="Payshanba">{row.para4}</td>
                <td data-label="Juma">{row.para5 || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <main className="container content-section">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link to="/">Bosh sahifa</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Dars jadvali</span>
      </nav>

      <h2><Calendar size={28} />Dars jadvali</h2>

      {/* Поиск и фильтры */}
      <div className="schedule-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Guruh yoki fan nomi bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-filter"
          >
            <option value="all">Barcha kurslar</option>
            <option value="1">1-kurs</option>
            <option value="2">2-kurs</option>
          </select>
        </div>
      </div>

      {/* Результаты поиска */}
      {searchQuery && (
        <div className="search-results-info">
          <p>Topildi: <strong>{filteredSchedules.length}</strong> natija</p>
        </div>
      )}

      {/* 1-курс */}
      {(selectedCourse === "all" || selectedCourse === "1") && (
        <div className="schedule-section">
          <h3 className="course-title">
            <span className="course-badge">1-kurs</span>
            <span className="course-count">({filtered1Course.length} guruh)</span>
          </h3>
          {renderScheduleTable(filtered1Course, 1)}
        </div>
      )}

      {/* 2-курс */}
      {(selectedCourse === "all" || selectedCourse === "2") && (
        <div className="schedule-section">
          <h3 className="course-title">
            <span className="course-badge">2-kurs</span>
            <span className="course-count">({filtered2Course.length} guruh)</span>
          </h3>
          {renderScheduleTable(filtered2Course, 2)}
        </div>
      )}
    </main>
  )
}

export default Schedule
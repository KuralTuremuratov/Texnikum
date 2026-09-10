"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

const Schedule = () => {
  const [course1Schedule, setCourse1Schedule] = useState([])
  const [course2Schedule, setCourse2Schedule] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <main className="container content-section">
        <div className="loading">Yuklanmoqda...</div>
      </main>
    )
  }

  return (
    <main className="container content-section">
      <h2>1-kurs dars jadvali</h2>
      <div className="schedule-wrapper">
        <table className="course-schedule">
          <thead>
            <tr>
              <th>Guruh</th>
              <th>Dushanba</th>
              <th>Seshanba</th>
              <th>Chorshanba</th>
              <th>Payshanba</th>
              <th>Juma</th> {/* Добавлен заголовок 5-para */}
            </tr>
          </thead>
          <tbody>
            {course1Schedule.map((row) => (
              <tr key={row.id}>
                <td style={{ whiteSpace: "pre-line" }}>{row.day}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Dushanba">{row.para1}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Seshanba">{row.para2}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Chorshanba">{row.para3}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Payshanba">{row.para4}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Juma">{row.para5 || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>2-kurs dars jadvali</h2>
      <div className="schedule-wrapper">
        <table className="course-schedule">
          <thead>
            <tr>
              <th>Guruh</th>
              <th>Dushanba</th>
              <th>Seshanba</th>
              <th>Chorshanba</th>
              <th>Payshanba</th>
              <th>Juma</th>
            </tr>
          </thead>
          <tbody>
            {course2Schedule.map((row) => (
              <tr key={row.id}>
                <td style={{ whiteSpace: "pre-line" }}>{row.day}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Dushanba">{row.para1}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Seshanba">{row.para2}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Chorshanba">{row.para3}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Payshanba">{row.para4}</td>
                <td style={{ whiteSpace: "pre-line" }} data-label="Juma">{row.para5 || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Schedule
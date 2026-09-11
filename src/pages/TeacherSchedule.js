"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

const TeacherSchedule = () => {
  const [teacherSchedule, setTeacherSchedule] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <main className="container content-section">
        <div className="loading">Yuklanmoqda...</div>
      </main>
    )
  }

  return (
    <main className="container content-section">
      <h2>Navbatchilik jadvali</h2>
      <div className="schedule-wrapper">
        <table className="teacher-schedule">
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
            {teacherSchedule.map((row) => (
              <tr key={row.id}>
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
    </main>
  )
}

export default TeacherSchedule

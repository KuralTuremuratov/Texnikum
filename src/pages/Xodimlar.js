import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import { supabase } from "../lib/supabase"
import Loader from "../components/Loader"

const Xodimlar = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      console.error("Xodimlarni yuklashda xatolik:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container content-section">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <a href="/">Bosh sahifa</a>
        <span>/</span>
        <span>Xodimlar</span>
      </nav>

      <div className="page-header">
        <div className="page-header-icon">
          <Users size={32} />
        </div>
        <div>
          <h1>Xodimlar</h1>
          <p className="page-subtitle">Texnikumning malakali xodimlari bilan tanishing</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <p>Hozircha xodimlar ro'yxati bo'sh</p>
        </div>
      ) : (
        <div className="employees-grid">
          {employees.map((employee) => (
            <article key={employee.id} className="employee-card">
              <div className="employee-photo">
                <img
                  src={employee.photo_url || "/placeholder-employee.jpg"}
                  alt={employee.name}
                  onError={(e) => {
                    e.target.src = "/placeholder-employee.jpg"
                  }}
                />
              </div>
              <div className="employee-info">
                <h3>{employee.name}</h3>
                <p className="employee-position">{employee.position}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Xodimlar

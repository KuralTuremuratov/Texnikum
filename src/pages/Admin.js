"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Edit, Save, X, Trash2, Plus, Upload, ImageIcon } from "lucide-react"

const Admin = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [courseSchedules, setCourseSchedules] = useState([])
  const [teacherSchedules, setTeacherSchedules] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [editingCourse, setEditingCourse] = useState(null)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [editingImage, setEditingImage] = useState(null)
  const [activeTab, setActiveTab] = useState("courses")
  const [uploadingImage, setUploadingImage] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate("/login", { replace: true })
        return
      }
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
          navigate("/login", { replace: true })
          return
        }
        setUser(user)
      } catch (error) {
        console.error("Foydalanuvchini tekshirishda xatolik:", error)
        navigate("/login", { replace: true })
        return
      } finally {
        setLoading(false)
      }
      loadData()
    }
    checkSession()
  }, [navigate])

  const loadData = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from("course_schedules")
        .select("*")
        .order("course_number", { ascending: true })
        .order("id", { ascending: true })
      if (courseError) console.error("Kurs jadvallari xatoligi:", courseError)
      else setCourseSchedules(courseData || [])

      const { data: teacherData, error: teacherError } = await supabase
        .from("teacher_schedules")
        .select("*")
        .order("id")
      if (teacherError) console.error("O'qituvchilar jadvallari xatoligi:", teacherError)
      else setTeacherSchedules(teacherData || [])

      const { data: galleryData, error: galleryError } = await supabase
        .from("gallery_images")
        .select("*")
        .order("uploaded_at", { ascending: false })
      if (galleryError) console.error("Galereya rasmlari xatoligi:", galleryError)
      else setGalleryImages(galleryData || [])
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const updateCourseSchedule = async (id, updatedData) => {
    try {
      const { error } = await supabase.from("course_schedules").update(updatedData).eq("id", id)
      if (error) {
        console.error("Yangilash xatoligi:", error)
        alert("Yangilashda xatolik: " + error.message)
        return
      }
      setCourseSchedules((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)))
      setEditingCourse(null)
      alert("Kurs jadvali muvaffaqiyatli yangilandi!")
    } catch (error) {
      console.error("Kurs jadvalini yangilashda xatolik:", error)
      alert("Kurs jadvalini yangilashda xatolik: " + error.message)
    }
  }

  const addCourseSchedule = async () => {
    try {
      const newSchedule = {
        course_number: 1,
        day: "Yangi Guruh",
        para1: "Fan 1",
        para2: "Fan 2",
        para3: "Fan 3",
        para4: "Fan 4",
        para5: "Fan 5", // Добавлен para5
      }
      const { data, error } = await supabase.from("course_schedules").insert([newSchedule]).select()
      if (error) {
        console.error("Qo'shish xatoligi:", error)
        alert("Qo'shishda xatolik: " + error.message)
        return
      }
      if (data && data.length > 0) {
        setCourseSchedules((prev) => [...prev, data[0]])
        alert("Yangi kurs jadvali qo'shildi!")
      }
    } catch (error) {
      console.error("Kurs jadvalini qo'shishda xatolik:", error)
      alert("Kurs jadvalini qo'shishda xatolik: " + error.message)
    }
  }

  const deleteCourseSchedule = async (id) => {
    if (!window.confirm("Ushbu kurs jadvalini o'chirishga ishonchingiz komilmi?")) return
    try {
      const { error } = await supabase.from("course_schedules").delete().eq("id", id)
      if (error) {
        console.error("O'chirish xatoligi:", error)
        alert("O'chirishda xatolik: " + error.message)
        return
      }
      setCourseSchedules((prev) => prev.filter((item) => item.id !== id))
      alert("Kurs jadvali muvaffaqiyatli o'chirildi!")
    } catch (error) {
      console.error("Kurs jadvalini o'chirishda xatolik:", error)
      alert("Kurs jadvalini o'chirishda xatolik: " + error.message)
    }
  }

  const updateTeacherSchedule = async (id, updatedData) => {
    try {
      const { error } = await supabase.from("teacher_schedules").update(updatedData).eq("id", id)
      if (error) {
        console.error("Yangilash xatoligi:", error)
        alert("Yangilashda xatolik: " + error.message)
        return
      }
      setTeacherSchedules((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)))
      setEditingTeacher(null)
      alert("Navbatchilik jadvali muvaffaqiyatli yangilandi!")
    } catch (error) {
      console.error("Navbatchilik jadvalini yangilashda xatolik:", error)
      alert("Navbatchilik jadvalini yangilashda xatolik: " + error.message)
    }
  }

  const addTeacherSchedule = async () => {
    try {
      const newSchedule = {
        teacher: "Yangi o'qituvchi",
        dushanba: "-",
        seshanba: "-",
        chorshanba: "-",
        payshanba: "-",
        juma: "-",
        shanba: "-",
      }
      const { data, error } = await supabase.from("teacher_schedules").insert([newSchedule]).select()
      if (error) {
        console.error("Qo'shish xatoligi:", error)
        alert("Qo'shishda xatolik: " + error.message)
        return
      }
      if (data && data.length > 0) {
        setTeacherSchedules((prev) => [...prev, data[0]])
        alert("Yangi navbatchilik jadvali qo'shildi!")
      }
    } catch (error) {
      console.error("Navbatchilik jadvalini qo'shishda xatolik:", error)
      alert("Navbatchilik jadvalini qo'shishda xatolik: " + error.message)
    }
  }

  const deleteTeacherSchedule = async (id) => {
    if (!window.confirm("Ushbu navbatchilik jadvalini o'chirishga ishonchingiz komilmi?")) return
    try {
      const { error } = await supabase.from("teacher_schedules").delete().eq("id", id)
      if (error) {
        console.error("O'chirish xatoligi:", error)
        alert("O'chirishda xatolik: " + error.message)
        return
      }
      setTeacherSchedules((prev) => prev.filter((item) => item.id !== id))
      alert("Navbatchilik jadvali muvaffaqiyatli o'chirildi!")
    } catch (error) {
      console.error("Navbatchilik jadvalini o'chirishda xatolik:", error)
      alert("Navbatchilik jadvalini o'chirishda xatolik: " + error.message)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    try {
      setUploadingImage(true)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        alert("Faqat rasmlar qo'llab-quvvatlanadi: JPEG, PNG, WebP, GIF")
        return
      }
      if (file.size > 5242880) {
        alert("Fayl hajmi 5MB dan oshmasligi kerak")
        return
      }
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      console.log("Fayl yuklash boshlandi:", fileName)
      const { data: uploadData, error: uploadError } = await supabase.storage.from("gallery").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })
      if (uploadError) {
        console.error("Yuklash xatoligi:", uploadError)
        if (uploadError.message.includes("Bucket not found")) {
          alert("'gallery' bucket topilmadi. Supabase Storage da yaratilganligini va ommaviy kirish huquqi borligini tekshiring.")
        } else if (uploadError.message.includes("not allowed")) {
          alert("Yuklash huquqi yo'q. 'gallery' bucket uchun kirish siyosatlarini tekshiring.")
        } else if (uploadError.message.includes("Duplicate")) {
          alert("Bunday nomli fayl allaqachon mavjud. Qayta urinib ko'ring.")
        } else {
          alert(`Yuklash xatoligi: ${uploadError.message}`)
        }
        return
      }
      console.log("Fayl muvaffaqiyatli yuklandi:", uploadData)
      if (!uploadData || !uploadData.publicUrl) {
        alert("Rasm URL sini olishda xatolik")
        return
      }
      console.log("Ommaviy URL:", uploadData.publicUrl)
      const newImage = {
        title: `Rasm ${new Date().toLocaleDateString()}`,
        description: "Yangi rasm",
        image_url: uploadData.publicUrl,
        image_path: uploadData.path,
        is_active: true,
      }
      console.log("Ma'lumotlar bazasiga saqlash:", newImage)
      const { data, error } = await supabase.from("gallery_images").insert([newImage]).select()
      if (error) {
        console.error("Ma'lumotlar bazasi xatoligi:", error)
        await supabase.storage.from("gallery").remove([fileName])
        alert("Ma'lumotlar bazasiga saqlashda xatolik: " + error.message)
        return
      }
      if (data && data.length > 0) {
        setGalleryImages((prev) => [data[0], ...prev])
        alert("Rasm muvaffaqiyatli yuklandi!")
      }
    } catch (error) {
      console.error("Umumiy xatolik:", error)
      alert("Xatolik yuz berdi: " + error.message)
    } finally {
      setUploadingImage(false)
      event.target.value = ""
    }
  }

  const updateGalleryImage = async (id, updatedData) => {
    try {
      const { error } = await supabase.from("gallery_images").update(updatedData).eq("id", id)
      if (error) {
        console.error("Yangilash xatoligi:", error)
        alert("Yangilashda xatolik: " + error.message)
        return
      }
      setGalleryImages((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)))
      setEditingImage(null)
      alert("Rasm muvaffaqiyatli yangilandi!")
    } catch (error) {
      console.error("Rasmni yangilashda xatolik:", error)
      alert("Rasmni yangilashda xatolik: " + error.message)
    }
  }

  const deleteGalleryImage = async (id) => {
    if (!window.confirm("Ushbu rasmni o'chirishga ishonchingiz komilmi?")) return
    try {
      const image = galleryImages.find((img) => img.id === id)
      if (image && image.image_path) {
        const { error: storageError } = await supabase.storage.from("gallery").remove([image.image_path])
        if (storageError) console.error("Storage o'chirish xatoligi:", storageError)
      }
      const { error } = await supabase.from("gallery_images").delete().eq("id", id)
      if (error) {
        console.error("O'chirish xatoligi:", error)
        alert("O'chirishda xatolik: " + error.message)
        return
      }
      setGalleryImages((prev) => prev.filter((item) => item.id !== id))
      alert("Rasm muvaffaqiyatli o'chirildi!")
    } catch (error) {
      console.error("Rasmni o'chirishda xatolik:", error)
      alert("Rasmni o'chirishda xatolik: " + error.message)
    }
  }

  const toggleImageStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase.from("gallery_images").update({ is_active: !currentStatus }).eq("id", id)
      if (error) {
        console.error("Holat o'zgartirish xatoligi:", error)
        alert("Holatni o'zgartirishda xatolik: " + error.message)
        return
      }
      setGalleryImages((prev) => prev.map((item) => (item.id === id ? { ...item, is_active: !currentStatus } : item)))
      alert(`Rasm ${!currentStatus ? "faollashtirildi" : "o'chirildi"}!`)
    } catch (error) {
      console.error("Rasm holatini o'zgartirishda xatolik:", error)
      alert("Rasm holatini o'zgartirishda xatolik: " + error.message)
    }
  }

  if (loading) {
    return <div className="container content-section"><div className="loading">Kirish huquqini tekshirish...</div></div>
  }

  if (!user) {
    navigate("/login", { replace: true })
    return <div className="container content-section"><div className="loading">Yo'naltirish...</div></div>
  }

  return (
    <main className="container content-section">
      <div className="admin-header">
        <h2>Admin paneli</h2>
        <div className="admin-info">
          <span>Foydalanuvchi: {user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Chiqish</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === "courses" ? "active" : ""}`} onClick={() => setActiveTab("courses")}>Kurs jadvallari</button>
        <button className={`tab-btn ${activeTab === "teachers" ? "active" : ""}`} onClick={() => setActiveTab("teachers")}>Navbatchilik jadvallari</button>
        <button className={`tab-btn ${activeTab === "gallery" ? "active" : ""}`} onClick={() => setActiveTab("gallery")}>Foto galereya</button>
      </div>

      {activeTab === "courses" && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Kurs jadvallari ({courseSchedules.length})</h3>
            <button onClick={addCourseSchedule} className="add-btn"><Plus size={16} />Jadval qo'shish</button>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kurs</th>
                  <th>Kun</th>
                  <th>1-para</th>
                  <th>2-para</th>
                  <th>3-para</th>
                  <th>4-para</th>
                  <th>5-para</th> {/* Новая колонка */}
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {courseSchedules.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                      Ma'lumot yo'q. Birinchi jadvalni qo'shing.
                    </td>
                  </tr>
                ) : (
                  courseSchedules.map((schedule) => (
                    <tr key={schedule.id}>
                      {editingCourse === schedule.id ? (
                        <EditableCourseRow
                          schedule={schedule}
                          onSave={(data) => updateCourseSchedule(schedule.id, data)}
                          onCancel={() => setEditingCourse(null)}
                        />
                      ) : (
                        <>
                          <td>{schedule.course_number}</td>
                          <td>{schedule.day}</td>
                          <td>{schedule.para1}</td>
                          <td>{schedule.para2}</td>
                          <td>{schedule.para3}</td>
                          <td>{schedule.para4}</td>
                          <td>{schedule.para5 || "-"}</td> {/* Отображение para5 */}
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => setEditingCourse(schedule.id)} className="edit-btn"><Edit size={16} /></button>
                              <button onClick={() => deleteCourseSchedule(schedule.id)} className="delete-btn"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "teachers" && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Navbatchilik jadvallari ({teacherSchedules.length})</h3>
            <button onClick={addTeacherSchedule} className="add-btn"><Plus size={16} />Jadval qo'shish</button>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>O'qituvchi</th>
                  <th>Dushanba</th>
                  <th>Seshanba</th>
                  <th>Chorshanba</th>
                  <th>Payshanba</th>
                  <th>Juma</th>
                  <th>Shanba</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {teacherSchedules.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                      Ma'lumot yo'q. Birinchi jadvalni qo'shing.
                    </td>
                  </tr>
                ) : (
                  teacherSchedules.map((schedule) => (
                    <tr key={schedule.id}>
                      {editingTeacher === schedule.id ? (
                        <EditableTeacherRow
                          schedule={schedule}
                          onSave={(data) => updateTeacherSchedule(schedule.id, data)}
                          onCancel={() => setEditingTeacher(null)}
                        />
                      ) : (
                        <>
                          <td>{schedule.teacher}</td>
                          <td>{schedule.dushanba}</td>
                          <td>{schedule.seshanba}</td>
                          <td>{schedule.chorshanba}</td>
                          <td>{schedule.payshanba}</td>
                          <td>{schedule.juma}</td>
                          <td>{schedule.shanba}</td>
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => setEditingTeacher(schedule.id)} className="edit-btn"><Edit size={16} /></button>
                              <button onClick={() => deleteTeacherSchedule(schedule.id)} className="delete-btn"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Foto galereya ({galleryImages.length})</h3>
            <div className="gallery-actions">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                disabled={uploadingImage}
              />
              <label htmlFor="image-upload" className={`upload-btn ${uploadingImage ? "uploading" : ""}`}>
                <Upload size={16} />
                {uploadingImage ? "Yuklanmoqda..." : "Foto yuklash"}
              </label>
            </div>
          </div>
          <div className="gallery-admin-grid">
            {galleryImages.length === 0 ? (
              <div className="no-images-admin">
                <ImageIcon size={48} />
                <p>Rasmlar yo'q. Birinchi fotoni yuklang.</p>
              </div>
            ) : (
              galleryImages.map((image) => (
                <div key={image.id} className={`gallery-admin-item ${!image.is_active ? "inactive" : ""}`}>
                  {editingImage === image.id ? (
                    <EditableImageCard
                      image={image}
                      onSave={(data) => updateGalleryImage(image.id, data)}
                      onCancel={() => setEditingImage(null)}
                    />
                  ) : (
                    <>
                      <div className="gallery-admin-image">
                        <img
                          src={image.image_url || "/placeholder.svg"}
                          alt={image.title}
                          onError={(e) => { e.target.src = "/placeholder.svg?height=200&width=200" }}
                        />
                        {!image.is_active && <div className="inactive-overlay">Faol emas</div>}
                      </div>
                      <div className="gallery-admin-info">
                        <h4>{image.title}</h4>
                        <p>{image.description}</p>
                        <small>Yuklangan: {new Date(image.uploaded_at).toLocaleDateString()}</small>
                      </div>
                      <div className="gallery-admin-actions">
                        <button onClick={() => setEditingImage(image.id)} className="edit-btn"><Edit size={14} /></button>
                        <button
                          onClick={() => toggleImageStatus(image.id, image.is_active)}
                          className={`toggle-btn ${image.is_active ? "active" : "inactive"}`}
                        >
                          {image.is_active ? "Yashirish" : "Ko'rsatish"}
                        </button>
                        <button onClick={() => deleteGalleryImage(image.id)} className="delete-btn"><Trash2 size={14} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  )
}

const EditableCourseRow = ({ schedule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    course_number: schedule.course_number,
    day: schedule.day,
    para1: schedule.para1,
    para2: schedule.para2,
    para3: schedule.para3,
    para4: schedule.para4,
    para5: schedule.para5 || "", // Добавляем para5
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <>
      <td>
        <input
          type="number"
          value={formData.course_number}
          onChange={(e) => setFormData({ ...formData, course_number: Number.parseInt(e.target.value) })}
          min="1"
          max="4"
        />
      </td>
      <td>
        <input type="text" value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} />
      </td>
      <td>
        <textarea
          rows={3}
          value={formData.para1}
          onChange={(e) => setFormData({ ...formData, para1: e.target.value })}
        />
      </td>
      <td>
        <textarea
          rows={3}
          value={formData.para2}
          onChange={(e) => setFormData({ ...formData, para2: e.target.value })}
        />
      </td>
      <td>
        <textarea
          rows={3}
          value={formData.para3}
          onChange={(e) => setFormData({ ...formData, para3: e.target.value })}
        />
      </td>
      <td>
        <textarea
          rows={3}
          value={formData.para4}
          onChange={(e) => setFormData({ ...formData, para4: e.target.value })}
        />
      </td>
      <td>
        <textarea
          rows={3}
          value={formData.para5}
          onChange={(e) => setFormData({ ...formData, para5: e.target.value })}
        />
      </td>
      <td>
        <div className="action-buttons">
          <button onClick={handleSave} className="save-btn">
            <Save size={16} />
          </button>
          <button onClick={onCancel} className="cancel-btn">
            <X size={16} />
          </button>
        </div>
      </td>
    </>
  )
}

const EditableTeacherRow = ({ schedule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    teacher: schedule.teacher,
    dushanba: schedule.dushanba,
    seshanba: schedule.seshanba,
    chorshanba: schedule.chorshanba,
    payshanba: schedule.payshanba,
    juma: schedule.juma,
    shanba: schedule.shanba,
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <>
      <td>
        <textarea
          rows={3} // Устанавливаем количество строк, например, 3
          value={formData.teacher}
          onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={formData.dushanba}
          onChange={(e) => setFormData({ ...formData, dushanba: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={formData.seshanba}
          onChange={(e) => setFormData({ ...formData, seshanba: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={formData.chorshanba}
          onChange={(e) => setFormData({ ...formData, chorshanba: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={formData.payshanba}
          onChange={(e) => setFormData({ ...formData, payshanba: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={formData.juma}
          onChange={(e) => setFormData({ ...formData, juma: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          value={formData.shanba}
          onChange={(e) => setFormData({ ...formData, shanba: e.target.value })}
        />
      </td>
      <td>
        <div className="action-buttons">
          <button onClick={handleSave} className="save-btn">
            <Save size={16} />
          </button>
          <button onClick={onCancel} className="cancel-btn">
            <X size={16} />
          </button>
        </div>
      </td>
    </>
  )
}

const EditableImageCard = ({ image, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: image.title,
    description: image.description || "",
    is_active: image.is_active,
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="editing-image-card">
      <div className="gallery-admin-image">
        <img
          src={image.image_url || "/placeholder.svg"}
          alt={image.title}
          onError={(e) => { e.target.src = "/placeholder.svg?height=200&width=200" }}
        />
      </div>
      <div className="editing-form">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Rasm nomi"
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Rasm tavsifi"
          rows="3"
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          Faol (galereyada ko'rsatish)
        </label>
        <div className="editing-actions">
          <button onClick={handleSave} className="save-btn">
            <Save size={14} /> Saqlash
          </button>
          <button onClick={onCancel} className="cancel-btn">
            <X size={14} /> Bekor qilish
          </button>
        </div>
      </div>
    </div>
  )
}

export default Admin

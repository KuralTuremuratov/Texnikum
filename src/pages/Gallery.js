"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { supabase } from "../lib/supabase"

const Gallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("is_active", true)
        .order("uploaded_at", { ascending: false })

      if (error) {
        console.error("Error loading images:", error)
        // Fallback к статическим изображениям если база данных недоступна
        setImages([
          { id: 1, title: "Texnikum rasmi 1", image_url: "/01.jpg" },
          { id: 2, title: "Texnikum rasmi 2", image_url: "/02.jpg" },
          { id: 3, title: "Texnikum rasmi 3", image_url: "/03.jpg" },
          { id: 4, title: "Texnikum rasmi 4", image_url: "/04.jpg" },
          { id: 5, title: "Texnikum rasmi 5", image_url: "/05.jpg" },
          { id: 6, title: "Texnikum rasmi 6", image_url: "/06.jpg" },
        ])
      } else {
        setImages(data || [])
      }
    } catch (error) {
      console.error("Error loading images:", error)
      // Fallback к статическим изображениям
      setImages([
        { id: 1, title: "Texnikum rasmi 1", image_url: "/01.jpg" },
        { id: 2, title: "Texnikum rasmi 2", image_url: "/02.jpg" },
        { id: 3, title: "Texnikum rasmi 3", image_url: "/03.jpg" },
        { id: 4, title: "Texnikum rasmi 4", image_url: "/04.jpg" },
        { id: 5, title: "Texnikum rasmi 5", image_url: "/05.jpg" },
        { id: 6, title: "Texnikum rasmi 6", image_url: "/06.jpg" },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="content-section">
        <div className="container">
          <div className="loading">Yuklanmoqda...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="content-section">
      <div className="container">
        <h1 className="gallery-header">Fotogalereya</h1>
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="gallery-item">
              <img
                src={image.image_url || "/placeholder.svg"}
                alt={image.title || `Texnikum rasmi ${image.id}`}
                className="gallery-img"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=300&width=300"
                }}
              />
              {image.title && (
                <div className="gallery-item-overlay">
                  <h3>{image.title}</h3>
                  {image.description && <p>{image.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
        {images.length === 0 && (
          <div className="no-images">
            <p>Hozircha rasmlar mavjud emas.</p>
          </div>
        )}
        <Link className="back-link" to="/">
          <ArrowLeft size={20} />
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  )
}

export default Gallery

"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "../lib/supabase"
import Loader from "../components/Loader"

const Gallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
          { id: 1, title: "Texnikum binosi", description: "Asosiy o'quv binosi", image_url: "/01.jpg" },
          { id: 2, title: "Talabalar", description: "O'quv jarayoni", image_url: "/02.jpg" },
          { id: 3, title: "Ochilish marosimi", description: "Yangi o'quv yili", image_url: "/03.jpg" },
          { id: 4, title: "Auditoriya", description: "Zamonaviy sinf xonalari", image_url: "/04.jpg" },
          { id: 5, title: "Sport tadbirlari", description: "Futbol musobaqasi", image_url: "/05.jpg" },
          { id: 6, title: "Diplom topshirish", description: "Bitiruvchilar", image_url: "/06.jpg" },
        ])
      } else {
        setImages(data || [])
      }
    } catch (error) {
      console.error("Error loading images:", error)
      // Fallback к статическим изображениям
      setImages([
        { id: 1, title: "Texnikum binosi", description: "Asosiy o'quv binosi", image_url: "/01.jpg" },
        { id: 2, title: "Talabalar", description: "O'quv jarayoni", image_url: "/02.jpg" },
        { id: 3, title: "Ochilish marosimi", description: "Yangi o'quv yili", image_url: "/03.jpg" },
        { id: 4, title: "Auditoriya", description: "Zamonaviy sinf xonalari", image_url: "/04.jpg" },
        { id: 5, title: "Sport tadbirlari", description: "Futbol musobaqasi", image_url: "/05.jpg" },
        { id: 6, title: "Diplom topshirish", description: "Bitiruvchilar", image_url: "/06.jpg" },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Открыть lightbox
  const openLightbox = (index) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  // Закрыть lightbox
  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = "auto"
  }

  // Следующее фото
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  // Предыдущее фото
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Обработка клавиш
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") setCurrentImageIndex((prev) => (prev + 1) % images.length)
      if (e.key === "ArrowLeft") setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, images.length])

  if (loading) {
    return (
      <main className="content-section">
        <div className="container">
          <Loader />
        </div>
      </main>
    )
  }

  return (
    <main className="content-section">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link to="/">Bosh sahifa</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Fotogalereya</span>
        </nav>

        <h1 className="gallery-header">Fotogalereya</h1>

        <div className="gallery-grid">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="gallery-item"
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && openLightbox(index)}
            >
              <img
                src={image.image_url || "/placeholder.svg"}
                alt={image.title || `Texnikum rasmi ${image.id}`}
                className="gallery-img"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=300&width=300"
                }}
              />
              <div className="gallery-item-info">
                <h3>{image.title || `Rasm ${image.id}`}</h3>
                {image.description && <p>{image.description}</p>}
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="no-images">
            <p>Rasmlar mavjud emas.</p>
          </div>
        )}

        <Link className="back-link" to="/">
          <ArrowLeft size={20} />
          Bosh sahifaga qaytish
        </Link>
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Yopish">
            <X size={32} />
          </button>
          
          <button 
            className="lightbox-prev" 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Oldingi rasm"
          >
            <ChevronLeft size={40} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentImageIndex]?.image_url}
              alt={images[currentImageIndex]?.title}
              className="lightbox-image"
            />
            <div className="lightbox-caption">
              <h3>{images[currentImageIndex]?.title}</h3>
              {images[currentImageIndex]?.description && (
                <p>{images[currentImageIndex]?.description}</p>
              )}
              <span className="lightbox-counter">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          <button 
            className="lightbox-next" 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Keyingi rasm"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </main>
  )
}

export default Gallery

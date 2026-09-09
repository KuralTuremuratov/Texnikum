import { FileText, Target, MapPin } from "lucide-react"

const Home = () => {
  return (
    <>
      <section className="image-gallery">
        <div className="gallery-item">
          <img src="/1.jpg" alt="Texnikum rasmi 1" className="gallery-img" />
        </div>
        <div className="gallery-item">
          <img src="/2.jpg" alt="Texnikum rasmi 2" className="gallery-img" />
        </div>
      </section>

      <main className="content-section">
        <div className="container grid-3">
          <article className="card">
            <FileText className="card-icon" />
            <h3>Yo'nalishlar</h3>
            <ul>
             
              <li>50320203 – Kutubxonashunoslik va bibliografiya</li>
              <li>50610201 – Dasturiy injiniring</li>
              <li>40110104 – Maktabgacha ta’lim muassasasi tarbiyachisi</li>
              <li>40110104 – Maktabgacha ta’lim muassasasi yordamchi tarbiyachisi</li>
              <li>40110201 – Maktabgacha ta’lim muassasasi musiqa rahbari</li>
              
              <li></li>
            </ul>
          </article>

          <article className="card">
            <Target className="card-icon" />
            <h3>Dual-ta'lim yo'nalishlari</h3>
            <ul>
              <li>40110104 – Maktabgacha ta’lim muassasasi tarbiyachisi</li>
              <li>40110201 – Maktabgacha ta’lim muassasasi musiqa rahbari</li>
            </ul>
          </article>

          <article className="card">
            <MapPin className="card-icon" />
            <h3>Manzil</h3>
            <p>Xo'jayli tumani, Bag'man MFY, Buyuk kelajak ko'chasi</p>
            <p>
              Telefon: <a href="tel:+998551062067">+998 55 106 20 67</a>
            </p>
          </article>
        </div>
      </main>
    </>
  )
}

export default Home

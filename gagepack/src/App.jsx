import { useRef, useState } from "react"
import "./App.css"

function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const contactRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // stub: integrate real backend or form provider here
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: "", email: "", message: "" })
  }

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <h1 className="brand">Juju's Manufacturing</h1>
          <nav className="nav">
            <button className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Home
            </button>
            <button className="nav-link" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
              Services
            </button>
            <button className="nav-link" onClick={scrollToContact}>
              Contact
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-content">
              <h2>Precision Manufacturing. Trusted Delivery.</h2>
              <p>
                We deliver high-quality precision components for aerospace, automotive, and industrial
                customers. CNC machining, fabrication, and assembly at scale with ISO-certified processes.
              </p>
              <div className="hero-ctas">
                <button className="btn primary" onClick={scrollToContact}>
                  Request a Quote
                </button>
                <a className="btn outline" href="#services">
                  Our Services
                </a>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="visual-box">Factory • CNC • Assembly</div>
            </div>
          </div>
        </section>

        <section id="services" className="services">
          <div className="container">
            <h3>Core Capabilities</h3>
            <div className="cards">
              <article className="card">
                <h4>CNC Machining</h4>
                <p>Multi-axis precision machining with tolerances down to microns.</p>
              </article>
              <article className="card">
                <h4>Sheet Metal & Fabrication</h4>
                <p>Laser cutting, forming and welding for mid- to high-volume runs.</p>
              </article>
              <article className="card">
                <h4>Assembly & Testing</h4>
                <p>Full product assembly, functional testing and kitting for delivery.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="why container">
          <h3>Why Customers Choose Us</h3>
          <ul>
            <li>Short lead-times with predictable delivery</li>
            <li>Quality-first processes and full traceability</li>
            <li>Engineering support from prototype to production</li>
          </ul>
        </section>

        <section ref={contactRef} id="contact" className="contact container">
          <h3>Request a Quote</h3>
          <div className="contact-grid">
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Project details
                <textarea name="message" value={form.message} onChange={handleChange} rows="5" />
              </label>
              <div className="form-actions">
                <button className="btn primary" type="submit">
                  Send Request
                </button>
                <button
                  className="btn outline"
                  type="button"
                  onClick={() => setForm({ name: "", email: "", message: "" })}
                >
                  Reset
                </button>
              </div>
              {submitted && <p className="notice success">Request sent — we will contact you shortly.</p>}
            </form>

            <aside className="contact-info" aria-label="Contact information">
              <h4>Get in touch</h4>
              <p>Phone: (555) 123-4567</p>
              <p>Email: sales@atlasmanufacturing.example</p>
              <p>Address: 120 Industrial Way, Springfield</p>
              <div className="hours">
                <strong>Hours</strong>
                <p>Mon–Fri: 8:00 — 17:00</p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Atlas Manufacturing — Built with care</p>
        </div>
      </footer>
    </>
  )
}

export default App

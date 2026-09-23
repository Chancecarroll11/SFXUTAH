import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", instagram: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">
          <img src="/sfx-utah-logo.png" alt="SFX Utah" className="nav-logo-img" />
          <span className="nav-logo-text"><span>SFX</span> UTAH</span>
        </a>
        <ul className={`nav-links${mobileNavOpen ? " mobile-open" : ""}`}>
          {[
            { href: "/#home", label: "Home" },
            { href: "/#concerts", label: "Concerts" },
            { href: "/#promo", label: "Promotion" },
            { href: "/#instagram", label: "Gallery" },
          ].map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={() => setMobileNavOpen(false)}>{label}</a>
            </li>
          ))}
        </ul>
        <a href="/contact" className="nav-cta" style={{ background: "var(--red)" }}>Contact</a>
        <button className="hamburger" onClick={() => setMobileNavOpen((o) => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* PAGE */}
      <main className="contact-page">
        {/* HEADER */}
        <div className="contact-hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div className="contact-hero-inner">
            <div className="section-label">Get In Touch</div>
            <h1 className="contact-hero-title">
              <span className="red">Work</span>{" "}
              <span className="outline">With Us</span>
            </h1>
            <p className="contact-hero-sub">
              SFX Utah is always looking to connect with creative people who are passionate about Utah's music scene.
              Tell us what you're about. Let's build something together.
            </p>
          </div>
        </div>

        <div className="contact-body">
          {/* FORM */}
          {status === "sent" ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h2 className="contact-success-title">Message Received</h2>
              <p className="contact-success-body">
                Thanks for reaching out, <strong>{form.name}</strong>. We'll get back to you soon. Keep making noise.
              </p>
              <a href="/" className="btn-primary" style={{ marginTop: 32 }}>Back to Home</a>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-section-label">01: Your Info</div>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label className="contact-label">Full Name *</label>
                  <input
                    className="contact-input"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-label">Email Address *</label>
                  <input
                    className="contact-input"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </div>
              </div>
              <div className="contact-field">
                <label className="contact-label">Instagram Handle</label>
                <div className="contact-input-wrap">
                  <span className="contact-input-prefix">@</span>
                  <input
                    className="contact-input contact-input--prefixed"
                    type="text"
                    placeholder="yourhandle"
                    value={form.instagram}
                    onChange={set("instagram")}
                  />
                </div>
              </div>

              <div className="contact-section-label" style={{ marginTop: 48 }}>02: Tell Us More</div>
              <div className="contact-field">
                <label className="contact-label">What Are You Looking For? *</label>
                <textarea
                  className="contact-input contact-textarea"
                  placeholder="Tell us about your music, project, event, or what brings you to SFX Utah..."
                  rows={6}
                  value={form.message}
                  onChange={set("message")}
                  required
                />
              </div>

              <div className="contact-form-footer">
                <p className="contact-form-note">
                  {status === "error" && <span className="contact-form-warn">Something went wrong. Please try again.</span>}
                </p>
                <button
                  className="btn-primary contact-submit"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          )}

          {/* INFO STRIP */}
          <div className="contact-info-strip">
            <div className="contact-info-item">
              <div className="contact-info-label">Instagram</div>
              <a href="https://www.instagram.com/sfx_utah" target="_blank" rel="noreferrer" className="contact-info-value">
                @sfx_utah
              </a>
            </div>
            <div className="contact-info-divider" />
            <div className="contact-info-item">
              <div className="contact-info-label">Upcoming Shows</div>
              <div className="contact-info-value">SFX Kilby Court · SFX Whysound</div>
            </div>
            <div className="contact-info-divider" />
            <div className="contact-info-item">
              <div className="contact-info-label">Based In</div>
              <div className="contact-info-value">Utah, USA</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

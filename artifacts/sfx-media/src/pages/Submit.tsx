import { useState } from "react";

const GENRES = [
  { value: "hip-hop", label: "Hip-Hop / Rap" },
  { value: "rnb", label: "R&B / Soul" },
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock / Alt" },
  { value: "electronic", label: "Electronic / EDM" },
  { value: "indie", label: "Indie" },
  { value: "other", label: "Other" },
];

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

export default function Submit() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram: "",
    genre: "",
    musicLink: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${BASE}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="contact-page">
      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">
          <img src="/sfx-logo.svg" alt="SFX Utah" className="nav-logo-img" />
          <span className="nav-logo-text"><span>SFX</span> MEDIA</span>
        </a>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/contact">Work With Us</a></li>
          <li><a href="/submit" className="active">Submit Music</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <div className="contact-hero">
        <div className="contact-hero-inner">
          <div className="section-label">Local Artists</div>
          <h1 className="contact-hero-title">
            Submit Your<br />
            <span className="outline">Music</span>
          </h1>
          <p className="contact-hero-sub">
            Are you a Utah artist? We want to hear from you. Submit your music for a chance to be featured
            on SFX Media's platform, spotlighted on our Instagram, and covered at our events.
          </p>
        </div>
      </div>

      <div className="contact-body">
        {status === "sent" ? (
          <div className="contact-success">
            <div className="contact-success-icon">✓</div>
            <h2 className="contact-success-title">Submission Received</h2>
            <p className="contact-success-body">
              Thanks for sending your music, <strong>{form.name}</strong>. We'll listen and get back to you if it's a fit. Keep grinding.
            </p>
            <a href="/" className="btn-primary" style={{ marginTop: 32 }}>Back to Home</a>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-section-label">01: Your Info</div>
            <div className="contact-form-row">
              <div className="contact-field">
                <label className="contact-label">Artist / Stage Name *</label>
                <input
                  className="contact-input"
                  type="text"
                  placeholder="Your artist name"
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

            <div className="contact-form-row">
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
              <div className="contact-field">
                <label className="contact-label">City / Location *</label>
                <input
                  className="contact-input"
                  type="text"
                  placeholder="e.g. Provo, UT"
                  value={form.city}
                  onChange={set("city")}
                  required
                />
              </div>
            </div>

            <div className="contact-section-label" style={{ marginTop: 48 }}>02: Your Music</div>
            <div className="contact-form-row">
              <div className="contact-field">
                <label className="contact-label">Genre *</label>
                <select
                  className="contact-input"
                  value={form.genre}
                  onChange={set("genre")}
                  required
                  style={{ cursor: "pointer" }}
                >
                  <option value="" disabled>Select a genre</option>
                  {GENRES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div className="contact-field">
                <label className="contact-label">Spotify / SoundCloud / Link *</label>
                <input
                  className="contact-input"
                  type="url"
                  placeholder="https://open.spotify.com/artist/..."
                  value={form.musicLink}
                  onChange={set("musicLink")}
                  required
                />
              </div>
            </div>

            <div className="contact-field" style={{ marginTop: 8 }}>
              <label className="contact-label">Tell Us About Yourself *</label>
              <textarea
                className="contact-input contact-textarea"
                placeholder="Who are you as an artist? What's your sound? Do you perform live? What kind of coverage or feature are you looking for on SFX Media?"
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
                {status === "sending" ? "Sending..." : "Submit for Feature"}
              </button>
            </div>
          </form>
        )}

        <div className="contact-info-strip">
          <div className="contact-info-item">
            <div className="contact-info-label">Instagram</div>
            <a href="https://www.instagram.com/sfx_utah" target="_blank" rel="noreferrer" className="contact-info-value">
              @sfx_utah
            </a>
          </div>
          <div className="contact-info-divider" />
          <div className="contact-info-item">
            <div className="contact-info-label">Next Show</div>
            <div className="contact-info-value">SFX II: Apr 25, The Rise, Provo</div>
          </div>
          <div className="contact-info-divider" />
          <div className="contact-info-item">
            <div className="contact-info-label">Based In</div>
            <div className="contact-info-value">Utah, USA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

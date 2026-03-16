import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "success" | "error">("idle");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const expandEls = document.querySelectorAll(
      "a, button, .post-card, .sidebar-card, .concert-row, .artist-card, .ig-cell"
    );
    const expand = () => cursor.classList.add("expand");
    const shrink = () => cursor.classList.remove("expand");

    document.addEventListener("mousemove", onMove);
    expandEls.forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      expandEls.forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const onScroll = () => {
      let current = "";
      sections.forEach((s) => {
        if (window.scrollY >= (s as HTMLElement).offsetTop - 120)
          current = s.getAttribute("id") || "";
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubscribe = () => {
    if (email && email.includes("@")) {
      setSubStatus("success");
      setEmail("");
      setTimeout(() => setSubStatus("idle"), 3000);
    } else {
      setSubStatus("error");
      setTimeout(() => setSubStatus("idle"), 1500);
    }
  };

  return (
    <>
      <div className="cursor" ref={cursorRef} />

      {/* NAV */}
      <nav>
        <a href="#home" className="nav-logo">
          <span>SFX</span> MEDIA
        </a>
        <ul className={`nav-links${mobileNavOpen ? " mobile-open" : ""}`}>
          {[
            { href: "#coverage", label: "Coverage" },
            { href: "#concerts", label: "Concerts" },
            { href: "#artists", label: "Artists" },
            { href: "#promo", label: "Promotion" },
            { href: "#instagram", label: "Gallery" },
          ].map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={activeSection === href.slice(1) ? "active" : ""}
                onClick={() => setMobileNavOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#newsletter" className="nav-cta">Subscribe</a>
        <button className="hamburger" onClick={() => setMobileNavOpen((o) => !o)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-eyebrow">Utah's Independent Music Media</div>
        <h1 className="hero-title">
          <span className="red">SFX</span>
          <br />
          <span className="outline">MEDIA</span>
        </h1>
        <div className="hero-sub">
          <p className="hero-tagline">
            Covering concerts, spotlighting local artists, and powering promotion across Utah and beyond.
          </p>
          <div className="hero-actions">
            <a href="#coverage" className="btn-primary">Read Latest</a>
            <a href="#promo" className="btn-ghost">Work With Us</a>
          </div>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[
            "Concert Coverage",
            "Local Artist Spotlight",
            "Event Promotion",
            "Utah Music Scene",
            "Photography",
            "Reviews & Interviews",
            "SFX Media Utah",
            "Concert Coverage",
            "Local Artist Spotlight",
            "Event Promotion",
            "Utah Music Scene",
            "Photography",
            "Reviews & Interviews",
            "SFX Media Utah",
          ].map((item, i) => (
            <div key={i} className="ticker-item">{item}</div>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      <section className="featured" id="coverage">
        <div className="section-label">Featured</div>
        <div className="section-title">Latest Coverage</div>
        <div className="featured-grid fade-up">
          <div className="featured-main">
            <div className="featured-main-bg" />
            <div className="featured-main-glow" />
            <span className="featured-badge">Concert Review</span>
            <h2>Night One at The Complex: A New Chapter for Utah Hip-Hop</h2>
            <p>
              Last Friday's showcase brought together some of SLC's most exciting voices under one roof — a
              defining moment for the local scene heading into summer.
            </p>
            <div className="article-meta">
              <span className="author">SFX Team</span>
              <span className="dot">·</span>
              <span>March 14, 2026</span>
              <span className="dot">·</span>
              <span>8 min read</span>
            </div>
          </div>
          <div className="featured-sidebar">
            {[
              {
                cat: "Artist Spotlight",
                title: "Meet Talon Cruz: Spanish Fork's Next Big Voice",
                meta: "March 12, 2026 · 5 min read",
              },
              {
                cat: "Interview",
                title: "Kilby Court Turns 25 — We Talked to the Team",
                meta: "March 10, 2026 · 6 min read",
              },
              {
                cat: "Promotion",
                title: "How SFX Media Helped Launch Provo's Breakout Act",
                meta: "March 8, 2026 · 4 min read",
              },
            ].map(({ cat, title, meta }, i) => (
              <a key={i} href="#" className="sidebar-card fade-up">
                <div>
                  <div className="cat">{cat}</div>
                  <h3>{title}</h3>
                </div>
                <div className="meta">{meta}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE AREAS */}
      <section id="what-we-do">
        <div className="section-label">What We Do</div>
        <div className="section-title">Our Coverage</div>
        <div className="coverage-grid">
          {[
            {
              icon: "🎤",
              title: "Concerts",
              desc: "On-the-ground coverage of live shows across Utah — from intimate club nights to major festival stages. Reviews, photos, and real-time updates.",
              num: "01",
            },
            {
              icon: "🎵",
              title: "Local Artists",
              desc: "Deep-dive profiles, studio sessions, and interviews with the emerging and established artists shaping Utah's sound right now.",
              num: "02",
            },
            {
              icon: "📡",
              title: "Promotion",
              desc: "Full-service artist and event promotion — social media campaigns, press releases, content creation, and audience growth strategies.",
              num: "03",
            },
          ].map(({ icon, title, desc, num }) => (
            <div key={title} className="coverage-card fade-up">
              <span className="coverage-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="count">{num}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="latest">
        <div className="section-label">Recent</div>
        <div className="section-title">From the Feed</div>
        <div className="posts-grid">
          {[
            { thumb: "thumb-concerts", cat: "Concert Review", title: "Wuki at Sky SLC Was an Exercise in Pure Energy", meta: "Mar 11 · 4 min read" },
            { thumb: "thumb-artists",  cat: "Artist Spotlight", title: "Orem's Indie Scene Is Quietly Exploding — Here's Who to Watch", meta: "Mar 9 · 6 min read" },
            { thumb: "thumb-promo",    cat: "Industry", title: "5 Things Local Artists Should Know About Getting Press Coverage", meta: "Mar 7 · 7 min read" },
            { thumb: "thumb-review",   cat: "Album Review", title: "New Drop: Local Producer Drops Project That Blends Folk and Trap", meta: "Mar 5 · 5 min read" },
            { thumb: "thumb-local",    cat: "Scene Report", title: "Utah County's Music Scene: 2026 State of the Art", meta: "Mar 3 · 8 min read" },
            { thumb: "thumb-feature",  cat: "Feature", title: "How Urban Lounge Became the Heartbeat of SLC's Indie Scene", meta: "Mar 1 · 10 min read" },
          ].map(({ thumb, cat, title, meta }, i) => (
            <a key={i} href="#" className="post-card fade-up">
              <div className="post-thumb">
                <div className={`post-thumb-inner ${thumb}`}>
                  <div className="thumb-label">SFX</div>
                </div>
              </div>
              <div className="post-body">
                <div className="post-cat">{cat}</div>
                <h3>{title}</h3>
                <div className="meta">{meta}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CONCERTS */}
      <section id="concerts">
        <div className="section-label">Upcoming</div>
        <div className="section-title">Concerts We're Covering</div>
        <div className="concerts-list">
          {[
            { month: "Mar", day: "21", name: "Breakaway Utah Festival", sub: "Multiple headliners · All Ages", venue: "Utah State Fairpark", city: "Salt Lake City", live: true },
            { month: "Mar", day: "28", name: "Local Showcase Night Vol. 4", sub: "SFX Media Presents · 21+", venue: "The Urban Lounge", city: "Salt Lake City", live: true },
            { month: "Apr", day: "04", name: "Me Gusta Festival 2026", sub: "Latin & Urban · All Ages", venue: "The Complex", city: "Salt Lake City", live: false },
            { month: "Apr", day: "11", name: "Twilight Concert Series Kickoff", sub: "Outdoor Summer Series · All Ages", venue: "Gallivan Center", city: "Salt Lake City", live: false },
            { month: "Apr", day: "18", name: "Kilby Court Underground Night", sub: "Indie / Alternative · 18+", venue: "Kilby Court", city: "Salt Lake City", live: false },
          ].map(({ month, day, name, sub, venue, city, live }) => (
            <a key={name} href="#" className="concert-row">
              <div className="concert-date">
                <small>{month}</small>
                {day}
              </div>
              <div className="concert-info">
                <h4>{name}</h4>
                <span>{sub}</span>
              </div>
              <div className="concert-venue">
                {venue}
                <br />
                <small>{city}</small>
              </div>
              <div className={`concert-tag${live ? " live" : ""}`}>
                {live ? "Covering Live" : "Scheduled"}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ARTISTS */}
      <section className="artists" id="artists">
        <div className="section-label">Spotlight</div>
        <div className="section-title">Artists to Watch</div>
        <div className="artists-grid">
          {[
            { initials: "TC", name: "Talon Cruz", loc: "Spanish Fork", genre: "R&B / Soul" },
            { initials: "MV", name: "Mira Voss", loc: "Provo", genre: "Indie Pop" },
            { initials: "DX", name: "Dax & The Current", loc: "SLC", genre: "Hip-Hop" },
            { initials: "JR", name: "Jace Redd", loc: "Ogden", genre: "Alt-Rock" },
            { initials: "SN", name: "Sunnova", loc: "Lehi", genre: "Electronic" },
            { initials: "PK", name: "PVKK", loc: "SLC", genre: "Punk / Post-Punk" },
            { initials: "LM", name: "Luna Moreno", loc: "Orem", genre: "Folk / Americana" },
            { initials: "ZB", name: "Zero Bound", loc: "SLC", genre: "Metal" },
          ].map(({ initials, name, loc, genre }) => (
            <a key={name} href="#" className="artist-card fade-up">
              <div className="artist-avatar">{initials}</div>
              <h4>{name}</h4>
              <div className="genre">
                {loc} · <span>{genre}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PROMO */}
      <section className="promo" id="promo">
        <div className="promo-bg" />
        <div className="promo-inner">
          <div className="promo-text">
            <div className="section-label">Work With Us</div>
            <div className="section-title" style={{ marginBottom: "24px" }}>
              Artist &amp;
              <br />
              Event Promotion
            </div>
            <p>
              SFX Media doesn't just cover the scene — we help build it. We offer promotion packages for local
              artists and event organizers looking to grow their audience across Utah and beyond.
            </p>
            <a href="mailto:contact@sfxmedia.com" className="btn-primary">Get in Touch</a>
          </div>
          <div className="promo-features">
            {[
              { icon: "📱", title: "Social Media Campaigns", desc: "Targeted Instagram, TikTok, and X campaigns to grow your following and reach new fans before your show." },
              { icon: "📝", title: "Press Coverage & Write-Ups", desc: "Professional editorial coverage, artist profiles, and event previews published on SFX Media's platform." },
              { icon: "📸", title: "Photography & Content", desc: "Concert and promo photography delivered in a format ready for social media, press kits, and streaming profiles." },
              { icon: "🔊", title: "Event Promotion", desc: "Full digital promotion for upcoming shows, including graphics, event pages, and audience targeting." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="promo-feature fade-up">
                <span className="promo-feature-icon">{icon}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="instagram" id="instagram">
        <div className="ig-header">
          <div>
            <div className="section-label">Gallery</div>
            <div className="section-title" style={{ marginBottom: 0 }}>Instagram</div>
          </div>
          <a href="https://www.instagram.com/sfx_utah" target="_blank" rel="noreferrer" className="ig-handle">
            @sfx_utah
          </a>
        </div>
        <div className="ig-grid">
          {[
            { bg: "ig-bg-1", icon: "🎤" },
            { bg: "ig-bg-2", icon: "🎵" },
            { bg: "ig-bg-3", icon: "📸" },
            { bg: "ig-bg-4", icon: "🎸" },
            { bg: "ig-bg-5", icon: "🥁" },
            { bg: "ig-bg-6", icon: "🎤" },
            { bg: "ig-bg-7", icon: "🎵" },
            { bg: "ig-bg-8", icon: "📸" },
            { bg: "ig-bg-9", icon: "🎸" },
            { bg: "ig-bg-10", icon: "🥁" },
            { bg: "ig-bg-11", icon: "🎤" },
            { bg: "ig-bg-12", icon: "🎵" },
          ].map(({ bg, icon }, i) => (
            <div key={i} className="ig-cell">
              <div className={`ig-cell-inner ${bg}`}>{icon}</div>
              <div className="ig-cell-overlay">
                <span>♥</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter" id="newsletter">
        <div className="section-label">Stay Connected</div>
        <div className="section-title">Never Miss a Show</div>
        <p>
          Get Utah concert news, artist spotlights, and SFX Media coverage drops delivered straight to your
          inbox. No noise, just the good stuff.
        </p>
        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={subStatus === "error" ? { borderColor: "var(--red)" } : {}}
            onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
          />
          <button
            type="button"
            onClick={handleSubscribe}
            style={subStatus === "success" ? { background: "#1a7a1a" } : {}}
          >
            {subStatus === "success" ? "✓ Subscribed!" : "Subscribe"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo">
              <span>SFX</span> MEDIA
            </span>
            <p>
              Utah's independent music media outlet. Covering concerts, spotlighting local artists, and
              handling promotion across the Beehive State.
            </p>
            <div className="social-links">
              <a href="https://www.instagram.com/sfx_utah" target="_blank" rel="noreferrer" className="social-link">📷</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">🎵</a>
              <a href="#" className="social-link">▶</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Coverage</h5>
            <ul>
              {["Concert Reviews", "Artist Spotlights", "Album Reviews", "Scene Reports", "Interviews"].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              {["Event Promotion", "Social Campaigns", "Press Coverage", "Photography", "Artist EPK"].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              {["About SFX", "Our Team", "Submit Music", "Advertise", "Contact"].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SFX Media. Utah, USA.</span>
          <span>Built for the scene.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}

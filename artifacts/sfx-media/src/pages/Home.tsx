import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "success" | "error">("idle");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [popupEmail, setPopupEmail] = useState("");
  const [popupStatus, setPopupStatus] = useState<"idle" | "success" | "error">("idle");
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("custom-cursor-page");
    const cursor = cursorRef.current;
    if (!cursor) return () => document.body.classList.remove("custom-cursor-page");

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
      document.body.classList.remove("custom-cursor-page");
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

  useEffect(() => {
    if (
      window.localStorage.getItem("sfx-email-list-joined") ||
      window.localStorage.getItem("sfx-email-popup-dismissed")
    ) {
      return;
    }

    const timer = window.setTimeout(() => setIsEmailPopupOpen(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isEmailPopupOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeEmailPopup();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isEmailPopupOpen]);

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

  const closeEmailPopup = () => {
    setIsEmailPopupOpen(false);
    window.localStorage.setItem("sfx-email-popup-dismissed", "1");
  };

  const handlePopupSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = popupEmail.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setPopupStatus("error");
      return;
    }

    window.localStorage.setItem("sfx-email-list-joined", trimmedEmail);
    setPopupStatus("success");
    window.setTimeout(() => setIsEmailPopupOpen(false), 1800);
  };

  return (
    <>
      <div className="cursor" ref={cursorRef} />

      {/* NAV */}
      <nav>
        <a href="#home" className="nav-logo">
          <img src="/sfx-utah-logo.jpg" alt="SFX Utah" className="nav-logo-img" />
          <span className="nav-logo-text"><span>SFX</span> UTAH</span>
        </a>
        <ul className={`nav-links${mobileNavOpen ? " mobile-open" : ""}`}>
          {[
            { href: "#concerts", label: "Concerts" },
            { href: "#promo", label: "Promotion" },
            { href: "/shop", label: "Shop" },
            { href: "/submit", label: "Submit Music" },
            { href: "https://www.instagram.com/sfx_utah", label: "Gallery" },
          ].map(({ href, label }) => {
            const isExternal = href.startsWith("http");
            return (
              <li key={href}>
                <a
                  href={href}
                  className={!isExternal && activeSection === href.slice(1) ? "active" : ""}
                  onClick={() => setMobileNavOpen(false)}
                  {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
        <a href="/contact" className="nav-cta">Contact</a>
        <button className="hamburger" onClick={() => setMobileNavOpen((o) => !o)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero hero-homepage" id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-logo-wrap">
          <img src="/sfx-utah-logo.jpg" alt="SFX Utah" className="hero-main-logo" />
        </div>
        <h1 className="hero-title hero-title-centered">
          <span className="red">SFX</span>
          {" "}
          <span className="outline">UTAH</span>
        </h1>
          <div className="hero-eyebrow hero-eyebrow-centered">Local Shows · Local Artists · Utah Music</div>
          <p className="hero-description">
            We put on local concerts, discover Utah artists, and bring the scene closer together.
          </p>
        <div className="hero-actions hero-actions-centered">
            <a href="#concerts" className="btn-primary">See Upcoming Shows</a>
            <a href="/submit" className="btn-ghost">Submit Your Music</a>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[
            "Local Shows",
            "Artist Submissions",
            "Show Promotion",
            "Utah Music Scene",
            "Live Music",
            "Scene Building",
            "SFX Utah",
            "Local Shows",
            "Artist Submissions",
            "Show Promotion",
            "Utah Music Scene",
            "Live Music",
            "Scene Building",
            "SFX Utah",
          ].map((item, i) => (
            <div key={i} className="ticker-item">{item}</div>
          ))}
        </div>
      </div>

      {/* OUR VISION */}
      <section className="vision-section" id="vision">
        <div className="vision-inner fade-up">
          <div className="vision-logo-wrap">
            <img src="/sfx-utah-logo.jpg" alt="SFX Utah" className="vision-logo" />
          </div>
          <div className="vision-content">
            <div className="section-label">The SFX Utah Mission</div>
            <h2 className="vision-title">Put Utah<br />On Stage</h2>
            <p className="vision-body">
              SFX Utah exists to make more room for Utah music. We put on local shows, take submissions from
              artists ready for their next stage, and connect the right people to build lineups that move the
              scene forward.
            </p>
            <p className="vision-body">
              From the first submission to the last song of the night, we're here to elevate the artists,
              venues, and fans that make Utah's music culture worth showing up for.
            </p>
            <div className="vision-pillars">
              <div className="vision-pillar">
                <div className="vision-pillar-num">01</div>
                <div className="vision-pillar-label">Local Shows</div>
              </div>
              <div className="vision-pillar">
                <div className="vision-pillar-num">02</div>
                <div className="vision-pillar-label">Open Submissions</div>
              </div>
              <div className="vision-pillar">
                <div className="vision-pillar-num">03</div>
                <div className="vision-pillar-label">Scene First</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* COVERAGE AREAS */}
      <section id="what-we-do">
        <div className="section-label">How We Move The Scene</div>
        <div className="section-title">More Music.<br />More Together.</div>
        <div className="coverage-grid">
          {[
            {
              title: "Put On Shows",
              desc: "We build local lineups, partner with venues, and create live nights that give Utah artists a room full of people ready to listen.",
              num: "01",
            },
            {
              title: "Find The Next Wave",
              desc: "Artists can submit their music directly to SFX Utah for a chance to be featured, booked, and brought into the local conversation.",
              num: "02",
            },
            {
              title: "Build The Audience",
              desc: "We turn great music into momentum through show promotion, artist spotlights, and content that gets more Utah fans in the room.",
              num: "03",
            },
          ].map(({ title, desc, num }) => (
            <div key={title} className="coverage-card fade-up">
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="count">{num}</span>
            </div>
          ))}
        </div>
      </section>


      {/* CONCERTS */}
      <section id="concerts">
        <div className="section-label">SFX Presents</div>
        <div className="section-title">Upcoming Shows</div>
        <div className="concerts-list">
          <div className="concert-row">
            <div className="concert-date">
              <small>Details</small>
              Soon
            </div>
            <div className="concert-info">
              <h4>SFX Kilby Court</h4>
              <span>SFX Utah presents a new local show at Kilby Court. More details coming soon.</span>
            </div>
            <div className="concert-venue">
              Kilby Court
              <br />
              <small>Salt Lake City, Utah</small>
            </div>
            <div className="concert-tag live">More Details Soon</div>
          </div>
          <div className="concert-row">
            <div className="concert-date">
              <small>Details</small>
              Soon
            </div>
            <div className="concert-info">
              <h4>SFX Whysound</h4>
              <span>SFX Utah presents a new local show with Whysound. More details coming soon.</span>
            </div>
            <div className="concert-venue">
              Whysound
              <br />
              <small>Utah</small>
            </div>
            <div className="concert-tag live">More Details Soon</div>
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="promo" id="promo">
        <div className="promo-bg" />
        <div className="promo-inner">
          <div className="promo-text">
            <div className="section-label">For Artists &amp; Venues</div>
            <div className="section-title" style={{ marginBottom: "24px" }}>
              Bring Your
              <br />
              Show To Life
            </div>
            <p>
              Have a show to fill, a new artist to introduce, or a sound that deserves a bigger room? SFX Utah
              helps local artists and venues turn good ideas into nights people remember.
            </p>
            <a href="/contact" className="btn-primary">Plan A Show</a>
          </div>
          <div className="promo-features">
            {[
              { title: "Show Promotion", desc: "Targeted social campaigns, event creative, and direct audience outreach to get more people through the door." },
              { title: "Artist Submissions", desc: "A direct path for Utah artists to share their music, get discovered, and be considered for upcoming shows." },
              { title: "Live Content", desc: "Concert photography, artist features, and behind-the-scenes content that keeps the energy going after the show." },
              { title: "Scene Building", desc: "Thoughtful lineups and partnerships that connect artists, venues, and fans across Utah." },
            ].map(({ title, desc }) => (
              <div key={title} className="promo-feature fade-up">
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
        <div className="ig-showcase">
          <div className="ig-showcase-grid">
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <div key={n} className={`ig-cell`}>
                <div className={`ig-cell-inner ig-bg-${n}`} />
                <div className="ig-cell-overlay" />
              </div>
            ))}
          </div>
          <div className="ig-showcase-cta">
            <svg className="ig-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            <div className="section-label" style={{ marginBottom: 12 }}>Follow Along</div>
            <div className="ig-showcase-handle">@sfx_utah</div>
            <p className="ig-showcase-sub">
              Show announcements, artist features, and behind-the-scenes from every SFX Utah event.
            </p>
            <a
              href="https://www.instagram.com/sfx_utah"
              target="_blank"
              rel="noreferrer"
              className="btn-primary ig-showcase-btn"
            >
              View on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter" id="newsletter">
        <div className="section-label">Stay Connected</div>
        <div className="section-title">Never Miss a Show</div>
        <p>
          Get show announcements, special merch drops, and ticketing info delivered straight to your inbox. No
          noise, just the good stuff.
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
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <img src="/sfx-utah-logo.jpg" alt="SFX Utah" style={{ width: "48px", height: "48px", borderRadius: "4px" }} />
              <span className="logo" style={{ marginBottom: 0 }}>
                <span>SFX</span> UTAH
              </span>
            </div>
            <p>
              Utah's local concert promoter. Putting on shows, discovering artists, and elevating the music
              scene across the Beehive State.
            </p>
          </div>
          <div className="footer-col">
            <h5>Coverage</h5>
            <ul>
              {["Upcoming Shows", "Artist Submissions", "Local Lineups", "Scene Features", "Live Content"].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              {["Show Promotion", "Artist Features", "Venue Partnerships", "Photography"].map((l) => (
                <li key={l}><a href="/contact">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About SFX</a></li>
              <li><a href="/shop">Shop CDs</a></li>
              <li><a href="/submit">Submit Music</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SFX Utah. Utah, USA.</span>
          <span>Built for the scene.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>

      {isEmailPopupOpen && (
        <div
          className="email-popup-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEmailPopup();
          }}
        >
          <div
            className="email-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-popup-title"
            aria-describedby="email-popup-description"
          >
            <button className="email-popup-close" type="button" onClick={closeEmailPopup} aria-label="Close">
              ×
            </button>
            <div className="section-label">Stay In The Loop</div>
            <h2 id="email-popup-title">Never Miss<br /><span>the next show.</span></h2>
            {popupStatus === "success" ? (
              <div className="email-popup-success">
                <div className="email-popup-success-mark">✓</div>
                <p>You're on the list. We'll see you at the next one.</p>
              </div>
            ) : (
              <>
                <p id="email-popup-description">
                  Get show announcements, special merch drops, and ticketing info from SFX Utah.
                </p>
                <form className="email-popup-form" onSubmit={handlePopupSubscribe}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    aria-label="Email address"
                    value={popupEmail}
                    onChange={(event) => {
                      setPopupEmail(event.target.value);
                      if (popupStatus === "error") setPopupStatus("idle");
                    }}
                    autoFocus
                    required
                  />
                  <button className="btn-primary" type="submit">Join The List</button>
                </form>
                {popupStatus === "error" && (
                  <p className="email-popup-error">Enter a valid email address to join.</p>
                )}
                <p className="email-popup-note">No noise. Just the good stuff.</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  metadata: Record<string, string>;
  priceId: string;
  amount: number;
  currency: string;
}

function formatPrice(amount: number) {
  return `$${(amount / 100).toFixed(2)}`;
}

export default function Shop() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/shop/products`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load products. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleBuy = async (priceId: string, productId: string) => {
    setCheckingOut(productId);
    try {
      const res = await fetch(`${BASE}/api/shop/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. Please try again.");
        setCheckingOut(null);
      }
    } catch {
      alert("Checkout failed. Please try again.");
      setCheckingOut(null);
    }
  };

  return (
    <>
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
            { href: "https://www.instagram.com/sfx_utah", label: "Gallery" },
          ].map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={() => setMobileNavOpen(false)}>{label}</a>
            </li>
          ))}
        </ul>
        <a href="/contact" className="nav-cta" style={{ background: "var(--red)" }}>Work With Us</a>
        <button className="hamburger" onClick={() => setMobileNavOpen((o) => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <main className="contact-page">
        <div className="contact-hero">
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div className="contact-hero-inner">
            <div className="section-label">SFX Utah Store</div>
            <h1 className="contact-hero-title">
              <span className="red">Shop</span>{" "}
              <span className="outline">CDs</span>
            </h1>
            <p className="contact-hero-sub">
              Exclusive SFX Utah compilations and artist releases. Support Utah's underground music scene.
            </p>
          </div>
        </div>

        <div className="shop-body">
          {loading && (
            <div className="shop-loading">
              <div className="shop-loading-bar" />
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="shop-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="shop-grid">
              {products.map((product) => (
                <div key={product.id} className="shop-card">
                  <div className="shop-card-art">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="shop-card-art-placeholder">
                        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="40" cy="40" r="38" stroke="var(--red)" strokeWidth="2" />
                          <circle cx="40" cy="40" r="28" stroke="rgba(255,30,173,0.3)" strokeWidth="1" />
                          <circle cx="40" cy="40" r="18" stroke="rgba(255,30,173,0.2)" strokeWidth="1" />
                          <circle cx="40" cy="40" r="5" fill="var(--red)" />
                          <circle cx="40" cy="40" r="3" fill="var(--black)" />
                          <line x1="2" y1="40" x2="78" y2="40" stroke="rgba(255,30,173,0.15)" strokeWidth="1" />
                          <line x1="40" y1="2" x2="40" y2="78" stroke="rgba(255,30,173,0.15)" strokeWidth="1" />
                        </svg>
                        <div className="shop-card-art-label">SFX UTAH</div>
                      </div>
                    )}
                  </div>
                  <div className="shop-card-body">
                    <div className="shop-card-meta">
                      {product.metadata.tracks && (
                        <span className="shop-card-tracks">{product.metadata.tracks}</span>
                      )}
                      <span className="shop-card-format">CD</span>
                    </div>
                    <h3 className="shop-card-name">{product.name}</h3>
                    <p className="shop-card-desc">{product.description}</p>
                    <div className="shop-card-footer">
                      <span className="shop-card-price">{formatPrice(product.amount)}</span>
                      <button
                        className="btn-primary shop-card-btn"
                        onClick={() => handleBuy(product.priceId, product.id)}
                        disabled={checkingOut === product.id}
                      >
                        {checkingOut === product.id ? "Redirecting..." : "Buy Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="shop-note">
            <p>All purchases processed securely through Stripe. Physical CDs ship within 3-5 business days to US addresses only. Questions? <a href="/contact">Contact us.</a></p>
          </div>
        </div>
      </main>
    </>
  );
}

import { useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

interface OrderItem {
  name: string;
  quantity: number;
  amount: number;
}

interface OrderDetails {
  status: string;
  customerEmail: string | null;
  items: OrderItem[];
}

export default function ShopSuccess() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setLoading(false);
      return;
    }
    fetch(`${BASE}/api/shop/session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <nav>
        <a href="/" className="nav-logo">
          <img src="/sfx-utah-logo.jpg" alt="SFX Utah" className="nav-logo-img" />
          <span className="nav-logo-text"><span>SFX</span> UTAH</span>
        </a>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/shop">Shop</a></li>
        </ul>
      </nav>

      <main className="contact-page">
        <div className="contact-body" style={{ paddingTop: 80, textAlign: "center" }}>
          <div className="contact-success">
            <div className="contact-success-icon">✓</div>
            <h2 className="contact-success-title">Order Confirmed</h2>
            {loading ? (
              <p className="contact-success-body">Loading your order details...</p>
            ) : order ? (
              <>
                <p className="contact-success-body">
                  {order.customerEmail && (
                    <>A confirmation has been sent to <strong>{order.customerEmail}</strong>.</>
                  )}{" "}
                  Your CD will ship within 3-5 business days.
                </p>
                {order.items.length > 0 && (
                  <div style={{ margin: "32px auto", maxWidth: 400, textAlign: "left" }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #222" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                          <div style={{ color: "#888", fontSize: 13 }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ color: "var(--red)", fontWeight: 700 }}>${(item.amount / 100).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="contact-success-body">Your order was placed successfully. Check your email for confirmation.</p>
            )}
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
              <a href="/shop" className="btn-primary">Back to Shop</a>
              <a href="/" className="btn-primary" style={{ background: "transparent", border: "1px solid rgba(242,237,232,0.2)", color: "var(--white)" }}>Home</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

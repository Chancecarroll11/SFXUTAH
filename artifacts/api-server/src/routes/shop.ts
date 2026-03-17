import { Router, type IRouter } from "express";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
}

const router: IRouter = Router();

router.get("/shop/products", async (_req, res) => {
  try {
    const stripe = getStripe();
    const products = await stripe.products.list({ active: true, expand: ["data.default_price"] });

    const items = products.data
      .filter((p) => p.default_price)
      .map((p) => {
        const price = p.default_price as Stripe.Price;
        return {
          id: p.id,
          name: p.name,
          description: p.description || "",
          image: p.images?.[0] || null,
          metadata: p.metadata || {},
          priceId: price.id,
          amount: price.unit_amount || 0,
          currency: price.currency || "usd",
        };
      });

    res.json({ products: items });
  } catch (err: any) {
    console.error("shop/products error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/shop/checkout", async (req, res) => {
  try {
    const { priceId, quantity = 1 } = req.body;
    if (!priceId) {
      res.status(400).json({ error: "priceId required" });
      return;
    }

    const stripe = getStripe();
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    const baseUrl = domain ? `https://${domain}` : "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity }],
      mode: "payment",
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop`,
      shipping_address_collection: { allowed_countries: ["US"] },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("shop/checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/shop/session", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id || typeof session_id !== "string") {
      res.status(400).json({ error: "session_id required" });
      return;
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    res.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email || null,
      items: session.line_items?.data.map((li) => ({
        name: (li.price?.product as Stripe.Product)?.name || "",
        quantity: li.quantity,
        amount: li.amount_total,
      })) || [],
    });
  } catch (err: any) {
    console.error("shop/session error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;

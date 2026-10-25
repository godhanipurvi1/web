import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let orders = [
  { id: "ORD-1001", customer: "Asha", status: "preparing", total: 540 },
  { id: "ORD-1002", customer: "Ravi", status: "ready", total: 320 },
];

let products = [
  { id: "P-1", name: "Paneer Tikka", category: "Starters", price: 240, available: true },
  { id: "P-2", name: "Veg Biryani", category: "Mains", price: 220, available: true },
  { id: "P-3", name: "Gulab Jamun", category: "Desserts", price: 90, available: false },
];

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/orders", (req, res) => res.json(orders));

app.patch("/api/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  order.status = req.body.status ?? order.status;
  res.json(order);
});

app.get("/api/products", (req, res) => res.json(products));

app.patch("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (typeof req.body.available === "boolean") product.available = req.body.available;
  if (typeof req.body.price === "number") product.price = req.body.price;
  res.json(product);
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let orders = [
  { id: "ORD-1001", customer: "Asha", status: "preparing", total: 540 },
  { id: "ORD-1002", customer: "Ravi", status: "ready", total: 320 },
];

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/orders", (req, res) => res.json(orders));

app.patch("/api/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  order.status = req.body.status ?? order.status;
  res.json(order);
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));

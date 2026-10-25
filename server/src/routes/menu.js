import { Router } from "express";
import { orders, products, hide } from "../db.js";

const router = Router();

router.post("/orders", async (req, res) => {
  const { customer, items } = req.body;
  if (typeof customer !== "string" || !customer.trim()) {
    return res.status(400).json({ error: "Your name is required" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Add at least one dish" });
  }
  let total = 0;
  for (const item of items) {
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return res.status(400).json({ error: "Quantity must be between 1 and 20" });
    }
    const dish = await products.findOne({ id: item.id, available: true }, hide);
    if (!dish) return res.status(400).json({ error: "A dish is not available" });
    total += dish.price * qty;
  }
  const order = {
    id: "ORD-" + Date.now(),
    customer: customer.trim(),
    status: "preparing",
    total,
  };
  await orders.insertOne({ ...order });
  res.status(201).json(order);
});

// Public: customers see only the status, not the whole order list.
router.get("/orders/:id", async (req, res) => {
  const order = await orders.findOne(
    { id: req.params.id },
    { projection: { _id: 0, id: 1, customer: 1, status: 1, total: 1 } }
  );
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;

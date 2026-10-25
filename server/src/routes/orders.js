import { Router } from "express";
import { orders, hide } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await orders.find({}, hide).toArray());
});

router.post("/", async (req, res) => {
  const { customer, total } = req.body;
  if (typeof customer !== "string" || !customer.trim()) {
    return res.status(400).json({ error: "Customer name is required" });
  }
  if (typeof total !== "number" || total <= 0) {
    return res.status(400).json({ error: "Total must be a positive number" });
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

router.patch("/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.status === "string") update.status = req.body.status;
  await orders.updateOne({ id: req.params.id }, { $set: update });
  const order = await orders.findOne({ id: req.params.id }, hide);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;

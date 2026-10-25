import { Router } from "express";
import { orders, hide } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await orders.find({}, hide).toArray());
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

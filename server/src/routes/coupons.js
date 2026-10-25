import { Router } from "express";
import { coupons, hide } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await coupons.find({}, hide).toArray());
});

router.post("/", async (req, res) => {
  const { code, percent, minOrder } = req.body;
  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "Code is required" });
  }
  if (typeof percent !== "number" || percent < 1 || percent > 100) {
    return res.status(400).json({ error: "Percent must be between 1 and 100" });
  }
  if (typeof minOrder !== "number" || minOrder < 0) {
    return res.status(400).json({ error: "Minimum order must be zero or more" });
  }
  const coupon = {
    id: "C-" + Date.now(),
    code: code.trim().toUpperCase(),
    percent,
    minOrder,
    active: true,
  };
  await coupons.insertOne({ ...coupon });
  res.status(201).json(coupon);
});

router.patch("/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.active === "boolean") update.active = req.body.active;
  await coupons.updateOne({ id: req.params.id }, { $set: update });
  const coupon = await coupons.findOne({ id: req.params.id }, hide);
  if (!coupon) return res.status(404).json({ error: "Coupon not found" });
  res.json(coupon);
});

export default router;

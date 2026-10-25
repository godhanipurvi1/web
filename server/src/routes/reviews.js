import { Router } from "express";
import { reviews, hide } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await reviews.find({}, hide).toArray());
});

router.patch("/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.visible === "boolean") update.visible = req.body.visible;
  await reviews.updateOne({ id: req.params.id }, { $set: update });
  const review = await reviews.findOne({ id: req.params.id }, hide);
  if (!review) return res.status(404).json({ error: "Review not found" });
  res.json(review);
});

export default router;

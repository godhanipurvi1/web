import { Router } from "express";
import { riders, hide } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await riders.find({}, hide).toArray());
});

router.patch("/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.onDuty === "boolean") update.onDuty = req.body.onDuty;
  await riders.updateOne({ id: req.params.id }, { $set: update });
  const rider = await riders.findOne({ id: req.params.id }, hide);
  if (!rider) return res.status(404).json({ error: "Rider not found" });
  res.json(rider);
});

export default router;

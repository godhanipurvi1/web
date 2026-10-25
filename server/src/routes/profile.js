import { Router } from "express";
import { profile, hide } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await profile.findOne({ id: "restaurant" }, hide));
});

router.patch("/", async (req, res) => {
  const update = {};
  for (const key of ["name", "address", "phone"]) {
    if (typeof req.body[key] === "string") update[key] = req.body[key].trim();
  }
  if (typeof req.body.open === "boolean") update.open = req.body.open;
  await profile.updateOne({ id: "restaurant" }, { $set: update });
  res.json(await profile.findOne({ id: "restaurant" }, hide));
});

export default router;

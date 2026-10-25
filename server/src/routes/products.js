import { Router } from "express";
import { products, hide } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await products.find({}, hide).toArray());
});

router.post("/", async (req, res) => {
  const { name, category, price } = req.body;
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }
  const product = {
    id: "P-" + Date.now(),
    name: name.trim(),
    category: typeof category === "string" && category.trim() ? category.trim() : "Other",
    price,
    available: true,
  };
  await products.insertOne({ ...product });
  res.status(201).json(product);
});

router.patch("/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.available === "boolean") update.available = req.body.available;
  if (typeof req.body.price === "number") update.price = req.body.price;
  await products.updateOne({ id: req.params.id }, { $set: update });
  const product = await products.findOne({ id: req.params.id }, hide);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export default router;

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "biteverse_dev";
const PORT = 4000;

const SEED_PRODUCTS = [
  { id: "P-1", name: "Paneer Tikka", category: "Starters", price: 240, available: true },
  { id: "P-2", name: "Veg Biryani", category: "Mains", price: 220, available: true },
  { id: "P-3", name: "Gulab Jamun", category: "Desserts", price: 90, available: false },
];

const SEED_ORDERS = [
  { id: "ORD-1001", customer: "Asha", status: "preparing", total: 540 },
  { id: "ORD-1002", customer: "Ravi", status: "ready", total: 320 },
];

const client = new MongoClient(MONGO_URL);
await client.connect();
const db = client.db(DB_NAME);
const orders = db.collection("orders");
const products = db.collection("products");

if ((await products.countDocuments()) === 0) {
  await products.insertMany(SEED_PRODUCTS.map((p) => ({ ...p })));
  console.log("Seeded products");
}
if ((await orders.countDocuments()) === 0) {
  await orders.insertMany(SEED_ORDERS.map((o) => ({ ...o })));
  console.log("Seeded orders");
}

const app = express();
app.use(cors());
app.use(express.json());

const hide = { projection: { _id: 0 } };

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/orders", async (req, res) => {
  res.json(await orders.find({}, hide).toArray());
});

app.patch("/api/orders/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.status === "string") update.status = req.body.status;
  await orders.updateOne({ id: req.params.id }, { $set: update });
  const order = await orders.findOne({ id: req.params.id }, hide);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

app.get("/api/products", async (req, res) => {
  res.json(await products.find({}, hide).toArray());
});

app.patch("/api/products/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.available === "boolean") update.available = req.body.available;
  if (typeof req.body.price === "number") update.price = req.body.price;
  await products.updateOne({ id: req.params.id }, { $set: update });
  const product = await products.findOne({ id: req.params.id }, hide);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.listen(PORT, () => console.log("API running on http://localhost:" + PORT));

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

const SEED_COUPONS = [
  { id: "C-1", code: "WELCOME10", percent: 10, minOrder: 300, active: true },
  { id: "C-2", code: "LUNCH20", percent: 20, minOrder: 500, active: false },
];

const SEED_RIDERS = [
  { id: "R-1", name: "Amit", onDuty: true },
  { id: "R-2", name: "Kiran", onDuty: false },
  { id: "R-3", name: "Meera", onDuty: true },
];

const SEED_REVIEWS = [
  { id: "V-1", customer: "Asha", dish: "Paneer Tikka", rating: 5, comment: "Smoky and perfectly spiced.", visible: true },
  { id: "V-2", customer: "Ravi", dish: "Veg Biryani", rating: 3, comment: "Good flavour, rice was a bit dry.", visible: true },
  { id: "V-3", customer: "Asha", dish: "Gulab Jamun", rating: 4, comment: "Sweet and soft.", visible: false },
];

const SEED_PROFILE = {
  id: "restaurant",
  name: "Practice Kitchen",
  address: "Example Street, Your City",
  phone: "+91 90000 00000",
  open: true,
};

const client = new MongoClient(MONGO_URL);
await client.connect();
const db = client.db(DB_NAME);
const orders = db.collection("orders");
const products = db.collection("products");
const coupons = db.collection("coupons");
const riders = db.collection("riders");
const reviews = db.collection("reviews");
const profile = db.collection("profile");

if ((await products.countDocuments()) === 0) {
  await products.insertMany(SEED_PRODUCTS.map((p) => ({ ...p })));
  console.log("Seeded products");
}
if ((await orders.countDocuments()) === 0) {
  await orders.insertMany(SEED_ORDERS.map((o) => ({ ...o })));
  console.log("Seeded orders");
}
if ((await coupons.countDocuments()) === 0) {
  await coupons.insertMany(SEED_COUPONS.map((c) => ({ ...c })));
  console.log("Seeded coupons");
}
if ((await riders.countDocuments()) === 0) {
  await riders.insertMany(SEED_RIDERS.map((r) => ({ ...r })));
  console.log("Seeded riders");
}
if ((await reviews.countDocuments()) === 0) {
  await reviews.insertMany(SEED_REVIEWS.map((v) => ({ ...v })));
  console.log("Seeded reviews");
}
if ((await profile.countDocuments()) === 0) {
  await profile.insertOne({ ...SEED_PROFILE });
  console.log("Seeded profile");
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

app.post("/api/products", async (req, res) => {
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

app.patch("/api/products/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.available === "boolean") update.available = req.body.available;
  if (typeof req.body.price === "number") update.price = req.body.price;
  await products.updateOne({ id: req.params.id }, { $set: update });
  const product = await products.findOne({ id: req.params.id }, hide);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.get("/api/coupons", async (req, res) => {
  res.json(await coupons.find({}, hide).toArray());
});

app.post("/api/coupons", async (req, res) => {
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

app.patch("/api/coupons/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.active === "boolean") update.active = req.body.active;
  await coupons.updateOne({ id: req.params.id }, { $set: update });
  const coupon = await coupons.findOne({ id: req.params.id }, hide);
  if (!coupon) return res.status(404).json({ error: "Coupon not found" });
  res.json(coupon);
});

app.get("/api/riders", async (req, res) => {
  res.json(await riders.find({}, hide).toArray());
});

app.patch("/api/riders/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.onDuty === "boolean") update.onDuty = req.body.onDuty;
  await riders.updateOne({ id: req.params.id }, { $set: update });
  const rider = await riders.findOne({ id: req.params.id }, hide);
  if (!rider) return res.status(404).json({ error: "Rider not found" });
  res.json(rider);
});

app.get("/api/reviews", async (req, res) => {
  res.json(await reviews.find({}, hide).toArray());
});

app.patch("/api/reviews/:id", async (req, res) => {
  const update = {};
  if (typeof req.body.visible === "boolean") update.visible = req.body.visible;
  await reviews.updateOne({ id: req.params.id }, { $set: update });
  const review = await reviews.findOne({ id: req.params.id }, hide);
  if (!review) return res.status(404).json({ error: "Review not found" });
  res.json(review);
});

app.get("/api/profile", async (req, res) => {
  res.json(await profile.findOne({ id: "restaurant" }, hide));
});

app.patch("/api/profile", async (req, res) => {
  const update = {};
  for (const key of ["name", "address", "phone"]) {
    if (typeof req.body[key] === "string") update[key] = req.body[key].trim();
  }
  if (typeof req.body.open === "boolean") update.open = req.body.open;
  await profile.updateOne({ id: "restaurant" }, { $set: update });
  res.json(await profile.findOne({ id: "restaurant" }, hide));
});

app.listen(PORT, () => console.log("API running on http://localhost:" + PORT));

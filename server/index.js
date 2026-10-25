import express from "express";
import cors from "cors";
import { seed } from "./src/seed.js";
import { ensureAdmin, login, logout, changePassword, requireAdmin } from "./src/auth.js";
import ordersRoutes from "./src/routes/orders.js";
import productsRoutes from "./src/routes/products.js";
import couponsRoutes from "./src/routes/coupons.js";
import ridersRoutes from "./src/routes/riders.js";
import reviewsRoutes from "./src/routes/reviews.js";
import profileRoutes from "./src/routes/profile.js";
import menuRoutes from "./src/routes/menu.js";

const PORT = 4000;

await seed();
await ensureAdmin();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.post("/api/login", login);
app.post("/api/logout", logout);

// Public customer ordering: no admin login needed.
app.use("/api/menu", menuRoutes);

// Reads are open; any other change needs the admin token.
app.use("/api", (req, res, next) => {
  if (req.method === "GET") return next();
  return requireAdmin(req, res, next);
});

app.post("/api/password", changePassword);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/riders", ridersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => console.log("API running on http://localhost:" + PORT));

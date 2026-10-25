import express from "express";
import cors from "cors";
import { seed } from "./src/seed.js";
import ordersRoutes from "./src/routes/orders.js";
import productsRoutes from "./src/routes/products.js";
import couponsRoutes from "./src/routes/coupons.js";
import ridersRoutes from "./src/routes/riders.js";
import reviewsRoutes from "./src/routes/reviews.js";
import profileRoutes from "./src/routes/profile.js";

const PORT = 4000;

await seed();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/riders", ridersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => console.log("API running on http://localhost:" + PORT));

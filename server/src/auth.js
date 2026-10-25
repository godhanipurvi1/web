import { randomUUID } from "node:crypto";

const ADMIN_PASSWORD = "practice123";
const tokens = new Set();

export function login(req, res) {
  if (req.body?.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }
  const token = randomUUID();
  tokens.add(token);
  res.json({ token });
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!tokens.has(token)) {
    return res.status(401).json({ error: "Admin login required" });
  }
  next();
}

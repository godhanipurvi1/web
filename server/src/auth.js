import { randomUUID, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { admin } from "./db.js";

const scrypt = promisify(scryptCb);

try {
  process.loadEnvFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env"));
} catch {
  console.warn("No .env file found.");
}

const tokens = new Set();

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)).toString("hex");
  return { salt, hash };
}

async function checkPassword(password, record) {
  const stored = Buffer.from(record.hash, "hex");
  const attempt = await scrypt(password, record.salt, 64);
  return stored.length === attempt.length && timingSafeEqual(stored, attempt);
}

// First run only: create the admin password from ADMIN_PASSWORD in .env.
export async function ensureAdmin() {
  const existing = await admin.findOne({ id: "owner" });
  if (existing) return;
  const initial = process.env.ADMIN_PASSWORD;
  if (!initial) {
    console.warn("ADMIN_PASSWORD is not set in .env. Login is disabled.");
    return;
  }
  await admin.insertOne({ id: "owner", ...(await hashPassword(initial)) });
  console.log("Created admin password from .env");
}

export async function login(req, res) {
  const record = await admin.findOne({ id: "owner" });
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!record || !(await checkPassword(password, record))) {
    return res.status(401).json({ error: "Wrong password" });
  }
  const token = randomUUID();
  tokens.add(token);
  res.json({ token });
}

export async function changePassword(req, res) {
  const current = typeof req.body?.current === "string" ? req.body.current : "";
  const next = typeof req.body?.next === "string" ? req.body.next : "";
  const record = await admin.findOne({ id: "owner" });
  if (!record || !(await checkPassword(current, record))) {
    return res.status(401).json({ error: "Current password is wrong" });
  }
  if (next.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }
  await admin.updateOne({ id: "owner" }, { $set: await hashPassword(next) });
  res.json({ ok: true });
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!tokens.has(token)) {
    return res.status(401).json({ error: "Admin login required" });
  }
  next();
}

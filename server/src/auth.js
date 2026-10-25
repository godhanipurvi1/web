import { randomUUID, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { admin, sessions } from "./db.js";

const scrypt = promisify(scryptCb);
const SESSION_HOURS = 8;

try {
  process.loadEnvFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env"));
} catch {
  console.warn("No .env file found.");
}

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
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await sessions.insertOne({ token, expiresAt });
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
  // Changing the password logs out every existing session.
  await sessions.deleteMany({});
  res.json({ ok: true });
}

export async function logout(req, res) {
  const token = bearerToken(req);
  if (token) await sessions.deleteOne({ token });
  res.json({ ok: true });
}

function bearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

export async function requireAdmin(req, res, next) {
  const token = bearerToken(req);
  const session = token ? await sessions.findOne({ token }) : null;
  if (!session || session.expiresAt < new Date()) {
    if (session) await sessions.deleteOne({ token });
    return res.status(401).json({ error: "Admin login required" });
  }
  next();
}

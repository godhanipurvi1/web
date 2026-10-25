let token = null;

export function setToken(value) {
  token = value;
}

function headers() {
  const h = { "Content-Type": "application/json" };
  if (token) h.Authorization = "Bearer " + token;
  return h;
}

export async function getJson(path) {
  const res = await fetch("/api" + path);
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

export async function postJson(path, body) {
  const res = await fetch("/api" + path, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

export async function patchJson(path, body) {
  const res = await fetch("/api" + path, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

export async function login(password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Wrong password");
  return res.json();
}

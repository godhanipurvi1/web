const BASE = "/api";

export async function getJson(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

export async function patchJson(path, body) {
  const res = await fetch(BASE + path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

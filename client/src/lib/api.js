export async function getJson(path) {
  const res = await fetch("/api" + path);
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

export async function patchJson(path, body) {
  const res = await fetch("/api" + path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

export async function postJson(path, body) {
  const res = await fetch("/api" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

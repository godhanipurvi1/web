import { useEffect, useState } from "react";
import { getJson, patchJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, Button } from "../components/ui.jsx";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const data = await getJson("/profile");
      setProfile(data);
      setForm({ name: data.name, address: data.address, phone: data.phone });
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function save(e) {
    e.preventDefault();
    try {
      const data = await patchJson("/profile", form);
      setProfile(data);
      setMessage("Saved.");
      setError("");
    } catch (err) {
      setError("Could not save the profile.");
    }
  }

  async function toggleOpen() {
    try {
      const data = await patchJson("/profile", { open: !profile.open });
      setProfile(data);
      setMessage("");
    } catch (err) {
      setError("Could not change the store status.");
    }
  }

  useEffect(() => { load(); }, []);

  if (!profile) return <ErrorNotice message={error} />;

  return (
    <>
      <ErrorNotice message={error} />
      <Card>
        <div className="stat">
          <div className="stat-label">Store status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <StatusPill value={profile.open ? "yes" : "no"} label={profile.open ? "Open" : "Closed"} />
            <Button onClick={toggleOpen}>{profile.open ? "Close store" : "Open store"}</Button>
          </div>
        </div>
      </Card>
      <div style={{ height: 16 }} />
      <Card>
        <form className="addform" onSubmit={save}>
          <input
            placeholder="Restaurant name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Button primary>Save details</Button>
          {message && <span className="muted">{message}</span>}
        </form>
      </Card>
    </>
  );
}

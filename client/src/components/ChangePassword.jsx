import { useState } from "react";
import { postJson } from "../lib/api.js";
import { Card, ErrorNotice, Button } from "./ui.jsx";

export default function ChangePassword() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (form.next !== form.confirm) {
      setError("The new passwords do not match.");
      return;
    }
    try {
      await postJson("/password", { current: form.current, next: form.next });
      setForm({ current: "", next: "", confirm: "" });
      setMessage("Password changed. Use the new one next time you log in.");
    } catch (err) {
      setError("Could not change the password. Check the current password, and use at least 6 characters for the new one.");
    }
  }

  return (
    <>
      <ErrorNotice message={error} />
      <Card>
        <form className="addform" onSubmit={submit}>
          <input
            type="password"
            placeholder="Current password"
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
          />
          <input
            type="password"
            placeholder="New password"
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          <Button primary>Change password</Button>
          {message && <span className="muted">{message}</span>}
        </form>
      </Card>
    </>
  );
}

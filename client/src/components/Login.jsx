import { useState } from "react";
import { login, setToken } from "../lib/api.js";
import { Card, ErrorNotice, Button } from "./ui.jsx";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await login(password);
      setToken(data.token);
      onLogin();
    } catch (err) {
      setError("Wrong password. Try again.");
    }
  }

  return (
    <div className="login">
      <h1 className="login-title">BiteVerse <span>Admin</span></h1>
      <ErrorNotice message={error} />
      <Card>
        <form className="addform" onSubmit={submit}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button primary>Log in</Button>
        </form>
      </Card>
    </div>
  );
}

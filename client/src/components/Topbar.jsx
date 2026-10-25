import { useEffect, useState } from "react";
import { getJson } from "../lib/api.js";
import { StatusPill, Button } from "./ui.jsx";

export default function Topbar({ onLogout, refreshKey }) {
  const [open, setOpen] = useState(null);
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    setDark(next);
  }

  useEffect(() => {
    getJson("/profile")
      .then((p) => setOpen(p.open))
      .catch(() => setOpen(null));
  }, [refreshKey]);

  return (
    <header className="topbar">
      <div className="topbar-left"><span className="logo">Bite<b>Verse</b></span><span className="tag">Admin</span></div>
      <div className="topbar-right">
        {open !== null && (
          <StatusPill value={open ? "yes" : "no"} label={open ? "Store open" : "Store closed"} />
        )}
        <span className="avatar">A</span>
        <span className="topbar-user">Admin</span>
        <Button onClick={toggleTheme}>{dark ? "Light mode" : "Dark mode"}</Button>
        <Button onClick={onLogout}>Log out</Button>
      </div>
    </header>
  );
}

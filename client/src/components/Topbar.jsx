import { useEffect, useState } from "react";
import { getJson } from "../lib/api.js";
import { StatusPill, Button } from "./ui.jsx";

export default function Topbar({ title, onLogout, refreshKey }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    getJson("/profile")
      .then((p) => setOpen(p.open))
      .catch(() => setOpen(null));
  }, [refreshKey]);

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-right">
        {open !== null && (
          <StatusPill value={open ? "yes" : "no"} label={open ? "Store open" : "Store closed"} />
        )}
        <span className="topbar-user">Admin</span>
        <Button onClick={onLogout}>Log out</Button>
      </div>
    </header>
  );
}

import { useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import Products from "./pages/Products.jsx";
import Offers from "./pages/Offers.jsx";
import Customers from "./pages/Customers.jsx";
import Payments from "./pages/Payments.jsx";
import Delivery from "./pages/Delivery.jsx";
import Analytics from "./pages/Analytics.jsx";
import Reviews from "./pages/Reviews.jsx";
import Profile from "./pages/Profile.jsx";

const PAGES = [
  { id: "dashboard", label: "Dashboard", Component: Dashboard },
  { id: "orders", label: "Orders", Component: Orders },
  { id: "products", label: "Food items", Component: Products },
  { id: "offers", label: "Offers", Component: Offers },
  { id: "customers", label: "Customers", Component: Customers },
  { id: "payments", label: "Payments", Component: Payments },
  { id: "delivery", label: "Delivery", Component: Delivery },
  { id: "analytics", label: "Analytics", Component: Analytics },
  { id: "reviews", label: "Reviews", Component: Reviews },
  { id: "profile", label: "My profile", Component: Profile },
];

export default function App() {
  const [view, setView] = useState("dashboard");
  const current = PAGES.find((p) => p.id === view);
  const Page = current.Component;

  return (
    <div className="shell">
      <aside className="side">
        <div className="logo">Bite<b>Verse</b></div>
        <nav className="nav">
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={"navbtn" + (view === p.id ? " on" : "")}
              onClick={() => setView(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>
        <div className="sidefoot">Admin practice build. Changes are saved to MongoDB.</div>
      </aside>
      <main className="content">
        <header className="pagehead">
          <h1>{current.label}</h1>
        </header>
        <Page />
      </main>
    </div>
  );
}

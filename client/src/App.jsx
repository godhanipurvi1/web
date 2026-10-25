import { useState } from "react";
import Login from "./components/Login.jsx";
import Topbar from "./components/Topbar.jsx";
import { setToken, logoutRequest } from "./lib/api.js";
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
import Icon from "./components/Icon.jsx";

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

const GROUPS = [
  { title: "Overview", items: [["dashboard", "grid"]] },
  { title: "Management", items: [["orders", "receipt"], ["products", "fork"], ["offers", "tag"], ["customers", "users"], ["payments", "card"], ["delivery", "bike"]] },
  { title: "System", items: [["analytics", "chart"], ["reviews", "star"], ["profile", "user"]] },
];
export default function App() {
  const [authed, setAuthed] = useState(Boolean(localStorage.getItem("bv_token")));
  const [view, setView] = useState("dashboard");

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  function logout() {
    logoutRequest();
  setToken(null);
    setAuthed(false);
    setView("dashboard");
  }

  const current = PAGES.find((p) => p.id === view);
  const Page = current.Component;

  return (
    <div className="app">
      <Topbar onLogout={logout} refreshKey={view} />
      <div className="shell">
      <aside className="side">
        
        <nav className="nav">
          {GROUPS.map((g) => (
            <div key={g.title} className="navgroup">
              <h4>{g.title}</h4>
              {g.items.map(([id, ic]) => {
                const p = PAGES.find((x) => x.id === id);
                return (
                  <button
                    key={id}
                    className={"navbtn" + (view === id ? " on" : "")}
                    onClick={() => setView(id)}
                  >
                    <Icon name={ic} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidefoot">Admin practice build. Changes are saved to MongoDB.</div>
      </aside>
      <main className="content">
        
        <div className="page">
          <h1 className="page-title">{current.label}</h1>
          <Page />
        </div>
      </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getJson } from "../lib/api.js";
import { Card, ErrorNotice, RUPEE } from "../components/ui.jsx";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getJson("/orders"), getJson("/products")])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .catch(() => setError("Could not reach the API. Is the server running on port 4000?"));
  }, []);

  const inProgress = orders.filter((o) => o.status !== "ready").length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const available = products.filter((p) => p.available).length;

  const stats = [
    { label: "Total orders", value: orders.length },
    { label: "In progress", value: inProgress },
    { label: "Dishes available", value: available + " of " + products.length },
    { label: "Revenue", value: RUPEE + revenue },
  ];

  return (
    <>
      <ErrorNotice message={error} />
      <div className="stats">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="stat">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

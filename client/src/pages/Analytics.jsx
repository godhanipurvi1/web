import { useEffect, useState } from "react";
import { getJson } from "../lib/api.js";
import { Card, ErrorNotice, RUPEE } from "../components/ui.jsx";

export default function Analytics() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getJson("/orders")
      .then(setOrders)
      .catch(() => setError("Could not reach the API. Is the server running on port 4000?"));
  }, []);

  const total = orders.length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const average = total ? Math.round(revenue / total) : 0;
  const customers = new Set(orders.map((o) => o.customer)).size;
  const ready = orders.filter((o) => o.status === "ready").length;
  const readyShare = total ? Math.round((ready / total) * 100) : 0;

  const stats = [
    { label: "Total orders", value: total },
    { label: "Revenue", value: RUPEE + revenue },
    { label: "Average order", value: RUPEE + average },
    { label: "Unique customers", value: customers },
    { label: "Orders ready", value: readyShare + "%" },
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

import { useEffect, useState } from "react";
import { getJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, RUPEE } from "../components/ui.jsx";

export default function Payments() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getJson("/orders")
      .then(setOrders)
      .catch(() => setError("Could not reach the API. Is the server running on port 4000?"));
  }, []);

  const received = orders
    .filter((o) => o.status === "ready")
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders
    .filter((o) => o.status !== "ready")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <ErrorNotice message={error} />
      <div className="stats">
        <Card>
          <div className="stat">
            <div className="stat-label">Received (ready orders)</div>
            <div className="stat-value">{RUPEE}{received}</div>
          </div>
        </Card>
        <Card>
          <div className="stat">
            <div className="stat-label">Pending (in progress)</div>
            <div className="stat-value">{RUPEE}{pending}</div>
          </div>
        </Card>
      </div>
      <div style={{ height: 16 }} />
      <Card>
        <table className="tbl">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Amount</th><th>Payment</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>{RUPEE}{o.total}</td>
                <td>
                  <StatusPill
                    value={o.status === "ready" ? "yes" : "preparing"}
                    label={o.status === "ready" ? "Received" : "Pending"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

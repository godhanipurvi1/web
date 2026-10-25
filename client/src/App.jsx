import { useEffect, useState } from "react";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/orders");
      setOrders(await res.json());
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function markReady(id) {
    await fetch("/api/orders/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ready" }),
    });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>BiteVerse Admin (practice)</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <table cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Order</th>
            <th align="left">Customer</th>
            <th align="left">Status</th>
            <th align="left">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={{ borderTop: "1px solid #ddd" }}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.status}</td>
              <td>{"\u20B9"}{o.total}</td>
              <td>
                {o.status !== "ready" && (
                  <button onClick={() => markReady(o.id)}>Mark ready</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

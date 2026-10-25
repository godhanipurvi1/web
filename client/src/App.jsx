import { useEffect, useState } from "react";

const RUPEE = "\u20B9";

function OrdersTab() {
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
    <>
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
              <td>{RUPEE}{o.total}</td>
              <td>
                {o.status !== "ready" && (
                  <button onClick={() => markReady(o.id)}>Mark ready</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/products");
      setProducts(await res.json());
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function toggle(product) {
    await fetch("/api/products/" + product.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !product.available }),
    });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <table cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Dish</th>
            <th align="left">Category</th>
            <th align="left">Price</th>
            <th align="left">Available</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderTop: "1px solid #ddd" }}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{RUPEE}{p.price}</td>
              <td>{p.available ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => toggle(p)}>
                  {p.available ? "Mark unavailable" : "Mark available"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("orders");

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>BiteVerse Admin (practice)</h1>
      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("orders")} disabled={tab === "orders"}>Orders</button>
        <button onClick={() => setTab("products")} disabled={tab === "products"}>Food items</button>
      </nav>
      {tab === "orders" ? <OrdersTab /> : <ProductsTab />}
    </main>
  );
}

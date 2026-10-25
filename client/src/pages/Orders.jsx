import { useEffect, useState } from "react";
import { getJson, patchJson, postJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, Button, RUPEE } from "../components/ui.jsx";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ customer: "", total: "" });

  async function load() {
    try {
      setOrders(await getJson("/orders"));
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function markReady(id) {
    try {
      await patchJson("/orders/" + id, { status: "ready" });
      load();
    } catch (err) {
      setError("Could not update the order. Are you logged in?");
    }
  }

  async function placeOrder(e) {
    e.preventDefault();
    try {
      await postJson("/orders", { customer: form.customer, total: Number(form.total) });
      setForm({ customer: "", total: "" });
      setError("");
      load();
    } catch (err) {
      setError("Could not place the order. Check the customer name and total.");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <ErrorNotice message={error} />
      <Card>
        <form className="addform" onSubmit={placeOrder}>
          <input
            placeholder="Customer name"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
          />
          <input
            placeholder="Total (?)"
            type="number"
            min="1"
            value={form.total}
            onChange={(e) => setForm({ ...form, total: e.target.value })}
          />
          <Button primary>Place order</Button>
        </form>
      </Card>
      <div style={{ height: 16 }} />
      <Card>
        <table className="tbl">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td><StatusPill value={o.status} /></td>
                <td>{RUPEE}{o.total}</td>
                <td>
                  {o.status !== "ready" && (
                    <Button onClick={() => markReady(o.id)}>Mark ready</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

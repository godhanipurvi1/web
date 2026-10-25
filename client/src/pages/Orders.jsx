import { useEffect, useState } from "react";
import { getJson, patchJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, Button, RUPEE } from "../components/ui.jsx";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setOrders(await getJson("/orders"));
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function markReady(id) {
    await patchJson("/orders/" + id, { status: "ready" });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <ErrorNotice message={error} />
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

import { useEffect, useState } from "react";
import { getJson, postJson } from "../lib/api.js";
import { Card, ErrorNotice, Button, StatusPill, RUPEE } from "../components/ui.jsx";

function Tracker() {
  const [id, setId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function track(e) {
    e.preventDefault();
    setError("");
    setOrder(null);
    try {
      setOrder(await getJson("/menu/orders/" + encodeURIComponent(id.trim())));
    } catch (err) {
      setError("No order found with that ID.");
    }
  }

  return (
    <Card>
      <form className="addform" onSubmit={track}>
        <input
          placeholder="Order ID (e.g. ORD-1792...)"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Button>Check status</Button>
      </form>
      {error && <p className="muted" style={{ padding: "0 16px 16px" }}>{error}</p>}
      {order && (
        <div className="done" style={{ textAlign: "left", paddingTop: 0 }}>
          <p>
            <strong>{order.id}</strong> for {order.customer} ?{" "}
            <StatusPill value={order.status} />
          </p>
          <p className="muted">Total: {RUPEE}{order.total}</p>
        </div>
      )}
    </Card>
  );
}

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState({});
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(null);

  useEffect(() => {
    getJson("/products")
      .then((all) => setDishes(all.filter((d) => d.available)))
      .catch(() => setError("Could not load the menu. Please try again later."));
  }, []);

  function changeQty(id, delta) {
    setCart((c) => {
      const qty = Math.max(0, (c[id] || 0) + delta);
      const next = { ...c, [id]: qty };
      if (qty === 0) delete next[id];
      return next;
    });
  }

  const lines = dishes.filter((d) => cart[d.id]);
  const total = lines.reduce((sum, d) => sum + d.price * cart[d.id], 0);

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    try {
      const order = await postJson("/menu/orders", {
        customer: name,
        items: lines.map((d) => ({ id: d.id, qty: cart[d.id] })),
      });
      setPlaced(order);
      setCart({});
    } catch (err) {
      setError("Could not place the order. Check your name and that you picked at least one dish.");
    }
  }

  if (placed) {
    return (
      <div className="menu">
        <Card>
          <div className="done">
            <h2>Thank you, {placed.customer}!</h2>
            <p className="muted">Your order ID is <strong>{placed.id}</strong>. Keep it to check your status.</p>
            <p><strong>Total: {RUPEE}{placed.total}</strong></p>
            <Button onClick={() => setPlaced(null)}>Order again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="menu">
      <h1>BiteVerse Menu</h1>
      <ErrorNotice message={error} />
      <Card>
        <table className="tbl">
          <thead>
            <tr><th>Dish</th><th>Price</th><th>Quantity</th></tr>
          </thead>
          <tbody>
            {dishes.map((d) => (
              <tr key={d.id}>
                <td>
                  {d.name}
                  <div className="muted">{d.category}</div>
                </td>
                <td>{RUPEE}{d.price}</td>
                <td>
                  <div className="qty">
                    <Button onClick={() => changeQty(d.id, -1)}>-</Button>
                    <span>{cart[d.id] || 0}</span>
                    <Button onClick={() => changeQty(d.id, 1)}>+</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div style={{ height: 16 }} />
      <Card>
        <form className="addform" onSubmit={placeOrder}>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className="muted">Total: {RUPEE}{total}</span>
          <Button primary>Place order</Button>
        </form>
      </Card>
      <h2 className="section-title">Track your order</h2>
      <Tracker />
    </div>
  );
}

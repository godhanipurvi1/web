import { useEffect, useState } from "react";
import { getJson, patchJson, postJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, Button, RUPEE } from "../components/ui.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", category: "", price: "" });

  async function load() {
    try {
      setProducts(await getJson("/products"));
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function toggle(product) {
    await patchJson("/products/" + product.id, { available: !product.available });
    load();
  }

  async function addDish(e) {
    e.preventDefault();
    try {
      await postJson("/products", {
        name: form.name,
        category: form.category,
        price: Number(form.price),
      });
      setForm({ name: "", category: "", price: "" });
      setError("");
      load();
    } catch (err) {
      setError("Could not add the dish. Check the name and price.");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <ErrorNotice message={error} />
      <Card>
        <form className="addform" onSubmit={addDish}>
          <input
            placeholder="Dish name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            min="1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Button primary>Add dish</Button>
        </form>
      </Card>
      <div style={{ height: 16 }} />
      <Card>
        <table className="tbl">
          <thead>
            <tr><th>Dish</th><th>Category</th><th>Price</th><th>Available</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{RUPEE}{p.price}</td>
                <td>
                  <StatusPill value={p.available ? "yes" : "no"} label={p.available ? "Yes" : "No"} />
                </td>
                <td>
                  <Button onClick={() => toggle(p)}>
                    {p.available ? "Mark unavailable" : "Mark available"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

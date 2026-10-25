import { useEffect, useState } from "react";
import { getJson, patchJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, Button, RUPEE } from "../components/ui.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

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

  useEffect(() => { load(); }, []);

  return (
    <>
      <ErrorNotice message={error} />
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

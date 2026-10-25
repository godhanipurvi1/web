import { useEffect, useState } from "react";
import { getJson } from "../lib/api.js";
import { Card, ErrorNotice, RUPEE } from "../components/ui.jsx";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getJson("/orders")
      .then((orders) => {
        const byName = {};
        orders.forEach((o) => {
          if (!byName[o.customer]) {
            byName[o.customer] = { name: o.customer, orders: 0, spent: 0 };
          }
          byName[o.customer].orders += 1;
          byName[o.customer].spent += o.total;
        });
        setCustomers(Object.values(byName).sort((a, b) => b.spent - a.spent));
      })
      .catch(() => setError("Could not reach the API. Is the server running on port 4000?"));
  }, []);

  return (
    <>
      <ErrorNotice message={error} />
      <Card>
        <table className="tbl">
          <thead>
            <tr><th>Customer</th><th>Orders</th><th>Total spent</th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td>{c.orders}</td>
                <td>{RUPEE}{c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

import { useEffect, useState } from "react";
import { getJson, patchJson, postJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, Button } from "../components/ui.jsx";

export default function Offers() {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ code: "", percent: "", minOrder: "" });

  async function load() {
    try {
      setCoupons(await getJson("/coupons"));
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function toggle(coupon) {
    await patchJson("/coupons/" + coupon.id, { active: !coupon.active });
    load();
  }

  async function addCoupon(e) {
    e.preventDefault();
    try {
      await postJson("/coupons", {
        code: form.code,
        percent: Number(form.percent),
        minOrder: Number(form.minOrder),
      });
      setForm({ code: "", percent: "", minOrder: "" });
      setError("");
      load();
    } catch (err) {
      setError("Could not create the coupon. Check the code, percent (1 to 100), and minimum order.");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <ErrorNotice message={error} />
      <Card>
        <form className="addform" onSubmit={addCoupon}>
          <input
            placeholder="Code (e.g. SAVE15)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            placeholder="Percent off"
            type="number"
            min="1"
            max="100"
            value={form.percent}
            onChange={(e) => setForm({ ...form, percent: e.target.value })}
          />
          <input
            placeholder="Minimum order"
            type="number"
            min="0"
            value={form.minOrder}
            onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
          />
          <Button primary>Create coupon</Button>
        </form>
      </Card>
      <div style={{ height: 16 }} />
      <Card>
        <table className="tbl">
          <thead>
            <tr><th>Code</th><th>Discount</th><th>Minimum order</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.percent}% off</td>
                <td>?{c.minOrder}</td>
                <td>
                  <StatusPill value={c.active ? "yes" : "no"} label={c.active ? "Active" : "Off"} />
                </td>
                <td>
                  <Button onClick={() => toggle(c)}>
                    {c.active ? "Turn off" : "Turn on"}
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

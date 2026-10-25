import { useEffect, useState } from "react";
import { getJson, patchJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, Button } from "../components/ui.jsx";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setReviews(await getJson("/reviews"));
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function toggle(review) {
    await patchJson("/reviews/" + review.id, { visible: !review.visible });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <ErrorNotice message={error} />
      <Card>
        <table className="tbl">
          <thead>
            <tr><th>Customer</th><th>Dish</th><th>Rating</th><th>Comment</th><th>Shown</th><th></th></tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.customer}</td>
                <td>{r.dish}</td>
                <td>{"?".repeat(r.rating)}{"?".repeat(5 - r.rating)}</td>
                <td>{r.comment}</td>
                <td>
                  <StatusPill value={r.visible ? "yes" : "no"} label={r.visible ? "Shown" : "Hidden"} />
                </td>
                <td>
                  <Button onClick={() => toggle(r)}>
                    {r.visible ? "Hide" : "Show"}
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

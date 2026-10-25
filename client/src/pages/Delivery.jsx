import { useEffect, useState } from "react";
import { getJson, patchJson } from "../lib/api.js";
import { Card, ErrorNotice, StatusPill, Button } from "../components/ui.jsx";

export default function Delivery() {
  const [riders, setRiders] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setRiders(await getJson("/riders"));
      setError("");
    } catch (err) {
      setError("Could not reach the API. Is the server running on port 4000?");
    }
  }

  async function toggle(rider) {
    await patchJson("/riders/" + rider.id, { onDuty: !rider.onDuty });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <ErrorNotice message={error} />
      <Card>
        <table className="tbl">
          <thead>
            <tr><th>Rider</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {riders.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  <StatusPill value={r.onDuty ? "yes" : "no"} label={r.onDuty ? "On duty" : "Off duty"} />
                </td>
                <td>
                  <Button onClick={() => toggle(r)}>
                    {r.onDuty ? "Take off duty" : "Put on duty"}
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

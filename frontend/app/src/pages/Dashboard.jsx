import Card from "../components/Card";
import { mockAlerts, mockStats, mockLgas, mockEWasteTypes } from "../data/mockData";
import { useState } from "react";

export default function Dashboard() {
  const [selectedLga, setSelectedLga] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Council Dashboard</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <label>
          LGA:&nbsp;
          <select value={selectedLga} onChange={(e) => setSelectedLga(e.target.value)}>
            <option>All</option>
            {mockLgas.map(lga => <option key={lga}>{lga}</option>)}
          </select>
        </label>

        <label>
          E-waste type:&nbsp;
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option>All</option>
            {mockEWasteTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>

      {/* Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Risk Map */}
        <Card title="Risk Map (placeholder)">
          <div style={{
            height: 320,
            borderRadius: 12,
            background: "#f3f3f3",
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555"
          }}>
            Map will go here (Leaflet/Mapbox).<br />
            Filters: {selectedLga} / {selectedType}
          </div>
          <p style={{ color: "#555" }}>
            Next: show LGAs/suburbs shaded by risk score, and allow drill-down into misclassification categories.
          </p>
        </Card>

        {/* Alerts */}
        <Card title="Alerts">
          <p style={{ marginTop: 0, color: "#555" }}>
            Example alerts (mock data)
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mockAlerts.map(a => (
              <div key={a.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <b>{a.type}</b>
                  <span style={{ fontSize: 12, color: "#666" }}>{a.time}</span>
                </div>
                <div style={{ fontSize: 13, color: "#444", marginTop: 6 }}>
                  <div><b>Severity:</b> {a.severity}</div>
                  <div><b>Location:</b> {a.location}</div>
                  <div>{a.message}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <Card title="Total e-waste collected">
              <div style={{ fontSize: 24 }}><b>{mockStats.ewasteCollectedTonnes}</b> tonnes</div>
              <div style={{ color: "#666" }}>Last 30 days (example)</div>
            </Card>
            <Card title="E-waste per capita">
              <div style={{ fontSize: 24 }}><b>{mockStats.ewastePerCapitaKg}</b> kg</div>
              <div style={{ color: "#666" }}>By LGA population</div>
            </Card>
            <Card title="Recovery rate">
              <div style={{ fontSize: 24 }}><b>{mockStats.recoveryRatePercent}%</b></div>
              <div style={{ color: "#666" }}>Trend line to be added</div>
            </Card>
            <Card title="LGAs above threshold">
              <div style={{ fontSize: 24 }}><b>{mockStats.lgasAboveRiskThreshold}</b></div>
              <div style={{ color: "#666" }}>Needs attention</div>
            </Card>
          </div>

          <div style={{ marginTop: 16 }}>
            <Card title="Charts (placeholder)">
              <div style={{
                height: 180,
                borderRadius: 12,
                background: "#f3f3f3",
                border: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555"
              }}>
                Time-series and bar charts will go here (Recharts).
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

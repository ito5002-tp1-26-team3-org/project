import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>E-waste Management Tool</h1>
      <p>
        A web-based tool to help councils identify e-waste risk hotspots, detect anomalies,
        and plan targeted education and disposal infrastructure.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link to="/staff" style={buttonStyle}>Council Staff Login</Link>
        <Link to="/dashboard" style={buttonStyleSecondary}>View Demo Dashboard</Link>
      </div>

      <div style={{ marginTop: 24, color: "#555" }}>
        <p><b>Prototype note:</b> This is a skeleton UI using mock data. Authentication and real datasets will be connected next.</p>
      </div>
    </div>
  );
}

const buttonStyle = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  textDecoration: "none",
  background: "#111",
  color: "white"
};

const buttonStyleSecondary = {
  ...buttonStyle,
  background: "#f3f3f3",
  color: "#111",
  border: "1px solid #ddd"
};

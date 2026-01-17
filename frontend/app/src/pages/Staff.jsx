import { Link } from "react-router-dom";

export default function Staff() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Council Staff Login</h1>
      <p>This will be connected to council authentication (Cognito) later.</p>

      <div style={{ marginTop: 16, padding: 16, border: "1px dashed #aaa", borderRadius: 12 }}>
        <p style={{ marginTop: 0 }}><b>Coming soon:</b></p>
        <ul>
          <li>Sign-in / sign-out</li>
          <li>Role-based access (staff vs residents)</li>
          <li>Audit trail for admin actions</li>
        </ul>
      </div>

      <div style={{ marginTop: 18 }}>
        <Link to="/dashboard">Go to demo dashboard →</Link>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEMO_USER = "mindy";
const DEMO_PASS = "ewaste123";

export default function Staff() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function login(e) {
    e.preventDefault();
    setErr("");

    if (username.trim().toLowerCase() === DEMO_USER && password === DEMO_PASS) {
      localStorage.setItem("council_authed", "true");
      localStorage.setItem("council_user", "Mindy Zhang");
      navigate("/dashboard");
      return;
    }
    setErr("Invalid demo credentials. Try mindy / ewaste123");
  }

  return (
    <div className="container stack">
      <div className="pageTopNav">
        <Link className="btnSecondary linkBtn" to="/">Home</Link>
      </div>

      <div className="titleRow">
        <span className="pageIcon staff" aria-hidden="true">🏛️</span>
        <h1>Council Staff Login (Demo)</h1>
      </div>

      <p className="muted">Iteration 1 uses demo login. (Cognito planned for Iteration 2+)</p>

      <div className="card">
        <form onSubmit={login} className="formGrid">
          <label className="field">
            <span className="label">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="mindy"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span className="label">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input"
              placeholder="ewaste123"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="btn">Login</button>

          {err && <div className="error">{err}</div>}
        </form>
      </div>

      <div className="muted">
        Demo credentials: <b>mindy</b> / <b>ewaste123</b>
      </div>
    </div>
  );
}

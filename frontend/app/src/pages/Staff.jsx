import { useState } from "react";
import { useNavigate } from "react-router-dom";


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
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h1>Council Staff Login (Demo)</h1>
      <p>Iteration 1 uses demo login. (Cognito planned for Iteration 2+)</p>


      <form onSubmit={login} style={{ display: "grid", gap: 10, maxWidth: 360 }}>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 10, fontSize: 16 }}
            placeholder="mindy"
          />
        </label>


        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            style={{ width: "100%", padding: 10, fontSize: 16 }}
            placeholder="ewaste123"
          />
        </label>


        <button type="submit" style={{ padding: "10px 14px" }}>Login</button>


        {err && <div style={{ color: "crimson" }}>{err}</div>}
      </form>


      <div style={{ marginTop: 16, color: "#666" }}>
        Demo credentials: <b>mindy</b> / <b>ewaste123</b>
      </div>
    </div>
  );
}
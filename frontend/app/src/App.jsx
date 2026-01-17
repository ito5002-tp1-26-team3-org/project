import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Staff from "./pages/Staff";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

function TopNav() {
  return (
    <div style={{
      borderBottom: "1px solid #eee",
      background: "white"
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link to="/" style={{ textDecoration: "none", color: "#111", fontWeight: 700 }}>
          E-waste Tool
        </Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/staff">Staff</Link>
        </div>
      </div>
    </div>
  );
}

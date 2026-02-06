import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleAuthCallback } from "../auth/authService";

export default function AuthCallback() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    // Prevent double-run in React 18 StrictMode (dev)
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const user = await handleAuthCallback();

        // Optional: route based on portal hint stored in state
        const portal = user?.state?.portal;
        if (portal === "staff") navigate("/dashboard", { replace: true });
        else navigate("/resident", { replace: true });
      } catch (e) {
        console.error("Auth callback failed:", e);
        // Go home on failure (prevents being stuck on callback)
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="container stack centerPage">
      <h1 className="noTopMargin">Signing you in…</h1>
      <p className="muted">Please wait.</p>
    </div>
  );
}

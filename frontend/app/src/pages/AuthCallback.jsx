import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleAuthCallback, getGroupsFromUser } from "../auth/authService";

export default function AuthCallback() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const user = await handleAuthCallback();
        const groups = getGroupsFromUser(user);

        if (groups.includes("Staff")) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/resident", { replace: true });
        }
      } catch (e) {
        console.error("Auth callback failed:", e);
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

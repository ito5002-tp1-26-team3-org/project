import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { isInGroup, loginWithHint, logout, signupWithHint } from "../auth/authService";

export default function Staff() {
  const { user, loading } = useAuth();

  const authed = !!user;
  const isStaff = authed && isInGroup(user, "Staff");
  const isResident = authed && isInGroup(user, "Residents");

  const displayName =
    user?.profile?.name ||
    user?.profile?.given_name ||
    user?.profile?.email ||
    "User";

  return (
    <div className="container stack">
      {/* Page header */}
      <div className="rowBetween">
        <div className="titleRow">
          <span className="pageIcon staff" aria-hidden="true">🏛️</span>
          <h1 className="noTopMargin">Council Staff Portal</h1>
        </div>

        <div className="pageTopNav">
          <Link className="btnSecondary linkBtn" to="/">Home</Link>
          {!loading && authed ? (
            <button className="btnSecondary" type="button" onClick={() => logout()}>
              Sign out
            </button>
          ) : null}
        </div>
      </div>

      <p className="muted" style={{ maxWidth: 720 }}>
        Staff access is restricted to users who register with a <b>@victoria.ca</b> email address.
      </p>

      {/* Signed out */}
      {!loading && !authed ? (
        <div className="card stack" style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="stack" style={{ gap: 6 }}>
            <h2 className="noTopMargin">Sign in</h2>
            <div className="muted">
              You will be redirected to the secure sign-in page.
            </div>
          </div>

          <div
            className="row wrap"
            style={{
              gap: 10,
              justifyContent: "center",
              marginTop: 6,
            }}
          >
            <button
              type="button"
              className="btnPrimary"
              style={{ minWidth: 200 }}
              onClick={() => loginWithHint("staff")}
            >
              Sign in
            </button>

            <button
              type="button"
              className="btnSecondary"
              style={{ minWidth: 200 }}
              onClick={() => signupWithHint("staff")}
              title="Create a staff account (victoria.ca emails only)"
            >
              Create account
            </button>

            <Link
              className="btnSecondary linkBtn"
              style={{ minWidth: 200, textAlign: "center" }}
              to="/resident"
            >
              Resident portal
            </Link>
          </div>

          <div className="panel panelAccent" style={{ marginTop: 10 }}>
            <b>Automatic role assignment</b>
            <div className="muted mt8">
              If you sign up using a <b>@victoria.ca</b> email address, your account will be automatically added to the <b>Staff</b> group.
            </div>
          </div>
        </div>
      ) : null}

      {/* Signed in as Staff */}
      {!loading && authed && isStaff ? (
        <div className="card stack" style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 className="noTopMargin">Welcome, {displayName}</h2>
          <div className="muted">
            Your account is authorised for staff access.
          </div>

          <div
            className="row wrap"
            style={{ gap: 10, justifyContent: "center", marginTop: 6 }}
          >
            <Link className="btnPrimary linkBtn" style={{ minWidth: 200 }} to="/dashboard">
              Open dashboard
            </Link>
            <button className="btnSecondary" style={{ minWidth: 200 }} type="button" onClick={() => logout()}>
              Sign out
            </button>
          </div>
        </div>
      ) : null}

      {/* Signed in but NOT Staff */}
      {!loading && authed && !isStaff ? (
        <div
          className="panel"
          style={{
            maxWidth: 640,
            margin: "0 auto",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <b>Access restricted</b>
          <div className="muted" style={{ marginTop: 6 }}>
            You are signed in as <b>{displayName}</b>, but this account is not in the <b>Staff</b> group.
            {isResident ? " This appears to be a Resident account." : ""}
          </div>

          <div
            className="row wrap mt12"
            style={{ gap: 10, justifyContent: "center" }}
          >
            <Link className="btnSecondary linkBtn" style={{ minWidth: 220, textAlign: "center" }} to="/resident">
              Go to resident portal
            </Link>
            <button className="btnPrimary" style={{ minWidth: 220 }} type="button" onClick={() => logout()}>
              Sign out and switch account
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
    <div className="container stack centerPage">
      <div className="loginHeader">
        <span className="pageIcon staff" aria-hidden="true">🏛️</span>
        <h1 className="noTopMargin">Council Staff Portal</h1>
        <div className="row wrap" style={{ gap: 8 }}>
          <Link className="btnSecondary linkBtn" to="/">Home</Link>

          {!loading && authed ? (
            <button className="btnSecondary" type="button" onClick={() => logout()}>
              Logout
            </button>
          ) : null}
        </div>
      </div>

      <p className="muted" style={{ maxWidth: 560 }}>
  Staff access is secured by AWS Cognito. Staff accounts require a <b>@victoria.ca</b> email to access the dashboard.
</p>


      {/* Signed out */}
      {!loading && !authed ? (
        <div className="card stack" style={{ maxWidth: 560 }}>
          <h2 className="noTopMargin">Staff Sign In</h2>
          <div className="muted">
            You will be redirected to the secure Cognito sign-in page.
          </div>

          <div className="row wrap" style={{ gap: 10 }}>
            <button
              type="button"
              className="btnPrimary"
              onClick={() => loginWithHint("staff")}
            >
              Sign in as Staff
            </button>

            <button
              type="button"
              className="btnSecondary"
              onClick={() => signupWithHint("staff")}
              title="Create a staff account (victoria.ca emails only)"
            >
              Create Staff account
            </button>

            <Link className="btnSecondary linkBtn" to="/resident">
              I’m a Resident
            </Link>
          </div>


          <div className="muted" style={{ marginTop: 8 }}>
            Staff accounts are determined by email domain. Use a <b>@victoria.ca</b> email when signing up.
            After you verify your email, Cognito will automatically assign you to the <b>Staff</b> group.
          </div>

        </div>
      ) : null}

      {/* Signed in as Staff */}
      {!loading && authed && isStaff ? (
        <div className="card stack" style={{ maxWidth: 560 }}>
          <h2 className="noTopMargin">Welcome, {displayName}</h2>
          <div className="muted">
            Your account is authorized for staff access.
          </div>

          <div className="row wrap" style={{ gap: 10 }}>
            <Link className="btnPrimary linkBtn" to="/dashboard">
              Go to Dashboard
            </Link>
            <button className="btnSecondary" type="button" onClick={() => logout()}>
              Logout
            </button>
          </div>
        </div>
      ) : null}

      {/* Signed in but NOT Staff */}
      {!loading && authed && !isStaff ? (
        <div className="panel" style={{ maxWidth: 560, borderLeft: "4px solid #dc2626" }}>
          <b>Access denied</b>
          <div className="muted" style={{ marginTop: 6 }}>
            You are signed in as <b>{displayName}</b>, but your account is not in the <b>Staff</b> group.
            {isResident ? " It looks like you may be a Resident account." : ""}
          </div>

          <div className="row wrap mt12" style={{ gap: 10 }}>
            <Link className="btnSecondary linkBtn" to="/resident">
              Go to Resident Portal
            </Link>
            <button className="btnPrimary" type="button" onClick={() => logout()}>
              Logout and switch account
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

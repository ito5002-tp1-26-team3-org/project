import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { isInGroup, loginWithHint, logout, signupWithHint } from "../auth/authService";
import logo from "../51009.jpg";

function PageHero({ kicker, title, subtitle, right }) {
  return (
    <div className="panel panelAccentBlue" style={{ padding: 18, borderRadius: 18 }}>
      <div className="rowBetween" style={{ gap: 14, flexWrap: "wrap" }}>
        <div>
          {kicker ? (
            <div className="kicker" style={{ letterSpacing: 1.2, textTransform: "uppercase" }}>
              {kicker}
            </div>
          ) : null}

          <h1
            className="noTopMargin"
            style={{
              marginBottom: 6,
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            {title}
          </h1>

          {subtitle ? <div className="muted">{subtitle}</div> : null}
        </div>

        {right ? <div>{right}</div> : null}
      </div>
    </div>
  );
}



function Section({ title, subtitle, children }) {
  return (
    <section className="stack sectionBlock">
      <div className="sectionTop">
        <div className="sectionTopLeft">
          <h2 className="noTopMargin" style={{ marginBottom: 4 }}>{title}</h2>
          {subtitle ? <div className="muted">{subtitle}</div> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

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
    <>
      {/* Global header (aligned with Home) */}
      <div className="headerBand">
        <div className="headerBandInner">
          <div className="headerLeft">
            <Link to="/" className="brandLink">
              <span className="brandMark" aria-hidden="true">
                <img src={logo} alt="" className="brandLogo" />
              </span>
              <span className="brandText"><h1>E-Waste Manager</h1></span>
            </Link>
            <div className="muted headerSub">
              Supporting responsible e-waste disposal and local decision-making
            </div>
          </div>

          <div className="headerRight">
            <Link className="btnSecondary linkBtn" to="/resident">Resident portal</Link>
            <Link className="btnSecondary linkBtn" to="/staff">Council staff</Link>

            {!loading && authed ? (
              <button className="btnPrimary" type="button" onClick={() => logout()}>
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <main className="container stack">

        <Section
          title="COUNCIL STAFF LOGIN"
          subtitle="Secure access for authorised staff to view the dashboard and export reporting CSVs"
        >
          <div className="panel panelCallout panelCallout-warn">
            <b>Staff access requirement</b>
            <div className="muted mt8">
              Staff access is restricted to users who register with a <b>@victoria.ca</b> email address.
            </div>
          </div>

          {/* Signed out */}
          {!loading && !authed ? (
            <div className="panel panelAccent stack" style={{ maxWidth: 760, margin: "0 auto" }}>
              {/*<div className="sectionHeader">
                <div>
                  <div className="kicker">Access</div>
                  <h3 className="noTopMargin">Sign in</h3>
                </div>
                
              </div>

              <div className="muted">
                You will be redirected to the secure sign-in page.
              </div>*/}

              <div className="row wrap mt12" style={{ gap: 10, justifyContent: "center" }}>
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

                {/*<Link className="btnSecondary linkBtn" style={{ minWidth: 200, textAlign: "center" }} to="/resident">
                  Resident portal
                </Link>*/}
              </div>

              <div className="panel panelCallout mt12">
                <b>Automatic role assignment</b>
                <div className="muted mt8">
                  Users with a verified <b>@victoria.ca</b> email address will be automatically added to the <b>Staff</b> group.
                </div>
              </div>
            </div>
          ) : null}

          {/* Signed in as Staff */}
          {!loading && authed && isStaff ? (
            <div className="panel panelAccentBlue stack" style={{ maxWidth: 760, margin: "0 auto" }}>
              <div className="sectionHeader">
                <div>
                  <div className="kicker">Welcome</div>
                  <h3 className="noTopMargin">Authorised access</h3>
                </div>
                <span className="tag">Staff</span>
              </div>

              <div className="muted">
                Signed in as <b>{displayName}</b>. Your account is authorised for staff access.
              </div>

              <div className="row wrap mt12" style={{ gap: 10, justifyContent: "center" }}>
                <Link className="btnPrimary linkBtn" style={{ minWidth: 220 }} to="/dashboard">
                  Open dashboard
                </Link>
                <button className="btnSecondary" style={{ minWidth: 220 }} type="button" onClick={() => logout()}>
                  Sign out
                </button>
              </div>
            </div>
          ) : null}

          {/* Signed in but NOT Staff */}
          {!loading && authed && !isStaff ? (
            <div className="panel panelCallout panelCallout-danger" style={{ maxWidth: 760, margin: "0 auto" }}>
              <b>Access restricted</b>
              <div className="muted mt8">
                You are signed in as <b>{displayName}</b>, but this account is not in the <b>Staff</b> group.
                {isResident ? " This appears to be a Resident account." : ""}
              </div>

              <div className="row wrap mt12" style={{ gap: 10, justifyContent: "center" }}>
                <Link className="btnSecondary linkBtn" style={{ minWidth: 240, textAlign: "center" }} to="/resident">
                  Go to resident portal
                </Link>
                <button className="btnPrimary" style={{ minWidth: 240 }} type="button" onClick={() => logout()}>
                  Sign out and switch account
                </button>
              </div>
            </div>
          ) : null}
        </Section>
      </main>
    </>
  );
}

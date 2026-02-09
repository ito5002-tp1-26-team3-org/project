import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { isInGroup, logout } from "../auth/authService";
import logo from "../51009.jpg"

function StatCard({ value, label, note, variant = "teal" }) {
  return (
    <div className={`panel statCard statCard-${variant}`}>
      <div className="statCardValue">{value}</div>

      {/* label in a dark pill */}
      <div className="statLabelPill">{label}</div>

      {note ? <div className="muted mt8">{note}</div> : null}
    </div>
  );
}


function Section({ title, subtitle, right, children, id, centerTitle = false }) {
  return (
    <section className="stack sectionBlock" id={id}>
      <div className={`sectionTop ${centerTitle ? "sectionTopCenter" : ""}`}>
        <div className="sectionTopLeft sectionTopPanel">
          <h2 className="noTopMargin" style={{ marginBottom: 4 }}>{title}</h2>
          {subtitle ? <div className="">{subtitle}</div> : null}
        </div>

        {right ? <div className="sectionTopRight">{right}</div> : null}
      </div>

      {children}
    </section>
  );
}


function Disclosure({ title, subtitle, children, defaultOpen = false }) {
  return (
    <details className="panel detailsCard" open={defaultOpen}>
      <summary className="detailsSummary">
        <div>
          <div className="detailsTitle">{title}</div>
          {subtitle ? <div className="muted">{subtitle}</div> : null}
        </div>
        <span className="chev" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="detailsBody">{children}</div>
    </details>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  const isStaff = !!user && isInGroup(user, "Staff");
  const isResident = !!user && isInGroup(user, "Residents");
  const authed = !!user;

  return (
    <>
      <a className="skipLink" href="#main">
        Skip to main content
      </a>

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
            <Link className="btnSecondary linkBtn" to="/resident">
              Resident portal
            </Link>
            <Link className="btnSecondary linkBtn" to="/staff">
              Council staff
            </Link>

            {!loading && authed ? (
              <button className="btnPrimary" type="button" onClick={() => logout()}>
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Constrained content */}
      <main id="main" className="container stack">
        {/* Hero */}
        <Section
          title="Quick access"
          subtitle="A practical service for residents and authorised local government staff"
          right={
            <div className="trustBlock">
              <div className="trustTitle">Powered by reliable data sources</div>
              <div className="trustRow" aria-label="Data sources">
                <span className="iconTag iconBlue">ABS</span>
                <span className="iconTag iconPurple">DCCEEW</span>
                <span className="iconTag iconAmber">Sustainability Victoria</span>
              </div>
            </div>
          }
        >
          <div className="hero stack">
            {/*<p className="muted" style={{ maxWidth: 920 }}>
              Residents can use this portal to access disposal guidance and drop-off information, council staff can or view
              local indicators and export data for reporting.
            </p>*/}

            <div className="heroActions">
              {/* Show a single “continue” action when signed in */}
              {!loading && authed ? (
                <>
                  {isStaff ? (
                    <Link className="btnPrimary linkBtn" to="/dashboard">
                      Open dashboard
                    </Link>
                  ) : isResident ? (
                    <Link className="btnPrimary linkBtn" to="/resident">
                      Open resident portal
                    </Link>
                  ) : (
                    <Link className="btnPrimary linkBtn" to="/resident">
                      Continue
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link className="btnPrimary linkBtn" to="/resident">
                    Resident portal
                  </Link>
                  <Link className="btnSecondary linkBtn" to="/staff">
                    Council staff
                  </Link>
                </>
              )}
            </div>

            {!loading && authed && !isStaff && !isResident ? (
              <div className="panel panelCallout panelCallout-warn">
                <b>Account not assigned</b>
                <div className="muted mt8">
                  Your account is signed in, but it is not assigned to <b>Staff</b> or <b>Residents</b>. Contact an administrator
                  to update access.
                </div>
              </div>
            ) : null}
          </div>
        </Section>

        {/* Start / Journey */}
        <Section id="start" title="Where to start" subtitle="Select the pathway that matches your role">
          <div className="gridFeature">
            <div className="panel panelAccentBlue stack">
              <div className="statKicker">
                <span className="roleIcon roleIconResident" aria-hidden="true">👨‍👩‍👧‍👦</span>
                Residents
              </div>
              <h3 className="noTopMargin">Find drop-off options and disposal guidance</h3>
              <div className="muted">
                Use the suburb finder, review disposal guides, and sign in to access incentives and vouchers.
              </div>
              <div className="row wrap mt12">
                <Link className="btnPrimary linkBtn" to="/resident">
                  Resident portal
                </Link>

              </div>
            </div>

            <div className="panel panelAccentAmber stack">
              <div className="statKicker">
                <span className="roleIcon roleIconStaff" aria-hidden="true">🏛️</span>
                Council staff
              </div>
              <h3 className="noTopMargin">Monitor indicators and export reports</h3>
              <div className="muted">
                View ranked LGAs, map risk categories, review trends over time, and download CSVs for reporting.
              </div>
              <div className="row wrap mt12">
                <Link className="btnPrimary linkBtn" to="/staff">
                  Staff portal
                </Link>
              </div>
            </div>
          </div>
        </Section>

        {/* Key indicators */}
        <Section title="Environmental Impact" subtitle="Together, we're making a real difference">
          <div className="gridCardsWide">
            <StatCard
              variant="rose"
              value="42.5 Tonnes"
              label="E-waste Diverted from Landfill"
            />
            <StatCard
              variant="blue"
              value="180,000 kg"
              label="CO₂ Emissions Prevented"
            />
            <StatCard
              variant="amber"
              value="98%"
              label="Material Recovery Rate"
            />
          </div>
        </Section>

        {/* Guidance */}
        
        <Section id="guidance" title="Guidance" subtitle="Expand sections for more details">
          <div className="stack">
            <div id="resident-sections" className="scrollAnchor" />
            <Disclosure title="How the platform works" subtitle="Simple steps for residents and councils.">
              <ol className="stack">
                <li>
                  <b>Learn</b> — disposal guidance, accepted items, safe handling tips.
                </li>
                <li>
                  <b>Dispose</b> — locate drop-off options using the suburb finder.
                </li>
                <li>
                  <b>Improve</b> — councils use the dashboard to identify higher-risk areas and track changes over time.
                </li>
              </ol>

              <div className="row wrap mt12">
                <Link className="btnPrimary linkBtn" to="/resident">
                  Find drop-off options
                </Link>
                <Link className="btnSecondary linkBtn" to="/staff">
                  Council staff
                </Link>
              </div>
            </Disclosure>

            <Disclosure title="What counts as e-waste" subtitle="Common examples and safe handling notes.">
              <ul className="stack">
                <li>Phones, tablets, laptops, computers, and peripherals.</li>
                <li>Chargers, cables, small electronics and accessories.</li>
                <li>Batteries and battery-powered devices (follow battery safety guidance).</li>
                <li>Large items such as TVs, printers, and audio equipment.</li>
              </ul>
              <div className="muted mt8">For item-specific steps, use the disposal guides in the resident portal.</div>
            </Disclosure>
          </div>
        </Section>

        {/* Method */}
        <Section id="method" title="Definitions and methodology" subtitle="Expand sections for more details">
          <div className="stack">
            <Disclosure title="Risk score definition" subtitle="Used to support prioritisation and reporting.">
              <div className="panel panelAccent">
                <div>
                  <b>Definition</b>
                </div>
                <div className="muted mt8">
                  <b>Risk score</b> is the percentage of kerbside recycling that was <b>collected</b> but <b>not recycled</b> for a given council area and year.
                </div>
                <div className="muted mt12">
                  <b>Formula:</b> Risk (%) = (1 − Recovery rate) × 100, where Recovery rate = Recycled ÷ Collected.
                </div>
                <div className="muted mt12">
                  This is an indicator designed for planning and prioritisation. It is not a direct measurement of illegal dumping or household non-compliance.
                </div>
              </div>
            </Disclosure>

            <Disclosure title="National data note" subtitle="Context indicators referenced on this page.">
              <div className="panel panelAccent">
                <h3 className="noTopMargin">Sources</h3>
                <p className="noTopMargin">
                  ABS Waste Account Australia (Experimental Estimates) and National Waste and Resource Recovery Report (DCCEEW).
                </p>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Figures are included for national context. Local outcomes vary by council, waste stream, and collection model.
                </p>
              </div>
            </Disclosure>
          </div>
        </Section>
      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="panel footerPanel">
            <div className="footerGrid">
              <div>
                <b>♻️E-Waste Manager</b>
                <div className="muted">
                  A practical tool for responsible disposal and data-informed local decision-making.
                </div>
              </div>

              <div>
                <b>Quick Links</b>
                <ul className="footerList">
                  <li><a href="#start">Start here</a></li>
                  <li><Link to="/resident">Resident portal</Link></li>
                  <li><Link to="/staff">Council staff portal</Link></li>
                  <li><a href="#method">Risk score definition</a></li>
                </ul>
              </div>

              <div>
                <b>Resources</b>
                <ul className="footerList">
                  <li><Link to="/resident">Disposal guides</Link></li>
                  <li><Link to="/resident">Drop-off finder</Link></li>
                </ul>
              </div>

              <div>
                <b>Contact</b>
                <div>info@ecowaste.gov</div>
                <div>(555) 123-4567</div>
                <div>123 Green Street</div>
                <div>City, State 12345</div>
              </div>
            </div>

            <div className="footerBottom muted">
              © 2026 E-Waste Manager. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      <button
          type="button"
          className="scrollCue"
          aria-label="Scroll for more"
          title="Scroll for more"
          onClick={() =>
            document
              .getElementById("resident-sections")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <span className="scrollCueText">🙋‍♀️ Get Help</span>
          <span className="scrollCueIcon" aria-hidden="true">↓</span>
        </button>

    </>
  );
}

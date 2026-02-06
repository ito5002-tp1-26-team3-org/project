import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { isInGroup, logout } from "../auth/authService";


function StatCard({ value, label, note, variant = "teal" }) {
  return (
    <div className={`panel statCard statCard-${variant}`}>
      <div style={{ fontSize: 20, fontWeight: "bold" }}>{value}</div>
      <div>{label}</div>
      {note ? <div className="muted mt8">{note}</div> : null}
    </div>
  );
}

function Section({ title, subtitle, children, id }) {
  return (
    <section className="stack sectionBlock" id={id}>
      <div>
        <h2 className="noTopMargin" style={{ marginBottom: 4 }}>{title}</h2>
        {subtitle ? <div className="muted">{subtitle}</div> : null}
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
        <span className="chev" aria-hidden="true">▾</span>
      </summary>
      <div className="detailsBody">{children}</div>
    </details>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  const isStaff = !!user && isInGroup(user, "Staff");
  const isResident = !!user && isInGroup(user, "Residents");

  return (
    <div className="container stack">
      {/* Sticky header band (you already have CSS for this) */}
      <div className="headerBand">
        <div className="headerBandInner">
          <div className="headerLeft">
            <Link to="/" className="brandLink">
              <span className="brandMark" aria-hidden="true">♻️</span>
              <span className="brandText">E-Waste Manager</span>
            </Link>
            <div className="muted headerSub">Supporting responsible e-waste disposal and local decision-making</div>
          </div>

          <div className="headerRight">
            <Link className="btnSecondary linkBtn" to="/resident">Resident portal</Link>
            <Link className="btnSecondary linkBtn" to="/staff">Council staff</Link>

            {!loading && user ? (
              <button className="btnPrimary" type="button" onClick={() => logout()}>
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Hero */}
      <Section
        title="E-waste disposal and council reporting portal"
        subtitle="A practical service for residents and local government staff."
      >
        <div className="hero stack">
          <p className="muted" style={{ maxWidth: 920 }}>
            Use this portal to access disposal guidance and drop-off information, or (for authorised council staff) view
            local indicators and export data for reporting. This service is designed to support safe handling and informed
            decision-making.
          </p>

          <div className="trustRow">
            <span className="iconTag iconBlue">ABS</span>
            <span className="iconTag iconPurple">DCCEEW</span>
            <span className="iconTag iconAmber">Sustainability Victoria</span>
          </div>

          <div className="heroActions">
            <Link className="btnPrimary linkBtn" to="/resident">Resident portal</Link>
            <Link className="btnSecondary linkBtn" to="/staff">Council staff</Link>

            {!loading && user && isStaff ? (
              <Link className="btnPrimary linkBtn" to="/dashboard">Open dashboard</Link>
            ) : null}
            {!loading && user && isResident ? (
              <Link className="btnPrimary linkBtn" to="/resident">Open resident portal</Link>
            ) : null}
          </div>

          {!loading && user && !isStaff && !isResident ? (
            <div className="panel panelCallout panelCallout-warn">
              <b>Account not assigned</b>
              <div className="muted mt8">
                Your account is signed in, but it is not assigned to <b>Staff</b> or <b>Residents</b>. Contact an administrator
                to update your access.
              </div>
            </div>
          ) : null}
        </div>
      </Section>


      {/* Start / Journey */}
      <Section id="start" title="Start here" subtitle="Choose the pathway that matches your role.">
        <div className="gridFeature">
          <div className="panel panelAccentBlue stack">
            <div className="statKicker">👨‍👩‍👧‍👦 Residents</div>
            <h3 className="noTopMargin">Find drop-off options and disposal guidance</h3>
            <div className="muted">
              Use the suburb finder, read disposal guides, and sign in to access incentives and vouchers.
            </div>
            <div className="row wrap mt12">
              <Link className="btnPrimary linkBtn" to="/resident">Resident portal</Link>
              <a className="btnSecondary linkBtn" href="#guidance">Read guidance</a>
            </div>
          </div>

          <div className="panel panelAccentAmber stack">
            <div className="statKicker">👩🏻‍💼 Council staff</div>
            <h3 className="noTopMargin">Monitor risk indicators and export reports</h3>
            <div className="muted">
              View ranked LGAs, map risk categories, review trends over time, and download CSVs for reporting.
            </div>
            <div className="row wrap mt12">
              <Link className="btnPrimary linkBtn" to="/staff">Staff portal</Link>
              <a className="btnSecondary linkBtn" href="#method">Risk score definition</a>
            </div>
          </div>
        </div>
      </Section>

      {/* Keep stats restrained */}
      <Section title="Key indicators" subtitle="">
        <div className="gridCardsWide">
          <StatCard variant="rose" value="500,000" label="Tonnes of e-waste annually (AU)" note="National context indicator." />
          <StatCard variant="blue" value="~50%" label="Estimated recycling rate (AU)" note="High-level indicator used in national reporting." />
          <StatCard variant="amber" value="Risk score" label="Proxy for missed recycling" note="% collected but not recycled." />
        </div>
      </Section>

      {/* Progressive disclosure instead of big blocks */}
      <Section id="guidance" title="Guidance" subtitle="Expand only what you need.">
        <div className="stack">
          <Disclosure
            title="How the platform works"
            subtitle="Simple steps for residents and councils."
            defaultOpen
          >
            <ol className="stack">
              <li><b>Learn</b> — disposal guidance, accepted items, safe handling tips.</li>
              <li><b>Dispose</b> — locate drop-off options using the suburb finder.</li>
              <li><b>Improve</b> — councils use the dashboard to identify higher-risk areas and track changes over time.</li>
            </ol>

            <div className="row wrap mt12">
              <Link className="btnPrimary linkBtn" to="/resident">Find drop-off options</Link>
              <Link className="btnSecondary linkBtn" to="/staff">Council dashboard</Link>
            </div>
          </Disclosure>

          <Disclosure
            title="What counts as e-waste"
            subtitle="Common examples and handling guidance."
          >
            <ul className="stack">
              <li>Phones, tablets, laptops, computers, and peripherals.</li>
              <li>Chargers, cables, small electronics and accessories.</li>
              <li>Batteries and battery-powered devices (follow battery safety guidance).</li>
              <li>Large items such as TVs, printers, and audio equipment.</li>
            </ul>
            <div className="muted mt8">
              For item-specific steps, use the disposal guides in the resident portal.
            </div>
          </Disclosure>
        </div>
      </Section>

      <Section id="method" title="Definitions and methodology" subtitle="Dashboard indicators and how they are derived.">
        <div className="stack">
          <Disclosure
            title="Risk score definition"
            subtitle="Used to support prioritisation and reporting."
            defaultOpen
          >
            <div className="panel panelAccent">
              <div><b>Definition</b></div>
              <div className="muted mt8">
                <b>Risk score</b> is the percentage of kerbside recycling that was <b>collected</b> but <b>not recycled</b> for a given council area and year.
              </div>
              <div className="muted mt12">
                <b>Formula:</b> Risk (%) = (1 − Recovery rate) × 100, where Recovery rate = Recycled ÷ Collected.
              </div>
              <div className="muted mt12">
                This is an indicator designed for planning and prioritisation. It is not a direct measurement of illegal dumping
                or household non-compliance.
              </div>
            </div>
          </Disclosure>

          <Disclosure
            title="National data note"
            subtitle="Context indicators used in the home page."
          >
            <div className="panel panelAccent">
              <h3 className="noTopMargin">Sources</h3>
              <p className="noTopMargin">
                <b>Sources:</b> ABS Waste Account Australia (Experimental Estimates) and National Waste and Resource Recovery Report (DCCEEW).
              </p>
              <p className="muted" style={{ marginBottom: 0 }}>
                Figures are included for national context. Local outcomes vary by council, waste stream, and collection model.
              </p>
            </div>
          </Disclosure>
        </div>
      </Section>

      <footer className="footer">
        <div className="footerGrid">
          <div>
            <b>E-Waste Manager</b>
            <div className="muted">A practical tool for responsible disposal and data-informed local decision-making.</div>
          </div>

          <div>
            <b>Quick Links</b>
            <ul className="stack">
              <li><a href="#start">Start here</a></li>
              <li><Link to="/resident">Resident portal</Link></li>
              <li><Link to="/staff">Council staff portal</Link></li>
              <li><a href="#method">Risk score definition</a></li>
            </ul>
          </div>

          <div>
            <b>Resources</b>
            <ul className="stack">
              <li><Link to="/resident">Disposal guides</Link></li>
              <li><Link to="/resident">Drop-off finder</Link></li>
            </ul>
          </div>

          <div>
            <b>Contact</b>
            <div>Service desk: info@ecowaste.gov</div>
            <div>(555) 123-4567</div>
            <div>123 Green Street</div>
            <div>City, State 12345</div>
          </div>
        </div>

        <div className="muted">© 2026 E-Waste Manager. All rights reserved.</div>
      </footer>
    </div>
  );
}

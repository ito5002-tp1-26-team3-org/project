import { Link } from "react-router-dom";

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

export default function Home() {
  return (
    <div className="container stack">
      <header className="rowBetween">
        <div className="titleRow">
          <span className="pageIcon home" aria-hidden="true">♻️</span>
          <h1 className="noTopMargin">E-Waste Manager</h1>
        </div>

        <div className="row">
          <Link to="/resident">Resident</Link>
          <span aria-hidden="true">|</span>
          <Link to="/dashboard">Council Staff</Link>
        </div>
      </header>

      <Section
        title="Sustainable E-Waste Management"
        subtitle="Building a Greener Future Through Smart Recycling"
      >
        <div className="hero stack">
          <p className="muted">
            Join residents and businesses in a community-driven initiative to properly manage electronic waste and
            create a sustainable future.
          </p>

          <div className="row wrap">
            <Link className="btnPrimary linkBtn" to="/resident">For Residents</Link>
            <Link className="btnSecondary linkBtn" to="/dashboard">For Staff</Link>
            <a className="btnSecondary linkBtn" href="#learn-more">Learn More</a>
          </div>
        </div>
      </Section>

      <Section title="Our Impact" subtitle="Real-time statistics across our LGA">
        <div className="gridCards">
          <StatCard variant= "rose" value="95,420" label="Items Recycled This Year" />
          <StatCard variant="blue" value="12,450" label="Active Participants" />
          <StatCard variant="purple" value="20" label="Drop-off Points" />
          <StatCard variant="amber" value="85%" label="Proper Classification Rate" />
        </div>
      </Section>

      <Section
        title="National E-Waste Statistics"
        subtitle="Verified data from Australian Bureau of Statistics & National Waste Report 2024 (DCCEEW)"
      >
        <div className="gridCardsWide">
          <StatCard
            value="500,000"
            label="Tonnes of E-Waste Generated Annually"
            note="Australia produces 500,000 tonnes of electronic waste every year."
          />
          <StatCard
            value="~50%"
            label="E-Waste Recycling Rate"
            note="Only about half of all e-waste is currently recycled (26.6% for hazardous waste)."
          />
          <StatCard
            value="75.8M"
            label="Total Waste Generated (2018–19)"
            note="Million tonnes of solid waste — 10% increase over two years."
          />
          <StatCard
            value="16.3%"
            label="Household Waste Contribution"
            note="Households contribute 12.4 million tonnes of Australia’s total waste."
          />
          <StatCard
            value="47%"
            label="Household Plastics Waste"
            note="Households are the largest contributor to plastic waste streams."
          />
          <StatCard
            value="42%"
            label="Household Organics Waste"
            note="Households contribute 42% of organic waste streams."
          />
        </div>

        <div className="panel">
          <h3 className="noTopMargin">⚠️ Data Source & Technical Note</h3>
          <p className="noTopMargin">
            <b>Sources:</b> ABS Waste Account Australia (Experimental Estimates) & National Waste and Resource Recovery
            Report 2024 (DCCEEW)
          </p>
          <p className="muted" style={{ marginBottom: 0 }}>
            <b>Note:</b> The ~50% e-waste recycling rate is a high-level policy estimate used in national waste reports.
            ABS experimental data shows hazardous waste (which includes e-waste components) had a recovery rate of 26.6%
            in 2018–19. Households are major contributors to difficult waste streams, making education and incentives
            important for improving outcomes.
          </p>
        </div>
      </Section>

      <Section id="learn-more" title="How It Works" subtitle="Simple steps to make a big difference">
        <ul className="stack">
          <li>
            <b>1️⃣ Register & Learn</b> — Access guides on how to properly sort and dispose of different types of e-waste.
          </li>
          <li>
            <b>2️⃣ Recycle & Track</b> — Drop off e-waste at collection points and track your impact.
          </li>
          <li>
            <b>3️⃣ Earn Rewards</b> — Get $0.10 credit per item recycled, redeem vouchers, and access partner deals.
          </li>
        </ul>
      </Section>

      <Section title="Platform Features" subtitle="Everything you need for effective e-waste management">
        <div className="gridFeature">
          <div className="panel">
            <h3 className="noTopMargin">👤 For Residents</h3>
            <ul className="stack">
              <li><b>Comprehensive Disposal Guides</b> — preparation tips, accepted items, drop-off locations</li>
              <li><b>Earn Incentives</b> — $0.10 credit per item recycled</li>
              <li><b>Partner Deals</b> — discounts from authorised partners</li>
              <li><b>Education & Impact Tracking</b> — learn and track contributions</li>
            </ul>
          </div>

          <div className="panel">
            <h3 className="noTopMargin">🏛️ For Council Staff</h3>
            <ul className="stack">
              <li><b>Interactive Risk Mapping</b> — filter and identify high-risk areas</li>
              <li><b>Underserved Area Analysis</b> — disposal sites vs population</li>
              <li><b>Time-based Trend Analysis</b> — track changes over time</li>
              <li><b>Alert System</b> — notify when thresholds/anomalies occur (Iteration 2)</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Our Local Impact" subtitle="Together, we’re contributing to Australia’s recycling goals">
        <div className="gridCardsWide">
          <StatCard
            variant="blue"
            value="42.5 Tonnes"
            label="E-waste diverted from landfill this year"
            note="Part of Australia’s 500,000 tonne annual challenge."
          />
          <StatCard
            variant="purple"
            value="180,000 kg"
            label="CO₂ emissions prevented"
            note="Through proper recycling processes."
          />
          <StatCard
            variant="amber"
            value="85%"
            label="Local material recovery rate"
            note="Exceeding the national average of ~50%."
          />
        </div>
      </Section>

      <footer className="footer">
        <div className="footerGrid">
          <div>
            <b>E-Waste Manager</b>
            <div className="muted">Building sustainable communities through smart e-waste management.</div>
          </div>

          <div>
            <b>Quick Links</b>
            <ul className="stack">
              <li><a href="#learn-more">How It Works</a></li>
              <li><Link to="/resident">Collection Points</Link></li>
              <li><Link to="/dashboard">Council Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <b>Resources</b>
            <ul className="stack">
              <li><Link to="/resident">Disposal Guides</Link></li>
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

        <div className="muted">© 2026 E-Waste Manager. All rights reserved.</div>
      </footer>
    </div>
  );
}

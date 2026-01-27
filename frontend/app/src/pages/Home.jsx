import { Link } from "react-router-dom";

function StatCard({ value, label, note }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 12 }}>
      <div style={{ fontSize: 20, fontWeight: "bold" }}>{value}</div>
      <div>{label}</div>
      {note ? <div style={{ color: "#555", marginTop: 6 }}>{note}</div> : null}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 4 }}>{title}</h2>
      {subtitle ? <div style={{ color: "#555", marginBottom: 12 }}>{subtitle}</div> : null}
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>E-Waste Manager</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/resident">Resident</Link>
          <span>|</span>
          <Link to="/staff">Council Staff</Link>
        </div>
      </header>

      {/* Hero */}
      <Section
        title="Sustainable E-Waste Management"
        subtitle="Building a Greener Future Through Smart Recycling"
      >
        <p>
          Join residents and businesses in a community-driven initiative to properly manage electronic waste and
          create a sustainable future.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/resident">Get Started (Resident)</Link>
          <Link to="/staff">Get Started (Council Staff)</Link>
          <a href="#learn-more">Learn More</a>
        </div>
      </Section>

      {/* Our Impact */}
      <Section title="Our Impact" subtitle="Real-time statistics across our LGA">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <StatCard value="95,420" label="Items Recycled This Year" />
          <StatCard value="12,450" label="Active Participants" />
          <StatCard value="20" label="Drop-off Points" />
          <StatCard value="85%" label="Proper Classification Rate" />
        </div>
      </Section>

      {/* National Stats */}
      <Section
        title="National E-Waste Statistics"
        subtitle="Verified data from Australian Bureau of Statistics & National Waste Report 2024 (DCCEEW)"
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
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

        <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 12 }}>
          <h3 style={{ marginTop: 0 }}>Data Source & Technical Note</h3>
          <p style={{ marginTop: 0 }}>
            <b>Sources:</b> ABS Waste Account Australia (Experimental Estimates) & National Waste and Resource Recovery
            Report 2024 (DCCEEW)
          </p>
          <p style={{ marginBottom: 0 }}>
            <b>Note:</b> The ~50% e-waste recycling rate is a high-level policy estimate used in national waste reports.
            ABS experimental data shows hazardous waste (which includes e-waste components) had a recovery rate of 26.6%
            in 2018–19. Households are major contributors to difficult waste streams, making education and incentives
            important for improving outcomes.
          </p>
        </div>
      </Section>

      {/* How it works */}
      <Section title="How It Works" subtitle="Simple steps to make a big difference">
        <ol id="learn-more">
          <li>
            <b>Register & Learn</b> — Access guides on how to properly sort and dispose of different types of e-waste.
          </li>
          <li>
            <b>Recycle & Track</b> — Drop off e-waste at collection points and track your impact.
          </li>
          <li>
            <b>Earn Rewards</b> — Get $0.10 credit per item recycled, redeem vouchers, and access partner deals.
          </li>
        </ol>
      </Section>

      {/* Platform Features */}
      <Section title="Platform Features" subtitle="Everything you need for effective e-waste management">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #ddd", padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>For Residents</h3>
            <ul>
              <li><b>Comprehensive Disposal Guides</b> — preparation tips, accepted items, drop-off locations</li>
              <li><b>Earn Incentives</b> — $0.10 credit per item recycled</li>
              <li><b>Partner Deals</b> — discounts from authorised partners</li>
              <li><b>Education & Impact Tracking</b> — learn and track contributions</li>
            </ul>
          </div>

          <div style={{ border: "1px solid #ddd", padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>For Council Staff</h3>
            <ul>
              <li><b>Interactive Risk Mapping</b> — filter and identify high-risk areas</li>
              <li><b>Underserved Area Analysis</b> — disposal sites vs population</li>
              <li><b>Time-based Trend Analysis</b> — track changes over time</li>
              <li><b>Alert System</b> — notify when thresholds/anomalies occur (Iteration 2)</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Local Impact */}
      <Section title="Our Local Impact" subtitle="Together, we’re contributing to Australia’s recycling goals">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <StatCard
            value="42.5 Tonnes"
            label="E-waste diverted from landfill this year"
            note="Part of Australia’s 500,000 tonne annual challenge."
          />
          <StatCard
            value="180,000 kg"
            label="CO₂ emissions prevented"
            note="Through proper recycling processes."
          />
          <StatCard
            value="85%"
            label="Local material recovery rate"
            note="Exceeding the national average of ~50%."
          />
        </div>
      </Section>

      {/* Footer */}
      <footer style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #ddd" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <div>
            <b>E-Waste Manager</b>
            <div style={{ color: "#555" }}>Building sustainable communities through smart e-waste management.</div>
          </div>

          <div>
            <b>Quick Links</b>
            <ul>
              <li><a href="#learn-more">How It Works</a></li>
              <li><Link to="/resident">Collection Points</Link></li>
              <li><Link to="/dashboard">Council Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <b>Resources</b>
            <ul>
              <li><Link to="/resident">Disposal Guides</Link></li>
              {/*<li><a href="#national">Reports</a></li>*/}
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

        <div style={{ marginTop: 12, color: "#666" }}>© 2026 E-Waste Manager. All rights reserved.</div>
      </footer>
    </div>
  );
}
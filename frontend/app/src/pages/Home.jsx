import { useState } from "react";
import RoleModal from "../components/RoleModal";
import Callout from "../components/Callout";
import StepCard from "../components/StepCard";
import FeatureBox from "../components/FeatureBox";
import ImpactItem from "../components/ImpactItem";



export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <header className="header">
        <div className="container headerInner">
          <div className="brand">E-Waste Manager</div>
          <button className="btn btnPrimary" onClick={() => setOpen(true)}>Login</button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container">
            <div className="kicker">Sustainable E-Waste Management</div>
            <h1 className="title">Building a Greener Future Through Smart Recycling</h1>
            <p className="subtitle">
              Join thousands of residents and businesses in our community-driven initiative to properly manage
              electronic waste and create a sustainable future.
            </p>

            <div className="heroActions">
              <button className="btn btnPrimary" onClick={() => setOpen(true)}>Get Started</button>
              <a className="btn btnGhost" href="#impact" style={{ textDecoration: "none" }}>Learn More</a>
            </div>
          </div>
        </section>

        <hr className="sep" />

        {/* OUR IMPACT */}
        <section className="section" id="impact">
          <div className="container">
            <h2 className="sectionTitle">Our Impact</h2>
            <div className="sectionSub">Real-time statistics across our LGA</div>

            <div className="grid4">
              <StatCard value="95,420" label="Items recycled this year" />
              <StatCard value="12,450" label="Active participants" />
              <StatCard value="20" label="Drop-off points" />
              <StatCard value="85%" label="Proper classification rate" />
            </div>
          </div>
        </section>

        {/* NATIONAL STATS */}
        <section className="section" id="national-stats">
          <div className="container">
            <div className="kicker">Official ABS & DCCEEW Data</div>
            <h2 className="sectionTitle">National E-Waste Statistics</h2>
            <div className="sectionSub">
              Verified data from the Australian Bureau of Statistics & National Waste Report 2024
            </div>

            <div className="grid6">
              <StatCard
                value="500,000"
                label="Tonnes of e-waste generated annually"
                note="Australia produces 500,000 tonnes of electronic waste every year."
              />
              <StatCard
                value="~50%"
                label="E-waste recycling rate"
                note="Only about half of all e-waste is currently recycled (26.6% for hazardous waste)."
              />
              <StatCard
                value="75.8M"
                label="Total waste generated (2018–19)"
                note="Million tonnes of solid waste — 10% increase over two years."
              />
              <StatCard
                value="16.3%"
                label="Household waste contribution"
                note="Households contribute 12.4 million tonnes of Australia’s total waste."
              />
              <StatCard
                value="47%"
                label="Household plastics waste"
                note="Households are the largest contributor to plastic waste streams."
              />
              <StatCard
                value="42%"
                label="Household organics waste"
                note="Households contribute 42% of organic waste streams."
              />
            </div>
            <Callout title="Data Source & Technical Note">
              <div>
                <b>Sources:</b> Australian Bureau of Statistics (ABS) Waste Account Australia Experimental Estimates
                &amp; National Waste and Resource Recovery Report 2024 (DCCEEW)
              </div>
              <div style={{ marginTop: 8 }}>
                <b>Note:</b> The ~50% e-waste recycling rate is a high-level policy estimate used in national waste reports.
                The ABS experimental data shows hazardous waste (which includes e-waste components) had a recovery rate of
                26.6% in 2018–19. Households are identified as major contributors to difficult waste streams, making resident
                education and incentive programs critical for improving these rates.
              </div>
            </Callout>
          </div>
        </section>
        
        {/* HOW IT WORKS */}
        <section className="section" id="how-it-works">
          <div className="container">
            <h2 className="sectionTitle">How It Works</h2>
            <div className="sectionSub">Simple steps to make a big difference</div>

            <div className="stepsGrid">
              <StepCard number="1" title="Register & Learn">
                Sign up and access comprehensive guides on how to properly sort and dispose
                of different types of e-waste.
              </StepCard>

              <StepCard number="2" title="Recycle & Track">
                Drop off your e-waste at designated collection points and track your recycling
                history and impact.
              </StepCard>

              <StepCard number="3" title="Earn Rewards">
                Get $0.10 credit per item recycled, redeem vouchers, and access exclusive partner deals.
              </StepCard>
            </div>
          </div>
        </section>
        
        {/* PLATFORM FEATURES */}
        <section className="section" id="features">
          <div className="container">
            <h2 className="sectionTitle">Platform Features</h2>
            <div className="sectionSub">Everything you need for effective e-waste management</div>

            <div className="featuresGrid">
              <FeatureBox
                title="For residents"
                items={[
                  {
                    icon: "🗺️",
                    heading: "Comprehensive Disposal Guides",
                    desc: "Step-by-step instructions with preparation tips, accepted items, and drop-off locations."
                  },
                  {
                    icon: "💰",
                    heading: "Earn Incentives",
                    desc: "$0.10 credit per item recycled, redeemable for vouchers and services."
                  },
                  {
                    icon: "🤝",
                    heading: "Partner Deals",
                    desc: "Exclusive discounts from authorized recycling partners."
                  },
                  {
                    icon: "🌱",
                    heading: "Education & Impact Tracking",
                    desc: "Learn environmental impacts and monitor your contribution."
                  }
                ]}
              />

              <FeatureBox
                title="For Council Staff"
                items={[
                  {
                    icon: "🧭",
                    heading: "Interactive Risk Mapping",
                    desc: "Filter by e-waste type, view trends, and identify high-risk suburbs."
                  },
                  {
                    icon: "📍",
                    heading: "Underserved Area Analysis",
                    desc: "Identify LGAs needing more drop-off locations based on population ratios."
                  },
                  {
                    icon: "📈",
                    heading: "Time-based Trend Analysis",
                    desc: "Track misclassification rates over 6 months for each suburb."
                  },
                  {
                    icon: "🚨",
                    heading: "Alert System",
                    desc: "Automated notifications for service gaps and anomalies."
                  }
                ]}
              />
            </div>
          </div>
        </section>
        
        {/* OUR LOCAL IMPACT (GRADIENT BAND) */}
        <section className="impactBand" id="local-impact">
          <div className="container">
            <h2 className="impactTitle">Our Local Impact</h2>
            <div className="impactSub">
              Together, we&apos;re contributing to Australia&apos;s recycling goals
            </div>

            <div className="impactGrid">
              <ImpactItem
                value="42.5 Tonnes"
                label="E-waste diverted from landfill this year"
                note="Part of Australia’s 500,000 tonne annual challenge"
              />
              <ImpactItem
                value="180,000 kg"
                label="CO₂ emissions prevented"
                note="Through proper recycling processes"
              />
              <ImpactItem
                value="85%"
                label="Local material recovery rate"
                note="Exceeding the national average of ~50%"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ctaSection">
          <div className="container">
            <h2 className="ctaTitle">Ready to Make a Difference?</h2>
            <div className="ctaSub">
              Join our community today and start your journey towards sustainable e-waste management.
            </div>

            <div className="ctaActions">
              <button className="btn btnPrimary" onClick={() => setOpen(true)}>
                Get Started Now →
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container">
            <div className="footerGrid">
              <div>
                <div className="footerTitle">E-Waste Manager</div>
                <div className="footerText">
                  Building sustainable communities through smart e-waste management.
                </div>
              </div>

              <div>
                <div className="footerTitle">Quick links</div>
                <ul className="footerList">
                  <li><a className="footerLink" href="#features">About Us</a></li>
                  <li><a className="footerLink" href="#how-it-works">How It Works</a></li>
                  <li><a className="footerLink" href="#impact">Collection Points</a></li>
                  <li><a className="footerLink" href="#national-stats">FAQs</a></li>
                </ul>
              </div>

              <div>
                <div className="footerTitle">Resources</div>
                <ul className="footerList">
                  <li><a className="footerLink" href="#features">Disposal Guides</a></li>
                  <li><a className="footerLink" href="#features">Partner Directory</a></li>
                  <li><a className="footerLink" href="#features">Education Materials</a></li>
                  <li><a className="footerLink" href="#national-stats">Reports</a></li>
                </ul>
              </div>

              <div>
                <div className="footerTitle">Contact</div>
                <ul className="footerList">
                  <li className="footerText">Contact</li>
                  <li className="footerText">info@ecowaste.gov</li>
                  <li className="footerText">(555) 123-4567</li>
                  <li className="footerText">123 Green Street</li>
                  <li className="footerText">City, State 12345</li>
                </ul>
              </div>
            </div>

            <hr className="footerDivider" />
            <div className="footerBottom">© 2026 E-Waste Manager. All rights reserved.</div>
          </div>
        </footer>




      </main>

      <RoleModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function StatCard({ value, label, note }) {
  return (
    <div className="card">
      <div className="statValue">{value}</div>
      <div className="statLabel">{label}</div>
      {note ? <div className="statNote">{note}</div> : null}
    </div>
  );
}

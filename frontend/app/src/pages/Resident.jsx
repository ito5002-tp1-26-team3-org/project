import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function mapsLink(address, suburb) {
  const q = encodeURIComponent([address, suburb].filter(Boolean).join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function StatBox({ title, value, subtitle, rightNote }) {
  return (
    <div className="panel statBox">
      <div className="muted statTitle">{title}</div>
      <div className="statValue">{value}</div>
      <div className="rowBetween statFooter">
        <div className="muted">{subtitle}</div>
        {rightNote ? <div className="muted">{rightNote}</div> : null}
      </div>
    </div>
  );
}

function TabButton({ id, activeTab, setActiveTab, children }) {
  const isActive = activeTab === id;
  return (
    <button
      type="button"
      className={isActive ? "tabBtn tabBtnActive" : "tabBtn"}
      onClick={() => setActiveTab(id)}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </button>
  );
}

function GuideCard({ title, subtitle, whatCounts, howToDispose }) {
  return (
    <details className="panel guideCard">
      <summary className="guideSummary">
        <div>
          <div className="guideTitle">{title}</div>
          <div className="muted">{subtitle}</div>
        </div>
        <span className="chev" aria-hidden="true">▾</span>
      </summary>

      <div className="guideBody">
        <div className="guideCols">
          <div className="guideCol">
            <div className="guideHeading">What counts as e-waste?</div>
            <ul className="stack">
              {whatCounts.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>

          <div className="guideCol">
            <div className="guideHeading">How to dispose</div>
            <ul className="stack">
              {howToDispose.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </details>
  );
}

function TxRow({ item, location, amount, date }) {
  return (
    <div className="panel txRow">
      <div className="rowBetween">
        <div>
          <div className="txItem"><b>{item}</b></div>
          <div className="muted">{location}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="txAmount">{amount}</div>
          <div className="muted">{date}</div>
        </div>
      </div>
    </div>
  );
}

function PartnerCard({ name, deal, address, phone }) {
  return (
    <div className="panel partnerCard">
      <div className="rowBetween">
        <div>
          <div className="partnerName"><b>{name}</b></div>
          <div className="badge">{deal}</div>
        </div>
        <button className="btnSecondary" type="button">Visit</button>
      </div>
      <div className="muted mt8">{address}</div>
      <div className="muted">{phone}</div>
    </div>
  );
}

function VoucherCard({ title, desc, points, onRedeem, disabled }) {
  return (
    <div className="panel voucherCard">
      <div className="voucherTitle"><b>{title}</b></div>
      <div className="muted">{desc}</div>

      <div className="rowBetween mt12">
        <div>
          <div className="muted">Required Points</div>
          <div className="voucherPoints"><b>{points}</b></div>
        </div>
        <button
          type="button"
          className="btnPrimary"
          disabled={disabled}
          onClick={onRedeem}
        >
          Redeem Now
        </button>
      </div>
    </div>
  );
}

export default function Resident() {
  const lifetimeItems = 46;
  const availableCredit = 45.80;
  const memberRank = "Silver";
  const rankProgress = `${lifetimeItems}/100`;
  const points = 458;

  const [activeTab, setActiveTab] = useState("guides");

  const [facilities, setFacilities] = useState([]);
  const [suburbInput, setSuburbInput] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [facErr, setFacErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadingFacilities(true);
        setFacErr("");
        const res = await fetch("/data/facilities_vic.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setFacilities(json.facilities || []);
      } catch (e) {
        if (!cancelled) setFacErr(`Failed to load facilities: ${e.message}`);
      } finally {
        if (!cancelled) setLoadingFacilities(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ✅ Autocomplete suburb list (unique + sorted)
  const suburbOptions = useMemo(() => {
    const set = new Set();
    for (const f of facilities) {
      const s = (f.suburb || "").trim();
      if (s) set.add(s);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [facilities]);

  const results = useMemo(() => {
    const q = submitted.trim().toUpperCase();
    if (!q) return [];
    return facilities
      .filter((f) => (f.suburb || "").trim().toUpperCase() === q)
      .slice(0, 25);
  }, [facilities, submitted]);

  function onSearch(e) {
    e.preventDefault();
    setSubmitted(suburbInput);
  }

  const guides = [
    {
      title: "Mobile Phones & Tablets",
      subtitle: "Smartphones, Tablets, E-readers",
      whatCounts: [
        "Smartphones, tablets, e-readers",
        "Chargers, cables, small accessories",
        "Old cases and non-swollen batteries (if removable)",
      ],
      howToDispose: [
        "Remove SIM/SD cards, and factory reset the device",
        "Bundle accessories separately (don’t tape to the device)",
        "Drop off at a council e-waste facility or approved partner",
      ],
    },
    {
      title: "Computers & Laptops",
      subtitle: "Desktops, Laptops, Monitors",
      whatCounts: [
        "Laptops, desktops, monitors",
        "Keyboards, mice, power supplies",
        "External drives (after wiping)",
      ],
      howToDispose: [
        "Back up and wipe data (see checklist below)",
        "Pack screens carefully to avoid breakage",
        "Drop off at an approved e-waste location",
      ],
    },
    {
      title: "Television & Large Electronics",
      subtitle: "Televisions, Printers, Scanners, Audio Equipment",
      whatCounts: [
        "TVs, printers, scanners, audio equipment",
        "Large cables and remotes",
        "Game consoles and set-top boxes",
      ],
      howToDispose: [
        "Keep items intact (don’t dismantle at home)",
        "Separate batteries where possible",
        "Use council drop-off points (large item bins) or partner facilities",
      ],
    },
    {
      title: "Batteries",
      subtitle: "Rechargeable, Alkaline, Button cells",
      whatCounts: [
        "Rechargeable batteries (Li-ion, NiMH)",
        "AA/AAA alkaline batteries",
        "Button cell batteries (watch/hearing aid)",
      ],
      howToDispose: [
        "Tape battery terminals (especially lithium)",
        "Keep damaged/swollen batteries separate",
        "Use battery-specific drop-off points (never kerbside recycling)",
      ],
    },
  ];

  const transactions = [
    { item: "Smartphone", location: "Monash Drop-off", amount: "+$8.00", date: "2026-01-12" },
    { item: "Laptop", location: "Box Hill Collection", amount: "+$10.00", date: "2026-01-10" },
    { item: "Batteries (5x)", location: "Glen Eira Hub", amount: "+$5.00", date: "2026-01-05" },
    { item: "Old Monitor", location: "Casey Center", amount: "+$2.00", date: "2026-01-02" },
  ];

  const partners = [
    { name: "GreenTech Recyclers", deal: "$5 off next drop-off", address: "123 Main St, Central", phone: "(555) 0100" },
    { name: "Battery Solutions Co", deal: "Free collection for bulk", address: "456 Oak Ave, Eastwood", phone: "(555) 0200" },
    { name: "ComputerCycle", deal: "10% bonus credit on laptops", address: "789 Tech Blvd, Westside", phone: "(555) 0300" },
  ];

  const voucherOptions = [
    { title: "$10 Council Services Voucher", desc: "Redeem for council services", points: 100 },
    { title: "Free Green Waste Collection", desc: "One free collection service", points: 150 },
    { title: "$25 Local Business Voucher", desc: "Use at participating businesses", points: 250 },
  ];

  function redeemVoucher(v) {
    alert(`Demo: Redeemed "${v.title}" for ${v.points} points.`);
  }

  return (
    <div className="container stack">
      <div className="rowBetween">
        <span className="pageIcon resident" aria-hidden="true">🏛️</span>
        <h1 className="noTopMargin">Resident Portal</h1>
        <div className="pageTopNav">
          <Link className="btnSecondary linkBtn" to="/">Home</Link>
        </div>
      </div>

      <div className="gridStats">
        <StatBox title="Items Recycled" value={lifetimeItems} subtitle="Lifetime total" />
        <StatBox title="Total Earned" value={`$${availableCredit.toFixed(2)}`} subtitle="Available credit" />
        <StatBox title="Member Rank" value={memberRank} subtitle="Progress to Gold" rightNote={rankProgress} />
      </div>

      <div className="tabs" role="tablist" aria-label="Resident features">
        <TabButton id="guides" activeTab={activeTab} setActiveTab={setActiveTab}>Disposal Guides</TabButton>
        <TabButton id="incentives" activeTab={activeTab} setActiveTab={setActiveTab}>My Incentives</TabButton>
        <TabButton id="partners" activeTab={activeTab} setActiveTab={setActiveTab}>Partners & Deals</TabButton>
        <TabButton id="vouchers" activeTab={activeTab} setActiveTab={setActiveTab}>Vouchers</TabButton>
      </div>

      {activeTab === "guides" && (
        <div className="stack">
          <div className="stack">
            <h2 className="noTopMargin">E-Waste Disposal Guides</h2>
            <div className="muted">
              Click on each category to learn how to properly dispose of different types of electronic waste.
            </div>
          </div>

          <div className="gridGuides">
            {guides.map((g) => (
              <GuideCard
                key={g.title}
                title={g.title}
                subtitle={g.subtitle}
                whatCounts={g.whatCounts}
                howToDispose={g.howToDispose}
              />
            ))}
          </div>

          <div className="panel stack">
            <h3 className="noTopMargin">Find a nearby drop-off point</h3>
            <div className="muted">
              Start typing a suburb and pick from the dropdown suggestions.
            </div>

            <form onSubmit={onSearch} className="row wrap">
              <div style={{ width: "min(520px, 100%)" }}>
                <input
                  value={suburbInput}
                  onChange={(e) => setSuburbInput(e.target.value)}
                  placeholder="Enter suburb (e.g., Glen Iris)"
                  className="input"
                  list="suburb-options"
                  autoComplete="off"
                />
                <datalist id="suburb-options">
                  {suburbOptions.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <button type="submit" className="btnPrimary">Search</button>
            </form>

            {loadingFacilities && <p className="muted">Loading facilities…</p>}
            {facErr && <p style={{ color: "crimson" }}>{facErr}</p>}

            {!loadingFacilities && !facErr && submitted.trim() && results.length === 0 && (
              <p className="muted">
                No nearby facilities found for “{submitted}”. Try a neighbouring suburb or check spelling.
              </p>
            )}

            {!loadingFacilities && !facErr && results.length > 0 && (
              <div className="stack">
                <h4 className="noTopMargin">Results</h4>
                <div className="stack">
                  {results.map((f) => (
                    <div key={f.id} className="panel facilityRow">
                      <div className="rowBetween">
                        <div>
                          <div><b>{f.name}</b></div>
                          <div className="muted">{f.address}{f.suburb ? `, ${f.suburb}` : ""}</div>
                          <div className="muted">
                            {f.facilityType ? `Type: ${f.facilityType}` : ""}
                            {f.infrastructureType ? ` • ${f.infrastructureType}` : ""}
                          </div>
                        </div>
                        <a
                          className="btnSecondary"
                          href={mapsLink(f.address, f.suburb)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Directions
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="panel stack">
            <h3 className="noTopMargin" id="data-wiping">Data wiping help</h3>
            <div className="muted">Simple steps to protect your personal data before recycling:</div>

            <div className="gridTwo">
              <div className="panel soft">
                <h4 className="noTopMargin">Phones (iPhone/Android)</h4>
                <ul className="stack">
                  <li>Back up photos/files you want to keep.</li>
                  <li>Sign out of your Apple ID / Google account.</li>
                  <li>Turn off activation lock / “Find My”.</li>
                  <li>Run “Factory reset” from Settings.</li>
                </ul>
              </div>

              <div className="panel soft">
                <h4 className="noTopMargin">Laptops (Windows/macOS)</h4>
                <ul className="stack">
                  <li>Back up files.</li>
                  <li>Sign out of accounts and de-authorise apps if needed.</li>
                  <li>Use “Reset this PC” (Windows) or “Erase All Content and Settings” (macOS).</li>
                </ul>
              </div>
            </div>

            <div className="muted">
              Iteration 2: add certified wiping services directory + printable checklist.
            </div>
          </div>
        </div>
      )}

      {activeTab === "incentives" && (
        <div className="stack">
          <div className="stack">
            <h2 className="noTopMargin">My Recycling Incentives</h2>
            <div className="muted">Earn $2.00 credit for each item recycled properly</div>
          </div>

          <div className="panel">
            <div className="muted">Available Balance</div>
            <div className="moneyBig">${availableCredit.toFixed(2)}</div>
          </div>

          <div className="stack">
            <h3 className="noTopMargin">Recent Transactions</h3>
            <div className="gridTx">
              {transactions.map((t) => (
                <TxRow key={`${t.item}-${t.date}`} {...t} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "partners" && (
        <div className="stack">
          <div className="stack">
            <h2 className="noTopMargin">Recycling Partners & Special Deals</h2>
            <div className="muted">Find authorized recycling partners and exclusive deals</div>
          </div>

          <div className="gridPartners">
            {partners.map((p) => (
              <PartnerCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "vouchers" && (
        <div className="stack">
          <div className="stack">
            <h2 className="noTopMargin">Council Discounts & Vouchers</h2>
            <div className="muted">Redeem your recycling credits for council services and local discounts</div>
          </div>

          <div className="panel rowBetween wrap">
            <div>
              <div className="muted">Available Points</div>
              <div className="moneyBig">{points}</div>
            </div>
            <div className="muted" style={{ textAlign: "right" }}>
              <div>1 point = $0.10 earned</div>
              <div>= ${(points * 0.10).toFixed(2)} value</div>
            </div>
          </div>

          <div className="gridVouchers">
            {voucherOptions.map((v) => (
              <VoucherCard
                key={v.title}
                title={v.title}
                desc={v.desc}
                points={v.points}
                disabled={points < v.points}
                onRedeem={() => redeemVoucher(v)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

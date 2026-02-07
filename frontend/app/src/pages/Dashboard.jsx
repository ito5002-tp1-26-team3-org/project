import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CouncilRiskMap from "../components/CouncilRiskMap";

import { useAuth } from "../auth/AuthProvider";
import { logout as cognitoLogout, getGroupsFromUser } from "../auth/authService";
import logo from "../51009.jpg";


function PageHero({ kicker, title, subtitle, right, variant = "teal" }) {
  // pick 3 dots based on variant
  const dotSets = {
    teal: ["teal", "blue", "amber"],
    blue: ["blue", "teal", "purple"],
    amber: ["amber", "teal", "blue"],
    purple: ["purple", "blue", "teal"],
  };
  const dots = dotSets[variant] || dotSets.teal;

  return (
    <div className="pageHeroWrap" style={{ paddingTop: 6 }}>
      <div className="stack" style={{ alignItems: "center", gap: 10, width: "100%" }}>
        {kicker ? (
          <div className="kicker" style={{ letterSpacing: 1.2, textTransform: "uppercase" }}>
            {kicker}
          </div>
        ) : null}

        {/* capsule-only title art */}
        <div className="pageHeroTitleArt" role="banner" aria-label={title}>
          <span className="pageHeroBloom" aria-hidden="true" />

          <span className="pageHeroDots" aria-hidden="true">
            <span className={`pageHeroDot ${dots[0]}`} />
            <span className={`pageHeroDot ${dots[1]}`} />
            <span className={`pageHeroDot ${dots[2]}`} />
          </span>

          <span className="pageHeroRule" aria-hidden="true" />

          <h1
            className="noTopMargin"
            style={{
              margin: 0,
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>

          <span className="pageHeroRule right" aria-hidden="true" />

          <span className="pageHeroDots" aria-hidden="true">
            <span className={`pageHeroDot ${dots[2]}`} />
            <span className={`pageHeroDot ${dots[1]}`} />
            <span className={`pageHeroDot ${dots[0]}`} />
          </span>
        </div>

        {subtitle ? (
          <div className="pageHeroSubtitlePill">
            <div className="muted">{subtitle}</div>
          </div>
        ) : null}

        {right ? <div style={{ marginTop: 6 }}>{right}</div> : null}
      </div>
    </div>
  );
}



function pct(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return "N/A";
  return (x * 100).toFixed(2);
}
function fmtRisk(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return "N/A";
  return Number(x).toFixed(2);
}

function toCSV(rows, headers) {
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    const escaped = s.replace(/"/g, '""');
    return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
  };

  const lines = [];
  lines.push(headers.map((h) => escape(h.label)).join(","));
  for (const r of rows) {
    lines.push(headers.map((h) => escape(r[h.key])).join(","));
  }
  return lines.join("\n");
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Section({ title, subtitle, right, children, id }) {
  return (
    <section className="stack sectionBlock" id={id}>
      <div className="sectionTop">
        <div className="sectionTopLeft">
          <h2 className="noTopMargin" style={{ marginBottom: 4 }}>{title}</h2>
          {subtitle ? <div className="muted">{subtitle}</div> : null}
        </div>
        {right ? <div className="sectionTopRight">{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

function RiskExplainer({ yearStart, selectedYearRow }) {
  const collected = selectedYearRow?.collected;
  const recycled = selectedYearRow?.recycled;

  const exampleOk =
    typeof collected === "number" &&
    typeof recycled === "number" &&
    collected > 0;

  const computedRisk = exampleOk ? ((collected - recycled) / collected) * 100 : null;

  return (
    <details className="panel detailsCard" open={false}>
      <summary className="detailsSummary">
        <div>
          <div className="detailsTitle">❓What does “Risk” mean?</div>
          <div className="muted">
            A proxy indicator: collected recycling vs successfully recycled output.
          </div>
        </div>
        <span className="chev" aria-hidden="true">▾</span>
      </summary>

      <div className="detailsBody">
        <p className="noTopMargin">
          In this dashboard, <b>Risk</b> estimates the <b>percentage of kerbside recycling collected that was not successfully recycled</b>.
        </p>

        <div className="panel soft">
          <b>Formula</b>
          <div className="muted mt8">
            <b>Risk (%)</b> ≈ <b>((Collected − Recycled) ÷ Collected) × 100</b>
          </div>
          <div className="muted mt8">
            Collected = tonnes picked up from kerbside recycling. <br />
            Recycled = tonnes successfully recycled after sorting/processing.
          </div>
        </div>

        <div className="gridTwo mt12">
          <div className="panel soft">
            <b>How to interpret it</b>
            <ul className="stack mt8" style={{ marginBottom: 0 }}>
              <li><b>Lower</b> → more collected material is successfully recycled.</li>
              <li><b>Higher</b> → more material is rejected/lost (often contamination/misclassification).</li>
              <li><b>Indicator only</b> - not a direct measure of illegal dumping or e-waste disposal.</li>
            </ul>
          </div>

          <div className="panel soft">
            <b>This council’s breakdown</b>
            <div className="muted mt8">
              {exampleOk ? (
                <>
                  <div><b>Collected:</b> {collected} tonnes</div>
                  <div><b>Recycled:</b> {recycled} tonnes</div>
                  <div><b>Not recycled:</b> {(collected - recycled).toFixed(2)} tonnes</div>
                  <div className="mt8">
                    <b>⚠️Computed risk:</b> {computedRisk.toFixed(2)}%
                  </div>
                </>
              ) : (
                <>Select a council and year with available data to see the breakdown.</>
              )}
            </div>
          </div>
        </div>

        <div className="muted mt12">
          Showing results for <b>{yearStart}</b>. Risk is intended for comparison across councils and over time.
        </div>
      </div>
    </details>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const displayName =
    user?.profile?.name ||
    user?.profile?.given_name ||
    user?.profile?.email ||
    "Staff";

  const email = user?.profile?.email || "";
  const groups = user ? getGroupsFromUser(user) : [];

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [yearStart, setYearStart] = useState(null);
  const [riskThreshold, setRiskThreshold] = useState(20);
  const [selectedCouncil, setSelectedCouncil] = useState("");
  const [activeTab, setActiveTab] = useState("ranking");

  const [csvPromptOpen, setCsvPromptOpen] = useState(false);
  const [csvPromptCouncil, setCsvPromptCouncil] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch("/data/vic_lga_risk.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setYearStart(json.latestYearStart || null);
        }
      } catch (e) {
        if (!cancelled) setErr(`Failed to load council data: ${e.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const years = useMemo(() => {
    if (!data?.timeseriesByCouncil) return [];
    const s = new Set();
    for (const council of Object.keys(data.timeseriesByCouncil)) {
      for (const row of data.timeseriesByCouncil[council]) {
        if (row.year_start) s.add(row.year_start);
      }
    }
    return Array.from(s).sort((a, b) => b - a);
  }, [data]);

  const ranking = useMemo(() => {
    if (!data?.timeseriesByCouncil || !yearStart) return [];
    const rows = [];

    for (const [council, series] of Object.entries(data.timeseriesByCouncil)) {
      const match = series.find((r) => r.year_start === yearStart);
      if (!match) continue;

      rows.push({
        council,
        financial_year: match.financial_year,
        risk_score: match.risk_score,
        recovery_rate: match.recovery_rate,
        collected: match.recycling_collected_tonnes,
        recycled: match.recycling_recycled_tonnes,
        population: match.population,
      });
    }

    rows.sort((a, b) => (b.risk_score ?? -1) - (a.risk_score ?? -1));
    return rows.map((r, idx) => ({ ...r, rank: idx + 1 }));
  }, [data, yearStart]);

  const aboveThreshold = useMemo(() => {
    if (!ranking.length) return [];
    return ranking.filter((r) => (r.risk_score ?? -1) >= riskThreshold);
  }, [ranking, riskThreshold]);

  useEffect(() => {
    if (!selectedCouncil && ranking.length > 0) {
      setSelectedCouncil(ranking[0].council);
    }
  }, [ranking, selectedCouncil]);

  const trend = useMemo(() => {
    if (!data?.timeseriesByCouncil || !selectedCouncil) return [];
    return (data.timeseriesByCouncil[selectedCouncil] || [])
      .slice()
      .sort((a, b) => (a.year_start ?? 0) - (b.year_start ?? 0));
  }, [data, selectedCouncil]);

  function downloadRankingCSV() {
    if (!ranking.length) return;

    const rows = ranking.map((r) => ({
      rank: r.rank,
      council: r.council,
      financial_year: r.financial_year,
      risk_percent: r.risk_score != null ? Number(r.risk_score).toFixed(2) : "",
      recovery_percent: r.recovery_rate != null ? (r.recovery_rate * 100).toFixed(2) : "",
      collected_tonnes: r.collected ?? "",
      recycled_tonnes: r.recycled ?? "",
      population: r.population ?? "",
    }));

    const csv = toCSV(rows, [
      { key: "rank", label: "Rank" },
      { key: "council", label: "Council" },
      { key: "financial_year", label: "Financial Year" },
      { key: "risk_percent", label: "Risk Score (%)" },
      { key: "recovery_percent", label: "Recovery Rate (%)" },
      { key: "collected_tonnes", label: "Recycling Collected (tonnes)" },
      { key: "recycled_tonnes", label: "Recycling Recycled (tonnes)" },
      { key: "population", label: "Population" },
    ]);

    downloadText(`vic_risk_ranking_${yearStart}.csv`, csv);
  }

  function downloadTrendCSVForCouncil(councilName) {
    const series = data?.timeseriesByCouncil?.[councilName] || [];
    if (!series.length) return;

    const sorted = series.slice().sort((a, b) => (a.year_start ?? 0) - (b.year_start ?? 0));

    const rows = sorted.map((t) => ({
      council: councilName,
      financial_year: t.financial_year,
      year_start: t.year_start ?? "",
      risk_percent: t.risk_score != null ? Number(t.risk_score).toFixed(2) : "",
      recovery_percent: t.recovery_rate != null ? (t.recovery_rate * 100).toFixed(2) : "",
      collected_tonnes: t.recycling_collected_tonnes ?? "",
      recycled_tonnes: t.recycling_recycled_tonnes ?? "",
      population: t.population ?? "",
    }));

    const csv = toCSV(rows, [
      { key: "council", label: "Council" },
      { key: "financial_year", label: "Financial Year" },
      { key: "year_start", label: "Year Start" },
      { key: "risk_percent", label: "Risk Score (%)" },
      { key: "recovery_percent", label: "Recovery Rate (%)" },
      { key: "collected_tonnes", label: "Recycling Collected (tonnes)" },
      { key: "recycled_tonnes", label: "Recycling Recycled (tonnes)" },
      { key: "population", label: "Population" },
    ]);

    const safeCouncil = councilName.replace(/[^a-z0-9]+/gi, "_");
    downloadText(`vic_${safeCouncil}_trend.csv`, csv);
  }

  function promptDownloadCouncilCSV(councilName) {
    setCsvPromptCouncil(councilName);
    setCsvPromptOpen(true);
  }

  function confirmDownloadCouncilCSV() {
    if (csvPromptCouncil) {
      setSelectedCouncil(csvPromptCouncil);
      downloadTrendCSVForCouncil(csvPromptCouncil);
    }
    setCsvPromptOpen(false);
  }

  function cancelDownloadCouncilCSV() {
    setCsvPromptOpen(false);
  }

  const selectedYearRow = ranking.find((r) => r.council === selectedCouncil);

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
            <Link className="btnSecondary linkBtn" to="/">Home</Link>
            <Link className="btnSecondary linkBtn" to="/resident">Resident portal</Link>
            <Link className="btnSecondary linkBtn" to="/staff">Council staff</Link>
            <button onClick={() => cognitoLogout()} className="btnPrimary" disabled={authLoading}>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <main className="container stack">
        <PageHero variant="blue" title="COUNCIL DASHBOARD" />


        <Section
          title="Welcome"
          subtitle="This page provides e-waste indicators, map view, threshold monitoring, and CSV exports for reporting."
          right={
            <div className="trustBlock">
              {/*<div className="trustTitle">Dashboard Functions</div>*/}
              <div className="trustRow">
                <span className="iconTag iconTeal">Ranking</span>
                <span className="iconTag iconBlue">Map</span>
                <span className="iconTag iconAmber">Exports</span>
              </div>
            </div>
          }
        >
          {!authLoading && user ? (
            <div className="panel soft">
              <div className="muted">
                Signed in as <b>{displayName}</b>{email ? <> (<b>{email}</b>)</> : null}
                {groups.length ? <> • <b>{groups.join(", ")} 🧑‍💼</b></> : null}
              </div>
            </div>
          ) : null}

          <RiskExplainer yearStart={yearStart ?? "the selected year"} selectedYearRow={selectedYearRow} />

          {loading && (
            <div className="panel">
              <b>Loading council dataset…</b>
              <div className="muted mt8">Please wait while the dashboard data loads.</div>
            </div>
          )}

          {err && (
            <div className="panel panelCallout panelCallout-danger">
              <b>Data load error</b>
              <div className="muted mt8">{err}</div>
            </div>
          )}
        </Section>

        {!loading && !err && data && (
          <>
            <Section
              title="Filters and exports"
              subtitle="Select year/council, then download ranking or council trend CSVs."
              right={<span className="iconTag iconBlue">Source: {data.sourceSheet}</span>}
            >
              <div id="dashboard-sections" className="scrollAnchor" />
              {/* Filters + exports */}
              <div className="gridTwo">
                <div className="panel panelAccent stack">
                  <div className="sectionHeader">
                    <div>
                      <div className="kicker">Filters</div>
                      <h3 className="noTopMargin">Select year and council</h3>
                    </div>
                    <span className="tag">Year: {yearStart ?? "—"}</span>
                  </div>

                  <div className="row wrap">
                    <label className="row" style={{ gap: 8 }}>
                      <b>Year</b>
                      <select value={yearStart ?? ""} onChange={(e) => setYearStart(Number(e.target.value))}>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </label>

                    <label className="row" style={{ gap: 8 }}>
                      <b>Council</b>
                      <select value={selectedCouncil} onChange={(e) => setSelectedCouncil(e.target.value)}>
                        {ranking.map((r) => (
                          <option key={r.council} value={r.council}>{r.council}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="panel panelAccentBlue stack">
                  <div className="sectionHeader">
                    <div>
                      <div className="kicker">Exports</div>
                      <h3 className="noTopMargin">Download CSV</h3>
                    </div>
                    <span className="tag">Reporting</span>
                  </div>

                  <div className="row wrap" style={{ gap: 10, justifyContent: "center" }}>
                    <button
                      onClick={downloadRankingCSV}
                      disabled={!ranking.length}
                      className="btnSecondary"
                      style={{ minWidth: 240 }}
                    >
                      Download ranking CSV
                    </button>

                    <button
                      onClick={() => selectedCouncil && downloadTrendCSVForCouncil(selectedCouncil)}
                      disabled={!selectedCouncil}
                      className="btnSecondary"
                      style={{ minWidth: 240 }}
                    >
                      Download selected council CSV
                    </button>
                  </div>

                  <div className="muted" style={{ textAlign: "center" }}>
                    Exports include the full time series available for each council.
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Views" subtitle="Switch between ranking, map, alerts, and detail/trend.">
              <div className="tabs" role="tablist" aria-label="Dashboard tabs">
                <button
                  type="button"
                  className={activeTab === "ranking" ? "tabBtn tabBtnActive" : "tabBtn"}
                  onClick={() => setActiveTab("ranking")}
                >
                  Ranking
                </button>
                <button
                  type="button"
                  className={activeTab === "map" ? "tabBtn tabBtnActive" : "tabBtn"}
                  onClick={() => setActiveTab("map")}
                >
                  Map
                </button>
                <button
                  type="button"
                  className={activeTab === "alerts" ? "tabBtn tabBtnActive" : "tabBtn"}
                  onClick={() => setActiveTab("alerts")}
                >
                  Alerts
                </button>
                <button
                  type="button"
                  className={activeTab === "detail" ? "tabBtn tabBtnActive" : "tabBtn"}
                  onClick={() => setActiveTab("detail")}
                >
                  Detail & Trend
                </button>
              </div>

              {/* Alerts */}
              {activeTab === "alerts" && (
                <div className="panel panelAccentRose stack">
                  <div className="sectionHeader">
                    <div>
                      <div className="kicker">Alerts</div>
                      <h3 className="noTopMargin">Threshold monitoring</h3>
                    </div>
                    <span className="tag">Year: {yearStart}</span>
                  </div>

                  <div className="row wrap" style={{ justifyContent: "space-between" }}>
                    <label className="row" style={{ gap: 8 }}>
                      <b>Risk threshold (%)</b>
                      <input
                        type="number"
                        value={riskThreshold}
                        onChange={(e) => setRiskThreshold(Number(e.target.value))}
                        className="inputSmall"
                        min="0"
                        max="100"
                        step="0.5"
                      />
                    </label>

                    <div className="muted">
                      <b>{aboveThreshold.length}</b> councils at or above <b>{riskThreshold}%</b>
                    </div>
                  </div>

                  {aboveThreshold.length === 0 ? (
                    <p className="muted">No councils exceed the threshold.</p>
                  ) : (
                    <div className="tableWrap">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Council</th>
                            <th>Risk (%)</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {aboveThreshold.slice(0, 10).map((r) => (
                            <tr key={r.council}>
                              <td><b>{r.council}</b></td>
                              <td>{fmtRisk(r.risk_score)}</td>
                              <td style={{ textAlign: "right" }}>
                                <button
                                  className="btnTiny"
                                  onClick={() => {
                                    setSelectedCouncil(r.council);
                                    promptDownloadCouncilCSV(r.council);
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {aboveThreshold.length > 10 && (
                    <div className="muted">Showing first 10 results.</div>
                  )}
                </div>
              )}

              {/* Map */}
              {activeTab === "map" && (
                <div className="panel mapPanel panelAccent">
                  <div className="mapViewport">
                    <CouncilRiskMap
                      ranking={ranking}
                      selectedCouncil={selectedCouncil}
                      onSelectCouncil={setSelectedCouncil}
                    />
                  </div>
                </div>
              )}

              {/* Ranking */}
              {activeTab === "ranking" && (
                <div className="stack">
                  <div className="panel panelAccentBlue">
                    <h3 className="noTopMargin">Ranked LGAs (Year {yearStart})</h3>
                    <div className="muted">Click a council row to update the selected council.</div>
                  </div>

                  {ranking.length === 0 ? (
                    <div className="panel"><b>Data unavailable for this year.</b></div>
                  ) : (
                    <div className="tableWrap">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Council</th>
                            <th>Risk (%)</th>
                            <th>Recovery (%)</th>
                            <th>Collected (t)</th>
                            <th>Recycled (t)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ranking.slice(0, 20).map((r) => (
                            <tr
                              key={r.council}
                              className={r.council === selectedCouncil ? "clickRow selected" : "clickRow"}
                              onClick={() => setSelectedCouncil(r.council)}
                            >
                              <td>{r.rank}</td>
                              <td><b>{r.council}</b></td>
                              <td>{fmtRisk(r.risk_score)}</td>
                              <td>{pct(r.recovery_rate)}</td>
                              <td>{r.collected ?? "N/A"}</td>
                              <td>{r.recycled ?? "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Detail */}
              {activeTab === "detail" && (
                <div className="stack">
                  <div className="panel panelAccent">
                    <h3 className="noTopMargin">Selected LGA detail</h3>
                    <div className="muted">Details for the selected year, plus full-year trend table below.</div>
                  </div>

                  {!selectedYearRow ? (
                    <div className="panel"><b>Data unavailable for the selected council/year.</b></div>
                  ) : (
                    <div className="panel panelAccentBlue">
                      <div><b>{selectedCouncil}</b> ({selectedYearRow.financial_year})</div>
                      <ul style={{ marginTop: 8 }}>
                        <li><b>Risk score:</b> {fmtRisk(selectedYearRow.risk_score)}%</li>
                        <li><b>Recovery rate:</b> {pct(selectedYearRow.recovery_rate)}%</li>
                        <li><b>Collected:</b> {selectedYearRow.collected ?? "N/A"} tonnes</li>
                        <li><b>Recycled:</b> {selectedYearRow.recycled ?? "N/A"} tonnes</li>
                      </ul>
                    </div>
                  )}

                  <h3 className="noTopMargin">Trend over time (all years)</h3>
                  {trend.length === 0 ? (
                    <div className="panel"><b>No trend data available.</b></div>
                  ) : (
                    <div className="tableWrap">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Financial Year</th>
                            <th>Risk (%)</th>
                            <th>Recovery (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trend.map((t) => (
                            <tr key={t.financial_year}>
                              <td>{t.financial_year}</td>
                              <td>{fmtRisk(t.risk_score)}</td>
                              <td>{pct(t.recovery_rate)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              )}
            </Section>
          </>
        )}

        {/* CSV prompt modal */}
        {csvPromptOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 9999,
            }}
            onClick={cancelDownloadCouncilCSV}
          >
            <div className="panel" style={{ width: "min(560px, 100%)" }} onClick={(e) => e.stopPropagation()}>
              <h3 className="noTopMargin">Download council CSV?</h3>
              <div className="muted">
                Download the full trend CSV for <b>{csvPromptCouncil}</b>?
              </div>

              <div className="row wrap mt12" style={{ gap: 10, justifyContent: "center" }}>
                <button className="btnPrimary" style={{ minWidth: 180 }} type="button" onClick={confirmDownloadCouncilCSV}>
                  Yes, download
                </button>
                <button className="btnSecondary" style={{ minWidth: 180 }} type="button" onClick={cancelDownloadCouncilCSV}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          className="scrollCue"
          aria-label="Scroll for more"
          title="Scroll for more"
          onClick={() =>
            document
              .getElementById("dashboard-sections")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <span className="scrollCueText">🔍 Filter</span>
          <span className="scrollCueIcon" aria-hidden="true">↓</span>
        </button>
      </main>

    </>

  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CouncilRiskMap from "../components/CouncilRiskMap";

import { useAuth } from "../auth/AuthProvider";
import { logout as cognitoLogout, getGroupsFromUser } from "../auth/authService";

function pct(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return "N/A";
  return (x * 100).toFixed(2);
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

function RiskExplainer({ yearStart, selectedYearRow }) {
  const collected = selectedYearRow?.collected;
  const recycled = selectedYearRow?.recycled;

  const exampleOk =
    typeof collected === "number" &&
    typeof recycled === "number" &&
    collected > 0;

  const computedRisk = exampleOk ? ((collected - recycled) / collected) * 100 : null;

  return (
    <details className="panel panelAccentBlue" style={{ marginBottom: 12 }}>
      <summary style={{ cursor: "pointer", listStyle: "none" }}>
        <div className="rowBetween" style={{ alignItems: "center" }}>
          <div>
            <b>What does “Risk” mean?</b>
            <div className="muted" style={{ marginTop: 4 }}>
              Risk is a proxy for kerbside recycling quality (collected vs actually recycled).
            </div>
          </div>
          <span className="muted" aria-hidden="true">▾</span>
        </div>
      </summary>

      <div style={{ marginTop: 12 }}>
        <p className="noTopMargin">
          In this dashboard, <b>Risk</b> estimates the <b>percentage of collected kerbside recycling that was not successfully recycled</b>.
        </p>

        <div className="panel soft">
          <b>Formula</b>
          <div className="muted" style={{ marginTop: 6 }}>
            <b>Risk (%)</b> ≈ <b>((Collected − Recycled) ÷ Collected) × 100</b>
          </div>
          <div className="muted" style={{ marginTop: 8 }}>
            Collected = tonnes picked up from kerbside recycling.
            <br />
            Recycled = tonnes actually recycled after sorting/processing.
          </div>
        </div>

        <div className="gridTwo" style={{ marginTop: 12 }}>
          <div className="panel soft">
            <b>How to interpret it</b>
            <ul className="stack" style={{ marginTop: 8, marginBottom: 0 }}>
              <li><b>Lower risk</b> → more collected material is successfully recycled.</li>
              <li><b>Higher risk</b> → more material is rejected/lost (often contamination/misclassification).</li>
              <li><b>Not a direct measure of e-waste</b> — it’s an indicator for where education/services may help.</li>
            </ul>
          </div>

          <div className="panel soft">
            <b>This council’s breakdown</b>
            <div className="muted" style={{ marginTop: 8 }}>
              {exampleOk ? (
                <>
                  <div><b>Collected:</b> {collected} tonnes</div>
                  <div><b>Recycled:</b> {recycled} tonnes</div>
                  <div><b>Not recycled:</b> {(collected - recycled).toFixed(2)} tonnes</div>
                  <div style={{ marginTop: 8 }}>
                    <b>Computed risk:</b> {computedRisk.toFixed(2)}%
                  </div>
                </>
              ) : (
                <>
                  Select a council and year with available data to see the breakdown.
                </>
              )}
            </div>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 10 }}>
          Showing results for <b>{yearStart}</b>. Risk is intended for comparisons across councils and over time, not as a definitive
          measure of illegal dumping or a specific waste type.
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
      risk_percent: r.risk_score ?? "",
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

  function downloadTrendCSV() {
    if (!trend.length || !selectedCouncil) return;

    const rows = trend.map((t) => ({
      council: selectedCouncil,
      financial_year: t.financial_year,
      year_start: t.year_start ?? "",
      risk_percent: t.risk_score ?? "",
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

    const safeCouncil = selectedCouncil.replace(/[^a-z0-9]+/gi, "_");
    downloadText(`vic_${safeCouncil}_trend.csv`, csv);
  }

  const selectedYearRow = ranking.find((r) => r.council === selectedCouncil);

  return (
    <div className="container stack">
      <div className="rowBetween">
        <span className="pageIcon resident" aria-hidden="true">📊</span>
        <h1 className="noTopMargin">Council Dashboard</h1>
        <div className="pageTopNav">
          <Link className="btnSecondary linkBtn" to="/">Home</Link>
          <button
            onClick={() => cognitoLogout()}
            className="btnPrimary"
            disabled={authLoading}
          >
            Logout
          </button>
        </div>
      </div>

      <RiskExplainer yearStart={yearStart ?? "the selected year"} selectedYearRow={selectedYearRow} />



      {!authLoading && user ? (
        <p className="muted" style={{ marginTop: -6 }}>
          Signed in as <b>{displayName}</b>{email ? <> (<b>{email}</b>)</> : null}
          {groups.length ? <> • Groups: <b>{groups.join(", ")}</b></> : null}
        </p>
      ) : null}

      {loading && <p>Loading council dataset…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {!loading && !err && data && (
        <>
          <div className="row wrap">
            <label>
              Year:&nbsp;
              <select value={yearStart ?? ""} onChange={(e) => setYearStart(Number(e.target.value))}>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>

            <label>
              Council:&nbsp;
              <select value={selectedCouncil} onChange={(e) => setSelectedCouncil(e.target.value)}>
                {ranking.map((r) => (
                  <option key={r.council} value={r.council}>{r.council}</option>
                ))}
              </select>
            </label>

            <div className="muted">
              Source sheet: <b>{data.sourceSheet}</b>
            </div>
          </div>

          <div className="row wrap">
            <button onClick={downloadRankingCSV} disabled={!ranking.length} className="btnSecondary">
              Download ranking CSV
            </button>

            <button onClick={downloadTrendCSV} disabled={!trend.length || !selectedCouncil} className="btnSecondary">
              Download council trend CSV
            </button>
          </div>

          <div className="tabs" role="tablist" aria-label="Dashboard tabs">
            <button type="button" className={activeTab === "ranking" ? "tabBtn tabBtnActive" : "tabBtn"} onClick={() => setActiveTab("ranking")}>
              Ranking
            </button>
            <button type="button" className={activeTab === "map" ? "tabBtn tabBtnActive" : "tabBtn"} onClick={() => setActiveTab("map")}>
              Map
            </button>
            <button type="button" className={activeTab === "alerts" ? "tabBtn tabBtnActive" : "tabBtn"} onClick={() => setActiveTab("alerts")}>
              Alerts
            </button>
            <button type="button" className={activeTab === "detail" ? "tabBtn tabBtnActive" : "tabBtn"} onClick={() => setActiveTab("detail")}>
              Detail & Trend
            </button>
          </div>

          {activeTab === "alerts" && (
            <div className="panel panelAccentRose">
              <h2 className="noTopMargin">Alerts (Threshold)</h2>

              <label>
                Risk threshold (%):&nbsp;
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

              <div className="mt8">
                <b>{aboveThreshold.length}</b> councils are at or above <b>{riskThreshold}%</b> risk in <b>{yearStart}</b>.
              </div>

              {aboveThreshold.length === 0 ? (
                <p className="mt8">No councils exceed the threshold.</p>
              ) : (
                <ul className="mt8">
                  {aboveThreshold.slice(0, 10).map((r) => (
                    <li key={r.council}>
                      <button onClick={() => setSelectedCouncil(r.council)} className="btnTiny">
                        View
                      </button>
                      &nbsp;{r.council} — <b>{r.risk_score?.toFixed(2) ?? "N/A"}%</b>
                    </li>
                  ))}
                </ul>
              )}

              {aboveThreshold.length > 10 && (
                <div className="muted">Showing first 10 results.</div>
              )}
            </div>
          )}

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

          {activeTab === "ranking" && (
            <div className="stack">
              <h2>Ranked LGAs (Year {yearStart})</h2>
              {ranking.length === 0 ? (
                <p>Data unavailable for this year.</p>
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
                          <td>{r.risk_score?.toFixed(2) ?? "N/A"}</td>
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

          {activeTab === "detail" && (
            <div className="stack">
              <h2>Selected LGA detail</h2>

              {!selectedYearRow ? (
                <p>Data unavailable for the selected council/year.</p>
              ) : (
                <div className="panel panelAccentBlue">
                  <div><b>{selectedCouncil}</b> ({selectedYearRow.financial_year})</div>
                  <ul>
                    <li><b>Risk score:</b> {selectedYearRow.risk_score?.toFixed(2) ?? "N/A"}%</li>
                    <li><b>Recovery rate:</b> {pct(selectedYearRow.recovery_rate)}%</li>
                    <li><b>Collected:</b> {selectedYearRow.collected ?? "N/A"} tonnes</li>
                    <li><b>Recycled:</b> {selectedYearRow.recycled ?? "N/A"} tonnes</li>
                  </ul>
                </div>
              )}

              <h3>Trend over time (all years)</h3>
              {trend.length === 0 ? (
                <p>No trend data available.</p>
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
                          <td>{t.risk_score?.toFixed(2) ?? "N/A"}</td>
                          <td>{pct(t.recovery_rate)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="muted">Iteration 2</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

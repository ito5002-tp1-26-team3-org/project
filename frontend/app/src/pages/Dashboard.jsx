import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function pct(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return "N/A";
  return (x * 100).toFixed(2);
}

function toCSV(rows, headers) {
  // headers: [{ key: "fieldName", label: "Column Label" }, ...]
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    // escape double quotes
    const escaped = s.replace(/"/g, '""');
    // wrap in quotes if needed
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

export default function Dashboard() {
  const navigate = useNavigate();

  // Guard route
  useEffect(() => {
    const ok = localStorage.getItem("council_authed") === "true";
    if (!ok) navigate("/staff");
  }, [navigate]);

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [yearStart, setYearStart] = useState(null);
  const [riskThreshold, setRiskThreshold] = useState(20); // percent
  const [selectedCouncil, setSelectedCouncil] = useState("");

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

  // All available years from the dataset
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



  // ranking for selected year
  const ranking = useMemo(() => {
    if (!data?.timeseriesByCouncil || !yearStart) return [];
    const rows = [];

    for (const [council, series] of Object.entries(data.timeseriesByCouncil)) {
      const match = series.find((r) => r.year_start === yearStart);
      if (!match) continue;

      rows.push({
        council,
        financial_year: match.financial_year,
        risk_score: match.risk_score, // percent
        recovery_rate: match.recovery_rate, // 0..1
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



  // default select top-ranked council for the chosen year
  useEffect(() => {
    if (!selectedCouncil && ranking.length > 0) {
      setSelectedCouncil(ranking[0].council);
    }
  }, [ranking, selectedCouncil]);

  // trend for selected council (all years)
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

  function logout() {
    localStorage.removeItem("council_authed");
    localStorage.removeItem("council_user");
    navigate("/");
  }

  const selectedYearRow = ranking.find((r) => r.council === selectedCouncil);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1>Council Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <p style={{ color: "#555" }}>
        <b>Risk score (proxy):</b> % of kerbside recycling that was collected but not recycled.
      </p>

      {loading && <p>Loading council dataset…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {!loading && !err && data && (
        <>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            <label>
              Year:&nbsp;
              <select
                value={yearStart ?? ""}
                onChange={(e) => setYearStart(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>

            <label>
              Council:&nbsp;
              <select
                value={selectedCouncil}
                onChange={(e) => setSelectedCouncil(e.target.value)}
              >
                {ranking.map((r) => (
                  <option key={r.council} value={r.council}>{r.council}</option>
                ))}
              </select>
            </label>

            <div style={{ color: "#666" }}>
              Source sheet: <b>{data.sourceSheet}</b>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <button onClick={downloadRankingCSV} disabled={!ranking.length}>
              Download ranking CSV
            </button>

            <button onClick={downloadTrendCSV} disabled={!trend.length || !selectedCouncil}>
              Download council trend CSV
            </button>
          </div>
          <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}>
            <h2 style={{ marginTop: 0 }}>Alerts (Threshold)</h2>

            <label>
              Risk threshold (%):&nbsp;
              <input
                type="number"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                style={{ width: 90 }}
                min="0"
                max="100"
                step="0.5"
              />
            </label>

            <div style={{ marginTop: 8 }}>
              <b>{aboveThreshold.length}</b> councils are at or above <b>{riskThreshold}%</b> risk in <b>{yearStart}</b>.
            </div>

            {aboveThreshold.length === 0 ? (
              <p style={{ marginTop: 8 }}>No councils exceed the threshold.</p>
            ) : (
              <ul style={{ marginTop: 8 }}>
                {aboveThreshold.slice(0, 10).map((r) => (
                  <li key={r.council}>
                    <button
                      onClick={() => setSelectedCouncil(r.council)}
                      style={{ padding: "2px 6px", marginRight: 8 }}
                    >
                      View
                    </button>
                    {r.council} — <b>{r.risk_score?.toFixed(2) ?? "N/A"}%</b>
                  </li>
                ))}
              </ul>
            )}

            {aboveThreshold.length > 10 && (
              <div style={{ color: "#666" }}>Showing first 10 results.</div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            {/* Ranking table */}
            <div>
              <h2>Ranked LGAs (Year {yearStart})</h2>
              {ranking.length === 0 ? (
                <p>Data unavailable for this year.</p>
              ) : (
                <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
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
                        style={{ cursor: "pointer", background: r.council === selectedCouncil ? "#eef" : "white" }}
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
              )}
            </div>

            {/* Detail panel */}
            <div>
              <h2>Selected LGA detail</h2>

              {!selectedYearRow ? (
                <p>Data unavailable for the selected council/year.</p>
              ) : (
                <>
                  <div><b>{selectedCouncil}</b> ({selectedYearRow.financial_year})</div>
                  <ul>
                    <li><b>Risk score:</b> {selectedYearRow.risk_score?.toFixed(2) ?? "N/A"}%</li>
                    <li><b>Recovery rate:</b> {pct(selectedYearRow.recovery_rate)}%</li>
                    <li><b>Collected:</b> {selectedYearRow.collected ?? "N/A"} tonnes</li>
                    <li><b>Recycled:</b> {selectedYearRow.recycled ?? "N/A"} tonnes</li>
                  </ul>
                </>
              )}

              <h3>Trend over time (all years)</h3>
              {trend.length === 0 ? (
                <p>No trend data available.</p>
              ) : (
                <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
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
              )}

              <p style={{ color: "#666" }}>
                Iteration 2: add chart + alert thresholds + export.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
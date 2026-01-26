import fs from "fs";
import path from "path";
import xlsx from "xlsx";

const RAW = path.resolve("data_raw/vic_lga_waste.xlsx");
const OUT = path.resolve("public/data/vic_lga_risk.json");
const TARGET_SHEET = "VLGAS v2025.02"; // latest for Iteration 1

function toNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function safeDiv(a, b) {
  if (a === null || b === null || b === 0) return null;
  return a / b;
}

function parseStartYear(finYear) {
  // "2001-2002" -> 2001
  const m = String(finYear || "").match(/^(\d{4})-/);
  return m ? Number(m[1]) : null;
}

const wb = xlsx.readFile(RAW);

if (!wb.SheetNames.includes(TARGET_SHEET)) {
  console.error(`❌ Sheet not found: ${TARGET_SHEET}`);
  console.error("Pick one of:", wb.SheetNames);
  process.exit(1);
}

const ws = wb.Sheets[TARGET_SHEET];
const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

// Build timeseries records
const records = [];

for (const r of rows) {
  const financial_year = String(r.financial_year || "").trim();
  const council = String(r.council || "").trim();
  if (!financial_year || !council) continue;

  const yearStart = parseStartYear(financial_year);

  const population = toNumber(r.Population);
  const collected = toNumber(r.kerbside_recycling_total_collected_tonnes);
  const recycled = toNumber(r.kerbside_recycling_total_recycled_tonnes);

  // Need at least collected + recycled to compute score
  const recoveryRate = safeDiv(recycled, collected); // 0..1
  const riskScore = recoveryRate === null ? null : (1 - recoveryRate) * 100;

  const recyclingPerCapita = (collected !== null && population) ? collected / population : null;

  records.push({
    council,
    financial_year,
    year_start: yearStart,
    population,
    recycling_collected_tonnes: collected,
    recycling_recycled_tonnes: recycled,
    recovery_rate: recoveryRate,          // fraction 0..1
    risk_score: riskScore,                // percent 0..100
    recycling_tonnes_per_capita: recyclingPerCapita,
  });
}

// Filter out rows where we can’t compute the risk score
const usable = records.filter((r) => r.risk_score !== null);

// build latest-year ranking
// use the max year_start we can find as “latest”
const latestYear = usable.reduce((acc, r) => (r.year_start && r.year_start > acc ? r.year_start : acc), 0);

const latestRows = usable.filter((r) => r.year_start === latestYear);

// Rank: highest risk first
latestRows.sort((a, b) => (b.risk_score ?? -1) - (a.risk_score ?? -1));

const ranking = latestRows.map((r, idx) => ({
  rank: idx + 1,
  council: r.council,
  financial_year: r.financial_year,
  risk_score: r.risk_score,
  recovery_rate: r.recovery_rate,
  recycling_collected_tonnes: r.recycling_collected_tonnes,
  recycling_recycled_tonnes: r.recycling_recycled_tonnes,
  population: r.population,
}));

// Group timeseries by council for fast UI
const byCouncil = {};
for (const r of usable) {
  if (!byCouncil[r.council]) byCouncil[r.council] = [];
  byCouncil[r.council].push(r);
}
for (const c of Object.keys(byCouncil)) {
  byCouncil[c].sort((a, b) => (a.year_start ?? 0) - (b.year_start ?? 0));
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sourceSheet: TARGET_SHEET,
      latestYearStart: latestYear,
      ranking,
      timeseriesByCouncil: byCouncil,
    },
    null,
    2
  )
);

console.log(`✅ Wrote vic LGA risk JSON to ${OUT}`);
console.log(`✅ Latest year_start detected: ${latestYear}`);
console.log(`✅ Ranking rows: ${ranking.length}`);
console.log("✅ Example ranking row:", ranking[0]);
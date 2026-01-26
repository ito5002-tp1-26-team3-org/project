import fs from "fs";
import path from "path";
import Papa from "papaparse";

const RAW = path.resolve("data_raw/vic_facilities.csv");
const OUT = path.resolve("public/data/facilities_vic.json");

function pick(row, keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") return row[k];
  }
  return "";
}

function norm(s) {
  return String(s || "").trim();
}

function normSuburb(s) {
  return norm(s).toUpperCase();
}

const csv = fs.readFileSync(RAW, "utf8");
const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

if (parsed.errors?.length) {
  console.error(parsed.errors);
  process.exit(1);
}

const rows = parsed.data;

const facilities = rows
  .map((r) => {
    const name = pick(r, ["Facility Name"]);
    const owner = pick(r, ["Facility Owner"]);
    const facilityType = pick(r, ["Facility Type"]);
    const infraType = pick(r, ["Infrastructure Type"]);
    const address = pick(r, ["Address"]);
    const suburb = pick(r, ["Suburb"]);
    const lga = pick(r, ["LGA"]);
    const lat = Number(pick(r, ["Latitude"]));
    const lon = Number(pick(r, ["Longitude"]));

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

    return {
      id: `${norm(name)}-${lat}-${lon}`,
      name: norm(name) || "Unknown facility",
      owner: norm(owner),
      facilityType: norm(facilityType),
      infrastructureType: norm(infraType),
      address: norm(address),
      suburb: normSuburb(suburb),
      lga: norm(lga),
      lat,
      lon,
    };
  })
  .filter(Boolean);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify({ generatedAt: new Date().toISOString(), facilities }, null, 2)
);

console.log(`✅ Wrote ${facilities.length} facilities to ${OUT}`);
console.log("✅ Example:", facilities[0]);
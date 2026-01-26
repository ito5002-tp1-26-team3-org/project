import xlsx from "xlsx";
import path from "path";

const RAW = path.resolve("data_raw/vic_lga_waste.xlsx");
const TARGET_SHEET = "VLGAS v2025.02"; 

const wb = xlsx.readFile(RAW);

console.log("Sheets found:", wb.SheetNames);

if (!wb.SheetNames.includes(TARGET_SHEET)) {
  console.error(`❌ Sheet not found: ${TARGET_SHEET}`);
  console.error("Pick one of:", wb.SheetNames);
  process.exit(1);
}

const ws = wb.Sheets[TARGET_SHEET];
const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

console.log(`\nUsing sheet: ${TARGET_SHEET}`);
console.log("Row count:", rows.length);

if (rows.length > 0) {
  const cols = Object.keys(rows[0]);
  console.log("\nColumns (first 60):");
  console.log(cols.slice(0, 60));
  console.log("\nExample row:");
  console.log(rows[0]);
} else {
  console.log("No rows found in sheet.");
}
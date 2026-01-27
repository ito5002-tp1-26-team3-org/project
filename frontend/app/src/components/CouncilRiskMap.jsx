import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

function normCouncilName(s) {
    return String(s || "")
        .toLowerCase()
        .replace(/\s*\([^)]+\)\s*/g, "")         // remove (C) etc
        .replace(/\bcouncil\b/g, "")             // drop "council"
        .replace(/\b(city|shire|rural city|borough)\b/g, "") // drop type words
        .replace(/[^\w\s]/g, " ")                // remove punctuation
        .replace(/\s+/g, " ")
        .trim();
}

function riskToFill(risk) {
    if (risk == null || Number.isNaN(risk)) return "#dddddd";
    if (risk >= 35) return "#b10026";
    if (risk >= 25) return "#e31a1c";
    if (risk >= 15) return "#fd8d3c";
    return "#fed976";
}

export default function CouncilRiskMap({ ranking, selectedCouncil, onSelectCouncil }) {
    const [geo, setGeo] = useState(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setErr("");
                const res = await fetch("/data/vic_lga_boundaries.geojson");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (!cancelled) setGeo(json);
            } catch (e) {
                if (!cancelled) setErr(`Failed to load LGA boundaries: ${e.message}`);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const riskByCouncil = useMemo(() => {
        const m = new Map();
        for (const r of ranking || []) {
            m.set(normCouncilName(r.council), r.risk_score);
        }
        return m;
    }, [ranking]);

    if (err) return <p style={{ color: "crimson" }}>{err}</p>;
    if (!geo) return <p>Loading map…</p>;

    const nameProp = "official_name";
    const selectedNorm = normCouncilName(selectedCouncil);

    return (
        <div style={{ border: "1px solid #ddd", padding: 8, marginBottom: 16 }}>
            <h2 style={{ marginTop: 0 }}>Risk Map (Victoria)</h2>

            <MapContainer style={{ height: 420, width: "100%" }} center={[-37.0, 144.5]} zoom={6}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <GeoJSON
                    data={geo}
                    style={(feature) => {
                        const rawName = feature?.properties?.[nameProp];
                        const risk = riskByCouncil.get(normCouncilName(rawName));
                        const isSelected = normCouncilName(rawName) === selectedNorm;

                        return {
                            color: isSelected ? "#000000" : "#444444",
                            weight: isSelected ? 3 : 1,
                            fillColor: riskToFill(risk),
                            fillOpacity: 0.6,
                        };
                    }}
                    onEachFeature={(feature, layer) => {
                        const rawName = feature?.properties?.[nameProp] ?? "Unknown";
                        const risk = riskByCouncil.get(normCouncilName(rawName));
                        layer.bindTooltip(`${rawName} — Risk: ${risk ?? "N/A"}%`);

                        layer.on("click", () => {
                            const clickedNorm = normCouncilName(rawName);
                            const match = (ranking || []).find((r) => normCouncilName(r.council) === clickedNorm);
                            if (match) onSelectCouncil(match.council);
                        });
                    }}
                />
            </MapContainer>
        </div>
    );
}
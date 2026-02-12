import { useEffect, useMemo, useRef, useState } from "react";
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

function MapLegend() {
    const items = [
        { label: "≥ 35% (Very high)", color: "#b10026" },
        { label: "25–34.99% (High)", color: "#e31a1c" },
        { label: "15–24.99% (Moderate)", color: "#fd8d3c" },
        { label: "< 15% (Low)", color: "#fed976" },
        { label: "No data", color: "#dddddd" },
    ];

    return (
        <div
            style={{
                position: "absolute",
                right: 12,
                bottom: 12,
                zIndex: 1000,
                background: "rgba(255,255,255,0.95)",
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: "10px 12px",
                width: 220,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Legend</div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>
                Risk bands (% collected but not recycled)
            </div>

            <div style={{ display: "grid", gap: 6 }}>
                {items.map((it) => (
                    <div
                        key={it.label}
                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                        <span
                            aria-hidden="true"
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: 4,
                                background: it.color,
                                border: "1px solid rgba(0,0,0,0.25)",
                                flex: "0 0 auto",
                            }}
                        />
                        <span style={{ fontSize: 13 }}>{it.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
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

    // keep latest values available to Leaflet event handlers
    const riskByCouncilRef = useRef(riskByCouncil);
    const rankingRef = useRef(ranking);

    useEffect(() => {
        riskByCouncilRef.current = riskByCouncil;
    }, [riskByCouncil]);

    useEffect(() => {
        rankingRef.current = ranking;
    }, [ranking]);

    if (err) return <p style={{ color: "crimson" }}>{err}</p>;
    if (!geo) return <p>Loading map…</p>;

    const nameProp = "official_name";
    const selectedNorm = normCouncilName(selectedCouncil);

    return (
        <div style={{ border: "1px solid #ddd", padding: 8, marginBottom: 16 }}>
            <h2 style={{ marginTop: 0 }}>Risk Map (Victoria)</h2>

            <div style={{ position: "relative" }}>
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
                            const norm = normCouncilName(rawName);

                            const makeTooltip = () => {
                                const latestRisk = riskByCouncilRef.current?.get(norm);
                                const riskLabel =
                                    latestRisk == null || Number.isNaN(latestRisk)
                                        ? "N/A"
                                        : Number(latestRisk).toFixed(2);
                                return `${rawName} — Risk: ${riskLabel}%`;
                            };

                            // initial tooltip
                            layer.bindTooltip(makeTooltip());

                            // refresh tooltip content whenever the user hovers/moves
                            const refreshTooltip = () => {
                                const content = makeTooltip();
                                if (typeof layer.setTooltipContent === "function") {
                                    layer.setTooltipContent(content);
                                } else if (layer.getTooltip?.()) {
                                    layer.getTooltip().setContent(content);
                                } else {
                                    // fallback: rebind if needed
                                    layer.unbindTooltip();
                                    layer.bindTooltip(content);
                                }
                            };

                            layer.on("mouseover", refreshTooltip);
                            layer.on("mousemove", refreshTooltip);

                            layer.on("click", () => {
                                const match = (rankingRef.current || []).find(
                                    (r) => normCouncilName(r.council) === norm
                                );
                                if (match) onSelectCouncil(match.council);
                            });
                        }}

                    />
                </MapContainer>
                <MapLegend />
            </div>
        </div>
    );
}
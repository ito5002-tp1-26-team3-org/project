import { useEffect, useMemo, useState } from "react";


function mapsLink(address, suburb) {
    const q = encodeURIComponent([address, suburb].filter(Boolean).join(", "));
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
}


export default function Resident() {
    const [facilities, setFacilities] = useState([]);
    const [suburbInput, setSuburbInput] = useState("");
    const [submitted, setSubmitted] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");


    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setErr("");
                const res = await fetch("/data/facilities_vic.json");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                if (!cancelled) setFacilities(json.facilities || []);
            } catch (e) {
                if (!cancelled) setErr(`Failed to load facilities: ${e.message}`);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);


    const results = useMemo(() => {
        const q = submitted.trim().toUpperCase();
        if (!q) return [];
        return facilities
            .filter((f) => (f.suburb || "").toUpperCase() === q)
            .slice(0, 25);
    }, [facilities, submitted]);


    function onSearch(e) {
        e.preventDefault();
        setSubmitted(suburbInput);
    }


    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
            <h1>Resident Portal: Disposal Finder</h1>


            <form onSubmit={onSearch} style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <input
                    value={suburbInput}
                    onChange={(e) => setSuburbInput(e.target.value)}
                    placeholder="Enter suburb (e.g., Glen Iris)"
                    style={{ flex: 1, padding: 10, fontSize: 16 }}
                />
                <button type="submit" style={{ padding: "10px 14px" }}>Search</button>
            </form>


            {loading && <p style={{ marginTop: 16 }}>Loading facilities…</p>}
            {err && <p style={{ marginTop: 16, color: "crimson" }}>{err}</p>}


            {!loading && !err && submitted.trim() && results.length === 0 && (
                <p style={{ marginTop: 16 }}>
                    No nearby facilities found for “{submitted}”. Try a neighbouring suburb or check spelling.
                </p>
            )}


            {!loading && !err && results.length > 0 && (
                <div style={{ marginTop: 16 }}>
                    <h2>Results</h2>
                    <ul style={{ paddingLeft: 18 }}>
                        {results.map((f) => (
                            <li key={f.id} style={{ marginBottom: 12 }}>
                                <div><b>{f.name}</b></div>
                                <div>{f.address}{f.suburb ? `, ${f.suburb}` : ""}</div>
                                <div style={{ color: "#444" }}>
                                    {f.facilityType ? `Type: ${f.facilityType}` : ""}
                                    {f.infrastructureType ? ` • ${f.infrastructureType}` : ""}
                                </div>
                                <div style={{ marginTop: 4 }}>
                                    <a href={mapsLink(f.address, f.suburb)} target="_blank" rel="noreferrer">
                                        Directions
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            <hr style={{ margin: "24px 0" }} />


            <h2 id="data-wiping">Data wiping help</h2>
            <p>Simple steps to protect your personal data before recycling:</p>
            <h3>Phones (iPhone/Android)</h3>
            <ul>
                <li>Back up photos/files you want to keep.</li>
                <li>Sign out of your Apple ID / Google account.</li>
                <li>Turn off activation lock / “Find My”.</li>
                <li>Run “Factory reset” from Settings.</li>
            </ul>


            <h3>Laptops (Windows/macOS)</h3>
            <ul>
                <li>Back up files.</li>
                <li>Sign out of accounts and de-authorise apps if needed.</li>
                <li>Use “Reset this PC” (Windows) or “Erase All Content and Settings” (macOS).</li>
            </ul>


            <p style={{ color: "#666" }}>
                Iteration 2: add certified wiping services directory + printable checklist.
            </p>
        </div>
    );
}
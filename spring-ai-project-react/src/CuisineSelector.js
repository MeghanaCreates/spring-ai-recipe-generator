// src/CuisineSelector.js
// trigger vercel rebuild
import React, { useEffect, useMemo, useState } from "react";

/**
 * Robust CuisineSelector for backend responses like:
 * 1. North African Cuisine
 * 2. West African Cuisine
 * ...
 *
 * Usage:
 * <CuisineSelector onSelect={(c,continent) => ...} initialCuisine="..." />
 */

const BACKEND_BASE = process.env.REACT_APP_API_URL;
const CUISINES_API_BASE = `${BACKEND_BASE}/springAI/cuisinesacross`;

export default function CuisineSelector({ onSelect, initialCuisine = "" }) {
  const [continent, setContinent] = useState("");
  const [query, setQuery] = useState(initialCuisine || "");
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const continentList = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
    "Antarctica"
  ];

  // helper: parse raw text from backend into array of cuisine strings
  const parseCuisinesFromText = (text) => {
    if (!text || typeof text !== "string") return [];

    // remove byte order mark if present
    text = text.replace(/^\uFEFF/, "");

    // normalize CRLF
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // If lines look like numbered entries (e.g. "1. italian"), strip numbering.
    const numberedPattern = /^\s*\d+\s*[.)-]\s*(.+)$/; // captures the part after "1." / "1)" / "1-"
    const results = [];

    for (const l of lines) {
      // try numbered pattern
      const m = l.match(numberedPattern);
      if (m && m[1]) {
        results.push(m[1].trim());
        continue;
      }
      // if line contains commas and looks like CSV, split it
      if (l.includes(",")) {
        l.split(",").map(s => s.trim()).filter(Boolean).forEach(s => results.push(s));
        continue;
      }
      // otherwise push the line as-is
      results.push(l);
    }

    // final normalization: capitalize first letter of each word-ish string
    return results.map(item => {
      if (typeof item !== "string") item = String(item);
      const trimmed = item.trim();
      if (!trimmed) return trimmed;
      // keep inner-case but capitalize first character
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    });
  };

  // Fetch cuisines when continent changes
  useEffect(() => {
    if (!continent) {
      setCuisines([]);
      setError(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const url = `${CUISINES_API_BASE}?continent=${encodeURIComponent(continent)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const ct = (res.headers.get("content-type") || "").toLowerCase();

        let parsedList = [];

        // If JSON-like content-type, try JSON first
        if (ct.includes("application/json") || ct.includes("text/json")) {
          try {
            const json = await res.json();
            console.debug("[CuisineSelector] raw JSON response:", json);
            if (Array.isArray(json)) parsedList = json;
            else if (json && Array.isArray(json.cuisines)) parsedList = json.cuisines;
          } catch (e) {
            console.debug("[CuisineSelector] JSON.parse failed, will fall back to text parsing.", e);
          }
        }

        // If we don't have an array yet, read as text and parse
        if (!Array.isArray(parsedList) || parsedList.length === 0) {
          const text = await res.text();
          console.debug("[CuisineSelector] raw text response:", text);
          // Try to parse JSON from text (safe)
          try {
            const maybeJson = JSON.parse(text);
            if (Array.isArray(maybeJson)) parsedList = maybeJson;
            else if (maybeJson && Array.isArray(maybeJson.cuisines)) parsedList = maybeJson.cuisines;
          } catch (_) {
            // Not JSON — parse numbered lines / csv / plain lines
            parsedList = parseCuisinesFromText(text);
          }
        }

        // Ensure it's an array
        if (!Array.isArray(parsedList)) parsedList = [];

        if (mounted) {
          console.debug("[CuisineSelector] parsed cuisines array:", parsedList);
          setCuisines(parsedList);
        }
      } catch (err) {
        console.error("[CuisineSelector] fetch error:", err);
        if (mounted) {
          setError("Could not load cuisines.");
          setCuisines([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [continent]);

  const filtered = useMemo(() => {
    if (!query) return cuisines;
    const q = query.toLowerCase();
    return cuisines.filter((c) => c.toLowerCase().includes(q));
  }, [cuisines, query]);

  return (
    <div className="cuisine-selector">
      <label className="label">Continent</label>
      <select
        value={continent}
        onChange={(e) => {
          setContinent(e.target.value);
          setQuery("");
        }}
      >
        <option value="">-- Select a continent --</option>
        {continentList.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <div className="helper small" style={{ marginTop: 6 }}>
        Choose a continent to load cuisines (or use the quick buttons above).
      </div>

      <div style={{ height: 8 }} />

      <label className="label">Search / Choose cuisine</label>
      <input
        type="text"
        placeholder={continent ? "Search cuisines..." : "Select a continent first"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={!continent || loading}
      />

      <div className="cuisine-list" role="list" aria-label="Cuisines list">
        {loading && <div className="helper">Loading cuisines...</div>}
        {error && <div className="helper" style={{ color: "salmon" }}>{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="helper">{continent ? "No cuisines found." : "Choose a continent first."}</div>
        )}

        {filtered.map((c) => (
          <button
            key={c}
            type="button"
            className="cuisine-item"
            onClick={() => onSelect && onSelect(c, continent)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

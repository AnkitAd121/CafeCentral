import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cafes } from "@/data/cafes";
import CafeCard from "@/components/CafeCard";
import { Search, SlidersHorizontal, Wifi, Plug, Volume2, Sun, CloudRain, X } from "lucide-react";

const FILTERS = [
  { key: "wifi", label: "WiFi", icon: Wifi },
  { key: "powerOutlets", label: "Power Outlets", icon: Plug },
  { key: "quiet", label: "Quiet", icon: Volume2 },
  { key: "goldenHour", label: "Golden Hour", icon: Sun },
  { key: "monsoonMode", label: "Monsoon Mode", icon: CloudRain },
];

const neighborhoods = [...new Set(cafes.map((c) => c.neighborhood))];

export default function Directory() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [neighborhood, setNeighborhood] = useState(params.get("neighborhood") || "All");
  const [active, setActive] = useState(params.get("filter") ? [params.get("filter")] : []);
  const [showFilters, setShowFilters] = useState(Boolean(params.get("filter")));

  const toggleFilter = (key) =>
    setActive((a) => (a.includes(key) ? a.filter((k) => k !== key) : [...a, key]));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cafes.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.neighborhood.toLowerCase().includes(q) ||
        c.vibe.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      const matchesNeighborhood = neighborhood === "All" || c.neighborhood === neighborhood;
      const matchesFilters = active.every((f) => {
        if (f === "quiet") return c.noiseLevel === "quiet";
        return c[f];
      });
      return matchesQuery && matchesNeighborhood && matchesFilters;
    });
  }, [query, neighborhood, active]);

  const clearAll = () => {
    setActive([]);
    setQuery("");
    setNeighborhood("All");
  };

  return (
    <div className="bg-background">
      {/* ===== DARK HEADER (top) ===== */}
      <section className="bg-espresso text-cream rounded-b-[2.5rem] sm:rounded-b-[3.5rem] px-5 sm:px-8 pt-28 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="fade-up font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-cream">
            The Guwahati Guide
          </h1>
          <p className="fade-up delay-100 text-cream/60 mt-3">
            {cafes.length} curated cafes · {neighborhoods.length} neighborhoods
          </p>

          <div className="fade-up delay-200 mt-8 rounded-[1.75rem] bg-cream/[0.06] border border-cream/10 p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-cream/40" />
              <input
                data-testid="directory-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or vibe (e.g. Minimalist, Riverside)…"
                className="w-full h-14 pl-14 pr-5 rounded-2xl bg-cream/[0.04] text-cream placeholder:text-cream/40 border border-cream/10 focus:ring-2 focus:ring-amber/40 focus:outline-none text-base"
              />
            </div>

            {/* Neighborhood chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {["All", ...neighborhoods].map((n) => {
                const on = neighborhood === n;
                return (
                  <button
                    key={n}
                    data-testid={`neighborhood-${n.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setNeighborhood(n)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                      on
                        ? "bg-amber text-espresso"
                        : "border border-cream/15 text-cream/80 hover:border-amber hover:text-cream"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenity filter toggle */}
          <div className="fade-up delay-300 mt-4 flex flex-wrap items-center gap-2.5">
            <button
              data-testid="directory-filter-toggle"
              onClick={() => setShowFilters((s) => !s)}
              className={`h-10 px-4 rounded-full border flex items-center gap-2 text-sm transition-colors duration-300 ${
                showFilters || active.length ? "border-amber text-amber" : "border-cream/15 text-cream/70 hover:text-cream"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {active.length > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-amber text-espresso text-xs flex items-center justify-center">
                  {active.length}
                </span>
              )}
            </button>
            {showFilters &&
              FILTERS.map((f) => {
                const Icon = f.icon;
                const on = active.includes(f.key);
                return (
                  <button
                    key={f.key}
                    data-testid={`filter-chip-${f.key}`}
                    onClick={() => toggleFilter(f.key)}
                    className={`h-10 px-4 rounded-full flex items-center gap-2 text-sm transition-colors duration-300 ${
                      on ? "bg-amber text-espresso" : "border border-cream/15 text-cream/70 hover:text-cream"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {f.label}
                  </button>
                );
              })}
          </div>
        </div>
      </section>

      {/* ===== RESULTS (beige) ===== */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-2xl mt-5">No cafes match your filters</h3>
            <p className="text-muted-foreground mt-2">Try clearing a few to see more places.</p>
            <button
              data-testid="clear-filters-btn"
              onClick={clearAll}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm"
            >
              <X className="h-4 w-4" /> Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" data-testid="directory-grid">
            {filtered.map((c) => (
              <CafeCard key={c.id} cafe={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

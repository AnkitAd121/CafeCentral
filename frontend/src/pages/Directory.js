import { useMemo, useState } from "react";
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

export default function Directory() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [active, setActive] = useState([]);

  const toggleFilter = (key) =>
    setActive((a) => (a.includes(key) ? a.filter((k) => k !== key) : [...a, key]));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cafes.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.neighborhood.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      const matchesFilters = active.every((f) => {
        if (f === "quiet") return c.noiseLevel === "quiet";
        return c[f];
      });
      return matchesQuery && matchesFilters;
    });
  }, [query, active]);

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-muted/60 dark:bg-[hsl(25_16%_10%)] border-b border-warmborder transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <h1 className="fade-up font-serif text-4xl sm:text-5xl font-semibold tracking-tight">
            Cafe Directory
          </h1>
          <p className="fade-up delay-100 text-muted-foreground mt-3">
            {cafes.length} curated cafes in Guwahati
          </p>

          <div className="fade-up delay-200 mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                data-testid="directory-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, area, or vibe..."
                className="w-full h-12 pl-11 pr-4 rounded-full bg-background border border-warmborder focus:ring-2 focus:ring-primary/30 focus:outline-none text-sm"
              />
            </div>
            <button
              data-testid="directory-filter-toggle"
              onClick={() => setShowFilters((s) => !s)}
              className={`h-12 px-5 rounded-full border flex items-center justify-center gap-2 text-sm transition-colors duration-300 ${
                showFilters || active.length
                  ? "border-primary text-primary"
                  : "border-warmborder text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {active.length > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {active.length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="fade-up mt-5 flex flex-wrap gap-2.5">
              {FILTERS.map((f) => {
                const Icon = f.icon;
                const on = active.includes(f.key);
                return (
                  <button
                    key={f.key}
                    data-testid={`filter-chip-${f.key}`}
                    onClick={() => toggleFilter(f.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors duration-300 ${
                      on
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-warmborder text-muted-foreground hover:border-primary"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {f.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-2xl mt-5">No cafes match your filters</h3>
            <p className="text-muted-foreground mt-2">Try clearing a few to see more places.</p>
            <button
              data-testid="clear-filters-btn"
              onClick={() => {
                setActive([]);
                setQuery("");
              }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm"
            >
              <X className="h-4 w-4" /> Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" data-testid="directory-grid">
            {filtered.map((c) => (
              <CafeCard key={c.id} cafe={c} enableHover />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

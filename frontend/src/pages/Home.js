import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cafes } from "@/data/cafes";
import CafeCard from "@/components/CafeCard";
import SurpriseMe from "@/components/SurpriseMe";
import FeaturedCafe from "@/components/FeaturedCafe";
import { Coffee, Sun, CloudRain, Search, ArrowRight } from "lucide-react";

const neighborhoods = [...new Set(cafes.map((c) => c.neighborhood))];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const goToSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/directory?q=${encodeURIComponent(query.trim())}` : "/directory");
  };

  return (
    <div className="bg-background">
      {/* ===== DARK HERO (top) ===== */}
      <section className="bg-espresso text-cream rounded-b-[2.5rem] sm:rounded-b-[3.5rem] px-5 sm:px-8 pt-28 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto">
          <span className="fade-up inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-cream/10 border border-cream/15 text-cream/80">
            <Coffee className="h-3.5 w-3.5 text-amber" /> Guwahati's curated cafe guide
          </span>

          <h1 className="fade-up delay-100 mt-7 text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.04] tracking-tight max-w-3xl text-cream">
            Find your perfect{" "}
            <span className="text-amber italic">third place</span>
          </h1>

          <p className="fade-up delay-200 mt-6 text-base sm:text-lg text-cream/70 max-w-2xl leading-relaxed">
            A carefully curated guide to Guwahati's most atmospheric, functional, and
            soulful cafes — filtered for how you actually feel right now.
          </p>

          {/* Search panel */}
          <div className="fade-up delay-300 mt-10 rounded-[1.75rem] bg-cream/[0.06] border border-cream/10 p-3 sm:p-4">
            <form onSubmit={goToSearch} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-cream/40" />
              <input
                data-testid="home-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or vibe (e.g. Minimalist, Riverside)…"
                className="w-full h-14 pl-14 pr-5 rounded-2xl bg-cream/[0.04] text-cream placeholder:text-cream/40 border border-cream/10 focus:ring-2 focus:ring-amber/40 focus:outline-none text-base"
              />
            </form>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/directory"
                data-testid="home-neighborhood-all"
                className="px-5 py-2.5 rounded-full text-sm font-medium bg-amber text-espresso hover:bg-amber/90 transition-colors duration-300"
              >
                All
              </Link>
              {neighborhoods.map((n) => (
                <Link
                  key={n}
                  to={`/directory?neighborhood=${encodeURIComponent(n)}`}
                  data-testid={`home-neighborhood-${n.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-5 py-2.5 rounded-full text-sm font-medium border border-cream/15 text-cream/80 hover:border-amber hover:text-cream transition-colors duration-300"
                >
                  {n}
                </Link>
              ))}
            </div>
          </div>

          {/* Random cafe picker */}
          <div className="fade-up delay-300 mt-5">
            <SurpriseMe />
          </div>
        </div>
      </section>

      {/* ===== LIGHT BEIGE BODY ===== */}
      {/* Golden Hour + Monsoon Mode */}
      <section className="px-5 sm:px-8 -mt-6 sm:-mt-8 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <Link
            to="/directory?filter=goldenHour"
            data-testid="golden-hour-card"
            className="fade-up group rounded-[1.5rem] bg-card border border-warmborder p-7 sm:p-8 flex items-start justify-between gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(40,24,12,0.35)]"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-amber">
                Golden Hour
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold mt-3">Best for Sunsets</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Rooftops, river views & that warm amber glow.
              </p>
            </div>
            <span className="h-12 w-12 shrink-0 rounded-full bg-amber/15 flex items-center justify-center text-amber transition-transform duration-500 group-hover:rotate-12">
              <Sun className="h-5 w-5" />
            </span>
          </Link>

          <Link
            to="/directory?filter=monsoonMode"
            data-testid="monsoon-card"
            className="fade-up delay-100 group rounded-[1.5rem] bg-card border border-warmborder p-7 sm:p-8 flex items-start justify-between gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(40,24,12,0.35)]"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-400">
                Monsoon Mode
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold mt-3">Cozy &amp; Enclosed</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Snug, covered corners for Guwahati's rainy days.
              </p>
            </div>
            <span className="h-12 w-12 shrink-0 rounded-full bg-blue-400/15 flex items-center justify-center text-blue-400 transition-transform duration-500 group-hover:-translate-y-0.5">
              <CloudRain className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </section>

      <FeaturedCafe />

      {/* The Collection */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">
                The Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-2">
                Every cafe, hand-picked
              </h2>
            </div>
            <Link
              to="/directory"
              data-testid="collection-see-all"
              className="text-sm text-primary hover:underline shrink-0 flex items-center gap-1"
            >
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {cafes.map((c) => (
              <CafeCard key={c.id} cafe={c} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 px-5 sm:px-8 border-t border-warmborder">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-serif text-lg font-semibold">CafeCentral</span>
          </Link>
          <p className="text-sm text-muted-foreground font-serif italic">
            A love letter to Guwahati's cafe culture. Made with care.
          </p>
        </div>
      </footer>
    </div>
  );
}

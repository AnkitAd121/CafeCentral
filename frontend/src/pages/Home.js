import { Link } from "react-router-dom";
import { cafes } from "@/data/cafes";
import { useTheme } from "@/context/ThemeContext";
import CafeCard from "@/components/CafeCard";
import { Button } from "@/components/ui/button";
import { Coffee, Sun, CloudRain, ArrowRight } from "lucide-react";

export default function Home() {
  const { night, toggle } = useTheme();
  const goldenHourCafes = cafes.filter((c) => c.goldenHour).slice(0, 3);
  const monsoonCafes = cafes.filter((c) => c.monsoonMode).slice(0, 3);

  return (
    <div className="pt-16">
      {/* HERO */}
      <section className="min-h-[90vh] flex items-center transition-colors duration-1000 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 transition-colors duration-1000"
          style={{
            background: night
              ? "linear-gradient(180deg, hsl(25 20% 6%) 0%, hsl(25 20% 8%) 100%)"
              : "linear-gradient(180deg, hsl(36 40% 92%) 0%, hsl(36 33% 97%) 55%)",
          }}
        />
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-24">
          <span className="fade-up inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-card border border-warmborder text-muted-foreground">
            <Coffee className="h-3.5 w-3.5 text-primary" /> Guwahati's curated cafe guide
          </span>

          <h1 className="fade-up delay-100 mt-7 text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-3xl">
            Find your perfect{" "}
            <span className="text-primary italic">third place</span>
          </h1>

          <p className="fade-up delay-200 mt-7 text-base sm:text-lg text-foreground/80 max-w-2xl leading-relaxed">
            A carefully curated guide to Guwahati's most atmospheric, functional, and
            soulful cafes — filtered for how you actually feel right now.
          </p>

          <div className="fade-up delay-300 mt-9 flex flex-col sm:flex-row gap-3">
            <Link to="/directory">
              <Button
                data-testid="hero-explore-btn"
                className="rounded-full px-7 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                Explore all cafes <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              data-testid="hero-ambiance-toggle"
              onClick={toggle}
              variant="outline"
              className="rounded-full px-7 h-12 text-base border-warmborder hover:border-primary w-full sm:w-auto"
            >
              {night ? <Sun className="h-4 w-4" /> : <CloudRain className="h-4 w-4" />}
              {night ? "Switch to Day" : "Switch to Night"}
            </Button>
          </div>
        </div>
      </section>

      {/* GOLDEN HOUR */}
      <section className="py-20 sm:py-24 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-amber font-medium">
                <Sun className="h-4 w-4" /> Golden Hour
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-2">
                Best for sunset views
              </h2>
            </div>
            <Link
              to="/directory"
              data-testid="golden-hour-see-all"
              className="text-sm text-primary hover:underline shrink-0 flex items-center gap-1"
            >
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {goldenHourCafes.map((c) => (
              <CafeCard key={c.id} cafe={c} enableHover />
            ))}
          </div>
        </div>
      </section>

      {/* MONSOON MODE */}
      <section className="py-20 sm:py-24 px-5 sm:px-8 bg-muted/50 dark:bg-[hsl(25_18%_9%)] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-blue-400 font-medium">
                <CloudRain className="h-4 w-4" /> Monsoon Mode
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-2">
                Cozy rainy-day picks
              </h2>
            </div>
            <Link
              to="/directory"
              data-testid="monsoon-see-all"
              className="text-sm text-primary hover:underline shrink-0 flex items-center gap-1"
            >
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {monsoonCafes.map((c) => (
              <CafeCard key={c.id} cafe={c} enableHover />
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

import { Link } from "react-router-dom";
import { cafes } from "@/data/cafes";
import { getWeeklyFeatured, featuredBlurbs } from "@/lib/cafeUtils";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Wifi, WifiOff, Sparkles, ArrowRight } from "lucide-react";

export default function FeaturedCafe() {
  const cafe = getWeeklyFeatured(cafes);
  const blurb = featuredBlurbs[cafe.id];

  return (
    <section className="px-5 sm:px-8 py-16 sm:py-20" data-testid="featured-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-amber">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.18em] font-semibold">Featured this week</span>
        </div>

        <Link
          to={`/cafe/${cafe.id}`}
          data-testid="featured-cafe-card"
          className="group grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden border border-warmborder bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(40,24,12,0.4)]"
        >
          <div className="relative overflow-hidden aspect-[16/11] lg:aspect-auto lg:min-h-[360px]">
            <img
              src={cafe.heroImage}
              alt={cafe.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute top-4 left-4 bg-espresso/90 text-cream rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase">
              {cafe.vibe}
            </span>
          </div>

          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              {cafe.name}
            </h2>
            <p className="font-serif italic text-muted-foreground mt-3 text-lg leading-relaxed">
              {blurb}
            </p>

            <div className="flex flex-wrap items-center gap-5 mt-7 text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <Star className="h-4 w-4 fill-amber text-amber" /> {cafe.rating}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {cafe.neighborhood}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                {cafe.wifi ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                {cafe.wifi ? "WiFi" : "No WiFi"}
              </span>
            </div>

            <div className="mt-8">
              <Button className="rounded-full px-7 h-12 bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-none">
                Explore this week's pick <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

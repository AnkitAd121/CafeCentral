import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Trash2 } from "lucide-react";

// Apple-minimal cafe card: rests as a single photo, and on hover the image
// splits into a two-shot gallery while the footer reveals location + price.
export default function CafeCard({ cafe, onRemove = null }) {
  return (
    <div className="relative" data-testid={`cafe-card-${cafe.id}`}>
      <Link to={`/cafe/${cafe.id}`} className="block group">
        <div className="rounded-[1.5rem] overflow-hidden bg-card border border-warmborder transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_70px_-24px_rgba(40,24,12,0.4)]">
          {/* IMAGE REGION */}
          <div className="relative overflow-hidden aspect-[5/4]">
            {/* Resting state: single hero photo */}
            <img
              src={cafe.heroImage}
              alt={cafe.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-hover:scale-105"
            />
            {/* Hover state: two-shot split gallery */}
            <div className="absolute inset-0 grid grid-cols-2 gap-0.5 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100">
              <img src={cafe.gallery[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
              <img src={cafe.gallery[1]} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>

            {/* Vibe pill — always visible */}
            <span
              data-testid={`cafe-vibe-${cafe.id}`}
              className="absolute top-4 left-4 bg-background/95 text-foreground rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase shadow-sm"
            >
              {cafe.vibe}
            </span>

            {/* Price badge — reveals on hover */}
            <span
              data-testid={`cafe-price-${cafe.id}`}
              className="absolute top-4 right-4 h-11 min-w-11 px-3 rounded-full bg-espresso text-cream flex items-center justify-center text-sm font-medium opacity-0 scale-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
            >
              {cafe.priceRange}
            </span>
          </div>

          {/* CONTENT REGION */}
          <div className="p-6">
            <h3 className="font-serif text-2xl font-semibold leading-tight transition-colors duration-500 group-hover:text-amber">
              {cafe.name}
            </h3>

            {/* Location — reserved height, slides + fades in on hover */}
            <div className="h-7 mt-2 overflow-hidden">
              <p className="flex items-center gap-2 text-muted-foreground opacity-0 -translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0">
                <MapPin className="h-4 w-4 shrink-0" />
                {cafe.neighborhood}, Guwahati
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-warmborder flex items-center justify-between">
              <span className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">
                Explore Space
              </span>
              <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </div>
        </div>
      </Link>

      {onRemove && (
        <button
          data-testid={`remove-cafe-${cafe.id}`}
          onClick={() => onRemove(cafe.id)}
          className="mt-3 w-full rounded-xl border border-warmborder py-2.5 text-sm text-muted-foreground hover:text-destructive hover:border-destructive transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" /> Remove from vault
        </button>
      )}
    </div>
  );
}

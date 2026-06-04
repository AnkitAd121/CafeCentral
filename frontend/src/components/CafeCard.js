import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Wifi, Plug, Sun, CloudRain, Clock, Volume2, Armchair, Trash2 } from "lucide-react";

const noiseColor = {
  quiet: "bg-emerald-500",
  moderate: "bg-amber-400",
  lively: "bg-rose-500",
};

export default function CafeCard({ cafe, enableHover = false, onRemove = null, index = 0 }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative"
      style={{ overflow: "visible" }}
      onMouseEnter={() => enableHover && setHover(true)}
      onMouseLeave={() => enableHover && setHover(false)}
      data-testid={`cafe-card-${cafe.id}`}
    >
      <Link to={`/cafe/${cafe.id}`} className="block group">
        <div className="rounded-2xl overflow-hidden bg-card border border-warmborder transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-[0_18px_45px_-15px_rgba(0,0,0,0.25)]">
          <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
            <img
              src={cafe.heroImage}
              alt={cafe.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3 flex gap-1.5">
              {cafe.goldenHour && (
                <span className="h-7 w-7 rounded-full bg-amber/90 flex items-center justify-center backdrop-blur-sm" title="Golden Hour">
                  <Sun className="h-3.5 w-3.5 text-espresso" />
                </span>
              )}
              {cafe.monsoonMode && (
                <span className="h-7 w-7 rounded-full bg-blue-400/90 flex items-center justify-center backdrop-blur-sm" title="Monsoon Mode">
                  <CloudRain className="h-3.5 w-3.5 text-white" />
                </span>
              )}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-xl font-semibold leading-tight">{cafe.name}</h3>
              <span className="flex items-center gap-1 shrink-0 text-sm font-medium">
                <Star className="h-4 w-4 fill-amber text-amber" />
                {cafe.rating}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {cafe.neighborhood} · {cafe.priceRange}
            </p>
            <p className="text-sm text-foreground/80 mt-2 line-clamp-2 font-serif italic">
              {cafe.tagline}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {cafe.tags.slice(0, 3).map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-warmborder text-muted-foreground">
              {cafe.wifi && <Wifi className="h-4 w-4" title="WiFi" />}
              {cafe.powerOutlets && <Plug className="h-4 w-4" title="Power Outlets" />}
              {cafe.goldenHour && <Sun className="h-4 w-4" title="Golden Hour" />}
              {cafe.monsoonMode && <CloudRain className="h-4 w-4" title="Monsoon Mode" />}
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

      {/* Floating info card on hover (desktop only) */}
      {enableHover && hover && (
        <div
          className="hidden lg:block absolute z-30 left-1/2 -translate-x-1/2 -top-3 -translate-y-full w-64 pop-in"
          data-testid={`floating-info-${cafe.id}`}
        >
          <div className="bg-card border border-warmborder rounded-xl p-3.5 shadow-lg space-y-2.5">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Open today: {cafe.hours}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Volume2 className="h-3.5 w-3.5 text-primary" />
              <span className={`h-2 w-2 rounded-full ${noiseColor[cafe.noiseLevel]}`} />
              <span className="capitalize text-muted-foreground">{cafe.noiseLevel}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Armchair className="h-3.5 w-3.5 text-primary" />
              <span className="capitalize text-muted-foreground">{cafe.seating} seating</span>
            </div>
            <div className="pt-2 border-t border-warmborder text-sm">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Must try</span>
              <p className="flex justify-between mt-0.5">
                <span className="font-medium">{cafe.mustTry[0].name}</span>
                <span className="text-primary font-medium">{cafe.mustTry[0].price}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

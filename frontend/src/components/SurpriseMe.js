import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { cafes } from "@/data/cafes";
import { isOpenNow } from "@/lib/cafeUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dices, MapPin, RefreshCw, ArrowRight } from "lucide-react";

export default function SurpriseMe() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("near"); // "near" = open now, "any" = all
  const [spinning, setSpinning] = useState(false);
  const [display, setDisplay] = useState(null);
  const [result, setResult] = useState(null);
  const [fallback, setFallback] = useState(false);
  const intervalRef = useRef(null);

  const buildPool = (m) => {
    if (m === "near") {
      const openCafes = cafes.filter((c) => isOpenNow(c));
      if (openCafes.length) return { pool: openCafes, fb: false };
      return { pool: cafes, fb: true };
    }
    return { pool: cafes, fb: false };
  };

  const spin = useCallback((m) => {
    clearInterval(intervalRef.current);
    const { pool, fb } = buildPool(m);
    setFallback(fb);
    setResult(null);
    setSpinning(true);
    let ticks = 0;
    intervalRef.current = setInterval(() => {
      setDisplay(pool[Math.floor(Math.random() * pool.length)]);
      ticks += 1;
      if (ticks >= 16) {
        clearInterval(intervalRef.current);
        const final = pool[Math.floor(Math.random() * pool.length)];
        setDisplay(final);
        setResult(final);
        setSpinning(false);
      }
    }, 85);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const launch = (m) => {
    setMode(m);
    setOpen(true);
    spin(m);
  };

  const switchMode = (m) => {
    setMode(m);
    spin(m);
  };

  const onOpenChange = (o) => {
    setOpen(o);
    if (!o) {
      clearInterval(intervalRef.current);
      setSpinning(false);
      setResult(null);
      setDisplay(null);
    }
  };

  const modeBtn = (active) =>
    `flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
      active ? "bg-primary text-primary-foreground" : "border border-warmborder text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      <button
        data-testid="surprise-me-btn"
        onClick={() => launch("near")}
        className="group inline-flex items-center gap-2.5 rounded-full border border-cream/20 bg-cream/[0.05] px-6 py-3 text-sm font-medium text-cream hover:border-amber hover:text-amber transition-colors duration-300"
      >
        <Dices className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[20deg]" />
        Can't decide? Surprise me
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md rounded-2xl" data-testid="surprise-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Let fate pick your cup</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2">
            <button data-testid="surprise-mode-near" onClick={() => switchMode("near")} className={modeBtn(mode === "near")}>
              Near me · Open now
            </button>
            <button data-testid="surprise-mode-any" onClick={() => switchMode("any")} className={modeBtn(mode === "any")}>
              Any cafe
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-warmborder aspect-[16/10] bg-muted">
            {display && (
              <img
                key={`${display.id}-${result ? "final" : "spin"}`}
                src={display.heroImage}
                alt=""
                className={`h-full w-full object-cover ${spinning ? "blur-[2px] scale-105" : "pop-in"}`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent flex items-end p-4">
              <div className="text-cream">
                <p className="font-serif text-xl font-semibold" data-testid="surprise-result-name">
                  {display ? display.name : "…"}
                </p>
                {result && (
                  <p className="text-sm text-cream/80 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" /> {result.neighborhood} · {result.priceRange}
                  </p>
                )}
              </div>
            </div>
            {spinning && (
              <div className="absolute top-3 right-3">
                <RefreshCw className="h-5 w-5 text-cream animate-spin" />
              </div>
            )}
          </div>

          {fallback && (
            <p className="text-xs text-muted-foreground text-center">
              Nothing's open right now — spinning through all of Guwahati instead.
            </p>
          )}

          {result ? (
            <div className="flex gap-2">
              <Button
                data-testid="surprise-reroll"
                variant="outline"
                onClick={() => spin(mode)}
                className="rounded-full border-warmborder"
              >
                <RefreshCw className="h-4 w-4" /> Re-roll
              </Button>
              <Link to={`/cafe/${result.id}`} className="flex-1" onClick={() => onOpenChange(false)}>
                <Button data-testid="surprise-visit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Visit {result.name} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground h-9 flex items-center justify-center">
              {spinning ? "Finding your spot…" : ""}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

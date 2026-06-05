import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCafeById } from "@/data/cafes";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Star, MapPin, Clock, Volume2, Wifi, Plug, Sun, CloudRain,
  Bookmark, BookmarkCheck, Music, ArrowLeft, ExternalLink,
} from "lucide-react";

export default function CafeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cafe = getCafeById(id);
  const { user, login } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!user || !cafe) return;
    api.get("/saved").then((res) => setSaved(res.data.includes(cafe.id))).catch(() => {});
  }, [user, cafe]);

  if (!cafe) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <h1 className="font-serif text-3xl">Cafe not found</h1>
        <Link to="/directory" className="text-primary hover:underline mt-4 inline-block">
          Back to directory
        </Link>
      </div>
    );
  }

  const toggleSave = async () => {
    if (!user) {
      toast.error("Sign in to save cafes to your vault");
      login();
      return;
    }
    setBusy(true);
    try {
      if (saved) {
        await api.delete(`/saved/${cafe.id}`);
        setSaved(false);
        toast.success("Removed from your vault");
      } else {
        await api.post("/saved", { cafe_id: cafe.id });
        setSaved(true);
        toast.success(`${cafe.name} saved to your vault`);
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(cafe.address)}&z=15&output=embed`;

  return (
    <div className="pt-20 pb-20 px-5 sm:px-8" data-testid="cafe-detail-page">
      <div className="max-w-6xl mx-auto">
        <button
          data-testid="back-to-directory"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Gallery */}
        <div className="fade-up grid grid-cols-4 grid-rows-2 gap-3 rounded-2xl overflow-hidden h-[400px]">
          <div className="col-span-2 row-span-2 overflow-hidden">
            <img src={cafe.heroImage} alt={cafe.name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          {cafe.gallery.slice(0, 3).map((g, i) => (
            <div key={g} className="overflow-hidden">
              <img src={g} alt={`${cafe.name} ${i + 1}`} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
          <div className="overflow-hidden">
            <img src={cafe.gallery[0]} alt={`${cafe.name} detail`} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          <div className="lg:col-span-2 fade-up delay-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight">{cafe.name}</h1>
                <p className="font-serif italic text-lg text-muted-foreground mt-2">{cafe.tagline}</p>
              </div>
              <button
                data-testid="detail-save-toggle"
                onClick={toggleSave}
                disabled={busy}
                aria-label="Save cafe"
                className={`shrink-0 h-11 w-11 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                  saved ? "bg-primary border-primary text-primary-foreground" : "border-warmborder text-muted-foreground hover:border-primary"
                }`}
              >
                {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <span className="flex items-center gap-1 font-medium">
                <Star className="h-4 w-4 fill-amber text-amber" /> {cafe.rating}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{cafe.neighborhood}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{cafe.priceRange}</span>
              {cafe.goldenHour && (
                <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-amber/15 text-amber-700 dark:text-amber">
                  <Sun className="h-3 w-3" /> Golden Hour
                </span>
              )}
              {cafe.monsoonMode && (
                <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-400/15 text-blue-500">
                  <CloudRain className="h-3 w-3" /> Monsoon Mode
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {cafe.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
              ))}
            </div>

            <p className="text-foreground mt-7 leading-relaxed">{cafe.description}</p>
            <div className="text-muted-foreground mt-4 leading-relaxed space-y-4">
              {cafe.longDescription.split("\n\n").map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>

            {/* Must Try */}
            <h2 className="font-serif text-2xl font-semibold mt-12 mb-5">Must Try</h2>
            <div className="space-y-3">
              {cafe.mustTry.map((m) => (
                <div key={m.name} className="rounded-2xl border border-warmborder bg-card p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-semibold">{m.name}</h3>
                    <span className="text-primary font-medium shrink-0">{m.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5">{m.note}</p>
                </div>
              ))}
            </div>

            {/* Ambiance */}
            <h2 className="font-serif text-2xl font-semibold mt-12 mb-5">Ambiance</h2>
            <div className="flex flex-wrap gap-2.5">
              {cafe.ambiance.map((a) => (
                <span key={a} className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-muted text-foreground/80">
                  <Music className="h-3.5 w-3.5 text-primary" /> {a}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 fade-up delay-200 space-y-4">
              <div className="rounded-2xl border border-warmborder bg-card p-6">
                <h3 className="font-serif text-xl font-semibold mb-4">Quick Info</h3>
                <div className="space-y-3.5 text-sm">
                  <div className="flex gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{cafe.address}</span>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{cafe.hours}</span>
                  </div>
                  <div className="flex gap-3">
                    <Volume2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground capitalize">{cafe.noiseLevel} noise level</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <span className={`flex items-center gap-2 ${cafe.wifi ? "text-foreground/80" : "text-muted-foreground line-through"}`}>
                      <Wifi className="h-4 w-4" /> WiFi
                    </span>
                    <span className={`flex items-center gap-2 ${cafe.powerOutlets ? "text-foreground/80" : "text-muted-foreground line-through"}`}>
                      <Plug className="h-4 w-4" /> Outlets
                    </span>
                  </div>
                </div>

                <a href={cafe.mapUrl} target="_blank" rel="noopener noreferrer" data-testid="open-in-maps">
                  <Button className="w-full mt-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Open in Maps <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>

                <div className="mt-4 rounded-xl overflow-hidden border border-warmborder">
                  <iframe
                    title={`Map of ${cafe.name}`}
                    src={mapEmbed}
                    width="100%"
                    height="200"
                    style={{ border: "none" }}
                    loading="lazy"
                  />
                </div>
              </div>

              <Button
                data-testid="sidebar-save-toggle"
                onClick={toggleSave}
                disabled={busy}
                variant="outline"
                className={`w-full rounded-full border-warmborder ${saved ? "border-primary text-primary" : ""}`}
              >
                {saved ? <><BookmarkCheck className="h-4 w-4" /> ✓ Saved to Vault</> : <><Bookmark className="h-4 w-4" /> Save to Vault</>}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

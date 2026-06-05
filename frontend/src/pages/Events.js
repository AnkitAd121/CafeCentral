import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar, Coffee, BookOpen, Music, Sparkles, Lock, ArrowRight, Bell } from "lucide-react";

const TEASERS = [
  { title: "Saturday Cupping Sessions", cafe: "The Quiet Cup", when: "Every Saturday · 11 AM", icon: Coffee },
  { title: "Friday Poetry Nights", cafe: "Pages & Pour", when: "Fridays · 7 PM", icon: BookOpen },
  { title: "Latte Art Throwdown", cafe: "The Daily Grind", when: "Monthly · TBA", icon: Sparkles },
  { title: "Sunset Acoustic Sessions", cafe: "Rooftop Ritual", when: "Weekends · 6 PM", icon: Music },
];

export default function Events() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const notify = async (e) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/events/notify", { email });
      toast.success("You're on the list! We'll email you the moment events go live.");
      setEmail("");
    } catch (err) {
      toast.error("Couldn't sign you up. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background" data-testid="events-page">
      {/* DARK HERO */}
      <section className="bg-espresso text-cream rounded-b-[2.5rem] sm:rounded-b-[3.5rem] px-5 sm:px-8 pt-28 pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <span className="fade-up inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full bg-cream/10 border border-cream/15 text-cream/80">
            <Calendar className="h-3.5 w-3.5 text-amber" /> Coming soon
          </span>

          <h1 className="fade-up delay-100 mt-7 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-cream">
            Events are <span className="text-amber italic">brewing</span>
          </h1>

          <p className="fade-up delay-200 mt-6 text-base sm:text-lg text-cream/70 max-w-2xl mx-auto leading-relaxed">
            Cupping mornings, poetry nights, latte-art throwdowns and rooftop acoustic sets —
            hosted by the cafes you love. We're putting the final foam on it. Be the first to know.
          </p>

          <form onSubmit={notify} className="fade-up delay-300 mt-9 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              data-testid="events-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 h-12 px-5 rounded-full bg-cream/[0.06] text-cream placeholder:text-cream/40 border border-cream/15 focus:ring-2 focus:ring-amber/40 focus:outline-none text-sm"
            />
            <Button
              type="submit"
              data-testid="events-notify-btn"
              disabled={submitting}
              className="h-12 rounded-full px-6 bg-amber text-espresso hover:bg-amber/90"
            >
              <Bell className="h-4 w-4" /> {submitting ? "Adding…" : "Notify me"}
            </Button>
          </form>
        </div>
      </section>

      {/* TEASER GRID */}
      <section className="px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-center">A taste of what's coming</h2>
          <p className="text-muted-foreground text-center mt-3">A sneak peek at the kinds of nights we're lining up.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {TEASERS.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  data-testid={`event-teaser-${t.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="relative rounded-2xl border border-warmborder bg-card p-6 overflow-hidden"
                >
                  <span className="absolute top-4 right-4 flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                    <Lock className="h-3 w-3" /> Soon
                  </span>
                  <span className="h-11 w-11 rounded-full bg-amber/15 text-amber flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-serif text-xl font-semibold mt-5 leading-snug">{t.title}</h3>
                  <p className="text-sm text-primary mt-1">{t.cafe}</p>
                  <p className="text-sm text-muted-foreground mt-3">{t.when}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-14">
            <p className="font-serif italic text-muted-foreground">
              Run a cafe in Guwahati? Host your event here when we launch.
            </p>
            <Link
              to="/directory"
              data-testid="events-explore-link"
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm"
            >
              Explore cafes meanwhile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

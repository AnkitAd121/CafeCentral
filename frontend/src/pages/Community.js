import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { cafes, getCafeById } from "@/data/cafes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, Send } from "lucide-react";

function timeAgo(iso) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const day = 86400000;
  const hr = 3600000;
  if (diff < hr) return "Just now";
  if (diff < day) return `${Math.floor(diff / hr)}h ago`;
  const days = Math.floor(diff / day);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

export default function Community() {
  const { user, login } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [cafeId, setCafeId] = useState(cafes[0].id);
  const [rating, setRating] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get("/reviews").then((res) => setReviews(res.data)).catch(() => {});
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please write a few words about your visit");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/reviews", { cafe_id: cafeId, rating, text });
      setReviews((r) => [res.data, ...r]);
      setText("");
      setRating(5);
      toast.success("Your review is live. Thank you!");
    } catch (e) {
      toast.error("Couldn't post your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-20 px-5 sm:px-8" data-testid="community-page">
      <div className="max-w-6xl mx-auto">
        <div className="fade-up border-b border-warmborder pb-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight">Community</h1>
          <p className="text-muted-foreground mt-3 font-serif italic">
            Notes from fellow wanderers of Guwahati's cafe trail.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mt-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-warmborder bg-card p-6 fade-up delay-100">
              <h2 className="font-serif text-2xl font-semibold">Write a review</h2>

              {user ? (
                <form onSubmit={submit} className="mt-5 space-y-4" data-testid="review-form">
                  <div>
                    <label className="text-sm text-muted-foreground">Cafe</label>
                    <select
                      data-testid="review-cafe-select"
                      value={cafeId}
                      onChange={(e) => setCafeId(e.target.value)}
                      className="w-full mt-1.5 h-11 px-3 rounded-xl bg-background border border-warmborder focus:ring-2 focus:ring-primary/30 focus:outline-none text-sm"
                    >
                      {cafes.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Rating</label>
                    <div className="flex gap-1.5 mt-1.5" data-testid="review-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          data-testid={`star-${s}`}
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverStar(s)}
                          onMouseLeave={() => setHoverStar(0)}
                        >
                          <Star
                            className={`h-7 w-7 transition-colors duration-200 ${
                              (hoverStar || rating) >= s ? "fill-amber text-amber" : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Your thoughts</label>
                    <textarea
                      data-testid="review-text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={4}
                      placeholder="What did the light feel like? What did you order?"
                      className="w-full mt-1.5 p-3 rounded-xl bg-background border border-warmborder focus:ring-2 focus:ring-primary/30 focus:outline-none text-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    data-testid="submit-review-btn"
                    disabled={submitting}
                    className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {submitting ? "Posting…" : <>Post review <Send className="h-4 w-4" /></>}
                  </Button>
                </form>
              ) : (
                <div className="mt-5 text-center py-6">
                  <p className="text-muted-foreground">Sign in to leave a review.</p>
                  <Button
                    data-testid="community-signin-btn"
                    onClick={login}
                    className="mt-4 rounded-full bg-primary text-primary-foreground"
                  >
                    Sign in
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3 space-y-5" data-testid="reviews-feed">
            {reviews.length === 0 && (
              <p className="text-muted-foreground">No reviews yet. Be the first.</p>
            )}
            {reviews.map((r) => {
              const cafe = getCafeById(r.cafe_id);
              const username = r.user_email ? r.user_email.split("@")[0] : r.user_name;
              return (
                <div
                  key={r.id}
                  data-testid={`review-${r.id}`}
                  className="rounded-2xl border border-warmborder bg-card p-5 fade-up"
                >
                  <div className="flex items-start gap-3">
                    <span className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-serif font-semibold uppercase shrink-0">
                      {(r.user_name || username || "?")[0]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{username}</p>
                        <span className="text-xs text-muted-foreground shrink-0">{timeAgo(r.created_at)}</span>
                      </div>
                      <p className="text-sm text-primary">{cafe ? cafe.name : r.cafe_id}</p>
                      <div className="flex gap-0.5 mt-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${r.rating >= s ? "fill-amber text-amber" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{r.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

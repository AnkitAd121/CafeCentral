import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { cafes } from "@/data/cafes";
import CafeCard from "@/components/CafeCard";
import { toast } from "sonner";
import { Bookmark, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/saved")
      .then((res) => setSavedIds(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const savedCafes = cafes.filter((c) => savedIds.includes(c.id));

  const remove = async (cafeId) => {
    const prev = savedIds;
    setSavedIds((ids) => ids.filter((id) => id !== cafeId)); // optimistic
    try {
      await api.delete(`/saved/${cafeId}`);
      toast.success("Removed from your vault");
    } catch (e) {
      setSavedIds(prev);
      toast.error("Couldn't remove. Try again.");
    }
  };

  return (
    <div className="pt-20 pb-20 px-5 sm:px-8" data-testid="dashboard-page">
      <div className="max-w-7xl mx-auto">
        <div className="fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-warmborder pb-8">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight">Your Vault</h1>
            <p className="text-muted-foreground mt-3">
              {user?.email} · {savedCafes.length} saved {savedCafes.length === 1 ? "cafe" : "cafes"}
            </p>
          </div>
          <button
            data-testid="dashboard-signout"
            onClick={logout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 self-start"
          >
            Sign out
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-warmborder bg-card h-80 animate-pulse" />
            ))}
          </div>
        ) : savedCafes.length === 0 ? (
          <div className="text-center py-28 fade-up">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Bookmark className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-2xl mt-5">Your vault is empty</h3>
            <p className="text-muted-foreground mt-2">Start collecting the cafes that feel like home.</p>
            <Link
              to="/directory"
              data-testid="empty-explore-link"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm"
            >
              Explore cafes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10" data-testid="vault-grid">
            {savedCafes.map((c) => (
              <CafeCard key={c.id} cafe={c} onRemove={remove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

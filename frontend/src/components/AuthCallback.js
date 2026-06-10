import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Coffee } from "lucide-react";

// With Google GIS popup flow, there is no redirect callback page needed.
// This component exists as a safe fallback — if someone lands on /auth/callback,
// redirect them to dashboard if logged in, or login if not.
export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center animate-pulse">
        <Coffee className="h-7 w-7 text-primary-foreground" />
      </div>
      <p className="mt-5 text-muted-foreground font-serif italic text-lg">Brewing your session…</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await login();
      navigate("/dashboard", { replace: true });
    } catch (e) {
      // User closed the popup — don't show an error
      if (e?.message !== "popup_closed_by_user" && e?.message !== "access_denied") {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-16">
      <div className="w-full max-w-md fade-up" data-testid="login-card">
        <div className="rounded-2xl border border-warmborder bg-card p-9 text-center">
          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center mx-auto">
            <Coffee className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-semibold mt-6">Welcome to Guwahati Central</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Sign in to save your favourite third places, build your vault, and share
            reviews with Guwahati's cafe community.
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-500">{error}</p>
          )}

          <Button
            data-testid="google-signin-btn"
            onClick={handleLogin}
            disabled={signingIn}
            className="w-full mt-8 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-base"
          >
            {signingIn ? "Signing in…" : "Continue with Google"}
          </Button>
          <p className="text-xs text-muted-foreground mt-5 font-serif italic">
            One quiet tap, and your coffee corner remembers you.
          </p>
        </div>
      </div>
    </div>
  );
}

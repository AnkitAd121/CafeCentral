import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-16">
      <div className="w-full max-w-md fade-up" data-testid="login-card">
        <div className="rounded-2xl border border-warmborder bg-card p-9 text-center">
          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center mx-auto">
            <Coffee className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-semibold mt-6">Welcome to CafeCentral</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Sign in to save your favourite third places, build your vault, and share
            reviews with Guwahati's cafe community.
          </p>

          <Button
            data-testid="google-signin-btn"
            onClick={login}
            className="w-full mt-8 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-base"
          >
            Continue with Google
          </Button>

          <p className="text-xs text-muted-foreground mt-5 font-serif italic">
            One quiet tap, and your coffee corner remembers you.
          </p>
        </div>
      </div>
    </div>
  );
}

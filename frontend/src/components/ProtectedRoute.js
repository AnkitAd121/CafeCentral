import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Coffee } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center animate-pulse">
          <Coffee className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

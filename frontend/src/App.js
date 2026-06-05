import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import AuthCallback from "@/components/AuthCallback";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Directory from "@/pages/Directory";
import CafeDetail from "@/pages/CafeDetail";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Community from "@/pages/Community";
import Events from "@/pages/Events";

function AppRouter() {
  const location = useLocation();

  // Process OAuth callback FIRST (synchronously) before any route/auth check.
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/cafe/:id" element={<CafeDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/community" element={<Community />} />
        <Route path="/events" element={<Events />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App min-h-screen bg-background text-foreground transition-colors duration-500">
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

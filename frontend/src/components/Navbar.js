import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Coffee, Menu, X, Sun, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavLink = ({ to, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    data-testid={`nav-link-${label.toLowerCase()}`}
    className={`text-sm transition-colors duration-300 ${
      active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {label}
  </Link>
);

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { night, toggle } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const path = location.pathname;

  const links = [
    { to: "/directory", label: "Directory" },
    { to: "/events", label: "Events" },
    { to: "/community", label: "Community" },
  ];
  if (user) links.push({ to: "/dashboard", label: "Dashboard" });

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-warmborder">
      <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2.5 group">
          <span className="h-9 w-9 rounded-full bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Coffee className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">CafeCentral</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} label={l.label} active={path === l.to} />
          ))}
          <button
            data-testid="navbar-theme-toggle"
            onClick={toggle}
            aria-label="Toggle ambiance"
            className="h-9 w-9 rounded-full border border-warmborder flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-300"
          >
            {night ? <Sun className="h-4 w-4" /> : <CloudRain className="h-4 w-4" />}
          </button>
          {user ? (
            <button
              data-testid="navbar-signout"
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Sign Out
            </button>
          ) : (
            <Button
              data-testid="navbar-signin"
              onClick={login}
              className="rounded-full px-5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button
            data-testid="navbar-theme-toggle-mobile"
            onClick={toggle}
            aria-label="Toggle ambiance"
            className="h-9 w-9 rounded-full border border-warmborder flex items-center justify-center text-muted-foreground"
          >
            {night ? <Sun className="h-4 w-4" /> : <CloudRain className="h-4 w-4" />}
          </button>
          <button
            data-testid="navbar-menu-toggle"
            onClick={() => setOpen((o) => !o)}
            className="h-9 w-9 rounded-full border border-warmborder flex items-center justify-center"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-background border-b border-warmborder px-5 py-5 flex flex-col gap-4 pop-in">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              label={l.label}
              active={path === l.to}
              onClick={() => setOpen(false)}
            />
          ))}
          {user ? (
            <button
              data-testid="navbar-signout-mobile"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="text-left text-sm text-muted-foreground"
            >
              Sign Out
            </button>
          ) : (
            <Button
              data-testid="navbar-signin-mobile"
              onClick={login}
              className="rounded-full bg-primary text-primary-foreground w-fit px-5"
            >
              Sign In
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}

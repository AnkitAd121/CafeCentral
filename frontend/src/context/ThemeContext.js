import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [night, setNight] = useState(() => {
    return localStorage.getItem("cc-night") === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (night) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("cc-night", String(night));
  }, [night]);

  const toggle = useCallback(() => setNight((n) => !n), []);

  const value = useMemo(() => ({ night, toggle, setNight }), [night, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

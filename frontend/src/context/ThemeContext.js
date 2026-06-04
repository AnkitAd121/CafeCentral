import { createContext, useContext, useEffect, useState } from "react";

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

  const toggle = () => setNight((n) => !n);

  return (
    <ThemeContext.Provider value={{ night, toggle, setNight }}>
      {children}
    </ThemeContext.Provider>
  );
};

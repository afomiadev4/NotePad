import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1. Initialize state from localStorage, defaulting to 'system'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = window.document.documentElement;

    // Function to apply the correct class
    const applyTheme = (targetTheme) => {
      if (targetTheme === "dark") {
        root.classList.add("dark");
      } else if (targetTheme === "light") {
        root.classList.remove("dark");
      } else {
        // Handle 'system'
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        systemPrefersDark
          ? root.classList.add("dark")
          : root.classList.remove("dark");
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme); // Save choice for next visit

    // If it's 'system', listen for OS changes while the app is open
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => root.classList.toggle("dark", e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

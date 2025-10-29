import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Theme } from "@shared/schema";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors: Record<Theme, { primary: string; glow: string }> = {
  red: { primary: "0 72% 50%", glow: "0 72% 55%" },
  blue: { primary: "217 91% 60%", glow: "217 91% 65%" },
  purple: { primary: "271 81% 56%", glow: "271 81% 61%" },
  green: { primary: "142 71% 45%", glow: "142 71% 50%" },
  monochrome: { primary: "0 0% 50%", glow: "0 0% 60%" },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("proxy-theme");
    return (stored as Theme) || "red";
  });

  useEffect(() => {
    localStorage.setItem("proxy-theme", theme);
    const root = document.documentElement;
    const colors = themeColors[theme];
    
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--sidebar-primary", colors.primary);
    root.style.setProperty("--ring", colors.glow);
    root.style.setProperty("--sidebar-ring", colors.glow);
    root.style.setProperty("--glow-primary", colors.glow);
    
    root.classList.add("dark");
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

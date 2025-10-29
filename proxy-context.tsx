import { createContext, useContext, useState, type ReactNode } from "react";
import type { ProxySettings, RecentSite, ProxyEngine, TransportMethod, SearchEngine } from "@shared/schema";

interface ProxyContextType {
  settings: ProxySettings;
  updateSettings: (partial: Partial<ProxySettings>) => void;
  recentSites: RecentSite[];
  addRecentSite: (site: Omit<RecentSite, "id" | "timestamp">) => void;
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  isProxying: boolean;
  setIsProxying: (value: boolean) => void;
}

const ProxyContext = createContext<ProxyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: "proxy-settings",
  RECENT: "proxy-recent-sites",
};

export function ProxyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ProxySettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : {
      proxyEngine: "scramjet" as ProxyEngine,
      transportMethod: "libcurl" as TransportMethod,
      searchEngine: "google" as SearchEngine,
      theme: "red",
    };
  });

  const [recentSites, setRecentSites] = useState<RecentSite[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT);
    return stored ? JSON.parse(stored) : [];
  });

  const [currentUrl, setCurrentUrl] = useState("");
  const [isProxying, setIsProxying] = useState(false);

  const updateSettings = (partial: Partial<ProxySettings>) => {
    const newSettings = { ...settings, ...partial };
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  const addRecentSite = (site: Omit<RecentSite, "id" | "timestamp">) => {
    const newSite: RecentSite = {
      ...site,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    const updated = [newSite, ...recentSites.filter(s => s.url !== site.url)].slice(0, 12);
    setRecentSites(updated);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
  };

  return (
    <ProxyContext.Provider
      value={{
        settings,
        updateSettings,
        recentSites,
        addRecentSite,
        currentUrl,
        setCurrentUrl,
        isProxying,
        setIsProxying,
      }}
    >
      {children}
    </ProxyContext.Provider>
  );
}

export function useProxy() {
  const context = useContext(ProxyContext);
  if (!context) {
    throw new Error("useProxy must be used within ProxyProvider");
  }
  return context;
}

import { createContext, useContext, useState, type ReactNode } from "react";

export interface ProxyTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
}

interface TabsContextType {
  tabs: ProxyTab[];
  activeTabId: string | null;
  addTab: (url: string, title?: string) => string;
  closeTab: (id: string) => void;
  switchTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<ProxyTab>) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<ProxyTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const addTab = (url: string, title: string = "New Tab"): string => {
    const id = crypto.randomUUID();
    const newTab: ProxyTab = { id, url, title };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
    return id;
  };

  const closeTab = (id: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== id);
      if (activeTabId === id && filtered.length > 0) {
        setActiveTabId(filtered[filtered.length - 1].id);
      } else if (filtered.length === 0) {
        setActiveTabId(null);
      }
      return filtered;
    });
  };

  const switchTab = (id: string) => {
    setActiveTabId(id);
  };

  const updateTab = (id: string, updates: Partial<ProxyTab>) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab))
    );
  };

  return (
    <TabsContext.Provider
      value={{ tabs, activeTabId, addTab, closeTab, switchTab, updateTab }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within TabsProvider");
  }
  return context;
}

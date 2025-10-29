import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Home, Settings, RefreshCw, ArrowLeft, ArrowRight, Loader2, Plus, X, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsPanel } from "@/components/settings-panel";
import { DevTools } from "@/components/dev-tools";
import { useProxy } from "@/lib/proxy-context";
import { useTabs } from "@/lib/tabs-context";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/generated_images/Red_proxy_cyberpunk_logo_22a65298.png";

export default function ProxyPage() {
  const [, setLocation] = useLocation();
  const { currentUrl, setCurrentUrl, isProxying, addRecentSite, settings } = useProxy();
  const { tabs, activeTabId, addTab, closeTab, switchTab, updateTab } = useTabs();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());
  const [loadingTabs, setLoadingTabs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isProxying || !currentUrl) {
      setLocation("/");
      return;
    }

    if (tabs.length === 0) {
      addTab(currentUrl, new URL(currentUrl).hostname);
    }
  }, [currentUrl, isProxying, setLocation, tabs.length, addTab]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const handleUrlSubmit = (e: React.FormEvent, tabId: string) => {
    e.preventDefault();
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;

    let url = tab.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    updateTab(tabId, { url });
    setLoadingTabs((prev) => new Set(prev).add(tabId));
    
    const iframe = iframeRefs.current.get(tabId);
    if (iframe) {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}&engine=${settings.proxyEngine}&transport=${settings.transportMethod}`;
      iframe.src = proxyUrl;
    }
  };

  const handleRefresh = () => {
    if (!activeTabId) return;
    const iframe = iframeRefs.current.get(activeTabId);
    if (iframe) {
      setLoadingTabs((prev) => new Set(prev).add(activeTabId));
      iframe.src = iframe.src;
    }
  };

  const handleBack = () => {
    if (!activeTabId) return;
    const iframe = iframeRefs.current.get(activeTabId);
    if (iframe?.contentWindow) {
      iframe.contentWindow.history.back();
    }
  };

  const handleForward = () => {
    if (!activeTabId) return;
    const iframe = iframeRefs.current.get(activeTabId);
    if (iframe?.contentWindow) {
      iframe.contentWindow.history.forward();
    }
  };

  const handleIframeLoad = (tabId: string) => {
    setLoadingTabs((prev) => {
      const next = new Set(prev);
      next.delete(tabId);
      return next;
    });

    const tab = tabs.find((t) => t.id === tabId);
    if (tab && tab.url && tab.url !== "about:blank") {
      const title = new URL(tab.url).hostname;
      addRecentSite({ url: tab.url, title });
    }
  };

  const handleNewTab = () => {
    const url = "https://www.google.com";
    addTab(url, "New Tab");
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    closeTab(tabId);
    iframeRefs.current.delete(tabId);
    
    if (tabs.length === 1) {
      setLocation("/");
    }
  };

  if (!isProxying || tabs.length === 0) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0">
            <img 
              src={logoImage} 
              alt="Red Proxy" 
              className="w-6 h-6"
            />
            <Badge variant="outline" className="text-xs hidden md:flex">
              {settings.proxyEngine.charAt(0).toUpperCase() + settings.proxyEngine.slice(1)}
            </Badge>
          </div>

          <div className="flex gap-1 flex-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                data-testid={`button-tab-${tab.id}`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg border border-b-0 transition-all min-w-[120px] max-w-[200px] group ${
                  activeTabId === tab.id
                    ? "bg-background border-border"
                    : "bg-muted/50 border-transparent hover-elevate"
                }`}
              >
                <span className="text-sm truncate flex-1">{tab.title}</span>
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  data-testid={`button-close-tab-${tab.id}`}
                  className="opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </button>
            ))}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNewTab}
              data-testid="button-new-tab"
              className="h-8 w-8 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-home"
            className="flex-shrink-0"
          >
            <Home className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button size="icon" variant="ghost" onClick={handleBack} data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleForward} data-testid="button-forward">
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleRefresh} data-testid="button-refresh">
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>

          {activeTab && (
            <form
              onSubmit={(e) => handleUrlSubmit(e, activeTab.id)}
              className="flex-1 max-w-4xl"
            >
              <Input
                type="text"
                value={activeTab.url}
                onChange={(e) => updateTab(activeTab.id, { url: e.target.value })}
                data-testid="input-url"
                className="w-full rounded-full px-6 font-mono text-sm bg-muted/50"
                placeholder="Enter URL..."
              />
            </form>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setDevToolsOpen(!devToolsOpen)}
            data-testid="button-devtools"
            className={`flex-shrink-0 ${devToolsOpen ? "bg-primary/10" : ""}`}
          >
            <Code className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSettingsOpen(true)}
            data-testid="button-settings"
            className="flex-shrink-0"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className={`flex-1 flex ${devToolsOpen ? "flex-col" : ""} overflow-hidden`}>
        <div className={`relative ${devToolsOpen ? "h-1/2" : "flex-1"} overflow-hidden`}>
          {tabs.map((tab) => {
            const isLoading = loadingTabs.has(tab.id);
            const isActive = activeTabId === tab.id;
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(tab.url)}&engine=${settings.proxyEngine}&transport=${settings.transportMethod}`;

            return (
              <div
                key={tab.id}
                className={`absolute inset-0 ${isActive ? "block" : "hidden"}`}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Loading proxied content...</p>
                    </div>
                  </div>
                )}
                <iframe
                  ref={(el) => {
                    if (el) iframeRefs.current.set(tab.id, el);
                  }}
                  src={proxyUrl}
                  onLoad={() => handleIframeLoad(tab.id)}
                  data-testid={`iframe-proxy-${tab.id}`}
                  className="w-full h-full border-0"
                  title={`Proxied Content - ${tab.title}`}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>

        {devToolsOpen && activeTab && (
          <div className="h-1/2">
            <DevTools url={activeTab.url} onClose={() => setDevToolsOpen(false)} />
          </div>
        )}
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

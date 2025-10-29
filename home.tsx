import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Settings, Globe, Lock, Zap, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsPanel } from "@/components/settings-panel";
import { useProxy } from "@/lib/proxy-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logoImage from "@assets/generated_images/Red_proxy_cyberpunk_logo_22a65298.png";

const popularSites = [
  { name: "YouTube", url: "https://www.youtube.com", icon: Globe },
  { name: "GitHub", url: "https://github.com", icon: Globe },
  { name: "Reddit", url: "https://www.reddit.com", icon: Globe },
  { name: "Wikipedia", url: "https://www.wikipedia.org", icon: Globe },
  { name: "Stack Overflow", url: "https://stackoverflow.com", icon: Globe },
  { name: "Twitter", url: "https://twitter.com", icon: Globe },
];

const searchEngineUrls: Record<string, string> = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  brave: "https://search.brave.com/search?q=",
};

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { settings, recentSites, addRecentSite, setCurrentUrl, setIsProxying } = useProxy();
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState(settings.searchEngine);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let targetUrl = searchQuery.trim();
    
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      if (targetUrl.includes(".") && !targetUrl.includes(" ")) {
        targetUrl = `https://${targetUrl}`;
      } else {
        const searchUrl = searchEngineUrls[selectedEngine];
        targetUrl = `${searchUrl}${encodeURIComponent(targetUrl)}`;
      }
    }

    setCurrentUrl(targetUrl);
    setIsProxying(true);
    setLocation("/proxy");
  };

  const handleQuickLink = (url: string, name: string) => {
    addRecentSite({ url, title: name });
    setCurrentUrl(url);
    setIsProxying(true);
    setLocation("/proxy");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSettingsOpen(true)}
          data-testid="button-open-settings"
          className="glow-primary-sm"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img 
                src={logoImage} 
                alt="Red Proxy Logo" 
                className="w-24 h-24 md:w-32 md:h-32 glow-primary"
                data-testid="img-logo"
              />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-glow tracking-tight">
              RED
            </h1>
            <p className="text-lg text-muted-foreground">
              Secure Web Proxy with Advanced Features
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center gap-2 p-2 pr-3 rounded-2xl border border-border bg-card glow-primary-sm transition-all focus-within:glow-primary">
              <Search className="w-6 h-6 ml-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Enter URL or search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
                className="flex-1 border-0 bg-transparent text-base h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Select value={selectedEngine} onValueChange={(v: any) => setSelectedEngine(v)}>
                <SelectTrigger
                  className="w-[140px] border-0 bg-muted/50 h-10"
                  data-testid="select-search-engine"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="bing">Bing</SelectItem>
                  <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                  <SelectItem value="brave">Brave</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                size="icon"
                className="rounded-lg"
                data-testid="button-search-submit"
              >
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4 text-primary" />
              <span>Private</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>{settings.proxyEngine.charAt(0).toUpperCase() + settings.proxyEngine.slice(1)} Engine</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularSites.map((site) => (
            <button
              key={site.url}
              onClick={() => handleQuickLink(site.url, site.name)}
              data-testid={`button-quick-${site.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="h-24 p-4 rounded-xl border border-border bg-card hover-elevate active-elevate-2 transition-all group"
            >
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <site.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{site.name}</span>
              </div>
            </button>
          ))}
        </div>

        {recentSites.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Recently Visited</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentSites.slice(0, 6).map((site) => (
                <button
                  key={site.id}
                  onClick={() => handleQuickLink(site.url, site.title)}
                  data-testid={`button-recent-${site.id}`}
                  className="h-24 p-4 rounded-xl border border-border bg-card hover-elevate active-elevate-2 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Globe className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium truncate w-full">
                      {site.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>Red Web Proxy - Browse securely and privately</p>
      </footer>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

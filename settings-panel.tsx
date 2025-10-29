import { X, Cpu, Network, Search as SearchIcon, Palette, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProxy } from "@/lib/proxy-context";
import { useTheme } from "@/lib/theme-context";
import type { ProxyEngine, TransportMethod, SearchEngine, Theme } from "@shared/schema";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const proxyEngines: { value: ProxyEngine; name: string; description: string }[] = [
  { value: "scramjet", name: "Scramjet", description: "Fast and efficient with advanced obfuscation" },
  { value: "ultraviolet", name: "Ultraviolet", description: "Highly sophisticated web proxy" },
  { value: "eclipse", name: "Eclipse", description: "Modern proxy with enhanced compatibility" },
  { value: "sandstone", name: "Sandstone", description: "Lightweight and blazing fast" },
];

const transportMethods: { value: TransportMethod; name: string; description: string }[] = [
  { value: "libcurl", name: "LibCurl", description: "Industry-standard HTTP library" },
  { value: "eproxy", name: "Eproxy", description: "Efficient proxy transport layer" },
];

const searchEngines: { value: SearchEngine; name: string }[] = [
  { value: "google", name: "Google" },
  { value: "bing", name: "Bing" },
  { value: "duckduckgo", name: "DuckDuckGo" },
  { value: "brave", name: "Brave" },
];

const themes: { value: Theme; name: string; colors: string }[] = [
  { value: "red", name: "Red Glow", colors: "from-red-500 to-red-700" },
  { value: "blue", name: "Blue Pulse", colors: "from-blue-500 to-blue-700" },
  { value: "purple", name: "Purple Haze", colors: "from-purple-500 to-purple-700" },
  { value: "green", name: "Green Matrix", colors: "from-green-500 to-green-700" },
  { value: "monochrome", name: "Monochrome", colors: "from-gray-400 to-gray-600" },
];

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useProxy();
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold">Settings</DialogTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              data-testid="button-close-settings"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <DialogDescription>
            Configure your proxy engine, transport method, search preferences, and visual theme
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-primary" />
              <Label className="text-xl font-semibold">Proxy Engine</Label>
            </div>
            <div className="grid gap-3">
              {proxyEngines.map((engine) => (
                <button
                  key={engine.value}
                  onClick={() => updateSettings({ proxyEngine: engine.value })}
                  data-testid={`button-engine-${engine.value}`}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    settings.proxyEngine === engine.value
                      ? "border-primary bg-primary/10 glow-primary-sm"
                      : "border-border hover-elevate active-elevate-2"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {engine.name}
                        {engine.value === "scramjet" && (
                          <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {engine.description}
                      </div>
                    </div>
                    {settings.proxyEngine === engine.value && (
                      <Zap className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-primary" />
              <Label className="text-xl font-semibold">Transport Method</Label>
            </div>
            <div className="grid gap-3">
              {transportMethods.map((method) => (
                <button
                  key={method.value}
                  onClick={() => updateSettings({ transportMethod: method.value })}
                  data-testid={`button-transport-${method.value}`}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    settings.transportMethod === method.value
                      ? "border-primary bg-primary/10 glow-primary-sm"
                      : "border-border hover-elevate active-elevate-2"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </div>
                    {settings.transportMethod === method.value && (
                      <Zap className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <SearchIcon className="w-5 h-5 text-primary" />
              <Label className="text-xl font-semibold">Search Engine</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {searchEngines.map((engine) => (
                <button
                  key={engine.value}
                  onClick={() => updateSettings({ searchEngine: engine.value })}
                  data-testid={`button-search-${engine.value}`}
                  className={`p-3 rounded-lg border transition-all ${
                    settings.searchEngine === engine.value
                      ? "border-primary bg-primary/10 glow-primary-sm"
                      : "border-border hover-elevate active-elevate-2"
                  }`}
                >
                  <div className="font-medium">{engine.name}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <Label className="text-xl font-semibold">Theme</Label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    updateSettings({ theme: t.value });
                  }}
                  data-testid={`button-theme-${t.value}`}
                  className={`p-4 rounded-xl border transition-all ${
                    theme === t.value
                      ? "border-primary bg-primary/10 glow-primary-sm"
                      : "border-border hover-elevate active-elevate-2"
                  }`}
                >
                  <div className={`h-12 rounded-lg bg-gradient-to-br ${t.colors} mb-2`} />
                  <div className="font-medium text-center">{t.name}</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

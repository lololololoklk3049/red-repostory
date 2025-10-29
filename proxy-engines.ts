export type ProxyEngine = "scramjet" | "ultraviolet" | "eclipse" | "sandstone";
export type TransportMethod = "libcurl" | "eproxy";

export interface ProxyEngineConfig {
  name: string;
  description: string;
  userAgent: string;
  rewriteStrategy: "aggressive" | "moderate" | "minimal";
}

export const engineConfigs: Record<ProxyEngine, ProxyEngineConfig> = {
  scramjet: {
    name: "Scramjet",
    description: "Fast and efficient with advanced obfuscation",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    rewriteStrategy: "aggressive",
  },
  ultraviolet: {
    name: "Ultraviolet",
    description: "Highly sophisticated web proxy",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
    rewriteStrategy: "aggressive",
  },
  eclipse: {
    name: "Eclipse",
    description: "Modern proxy with enhanced compatibility",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    rewriteStrategy: "moderate",
  },
  sandstone: {
    name: "Sandstone",
    description: "Lightweight and blazing fast",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    rewriteStrategy: "minimal",
  },
};

export const transportConfigs: Record<TransportMethod, { name: string; timeout: number }> = {
  libcurl: {
    name: "LibCurl",
    timeout: 30000,
  },
  eproxy: {
    name: "Eproxy",
    timeout: 45000,
  },
};

export function getEngineConfig(engine: ProxyEngine): ProxyEngineConfig {
  return engineConfigs[engine] || engineConfigs.scramjet;
}

export function getTransportConfig(transport: TransportMethod) {
  return transportConfigs[transport] || transportConfigs.libcurl;
}

export function shouldRewriteUrl(url: string, strategy: "aggressive" | "moderate" | "minimal"): boolean {
  if (strategy === "aggressive") return true;
  if (strategy === "minimal") return url.startsWith("http");
  return !url.startsWith("data:") && !url.startsWith("javascript:");
}

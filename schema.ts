import { z } from "zod";

export const proxyEngineSchema = z.enum(["scramjet", "ultraviolet", "eclipse", "sandstone"]);
export const transportMethodSchema = z.enum(["libcurl", "eproxy"]);
export const searchEngineSchema = z.enum(["google", "bing", "duckduckgo", "brave"]);
export const themeSchema = z.enum(["red", "blue", "purple", "green", "monochrome"]);

export const proxySettingsSchema = z.object({
  proxyEngine: proxyEngineSchema.default("scramjet"),
  transportMethod: transportMethodSchema.default("libcurl"),
  searchEngine: searchEngineSchema.default("google"),
  theme: themeSchema.default("red"),
});

export type ProxyEngine = z.infer<typeof proxyEngineSchema>;
export type TransportMethod = z.infer<typeof transportMethodSchema>;
export type SearchEngine = z.infer<typeof searchEngineSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type ProxySettings = z.infer<typeof proxySettingsSchema>;

export const recentSiteSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  timestamp: z.number(),
});

export type RecentSite = z.infer<typeof recentSiteSchema>;

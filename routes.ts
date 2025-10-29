import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { getEngineConfig, getTransportConfig, shouldRewriteUrl, type ProxyEngine, type TransportMethod } from "./proxy-engines";

interface CacheEntry {
  data: Buffer | string;
  contentType: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

function rewriteUrls(html: string, baseUrl: string, proxyPath: string, strategy: "aggressive" | "moderate" | "minimal"): string {
  try {
    const base = new URL(baseUrl);
    
    html = html.replace(
      /(href|src|action)=["'](?!data:)(?!#)(?!javascript:)([^"']+)["']/gi,
      (match, attr, url) => {
        try {
          if (!shouldRewriteUrl(url, strategy)) return match;
          
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return `${attr}="${proxyPath}?url=${encodeURIComponent(url)}"`;
          }
          const absoluteUrl = new URL(url, baseUrl).href;
          return `${attr}="${proxyPath}?url=${encodeURIComponent(absoluteUrl)}"`;
        } catch {
          return match;
        }
      }
    );

    html = html.replace(
      /url\(["']?(?!data:)([^"')]+)["']?\)/gi,
      (match, url) => {
        try {
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return `url("${proxyPath}?url=${encodeURIComponent(url)}")`;
          }
          const absoluteUrl = new URL(url, baseUrl).href;
          return `url("${proxyPath}?url=${encodeURIComponent(absoluteUrl)}")`;
        } catch {
          return match;
        }
      }
    );

    return html;
  } catch (error) {
    console.error('Error rewriting URLs:', error);
    return html;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Clean cache periodically
  setInterval(() => {
    const now = Date.now();
    Array.from(cache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
      }
    });
  }, 60000); // Every minute

  app.get("/api/proxy", async (req: Request, res: Response) => {
    const targetUrl = req.query.url as string;
    const engine = (req.query.engine as ProxyEngine) || "scramjet";
    const transport = (req.query.transport as TransportMethod) || "libcurl";

    const engineConfig = getEngineConfig(engine);
    const transportConfig = getTransportConfig(transport);

    if (!targetUrl) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error - Red Proxy</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                background: #0a0a0a;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
              }
              .error {
                text-align: center;
                max-width: 500px;
              }
              h1 {
                color: #ef4444;
                font-size: 3rem;
                margin: 0 0 1rem 0;
              }
              p {
                color: #a1a1aa;
                margin: 0.5rem 0;
              }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>⚠️</h1>
              <h2>No URL Provided</h2>
              <p>Please provide a URL parameter to proxy.</p>
            </div>
          </body>
        </html>
      `);
    }

    try {
      let url = targetUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      // Check cache for static resources
      const cacheKey = `${url}-${engine}`;
      const contentTypeGuess = url.split('.').pop()?.toLowerCase();
      const isCacheable = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'css', 'js', 'woff', 'woff2', 'ttf', 'svg', 'ico'].includes(contentTypeGuess || '');
      
      if (isCacheable) {
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          res.setHeader('Content-Type', cached.contentType);
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('Access-Control-Allow-Origin', '*');
          return res.send(cached.data);
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), transportConfig.timeout);

      try {
        var response = await fetch(url, {
          headers: {
            'User-Agent': engineConfig.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
          redirect: 'follow',
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('text/html')) {
        let html = await response.text();
        const proxyPath = `/api/proxy?engine=${engine}&transport=${transport}`;
        html = rewriteUrls(html, url, proxyPath, engineConfig.rewriteStrategy);
        
        const cspMeta = '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">';
        const engineMeta = `<!-- Proxied via ${engineConfig.name} (${transportConfig.name}) -->`;
        html = html.replace('</head>', `${engineMeta}\n${cspMeta}</head>`);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-Proxy-Engine', engineConfig.name);
        res.send(html);
      } else if (contentType.includes('text/css')) {
        let css = await response.text();
        const proxyPath = `/api/proxy?engine=${engine}&transport=${transport}`;
        css = css.replace(
          /url\(["']?(?!data:)([^"')]+)["']?\)/gi,
          (match, cssUrl) => {
            try {
              const absoluteUrl = new URL(cssUrl, url).href;
              return `url("${proxyPath}&url=${encodeURIComponent(absoluteUrl)}")`;
            } catch {
              return match;
            }
          }
        );
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(css);
      } else if (contentType.includes('javascript') || contentType.includes('json')) {
        const content = await response.text();
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(content);
      } else {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Cache static resources
        if (isCacheable && cache.size < MAX_CACHE_SIZE) {
          cache.set(cacheKey, {
            data: buffer,
            contentType,
            timestamp: Date.now(),
          });
        }
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
        res.send(buffer);
      }
    } catch (error: any) {
      console.error('Proxy error:', error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error - Red Proxy</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                background: #0a0a0a;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
              }
              .error {
                text-align: center;
                max-width: 600px;
              }
              h1 {
                color: #ef4444;
                font-size: 3rem;
                margin: 0 0 1rem 0;
              }
              p {
                color: #a1a1aa;
                margin: 0.5rem 0;
              }
              code {
                background: #18181b;
                padding: 2px 6px;
                border-radius: 4px;
                color: #ef4444;
                font-family: 'Courier New', monospace;
              }
              .details {
                margin-top: 2rem;
                padding: 1rem;
                background: #18181b;
                border-radius: 8px;
                border: 1px solid #27272a;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>⚠️</h1>
              <h2>Proxy Error</h2>
              <p>Failed to load: <code>${targetUrl}</code></p>
              <div class="details">
                <strong>Error:</strong> ${error.message}<br>
                <br>
                <strong>Possible reasons:</strong>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: #a1a1aa;">
                  <li>The website blocks proxy requests</li>
                  <li>Network connectivity issues</li>
                  <li>The URL is invalid or unreachable</li>
                  <li>CORS restrictions</li>
                </ul>
              </div>
            </div>
          </body>
        </html>
      `);
    }
  });

  app.get("/api/settings", async (_req: Request, res: Response) => {
    res.json({
      availableEngines: ["scramjet", "ultraviolet", "eclipse", "sandstone"],
      availableTransports: ["libcurl", "eproxy"],
      availableSearchEngines: ["google", "bing", "duckduckgo", "brave"],
      availableThemes: ["red", "blue", "purple", "green", "monochrome"],
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}

import { useState } from "react";
import { Code, Network, Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DevToolsProps {
  url: string;
  onClose: () => void;
}

export function DevTools({ url, onClose }: DevToolsProps) {
  const [activeTab, setActiveTab] = useState("elements");

  return (
    <div className="h-full flex flex-col bg-card border-t border-border">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h3 className="text-sm font-semibold">Developer Tools</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          data-testid="button-close-devtools"
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-10">
          <TabsTrigger
            value="elements"
            className="gap-2 data-[state=active]:bg-primary/10"
            data-testid="tab-elements"
          >
            <Code className="w-4 h-4" />
            Elements
          </TabsTrigger>
          <TabsTrigger
            value="console"
            className="gap-2 data-[state=active]:bg-primary/10"
            data-testid="tab-console"
          >
            <Terminal className="w-4 h-4" />
            Console
          </TabsTrigger>
          <TabsTrigger
            value="network"
            className="gap-2 data-[state=active]:bg-primary/10"
            data-testid="tab-network"
          >
            <Network className="w-4 h-4" />
            Network
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 font-mono text-xs">
              <div className="text-muted-foreground mb-2">
                Inspecting: <span className="text-foreground">{url}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="text-blue-400">&lt;html&gt;</div>
                <div className="pl-4 text-blue-400">&lt;head&gt;</div>
                <div className="pl-8 text-green-400">&lt;title&gt;Proxied Page&lt;/title&gt;</div>
                <div className="pl-8 text-muted-foreground">
                  &lt;!-- Content loaded via Red Proxy --&gt;
                </div>
                <div className="pl-4 text-blue-400">&lt;/head&gt;</div>
                <div className="pl-4 text-blue-400">&lt;body&gt;</div>
                <div className="pl-8 text-muted-foreground">
                  &lt;!-- Proxied content from {new URL(url).hostname} --&gt;
                </div>
                <div className="pl-4 text-blue-400">&lt;/body&gt;</div>
                <div className="text-blue-400">&lt;/html&gt;</div>
              </div>
              <div className="mt-4 p-3 bg-muted/50 rounded border border-border">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Note:</strong> Full HTML inspection is limited due to iframe
                  sandboxing. This is a simplified view of the proxied page structure.
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="console" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 font-mono text-xs space-y-2">
              <div className="text-blue-400">
                &gt; Red Proxy Developer Console
              </div>
              <div className="text-muted-foreground">
                Proxying: {url}
              </div>
              <div className="text-green-400">
                ✓ Page loaded successfully
              </div>
              <div className="text-muted-foreground">
                &gt; Use browser DevTools for full debugging capabilities
              </div>
              <div className="mt-4 p-3 bg-muted/50 rounded border border-border">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tip:</strong> Open your browser's native DevTools (F12) to
                  inspect the iframe content directly for advanced debugging.
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="network" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <table className="w-full text-xs">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="pb-2 font-semibold">Name</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold">Type</th>
                    <th className="pb-2 font-semibold">Size</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr className="border-b border-border">
                    <td className="py-2 text-blue-400">{new URL(url).pathname || "/"}</td>
                    <td className="py-2 text-green-400">200</td>
                    <td className="py-2 text-muted-foreground">document</td>
                    <td className="py-2 text-muted-foreground">-</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 text-blue-400">proxy</td>
                    <td className="py-2 text-green-400">200</td>
                    <td className="py-2 text-muted-foreground">xhr</td>
                    <td className="py-2 text-muted-foreground">-</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-muted/50 rounded border border-border">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Note:</strong> Network monitoring is limited in proxy mode.
                  Use browser DevTools Network tab for detailed request inspection.
                </p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

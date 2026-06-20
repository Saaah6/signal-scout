import React from "react";
import AnimatedLogo from "@/components/AnimatedLogo";
import { LayoutDashboard, Users, WebhooksLogo, Gear, SignOut } from "@phosphor-icons/react/dist/ssr";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Users", icon: Users },
  { label: "Crawl Logs", icon: WebhooksLogo },
  { label: "Settings", icon: Gear },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-light bg-foreground/[0.01] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border-light">
          <AnimatedLogo className="w-5 h-5 mr-3" showText={false} />
          <span className="font-black text-sm tracking-wide">ADMIN</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active 
                  ? "bg-foreground/5 text-foreground" 
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-border-light">
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03] transition-colors">
            <SignOut className="w-4 h-4" />
            Exit Admin
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border-light flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-sm font-semibold text-foreground/80">Dashboard</h2>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-foreground/60">System Online</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

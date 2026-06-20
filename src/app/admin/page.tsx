import React from "react";
import { StatCard } from "@/components/Admin/StatCard";
import { DataTable } from "@/components/Admin/DataTable";
import { Users, WebhooksLogo, HardDrives, Activity } from "@phosphor-icons/react/dist/ssr";

const MOCK_CRAWL_LOGS = [
  { id: "cr_1", domain: "stripe.com", status: "success", signals: 12, time: "2m ago" },
  { id: "cr_2", domain: "linear.app", status: "success", signals: 5, time: "15m ago" },
  { id: "cr_3", domain: "vercel.com", status: "processing", signals: 0, time: "Just now" },
  { id: "cr_4", domain: "github.com", status: "failed", signals: 0, time: "1h ago" },
  { id: "cr_5", domain: "figma.com", status: "success", signals: 8, time: "3h ago" },
];

const MOCK_USERS = [
  { email: "alex@example.com", plan: "Pro", joined: "Today" },
  { email: "sarah@startup.io", plan: "Free", joined: "Yesterday" },
  { email: "mike@enterprise.co", plan: "Enterprise", joined: "3 days ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground mb-1">Overview</h1>
        <p className="text-sm text-foreground/60">Real-time metrics and system status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="1,248" trend="up" trendValue="+12% this week" icon={Users} />
        <StatCard title="Active Crawls" value="34" trend="neutral" trendValue="Normal load" icon={WebhooksLogo} />
        <StatCard title="API Requests (24h)" value="142.5K" trend="up" trendValue="+5.2%" icon={Activity} />
        <StatCard title="Storage" value="48.2 GB" trend="down" trendValue="Cache cleared" icon={HardDrives} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DataTable 
            title="Recent Crawl Operations" 
            data={MOCK_CRAWL_LOGS}
            columns={[
              { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs text-foreground/50">{v}</span> },
              { key: "domain", header: "Target Domain" },
              { key: "status", header: "Status", render: (v) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                  v === "success" ? "bg-emerald-500/10 text-emerald-500" :
                  v === "processing" ? "bg-amber-500/10 text-amber-500" :
                  "bg-red-500/10 text-red-500"
                }`}>
                  {v}
                </span>
              )},
              { key: "signals", header: "Signals Found" },
              { key: "time", header: "Time" },
            ]}
          />
        </div>
        <div>
          <DataTable 
            title="New Signups" 
            data={MOCK_USERS}
            columns={[
              { key: "email", header: "Email" },
              { key: "plan", header: "Plan", render: (v) => (
                <span className="text-xs border border-border-light px-1.5 py-0.5 rounded">{v}</span>
              )},
            ]}
          />
        </div>
      </div>
    </div>
  );
}

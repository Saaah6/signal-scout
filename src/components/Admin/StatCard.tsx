import React from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  trend?: "up" | "down" | "neutral"; 
  trendValue?: string;
  icon: any;
}) {
  return (
    <div className="bg-background border border-border-light rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground/60">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-foreground/[0.03] flex items-center justify-center text-foreground/70">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-3xl font-black tracking-tight text-foreground">{value}</div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-foreground/50"}`}>
            {trend === "up" ? <TrendUp className="w-3 h-3" /> : trend === "down" ? <TrendDown className="w-3 h-3" /> : null}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}

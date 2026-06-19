"use client";

import React from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { 
  SquaresFour, 
  Table, 
  Sliders, 
  Pulse, 
  CaretDoubleLeft, 
  CaretDoubleRight, 
  SignOut,
  Target,
  Users,
  Stack
} from "@phosphor-icons/react";

import AnimatedLogo from "../AnimatedLogo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  const { setStep, accounts, user, logout } = useIntelScout();

  const navItems = [
    { id: "dashboard", label: "Analytics Overview", icon: SquaresFour },
    { id: "accounts", label: "Prioritized Accounts", icon: Table, badge: accounts.length },
    { id: "signals", label: "Signal Tuning", icon: Sliders },
    { id: "feed", label: "Intelligence Feed", icon: Pulse },
    { id: "environments", label: "Environments", icon: Stack },
    { id: "audience", label: "Audience & Auth", icon: Users }
  ];

  return (
    <aside 
      className={`bg-white/60 backdrop-blur-md border-r border-black/10 hidden md:flex flex-col transition-all duration-300 relative ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 justify-between border-b border-black/10">
        <div className="overflow-hidden">
          <AnimatedLogo className="w-6 h-6" showText={!collapsed} />
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="p-1 hover:bg-[#fafafa] rounded-lg text-[#888] hover:text-[#111] transition"
          >
            <CaretDoubleLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapse button when collapsed */}
      {collapsed && (
        <button 
          onClick={() => setCollapsed(false)}
          className="absolute -right-3.5 top-20 bg-white border border-black/10 p-1 rounded-full text-[#666] hover:text-[#111] shadow-sm transition z-20"
        >
          <CaretDoubleRight className="w-3 h-3" />
        </button>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-2.5 rounded-lg text-xs font-semibold tracking-wide transition relative group ${
                isActive 
                  ? "bg-black/5 border border-black/10 text-black" 
                  : "text-[#555] hover:bg-black/5 hover:text-black"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${collapsed ? "mx-auto" : "mr-3"}`} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="absolute right-3.5 bg-[#fafafa] border border-black/10 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-[#555]">
                  {item.badge}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-16 bg-white border border-black/10 text-[#111] text-[10px] px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-55 shadow-sm">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-black/10 space-y-2">
        {user && (
          <div className={`flex items-center p-1.5 rounded-lg bg-[#fafafa] border border-black/10 ${collapsed ? "justify-center" : "space-x-2.5"}`}>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-6 h-6 rounded-full border border-black/10 bg-white p-0.5 shrink-0" 
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#111] truncate leading-snug">{user.name}</p>
                <p className="text-[9px] text-[#666] truncate leading-none">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-1">
          <button
            onClick={() => setStep(1)}
            className="w-full flex items-center p-2 rounded-lg text-[10px] font-bold text-[#888] hover:text-[#111] hover:bg-black/5 transition group"
          >
            <Sliders className={`w-3.5 h-3.5 shrink-0 ${collapsed ? "mx-auto" : "mr-2.5"}`} />
            {!collapsed && <span className="uppercase tracking-wider">Reset Campaign</span>}
            {collapsed && (
              <div className="absolute left-16 bg-white border border-black/10 text-[#333] text-[9px] px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-55 shadow-sm uppercase tracking-wider">
                Reset Campaign
              </div>
            )}
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center p-2 rounded-lg text-[10px] font-bold text-[#888] hover:text-red-500 hover:bg-red-50 transition group"
          >
            <SignOut className={`w-3.5 h-3.5 shrink-0 ${collapsed ? "mx-auto" : "mr-2.5"}`} />
            {!collapsed && <span className="uppercase tracking-wider">Sign Out</span>}
            {collapsed && (
              <div className="absolute left-16 bg-white border border-black/10 text-red-500 text-[9px] px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-55 shadow-sm uppercase tracking-wider">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

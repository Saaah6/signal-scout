"use client";

import React from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { Shield, Sliders, SignOut, Target } from "@phosphor-icons/react";

interface NavbarProps {
  activeTab: string;
  setSidebarCollapsed: (v: boolean) => void;
  sidebarCollapsed: boolean;
}

export default function Navbar({ activeTab, setSidebarCollapsed, sidebarCollapsed }: NavbarProps) {
  const { offer, userRole, setUserRole, user, logout, setStep } = useIntelScout();

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Analytics Console";
      case "accounts": return "Accounts Prioritization Engine";
      case "signals": return "Dynamic Signal Configurations";
      case "feed": return "GTM Intelligence Feed";
      case "audience": return "Audience & Auth Logs";
      default: return "Dashboard";
    }
  };

  return (
    <header className="h-16 bg-white/60 backdrop-blur-md border-b border-black/10 px-6 flex items-center justify-between shrink-0 z-30">
      
      {/* View Title */}
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-black/5 border border-black/10 text-black rounded-lg md:hidden">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-[#111] font-outfit">{getTitle()}</h1>
          <p className="text-[10px] text-[#555] font-medium hidden md:block">
            Offer: <span className="text-[#111] font-semibold">{offer.sell}</span> &bull; deal size: <span className="text-[#333]">{offer.dealSize}</span>
          </p>
        </div>
      </div>

      {/* Status Indicators & RBAC Selector */}
      <div className="flex items-center space-x-3">
        
        {/* Role Selector dropdown */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#fafafa] border border-black/10 rounded-xl relative">
          <Shield className="w-3.5 h-3.5 text-[#555]" />
          <span className="text-[9px] font-bold text-[#888] uppercase tracking-wider hidden sm:inline">Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as any)}
            className="bg-transparent text-[9px] font-bold text-[#333] focus:outline-none cursor-pointer uppercase tracking-wider pr-1 border-none focus:ring-0 outline-none"
          >
            <option value="admin" className="bg-white text-[#333]">Admin</option>
            <option value="sales" className="bg-white text-[#333]">Sales Rep</option>
            <option value="marketing" className="bg-white text-[#333]">Marketing</option>
          </select>
        </div>

        {/* Pulsing Crawler Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#fafafa] border border-black/10 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-[#555] uppercase tracking-wider hidden lg:inline">
            GTM Crawler Live
          </span>
        </div>

        {/* Protection / Sandbox Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-violet-50 border border-violet-100 text-violet-600 rounded-xl">
          <span className="relative w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">
            AI Active
          </span>
        </div>

        {/* Mobile Profile & Signout Actions */}
        {user && (
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setStep(1)}
              title="Reset Campaign"
              className="p-1.5 bg-[#fafafa] hover:bg-black/5 border border-black/10 text-[#555] hover:text-[#111] rounded-lg transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 bg-[#fafafa] hover:bg-red-50 border border-black/10 text-[#555] hover:text-red-500 rounded-lg transition cursor-pointer"
            >
              <SignOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

    </header>
  );
}

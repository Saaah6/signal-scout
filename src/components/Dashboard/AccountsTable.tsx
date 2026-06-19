"use client";

import React, { useState } from "react";
import { useIntelScout, Account } from "@/context/IntelScoutContext";
import { MagnifyingGlass, Download, Funnel, Eye, ArrowSquareOut } from "@phosphor-icons/react";

interface AccountsTableProps {
  onRevealInsights: (account: Account) => void;
}

export default function AccountsTable({ onRevealInsights }: AccountsTableProps) {
  const { accounts, signals, userRole } = useIntelScout();
  const isMarketing = userRole === "marketing";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTierFilter, setActiveTierFilter] = useState<"all" | 1 | 2 | 3 | 4>("all");
  const [techFilter, setTechFilter] = useState("all");

  // Get unique technologies across all accounts for the filter dropdown
  const allTechs = Array.from(
    new Set(accounts.reduce<string[]>((acc, curr) => [...acc, ...curr.techStack], []))
  );

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = 
      acc.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.domain.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = activeTierFilter === "all" || acc.priorityTier === activeTierFilter;
    
    const matchesTech = techFilter === "all" || acc.techStack.includes(techFilter);

    return matchesSearch && matchesTier && matchesTech;
  });

  const getTierBadgeClass = (tier: 1 | 2 | 3 | 4) => {
    switch(tier) {
      case 1: return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 2: return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 3: return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-[#fafafa] text-[#666] border-black/10";
    }
  };

  const getTierName = (tier: 1 | 2 | 3 | 4) => {
    switch(tier) {
      case 1: return "Tier 1 - Immediate";
      case 2: return "Tier 2 - This Week";
      case 3: return "Tier 3 - Nurture";
      default: return "Tier 4 - Monitor";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 70) return "text-amber-600";
    if (score >= 50) return "text-blue-600";
    return "text-[#666]";
  };

  // CSV Exporter (Stage 14)
  const exportToCSV = () => {
    if (accounts.length === 0) return;
    
    const headers = [
      "Company",
      "Domain",
      "Opportunity Score",
      "Priority Tier",
      "Fit Score",
      "Intent Score",
      "Timing Score",
      "Explainable Prioritization",
      "Economic Buyer",
      "Technical Buyer",
      "Recommended Contact",
      "Suggested Angle"
    ];

    const rows = accounts.map(a => [
      a.company_name,
      a.domain,
      a.opportunityScore,
      `Tier ${a.priorityTier}`,
      a.icpFit,
      a.intent,
      a.timing,
      a.reasons.join(" | "),
      a.buyingCommittee.economic,
      a.buyingCommittee.technical,
      a.gtmRecommendations.contact,
      a.gtmRecommendations.angle.replace(/,/g, ";") // replace commas to prevent broken columns
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `intelscout_gtm_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-black/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-black/10">
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-2.5 w-4 h-4 text-[#888]" />
            <input
              type="text"
              placeholder="Search companies or domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-xl pl-9 pr-4 py-2 text-xs text-[#111] focus:outline-none focus:border-black/30 transition"
            />
          </div>

          {/* Technographic Filter */}
          <div className="relative shrink-0 flex items-center bg-white border border-black/10 rounded-xl px-2.5">
            <Funnel className="w-3.5 h-3.5 text-[#888] mr-2" />
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="bg-transparent text-xs text-[#333] py-2 focus:outline-none cursor-pointer pr-4 font-semibold"
            >
              <option value="all">All Technographics</option>
              {allTechs.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CSV Export Button (Stage 14) */}
        <button
          onClick={exportToCSV}
          disabled={accounts.length === 0 || isMarketing}
          title={isMarketing ? "CSV Export restricted to Admin & Sales roles" : "Export accounts to CSV"}
          className="px-4 py-2 bg-[#fafafa] hover:bg-black/5 border border-black/10 disabled:opacity-40 text-[#333] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isMarketing ? "Export Restricted" : "Export CSV"}</span>
        </button>

      </div>

      {/* Segment Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-black/10 pb-2">
        <button
          onClick={() => setActiveTierFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTierFilter === "all" 
              ? "bg-[#fafafa] text-[#111] border border-black/10" 
              : "text-[#555] hover:text-[#111]"
          }`}
        >
          All Accounts ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTierFilter(1)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTierFilter === 1 
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600" 
              : "text-[#555] hover:text-[#111]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Tier 1 ({accounts.filter(a => a.priorityTier === 1).length})</span>
        </button>
        <button
          onClick={() => setActiveTierFilter(2)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTierFilter === 2 
              ? "bg-amber-500/10 border border-amber-500/20 text-amber-600" 
              : "text-[#555] hover:text-[#111]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Tier 2 ({accounts.filter(a => a.priorityTier === 2).length})</span>
        </button>
        <button
          onClick={() => setActiveTierFilter(3)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTierFilter === 3 
              ? "bg-blue-500/10 border border-blue-500/20 text-blue-600" 
              : "text-[#555] hover:text-[#111]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Tier 3 ({accounts.filter(a => a.priorityTier === 3).length})</span>
        </button>
        <button
          onClick={() => setActiveTierFilter(4)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTierFilter === 4 
              ? "bg-[#fafafa] border border-black/10 text-[#666]" 
              : "text-[#555] hover:text-[#111]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#888]" />
          <span>Tier 4 ({accounts.filter(a => a.priorityTier === 4).length})</span>
        </button>
      </div>

      {/* Main Data Table */}
      <div className="flex-1 overflow-x-auto min-h-[300px] scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/10 text-[10px] font-bold text-[#888] uppercase tracking-wider">
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Opportunity Score</th>
              <th className="py-3 px-4">Priority Tier</th>
              <th className="py-3 px-4">Signals Detected</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-xs">
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center opacity-60">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-[#888]">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      <line x1="10" y1="10" x2="10" y2="10" strokeWidth="2" />
                    </svg>
                    <p className="text-[#555] font-semibold">No accounts found matching current query or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAccounts.map((account) => (
                <tr 
                  key={account.id} 
                  className="hover:bg-[#fafafa] group transition"
                >
                  {/* Company Info */}
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-[#111] group-hover:text-violet-600 transition">
                        {account.company_name}
                      </span>
                      <a 
                        href={`https://${account.domain}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-[#666] hover:text-[#111] inline-flex items-center space-x-0.5 ml-2"
                      >
                        <span>{account.domain}</span>
                        <ArrowSquareOut className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </td>

                  {/* Opportunity Score */}
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={getScoreColor(account.opportunityScore)}>
                      {account.opportunityScore}
                    </span>
                    <span className="text-[10px] text-[#888]"> / 100</span>
                  </td>

                  {/* Priority Tier Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-wider ${getTierBadgeClass(account.priorityTier)}`}>
                      {getTierName(account.priorityTier)}
                    </span>
                  </td>

                  {/* Top Trigger Signal */}
                  <td className="py-3.5 px-4">
                    <span className="text-[#333] font-medium line-clamp-1 max-w-[240px]">
                      {account.reasons[0] || "No signal triggers detected."}
                    </span>
                  </td>

                  {/* Drill down action button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onRevealInsights(account)}
                      className="px-3 py-1.5 bg-white group-hover:bg-black border border-black/10 group-hover:border-black text-[#555] group-hover:text-white rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1.5 ml-auto transition shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Drill Down</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

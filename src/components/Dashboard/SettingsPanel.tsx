"use client";

import React from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { Sliders, ToggleLeft, ToggleRight, ArrowsCounterClockwise, CheckCircle } from "@phosphor-icons/react";

export default function SettingsPanel() {
  const { signals, setSignals, recalculateScores, userRole } = useIntelScout();
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const isSales = userRole === "sales";

  const handleToggleSignal = (id: string) => {
    if (isSales) return;
    const updated = signals.map((sig) => (sig.id === id ? { ...sig, enabled: !sig.enabled } : sig));
    setSignals(updated);
  };

  const handleWeightChange = (id: string, weight: number) => {
    if (isSales) return;
    const updated = signals.map((sig) => (sig.id === id ? { ...sig, weight } : sig));
    setSignals(updated);
  };

  const handleApplyConfig = () => {
    if (isSales) return;
    recalculateScores();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Group signals
  const strongSigs = signals.filter((s) => s.category === "strong");
  const mediumSigs = signals.filter((s) => s.category === "medium");
  const weakSigs = signals.filter((s) => s.category === "weak");

  const renderSignalRow = (sig: typeof signals[0]) => (
    <div 
      key={sig.id} 
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#fafafa] border border-black/10 rounded-xl transition shadow-sm ${
        sig.enabled ? "border-black/20" : "opacity-40 border-black/10"
      }`}
    >
      <div className="flex items-center space-x-3 sm:w-1/2">
        <button
          type="button"
          disabled={isSales}
          onClick={() => handleToggleSignal(sig.id)}
          className={`focus:outline-none transition ${isSales ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${sig.enabled ? "text-violet-600" : "text-[#888]"}`}
        >
          {sig.enabled ? (
            <ToggleRight className="w-8 h-8" />
          ) : (
            <ToggleLeft className="w-8 h-8" />
          )}
        </button>
        <div>
          <p className="text-xs font-semibold text-[#111]">{sig.name}</p>
          <p className="text-[10px] text-[#666] font-mono">ID: {sig.id}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-3 sm:mt-0 flex-1 justify-end">
        <input
          type="range"
          min="1"
          max="50"
          value={sig.weight}
          disabled={!sig.enabled || isSales}
          onChange={(e) => handleWeightChange(sig.id, parseInt(e.target.value))}
          className="w-full sm:w-44 h-1 bg-[#e0e0e0] rounded-lg appearance-none cursor-pointer accent-violet-600 disabled:opacity-30 disabled:cursor-not-allowed"
        />
        <span className="text-xs font-mono font-bold text-[#333] w-12 text-right">
          +{sig.weight} pts
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-black/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
      
      {/* Sales Read-only Banner */}
      {isSales && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start space-x-3 text-xs leading-normal">
          <Sliders className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-bold block uppercase tracking-wide mb-0.5">Read-Only Mode</span>
            <span>Your role (Sales Representative) does not have privileges to alter GTM signal configurations. Contact your GTM administrator to customize weights.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#111] uppercase tracking-wider font-outfit">Qualification Weighting Center</h3>
          <p className="text-[10px] text-[#666]">Modify dynamic signal weights. Changes will impact all Opportunity Scores upon applying.</p>
        </div>
        
        {/* Save/Apply */}
        <button
          onClick={handleApplyConfig}
          disabled={isSales}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition ${
            isSales
              ? "bg-[#fafafa] text-[#888] border border-black/10 cursor-not-allowed opacity-50"
              : saveSuccess 
                ? "bg-emerald-600 text-white" 
                : "bg-black hover:bg-[#222] text-white shadow-sm cursor-pointer"
          }`}
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Applied!</span>
            </>
          ) : (
            <>
              <ArrowsCounterClockwise className="w-3.5 h-3.5" />
              <span>Apply & Recalculate</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
        
        {/* Strong Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-emerald-600 uppercase block mb-3">Strong Signal Weights</span>
          <div className="space-y-2">
            {strongSigs.map(renderSignalRow)}
          </div>
        </div>

        {/* Medium Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-blue-600 uppercase block mb-3">Medium Signal Weights</span>
          <div className="space-y-2">
            {mediumSigs.map(renderSignalRow)}
          </div>
        </div>

        {/* Weak Tiers */}
        <div>
          <span className="text-[9px] font-bold tracking-widest text-[#555] uppercase block mb-3">Weak Signal Weights</span>
          <div className="space-y-2">
            {weakSigs.map(renderSignalRow)}
          </div>
        </div>

      </div>

    </div>
  );
}

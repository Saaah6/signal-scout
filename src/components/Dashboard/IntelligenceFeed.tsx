"use client";

import React from "react";
import { useIntelScout } from "@/context/IntelScoutContext";
import { Pulse, ShieldCheck, Flame, Info } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntelligenceFeed() {
  const { feedEvents } = useIntelScout();

    const getEventIcon = (type: "strong" | "medium" | "weak") => {
    switch (type) {
      case "strong": return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "medium": return <Flame className="w-4 h-4 text-amber-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getEventBorderColor = (type: "strong" | "medium" | "weak") => {
    switch (type) {
      case "strong": return "border-emerald-500/20 bg-emerald-500/10";
      case "medium": return "border-amber-500/20 bg-amber-500/10";
      default: return "border-blue-500/20 bg-blue-500/10";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-black/10 rounded-xl p-5 shadow-sm flex flex-col h-full overflow-hidden min-h-[400px]">
      
      {/* Title */}
      <div className="flex items-center space-x-2 mb-4 border-b border-black/10 pb-3">
        <Pulse className="w-4 h-4 text-violet-600 animate-pulse" />
        <h3 className="text-xs font-bold text-[#111] uppercase tracking-wider font-outfit">Live GTM Signal Feed</h3>
      </div>

      <p className="text-[10px] text-[#666] mb-4">
        Dynamic intent triggers crawling from domain headers, job listings, and news channels in real-time.
      </p>

      {/* Events Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {feedEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <Pulse className="w-8 h-8 text-[#ccc] mb-2.5 animate-spin" />
              <p className="text-xs text-[#888] font-medium">Listening for GTM trigger webhooks...</p>
            </div>
          ) : (
            feedEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 15, stiffness: 150 }}
                className={`p-3.5 border rounded-xl flex items-start space-x-3 hover:border-black/20 transition ${getEventBorderColor(event.type)}`}
              >
                <div className="p-1.5 bg-white border border-black/10 rounded-lg shrink-0 mt-0.5">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-[#111] truncate font-outfit">
                      {event.companyName}
                    </span>
                    <span className="text-[9px] font-mono text-[#888] shrink-0">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-1 leading-normal">
                    {event.text}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

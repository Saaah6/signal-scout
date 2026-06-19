"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedLogoProps {
  className?: string;
  showText?: boolean;
}

export default function AnimatedLogo({ className = "", showText = true }: AnimatedLogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      {showText ? (
        <motion.span 
          className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#000] via-[#888] to-[#000]"
          animate={{ backgroundPosition: ["-200% center", "200% center"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% auto" }}
        >
          IntelScout
        </motion.span>
      ) : (
        <motion.span 
          className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#000] via-[#888] to-[#000] mx-auto"
          animate={{ backgroundPosition: ["-200% center", "200% center"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% auto" }}
        >
          IS
        </motion.span>
      )}
    </div>
  );
}

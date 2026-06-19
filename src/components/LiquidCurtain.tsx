"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LiquidCurtainProps {
  children: React.ReactNode;
  stageKey: any; // Unique key representing the step/stage (trigger transition on change)
}

export default function LiquidCurtain({ children, stageKey }: LiquidCurtainProps) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevStageKeyRef = useRef(stageKey);

  useEffect(() => {
    if (stageKey !== prevStageKeyRef.current) {
      prevStageKeyRef.current = stageKey;
      setIsTransitioning(true);
      // Wait for the curtain to reach full cover before updating child content
      const timer = setTimeout(() => {
        setDisplayChildren(children);
      }, 450); // Midpoint of the 900ms transition
      
      const finishTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 900); // End of transition
      
      return () => {
        clearTimeout(timer);
        clearTimeout(finishTimer);
      };
    } else {
      setDisplayChildren(children);
    }
  }, [stageKey, children]);

  // SVG path definitions for the liquid curtain morphing transition
  const animCurtain = {
    initial: {
      d: "M 100 0 L 100 100 L 100 100 L 100 0 Z",
    },
    mid: {
      d: [
        "M 100 0 L 100 100 L 100 100 L 100 0 Z",
        "M 100 0 L 100 100 L 40 100 Q -20 50 40 0 Z",
        "M 100 0 L 100 100 L 0 100 L 0 0 Z",
      ],
      transition: {
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      d: [
        "M 0 0 L 0 100 L 100 100 L 100 0 Z",
        "M 0 0 L 0 100 L 60 100 Q 120 50 60 0 Z",
        "M 0 0 L 0 100 L 0 100 L 0 0 Z",
      ],
      transition: {
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    <div className="relative w-full min-h-[420px] flex items-center justify-center">
      {/* Content wrapper with scale/opacity fade */}
      <motion.div
        key={stageKey}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        {displayChildren}
      </motion.div>

      {/* SVG Liquid Curtain Wipe Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9 }}
            className="fixed inset-0 pointer-events-none z-50 w-full h-full"
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-[120vh] -mt-[10vh] fill-[#111]"
            >
              {/* Outer Glow Liquid Wave Path */}
              <motion.path
                variants={animCurtain}
                initial="initial"
                animate="mid"
                exit="exit"
                className="opacity-10"
              />

              {/* Solid Liquid Wave Path */}
              <motion.path
                variants={animCurtain}
                initial="initial"
                animate="mid"
                exit="exit"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

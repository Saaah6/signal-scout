"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  
  // Track cursor position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Add spring physics for smooth, premium inertia
  const springConfig = { damping: 40, stiffness: 150, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop/devices with hover capability
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    
    // Disable heavy effects on low-end mobile or if no hover
    if (!mediaQuery.matches || prefersReducedMotion) {
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, prefersReducedMotion]);

  // If reduced motion is preferred, don't render the effect to save resources
  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          // GPU accelerated transform using Framer Motion springs
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          // Monochrome, premium atmospheric gradient
          background: "radial-gradient(circle, rgba(100, 100, 100, 0.06) 0%, rgba(150, 150, 150, 0.02) 40%, transparent 70%)",
          filter: "blur(120px)",
          willChange: "transform",
        }}
      />
    </motion.div>
  );
}

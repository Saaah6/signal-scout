import React from "react";
import { ArrowRight } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";
import { motion } from "framer-motion";

export const NavLink = React.memo(function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-sm font-medium text-[#333333] hover:text-black transition-colors duration-200 group relative font-roboto">
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
    </a>
  );
});

export default function Navbar({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="w-full max-w-[1200px] pointer-events-auto bg-white/70 backdrop-blur-md border border-black/10 rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-14 md:h-16 flex items-center justify-between px-6 transition-all">
        {/* Logo — left */}
        <div className="flex-1 min-w-max flex items-center">
          <AnimatedLogo className="w-5 h-5" showText={true} />
        </div>

        {/* Nav links — perfectly centred */}
        <div className="hidden md:flex items-center justify-center gap-8 flex-1">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it works</NavLink>
          <NavLink href="#newsletter">GTM Digest</NavLink>
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-6 flex-1 min-w-max">
          <button onClick={onOpenAuth} className="text-sm font-medium text-[#333333] hover:text-black transition-colors duration-200 font-roboto hidden md:block">
            Sign in
          </button>
          <motion.button
            onClick={onOpenAuth}
            className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold rounded-full px-5 h-9 transition-all duration-200 group font-roboto shrink-0 bg-gradient-to-r from-[#000] via-[#555] to-[#000] shadow-sm hover:shadow-md"
            style={{ backgroundSize: "200% auto" }}
            animate={{ backgroundPosition: ["-200% center", "200% center"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>
      </header>
    </div>
  );
}

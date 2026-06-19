import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, CircleNotch } from "@phosphor-icons/react";

const FADE_UP = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterSubmitting(true);
    try {
      const res  = await fetch("/api/newsletter/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setNewsletterSuccess(true); setEmail(""); }
      else setNewsletterError(data.error || "Something went wrong.");
    } catch {
      setNewsletterError("Failed to connect. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
    }
  }, [email]);

  const onEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), []);

  return (
    <section id="newsletter" className="relative py-24 lg:py-32 bg-transparent overflow-hidden">
      {/* Subtle radial background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
      
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-14 relative z-10">
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full border border-black/10 bg-white/60 backdrop-blur-md text-xs font-semibold text-[#111] tracking-wide mb-6 shadow-sm font-sans">
            <span className="text-amber-500">⚡</span>
            <span>Weekly GTM Intelligence</span>
          </div>
          <motion.h2 {...FADE_UP} className="text-4xl lg:text-5xl font-black tracking-tight font-roboto mb-6 leading-[1.1] text-black text-center w-full">
            Join the GTM<br className="hidden sm:block" /> Intelligence Circle
          </motion.h2>
          <p className="text-lg text-[#555] leading-relaxed mb-8 font-normal text-center w-full max-w-[480px] mx-auto">
            Weekly B2B signal crawling techniques, qualification frameworks, and outbound strategies. No spam.
          </p>

          <form 
            onSubmit={handleNewsletterSubmit} 
            className="w-full max-w-[480px] mx-auto bg-white border border-black/10 rounded-[16px] p-1.5 flex flex-col md:flex-row items-center gap-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-within:border-black/20"
          >
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              disabled={newsletterSubmitting || newsletterSuccess}
              onChange={onEmailChange}
              className="flex-1 w-full h-12 px-4 bg-transparent text-[15px] font-roboto text-black placeholder-[#888] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={newsletterSubmitting || newsletterSuccess}
              className="w-full md:w-[130px] h-12 bg-black hover:bg-[#222] text-white font-semibold text-[14px] rounded-[10px] transition-all duration-200 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 font-roboto"
            >
              {newsletterSubmitting ? (
                <CircleNotch className="w-5 h-5 animate-spin" />
              ) : newsletterSuccess ? (
                <><CheckCircle className="w-4 h-4 text-emerald-400" /> Subscribed</>
              ) : "Subscribe"}
            </button>
          </form>
          {newsletterError && <p className="text-sm text-red-500 mt-3 font-roboto text-center w-full">{newsletterError}</p>}

          <p className="text-[13px] text-[#888888] font-medium mt-4 font-roboto tracking-wide text-center w-full">
            Join 1,200+ revenue leaders receiving weekly GTM intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}

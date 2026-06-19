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
    <section id="newsletter" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-14">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center justify-center">
          <span className="inline-flex flex-wrap justify-center items-center gap-3 text-sm font-roboto-mono text-[#888888] mb-6">
            <span className="w-8 h-px bg-black/25 inline-block" />
            <span className="text-center">GTM Intelligence Digest</span>
            <span className="w-8 h-px bg-black/25 inline-block" />
          </span>
          <motion.h2 {...FADE_UP} className="text-4xl lg:text-6xl font-black tracking-tight font-roboto mb-6 leading-tight text-black text-center w-full">
            Join the GTM<br className="hidden sm:block" /> Intelligence Circle
          </motion.h2>
          <p className="text-lg sm:text-xl text-[#555555] leading-relaxed mb-10 font-normal text-center max-w-lg mx-auto">
            Weekly B2B signal crawling techniques, qualification frameworks, and outbound strategies. No spam.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-wrap w-full gap-3 items-center justify-center mt-4 sm:mt-8">
            <input
              type="email"
              placeholder="Work email"
              value={email}
              disabled={newsletterSubmitting || newsletterSuccess}
              onChange={onEmailChange}
              className="w-full sm:w-auto flex-1 min-w-[260px] max-w-sm h-12 px-5 rounded-full text-sm font-roboto text-black placeholder-[#aaaaaa] bg-white transition focus:outline-none"
              style={{ border: "1.5px solid rgba(0,0,0,0.15)" }}
            />
            <button
              type="submit"
              disabled={newsletterSubmitting || newsletterSuccess}
              className="w-full sm:w-auto h-12 px-8 bg-black hover:bg-[#1a1a1a] text-white font-bold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 font-roboto"
            >
              {newsletterSubmitting ? (
                <CircleNotch className="w-4 h-4 animate-spin" />
              ) : newsletterSuccess ? (
                <><CheckCircle className="w-4 h-4 text-green-400" /> Subscribed!</>
              ) : "Subscribe"}
            </button>
          </form>

          {newsletterError && <p className="text-sm text-red-500 mt-3 font-roboto w-full text-center">{newsletterError}</p>}
          <p className="text-xs text-[#aaaaaa] mt-8 font-roboto-mono tracking-widest uppercase text-center w-full">
            1,200+ revenue leaders · monthly
          </p>
        </div>
      </div>
    </section>
  );
}

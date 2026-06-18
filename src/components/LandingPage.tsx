"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSignIn } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, CircleNotch, EnvelopeSimple, X } from "@phosphor-icons/react";
import AnimatedLogo from "./AnimatedLogo";

// ── Types ──────────────────────────────────────────────────────────
interface HeroWord {
  text: string;
  animated: boolean;
}

// ── Char-by-char animated word ─────────────────────────────────────
function AnimatedWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <span className="relative inline-block">
      <span className="inline-flex">
        {word.split("").map((char, i) => (
          <span
            key={i}
            className="animate-char-in"
            style={{ animationDelay: `${delay + i * 40}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
      {/* Highlight bar beneath */}
      <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-foreground/8 rounded-sm" />
    </span>
  );
}

// ── Underline nav link ─────────────────────────────────────────────
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative text-sm text-foreground/60 hover:text-foreground transition-colors duration-300 group font-roboto"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

// ── Feature row ────────────────────────────────────────────────────
function FeatureRow({
  num,
  title,
  body,
  delay = 0,
}: {
  num: string;
  title: string;
  body: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group border-b border-foreground/8 py-10 lg:py-14 flex flex-col lg:flex-row gap-8 lg:gap-16 cursor-default"
    >
      <div className="shrink-0">
        <span className="font-roboto-mono text-sm text-foreground/30">{num}</span>
      </div>
      <div className="flex-1 grid lg:grid-cols-2 gap-6 items-start">
        <h3 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground group-hover:translate-x-2 transition-transform duration-500 font-roboto leading-tight">
          {title}
        </h3>
        <p className="text-lg text-foreground/50 leading-relaxed font-roboto font-light">{body}</p>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function LandingPage() {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const [showAuth, setShowAuth] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  const handleGoogleLogin = async () => {
    if (!isSignInLoaded) return;
    setLoginSubmitting(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch {
      setLoginSubmitting(false);
    }
  };

  const handleOktaLogin = async () => {
    if (!isSignInLoaded) return;
    setLoginSubmitting(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_okta",
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch {
      setLoginSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setNewsletterSuccess(true); setEmail(""); }
      else setNewsletterError(data.error || "Something went wrong.");
    } catch {
      setNewsletterError("Failed to connect. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IntelScout AI",
    operatingSystem: "All",
    applicationCategory: "BusinessApplication",
    description: "Real-time AI crawler, technographics parser, and account qualification scoring engine.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const stats = [
    { val: "94.8%", label: "ICP match rate", brand: "TIER 1" },
    { val: "18×",   label: "signals detected", brand: "DAILY" },
    { val: "< 3s",  label: "crawl latency",   brand: "P99" },
    { val: "1,200+",label: "revenue leaders", brand: "USERS" },
  ];

  return (
    <div className="relative min-h-screen bg-white text-foreground overflow-x-hidden noise-overlay font-roboto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Subtle grid overlay ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]" aria-hidden>
        {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((t) => (
          <div key={t} className="absolute h-px bg-foreground/10 left-0 right-0" style={{ top: `${t}%` }} />
        ))}
        {[8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 83.33, 91.66].map((l) => (
          <div key={l} className="absolute w-px bg-foreground/10 top-0 bottom-0" style={{ left: `${l}%` }} />
        ))}
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/90 backdrop-blur-md border-b border-foreground/8 shadow-sm" : ""
        }`}
      >
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 h-18 flex items-center justify-between" style={{ height: 72 }}>
          {/* Logo */}
          <AnimatedLogo className="w-5 h-5" showText={true} />

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#newsletter">GTM Digest</NavLink>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAuth(true)}
              className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-300 font-roboto hidden md:block"
            >
              Sign in
            </button>
            <button
              onClick={() => setShowAuth(true)}
              className="inline-flex items-center gap-2 bg-foreground hover:bg-foreground/85 text-white text-sm font-bold rounded-full px-6 h-10 transition-all duration-300 group font-roboto"
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-32 lg:py-40">

          {/* Eyebrow */}
          <div
            className="animate-line-in mb-8"
            style={{ animationDelay: "200ms" }}
          >
            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-foreground/40">
              <span className="w-8 h-px bg-foreground/30 inline-block" />
              The GTM intelligence platform
            </span>
          </div>

          {/* Giant headline */}
          <div className="mb-12">
            <h1
              className="font-black leading-[0.88] tracking-tight font-roboto"
              style={{ fontSize: "clamp(3.5rem, 11vw, 9.5rem)" }}
            >
              <span
                className="block animate-line-in"
                style={{ animationDelay: "350ms" }}
              >
                Qualify B2B
              </span>
              <span className="block">
                accounts to{" "}
                {heroVisible && (
                  <AnimatedWord word="win." delay={550} />
                )}
              </span>
            </h1>
          </div>

          {/* Sub-headline + CTA side-by-side */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-end">
            <p
              className="text-xl lg:text-2xl text-foreground/50 leading-relaxed max-w-xl font-light animate-line-in"
              style={{ animationDelay: "500ms" }}
            >
              IntelScout crawls target domains in real-time — tracking hiring signals,
              pricing changes, and tech stack shifts — then scores every account
              automatically.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start gap-4 animate-line-in"
              style={{ animationDelay: "620ms" }}
            >
              <button
                onClick={() => setShowAuth(true)}
                className="inline-flex items-center gap-2.5 bg-foreground hover:bg-foreground/85 text-white font-bold text-base rounded-full px-8 h-14 transition-all duration-300 group font-roboto"
              >
                Start free trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-foreground/15 hover:border-foreground/30 hover:bg-foreground/[0.03] text-foreground font-bold text-base rounded-full px-8 h-14 transition-all duration-300 font-roboto"
              >
                Watch demo
              </a>
            </div>
          </div>
        </div>

        {/* ── Scrolling stats marquee ─────────────────────── */}
        <div
          className="absolute bottom-12 left-0 right-0 animate-line-in overflow-hidden"
          style={{ animationDelay: "800ms" }}
        >
          <div className="flex gap-16 marquee whitespace-nowrap select-none">
            {[...stats, ...stats].map((s, i) => (
              <div key={i} className="flex items-baseline gap-4 shrink-0">
                <span
                  className="font-black font-roboto"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  {s.val}
                </span>
                <span className="text-sm text-foreground/40 font-roboto">
                  {s.label}
                  <span className="block font-roboto-mono text-[10px] mt-0.5 tracking-widest text-foreground/30">
                    {s.brand}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="relative py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-foreground/40 mb-6">
              <span className="w-8 h-px bg-foreground/30 inline-block" />
              Capabilities
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl lg:text-6xl font-black tracking-tight font-roboto leading-tight"
            >
              Everything you need.<br />
              <span className="text-foreground/30">Nothing you don't.</span>
            </motion.h2>
          </div>

          <div>
            <FeatureRow
              num="01"
              title="Continuous Crawler Engine"
              body="Scrapes web infrastructure, hiring targets, corporate news, and pricing tables automatically. Eliminates manual research overhead entirely."
              delay={0}
            />
            <FeatureRow
              num="02"
              title="Dynamic Intent Scoring"
              body="Set exact weights for compliance requirements, dev tool changes, or marketing roles. Watch matching profiles float straight to the top."
              delay={0.08}
            />
            <FeatureRow
              num="03"
              title="GTM Contact Blueprints"
              body="Maps target accounts to buying committees and writes highly contextual, personalized email sequences tailored to exact active pain points."
              delay={0.16}
            />
            <FeatureRow
              num="04"
              title="Real-time Signal Feed"
              body="Live alerts when a target account triggers a qualifying event — funding, headcount changes, tech adoption, or compliance filings."
              delay={0.24}
            />
          </div>
        </div>
      </section>

      {/* ── How it works — inverted black section ────────────── */}
      <section id="how-it-works" className="relative py-24 lg:py-32 bg-foreground text-white overflow-hidden">
        {/* Diagonal stripe texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)",
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-white/40 mb-6">
              <span className="w-8 h-px bg-white/30 inline-block" />
              Process
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-black tracking-tight font-roboto leading-tight"
            >
              Three steps.<br />
              <span className="text-white/40">Infinite pipeline.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Steps */}
            <div className="space-y-0">
              {[
                {
                  roman: "I",
                  title: "Define your ICP",
                  body: "Describe your offer and ideal customer. IntelScout compiles a full GTM blueprint — ICP fit, pain map, and signal weights.",
                  active: true,
                },
                {
                  roman: "II",
                  title: "Crawl & score accounts",
                  body: "The crawler monitors thousands of domains continuously, scoring each account against your qualification vectors in real-time.",
                  active: false,
                },
                {
                  roman: "III",
                  title: "Launch personalized outreach",
                  body: "Export AI-written email sequences, call scripts, and LinkedIn hooks tailored to each account's exact active signals.",
                  active: false,
                },
              ].map((step) => (
                <div
                  key={step.roman}
                  className={`w-full text-left py-8 border-b border-white/10 transition-all duration-500 group ${
                    step.active ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-black text-3xl text-white/30 font-roboto shrink-0">{step.roman}</span>
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-black mb-3 group-hover:translate-x-2 transition-transform duration-300 font-roboto">
                        {step.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed font-light font-roboto">{step.body}</p>
                      {step.active && (
                        <div className="mt-4 h-px bg-white/20 overflow-hidden">
                          <div className="h-full bg-white" style={{ animation: "progress 5s linear forwards" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Terminal preview */}
            <div className="lg:sticky lg:top-32 self-start">
              <div className="border border-white/10 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                  <span className="text-xs font-roboto-mono text-white/30">intelscout.crawl.ts</span>
                </div>
                <div className="p-7 font-roboto-mono text-sm min-h-[260px]">
                  <pre className="text-white/60 leading-loose">
                    {[
                      { line: 1, delay: 0,   text: 'import { intelscout } from "@/core"' },
                      { line: 2, delay: 80,  text: '' },
                      { line: 3, delay: 160, text: 'intelscout.crawl({' },
                      { line: 4, delay: 240, text: "  source: 'your-domain.com'," },
                      { line: 5, delay: 320, text: '  sync: true,' },
                      { line: 6, delay: 400, text: '  signals: ["hiring","pricing"]' },
                      { line: 7, delay: 480, text: '})' },
                    ].map((l) => (
                      <div
                        key={l.line}
                        className="code-line-reveal"
                        style={{ animationDelay: `${l.delay}ms` }}
                      >
                        <span className="text-white/20 select-none w-7 inline-block">{l.line}</span>
                        <span>{l.text}</span>
                      </div>
                    ))}
                  </pre>
                </div>
                <div className="px-5 py-3 border-t border-white/10 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-roboto-mono text-white/30">ICP_SCORE: 94.8 // 18 signals detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────── */}
      <section id="newsletter" className="relative py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center">

            <span className="inline-flex items-center gap-3 text-sm font-roboto-mono text-foreground/40 mb-6">
              <span className="w-8 h-px bg-foreground/30 inline-block" />
              GTM Intelligence Digest
              <span className="w-8 h-px bg-foreground/30 inline-block" />
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-black tracking-tight font-roboto mb-6 leading-tight"
            >
              Join the GTM<br />Intelligence Circle
            </motion.h2>
            <p className="text-xl text-foreground/40 leading-relaxed mb-10 font-light">
              Weekly B2B signal crawling techniques, qualification frameworks, and outbound strategies. No spam.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Work email"
                value={email}
                disabled={newsletterSubmitting || newsletterSuccess}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 px-4 rounded-full border border-foreground/15 focus:border-foreground/40 focus:outline-none text-sm font-roboto text-foreground placeholder-foreground/30 bg-white transition"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting || newsletterSuccess}
                className="h-12 px-6 bg-foreground hover:bg-foreground/85 text-white font-bold text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 font-roboto"
              >
                {newsletterSubmitting ? (
                  <CircleNotch className="w-4 h-4 animate-spin" />
                ) : newsletterSuccess ? (
                  <><CheckCircle className="w-4 h-4 text-green-400" /> Subscribed!</>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>

            {newsletterError && (
              <p className="text-sm text-red-500 mt-3 font-roboto">{newsletterError}</p>
            )}
            <p className="text-xs text-foreground/30 mt-5 font-roboto-mono tracking-widest uppercase">
              1,200+ revenue leaders · monthly
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-foreground/8 py-8 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <AnimatedLogo className="w-4 h-4" showText={true} />
          <div className="flex gap-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#newsletter">Subscribe</NavLink>
          </div>
          <p className="text-xs text-foreground/30 font-roboto-mono">
            © {new Date().getFullYear()} IntelScout AI Inc.
          </p>
        </div>
      </footer>

      {/* ── Auth modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showAuth && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-foreground/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
            >
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 pb-5 border-b border-foreground/8 mb-5">
                <AnimatedLogo className="w-5 h-5" showText={true} />
              </div>

              {loginSubmitting ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <CircleNotch className="w-7 h-7 text-foreground/50 animate-spin" />
                  <span className="text-sm text-foreground/40 font-roboto">Redirecting…</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[11px] font-roboto-mono text-foreground/30 uppercase tracking-widest text-center mb-5">
                    Select authentication provider
                  </p>

                  {/* Google */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center gap-3 px-4 py-3.5 border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.02] rounded-xl transition duration-200 font-bold text-sm text-foreground font-roboto"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Continue with Google
                  </button>

                  {/* Okta */}
                  <button
                    onClick={handleOktaLogin}
                    className="w-full flex items-center gap-3 px-4 py-3.5 border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.02] rounded-xl transition duration-200 font-bold text-sm text-foreground font-roboto"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-foreground/60" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    Continue with Okta SSO
                  </button>

                  <button
                    onClick={() => setShowAuth(false)}
                    className="w-full text-center py-2 text-xs text-foreground/30 hover:text-foreground/60 transition font-roboto mt-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

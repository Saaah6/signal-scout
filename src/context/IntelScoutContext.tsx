"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";


export type GtmCategory = "compliance" | "hr" | "sales" | "devtools" | "general";
export type UserRole = "admin" | "sales" | "marketing";

export function getOfferCategory(sell: string): GtmCategory {
  const sellLower = sell.toLowerCase();
  if (sellLower.includes("compliance") || sellLower.includes("security") || sellLower.includes("cyber") || sellLower.includes("audit") || sellLower.includes("soc2")) {
    return "compliance";
  }
  if (sellLower.includes("hr") || sellLower.includes("people") || sellLower.includes("recruiting") || sellLower.includes("hiring") || sellLower.includes("talent")) {
    return "hr";
  }
  if (sellLower.includes("crm") || sellLower.includes("sales") || sellLower.includes("marketing") || sellLower.includes("revenue") || sellLower.includes("revops")) {
    return "sales";
  }
  if (sellLower.includes("dev") || sellLower.includes("developer") || sellLower.includes("infra") || sellLower.includes("cloud") || sellLower.includes("git") || sellLower.includes("ci/cd") || sellLower.includes("caching")) {
    return "devtools";
  }
  return "general";
}

export interface Offer {
  sell: string;
  websiteUrl: string;
  problem: string;
  dealSize: string;
  salesCycle: string;
}

export interface ICP {
  firmographics: {
    industry: string;
    employeeCount: string;
    revenue: string;
    geography: string;
    fundingStage: string;
  };
  technographics: string[];
  growthSignals: string[];
  buyingCommittee: string[];
}

export interface IcpAnalysisResult {
  status: "perfect" | "warning" | "critical";
  message: string;
  suggestion?: string;
}

export interface PainMap {
  problem: string;
  pain: string[];
  triggers: string[];
  buyingMotivation: string;
}

export interface SignalConfig {
  id: string;
  name: string;
  category: "strong" | "medium" | "weak";
  weight: number;
  enabled: boolean;
}

export interface Account {
  id: string;
  company_name: string;
  domain: string;
  icpFit: number;
  intent: number;
  timing: number;
  signalScore: number;
  opportunityScore: number; // Formula: Fit + Intent + Timing + Signal
  priorityTier: 1 | 2 | 3 | 4; // Tier 1: 90+, Tier 2: 70-89, Tier 3: 50-69, Tier 4: <50
  reasons: string[];
  buyingCommittee: {
    economic: string;
    technical: string;
    champion: string;
    endUser: string;
  };
  gtmRecommendations: {
    contact: string;
    reason: string;
    pain: string;
    angle: string;
  };
  signalsDetected: string[];
  techStack: string[];
  employeeCount: number;
  revenue: string;
  geography: string;
  fundingStage: string;
  industry: string;
}

export interface FeedEvent {
  id: string;
  timestamp: string;
  companyName: string;
  text: string;
  type: "strong" | "medium" | "weak";
  weight: number;
}

interface IntelScoutContextType {
  step: number | "research" | "dashboard";
  setStep: (s: number | "research" | "dashboard") => void;
  offer: Offer;
  setOffer: (o: Offer) => void;
  icp: ICP | null;
  setIcp: (i: ICP | null) => void;
  painMap: PainMap | null;
  setPainMap: (p: PainMap | null) => void;
  signals: SignalConfig[];
  setSignals: (s: SignalConfig[]) => void;
  accounts: Account[];
  setAccounts: (a: Account[]) => void;
  feedEvents: FeedEvent[];
  addFeedEvent: (e: FeedEvent) => void;
  icpAnalysis: IcpAnalysisResult[] | null;
  isAnalyzingIcp: boolean;
  analyzeBusinessIcp: () => void;
  isResearching: boolean;
  setIsResearching: (r: boolean) => void;
  researchProgress: number;
  setResearchProgress: (p: number) => void;
  consoleLogs: string[];
  addConsoleLog: (l: string) => void;
  clearConsoleLogs: () => void;
  generateWorkspace: (customOffer?: Offer) => void;
  recalculateScores: () => void;
  gtmSummary: string;
  userRole: UserRole;
  setUserRole: (r: UserRole) => void;
  credits: number;
  setCredits: (c: number) => void;
  lastSignalAt: number; // Unix ms timestamp of last fired signal — used by charts to pulse
  user: { email: string; name: string; avatar: string } | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string, avatar?: string) => Promise<void>;
  logout: () => void;
}

const IntelScoutContext = createContext<IntelScoutContextType | undefined>(undefined);

export const useIntelScout = () => {
  const context = useContext(IntelScoutContext);
  if (!context) {
    throw new Error("useIntelScout must be used within a IntelScoutProvider");
  }
  return context;
};

const DEFAULT_SIGNALS: SignalConfig[] = [
  // Strong Signals
  { id: "exec_hire", name: "C-Level Executive Hire", category: "strong", weight: 35, enabled: true },
  { id: "dept_hiring", name: "Key Department Expansion", category: "strong", weight: 30, enabled: true },
  { id: "pricing_update", name: "Pricing / Packaging Update", category: "strong", weight: 25, enabled: true },
  { id: "tech_install", name: "New Premium Tech Stack Install", category: "strong", weight: 20, enabled: true },
  { id: "compliance_cert", name: "Regulatory / Compliance Update", category: "strong", weight: 20, enabled: true },
  { id: "specialty_role", name: "Specialized Role Hiring", category: "strong", weight: 25, enabled: true },
  // Medium Signals
  { id: "regional_exp", name: "Regional Market Expansion", category: "medium", weight: 15, enabled: true },
  { id: "funding", name: "Recently Funded (Last 90 Days)", category: "medium", weight: 15, enabled: true },
  { id: "headcount_growth", name: "Rapid Headcount Growth (>10%)", category: "medium", weight: 12, enabled: true },
  // Weak Signals
  { id: "content_pub", name: "New Content / Case Study Published", category: "weak", weight: 3, enabled: true },
  { id: "gen_hiring", name: "General Administrative Hiring", category: "weak", weight: 2, enabled: true }
];

export const IntelScoutProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStepState] = useState<number | "research" | "dashboard">(1);
  const [offer, setOffer] = useState<Offer>({
    sell: "AI Compliance Platform",
    websiteUrl: "vanta.com",
    problem: "Reduce compliance effort and automate SOC2 audits",
    dealSize: "$20,000-$100,000",
    salesCycle: "Medium"
  });
  const [icp, setIcp] = useState<ICP | null>(null);
  const [icpAnalysis, setIcpAnalysis] = useState<IcpAnalysisResult[] | null>(null);
  const [isAnalyzingIcp, setIsAnalyzingIcp] = useState<boolean>(false);
  const [painMap, setPainMap] = useState<PainMap | null>(null);
  const [signals, setSignals] = useState<SignalConfig[]>(DEFAULT_SIGNALS);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchProgress, setResearchProgress] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [gtmSummary, setGtmSummary] = useState<string>(
    "Active GTM Strategy: Targeting growing B2B SaaS companies undergoing security audits (SOC2/ISO). The GTM engine crawls target domains looking for trust directories, job vacancies in cybersecurity, and enterprise pricing updates to capture buying timing windows."
  );

  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [credits, setCredits] = useState<number>(5);
  const [lastSignalAt, setLastSignalAt] = useState<number>(0);

  const [user, setUser] = useState<{ email: string; name: string; avatar: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("intelscout_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
    setIsAuthLoading(false);
  }, []);

  const isAuthenticated = !!user;

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("intelscout_user", JSON.stringify(data.user));
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  const signupWithEmail = useCallback(async (email: string, password: string, name: string, avatar?: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, avatar })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("intelscout_user", JSON.stringify(data.user));
      } else {
        throw new Error(data.error || "Signup failed");
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("intelscout_user");
    setStepState(1);
  }, []);

  // Credit refill loop for simulated AI Rate Limiting
  useEffect(() => {
    const interval = setInterval(() => {
      setCredits((prev) => Math.min(5, prev + 1));
    }, 15000); // Refill 1 credit every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const setStep = useCallback((s: number | "research" | "dashboard") => {
    setStepState(s);
  }, []);

  const addConsoleLog = useCallback((l: string) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${l}`]);
  }, []);

  const clearConsoleLogs = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  const analyzeBusinessIcp = useCallback(() => {
    if (!offer || !icp) return;
    setIsAnalyzingIcp(true);
    
    setTimeout(() => {
      const results: IcpAnalysisResult[] = [];
      const ds = offer.dealSize;
      const cycle = offer.salesCycle;
      const size = icp.firmographics.employeeCount;
      const committeeSize = icp.buyingCommittee.length;

      if ((ds === "<$1,000" || ds === "$1,000-$5,000") && (size.includes("1000") || size.includes("Enterprise"))) {
        results.push({
          status: "critical",
          message: "Your deal size is too small for Enterprise targets.",
          suggestion: "Shift focus to SMBs or consider a Product-Led Growth (PLG) motion."
        });
      }

      if (cycle === "Short" && committeeSize >= 4) {
        results.push({
          status: "warning",
          message: "You have a short sales cycle, but targeting a large buying committee.",
          suggestion: "Target a single champion or end-user to reduce consensus friction."
        });
      }

      if (ds === "$100,000+" && cycle === "Short") {
        results.push({
          status: "warning",
          message: "Enterprise $100k+ deals rarely close in a short sales cycle.",
          suggestion: "Expect 6-9 months and adjust revenue forecasts accordingly."
        });
      }

      if (ds === "$100,000+" && (size.includes("1-50") || size.includes("Startup"))) {
        results.push({
          status: "critical",
          message: "Startups/SMBs rarely have the budget for $100k+ deals.",
          suggestion: "Target mid-market to enterprise companies with >200 employees."
        });
      }

      if (results.length === 0) {
        results.push({
          status: "perfect",
          message: "Your ICP aligns well with your business offer and deal dynamics."
        });
      }

      setIcpAnalysis(results);
      setIsAnalyzingIcp(false);
    }, 1500);
  }, [offer, icp]);

  const addFeedEvent = useCallback((e: FeedEvent) => {
    setFeedEvents((prev) => [e, ...prev].slice(0, 50));
    setLastSignalAt(Date.now());
  }, []);

  // Recalculates Opportunity Score based on state config
  const recalculateScores = useCallback(() => {
    setAccounts((prev) =>
      prev.map((acc) => {
        const computedSignals = acc.signalsDetected.reduce((sum, sigId) => {
          const cfg = signals.find((s) => s.id === sigId && s.enabled);
          return sum + (cfg ? cfg.weight : 0);
        }, 0);

        const signalScore = Math.min(100, Math.max(0, computedSignals * 2.2)); // Scale weight sum
        const oppScore = Math.round((acc.icpFit * 0.4) + (acc.intent * 0.25) + (acc.timing * 0.15) + (signalScore * 0.2));

        let tier: 1 | 2 | 3 | 4 = 4;
        if (oppScore >= 90) tier = 1;
        else if (oppScore >= 70) tier = 2;
        else if (oppScore >= 50) tier = 3;

        return {
          ...acc,
          signalScore: Math.round(signalScore),
          opportunityScore: oppScore,
          priorityTier: tier
        };
      })
    );
  }, [signals]);

  // Generate ICP and Pain mapping dynamically based on the offer
  const generateWorkspace = useCallback((customOffer?: Offer) => {
    const currentOffer = customOffer || offer;
    const sellLower = currentOffer.sell.toLowerCase();
    const domain = currentOffer.websiteUrl.toLowerCase();

    // Determine category based on keywords
    const isCompliance = sellLower.includes("compliance") || sellLower.includes("security") || sellLower.includes("cyber") || sellLower.includes("audit") || sellLower.includes("soc2");
    const isHR = sellLower.includes("hr") || sellLower.includes("people") || sellLower.includes("recruiting") || sellLower.includes("hiring") || sellLower.includes("talent");
    const isSalesCRM = sellLower.includes("crm") || sellLower.includes("sales") || sellLower.includes("marketing") || sellLower.includes("revenue") || sellLower.includes("revops");
    const isDevTools = sellLower.includes("dev") || sellLower.includes("developer") || sellLower.includes("infra") || sellLower.includes("cloud") || sellLower.includes("git") || sellLower.includes("ci/cd") || sellLower.includes("caching");
    const isMarketing = sellLower.includes("agency") || sellLower.includes("seo") || sellLower.includes("ads") || sellLower.includes("content") || sellLower.includes("marketing");

    let industry = "Software Development";
    let technographics = ["AWS", "GitHub Actions", "Salesforce", "Vanta", "Snowflake", "Sentry", "PostgreSQL"];
    let growthSignals = ["Engineering expansion (>20% YoY)", "Compliance requirements in job specifications", "Recent funding rounds", "Enterprise landing page launches"];
    let buyingCommittee = ["VP of Engineering", "Head of Security", "Chief Technology Officer (CTO)", "Director of DevOps"];
    
    // Dynamic Pain Mapping Mock based on parsed Offer
    let pain = [
      `Security reviews block major enterprise deals for ${currentOffer.sell} users`,
      `Teams using ${domain || "legacy tools"} spend hours on manual processes`,
      "Compliance audits are manual, error-prone, and stress-inducing"
    ];
    let triggers = [
      "Hiring Security Engineers (audit workload likely increasing)",
      "Added 'Enterprise Plan' link to website footer",
      "Announced Series A funding (entering enterprise sales cycle)"
    ];
    let buyingMotivation = `Unlock enterprise revenue and pass security reviews in days using ${currentOffer.sell || "the platform"}.`;
    let summary = `Active GTM Strategy (Synthesized from ${domain || "provided offer"}): Targeting growing B2B SaaS companies undergoing security audits (SOC2/ISO). The GTM engine crawls target domains looking for trust directories, job vacancies in cybersecurity, and enterprise pricing updates to capture buying timing windows.`;

    if (isHR) {
      industry = "HR Tech, B2B SaaS, Talent Management Services";
      technographics = ["Workday", "Greenhouse", "Slack", "Gusto", "BambooHR", "Lever"];
      growthSignals = ["Hiring 10+ new employees (rapid headcount growth)", "Opened new regional hub", "Transitioning to remote-first structure", "Adding HR operations tooling"];
      buyingCommittee = ["VP of HR", "Chief People Officer", "Head of Talent Acquisition", "Director of HR Operations"];
      pain = [
        "Headcount growth exceeds HR team capacity, slowing down hiring speed",
        "Employee onboarding and compliance tracking are completely manual",
        "High churn rates due to lack of career tracking and performance metrics"
      ];
      triggers = [
        "Hiring 5+ Talent Recruiters (headcount expansion preparation)",
        "Acquired a new company or announced regional expansion",
        "Adding automated onboarding software keyword to tech stack"
      ];
      buyingMotivation = "Reduce talent acquisition cost, speed up time-to-hire, and automate onboarding compliance.";
      summary = `Active GTM Strategy: Targeting companies with rapid headcount expansion. The GTM engine crawls job listings for recruiter roles, scans HR technographics, and monitors expansion signals to identify teams hitting HR operational bottlenecks.`;
    } else if (isSalesCRM) {
      industry = "SalesTech, Marketing Automation, B2B SaaS, Agencies";
      technographics = ["HubSpot", "Salesforce", "Marketo", "Segment", "Intercom", "Apollo"];
      growthSignals = ["Hiring 3+ Account Executives", "Launched new product category on Product Hunt", "Adding sales coaching tools", "CMO/CRO hire announced"];
      buyingCommittee = ["VP of Sales", "VP of Marketing", "Chief Revenue Officer (CRO)", "Head of Sales Operations"];
      pain = [
        "Sales pipelines have stalled due to generic outbound messaging",
        "High cost of customer acquisition through paid advertising channels",
        "Poor conversion rates from leads to booked meetings in the CRM"
      ];
      triggers = [
        "Hiring Growth Marketers or Sales Leaders (pipeline urgency)",
        "Launched a new product category on Product Hunt",
        "Updated pricing to add a direct sales / enterprise plan"
      ];
      buyingMotivation = "Increase conversion rates, automate cold lead personalization, and scale pipeline velocity.";
      summary = `Active GTM Strategy: Targeting companies with active sales hiring and pipeline expansion priorities. The GTM engine crawls job listings for growth/sales hires and scans marketing tools to identify fit.`;
    } else if (isDevTools) {
      industry = "DevTools, Infrastructure, Cloud Platform SaaS";
      technographics = ["AWS", "GitHub Actions", "Vercel", "Sentry", "PostgreSQL", "Docker", "Kubernetes"];
      growthSignals = ["Scaling infrastructure nodes", "Transitioning to cloud-native setup", "Hiring cloud architects", "Recent technical blog posts"];
      buyingCommittee = ["VP of Engineering", "Chief Technology Officer (CTO)", "Director of DevOps", "Engineering Manager"];
      pain = [
        "Engineering cycles wasted on manual CI/CD maintenance and debugging",
        "Slow site/app load speeds leading to developer frustration",
        "High cloud infrastructure and database caching costs"
      ];
      triggers = [
        "Scaling infrastructure nodes or moving workloads to AWS",
        "Hiring Cloud Engineers (infrastructure optimization needs)",
        "Adding DevOps tooling to the tech stack matrix"
      ];
      buyingMotivation = "Reclaim developer hours, optimize database/cloud spend, and double build speeds.";
      summary = `Active GTM Strategy: Targeting teams looking to streamline build cycles and cloud resources. The GTM engine crawls engineering roles, developer blogs, and technographic profiles (e.g. AWS/Vercel) to flag optimization triggers.`;
    } else if (!isCompliance) { // Default or general SaaS
      // If it doesn't match default compliance and is a general category, check isTech
      const isTech = currentOffer.sell.toLowerCase().includes("ai") || currentOffer.sell.toLowerCase().includes("tech") || currentOffer.sell.toLowerCase().includes("software") || currentOffer.sell.toLowerCase().includes("cyber");
      if (!isTech) {
        industry = "E-commerce, Retail, Professional Services";
        technographics = ["Shopify", "Google Analytics", "HubSpot", "Zendesk", "Stripe", "Clara"];
        growthSignals = ["Adding checkout flows", "Hiring sales/ops directors", "Launching online portals"];
        buyingCommittee = ["Chief Marketing Officer (CMO)", "Head of Sales", "Founder & CEO", "VP of Revenue Operations"];
        pain = [
          "Inbound sales pipeline has stalled due to lack of personalization",
          "High cost of customer acquisition through paid advertising channels",
          "Inefficient outbound campaign tracking and poor tool integrations"
        ];
        triggers = [
          "Hiring Growth Marketers or Sales Leaders",
          "Launched a new product category on Product Hunt",
          "Expanded into new geographic market segments"
        ];
        buyingMotivation = "Improve customer acquisition efficiency and increase outbound meeting booking rates.";
        summary = `Active GTM Strategy: Targeting retail and mid-market organizations looking to optimize customer acquisition. The GTM engine crawls job listings for growth/marketing hires and scans tech stacks to identify target integrations.`;
      }
    }

    // 1. Generate ICP
    const generatedICP: ICP = {
      firmographics: {
        industry: "",
        employeeCount: "",
        revenue: "",
        geography: "",
        fundingStage: ""
      },
      technographics,
      growthSignals,
      buyingCommittee
    };
    setIcp(generatedICP);

    // 2. Generate Pain Mapping
    const generatedPainMap: PainMap = {
      problem: currentOffer.problem,
      pain,
      triggers,
      buyingMotivation
    };
    setPainMap(generatedPainMap);
    setGtmSummary(summary);

    // 3. Dynamically adjust signals config categories / naming based on flags
    const customSignals = DEFAULT_SIGNALS.map((s) => {
      // Customize text for different categories
      if (isMarketing && !isSalesCRM) { // Marketing Agency
        if (s.id === "exec_hire") return { ...s, name: "Hiring VP of Marketing / CMO" };
        if (s.id === "dept_hiring") return { ...s, name: "Marketing Expansion Hiring" };
        if (s.id === "pricing_update") return { ...s, name: "Adding Premium Agency Retainers" };
        if (s.id === "tech_install") return { ...s, name: "Installed New Ad Tech Stack" };
        if (s.id === "compliance_cert") return { ...s, name: "Expanding to New Markets" };
        if (s.id === "specialty_role") return { ...s, name: "Hiring SEO / Growth Specialists" };
        if (s.id === "content_pub") return { ...s, name: "Publishing New Case Studies" };
      } else if (isCompliance) {
        if (s.id === "exec_hire") return { ...s, name: "CISO / VP Security Hire" };
        if (s.id === "dept_hiring") return { ...s, name: "Security Hiring / Expansion" };
        if (s.id === "pricing_update") return { ...s, name: "Enterprise Pricing Added" };
        if (s.id === "tech_install") return { ...s, name: "Trust Center Added to Website" };
        if (s.id === "compliance_cert") return { ...s, name: "ISO 27001 / SOC2 Preparation" };
        if (s.id === "specialty_role") return { ...s, name: "Compliance / Legal Hiring" };
      } else if (isHR) {
        if (s.id === "exec_hire") return { ...s, name: "Chief People Officer Hire" };
        if (s.id === "dept_hiring") return { ...s, name: "Talent Recruiter Expansion" };
        if (s.id === "pricing_update") return { ...s, name: "Compensation Frameworks Update" };
        if (s.id === "tech_install") return { ...s, name: "Onboarding Software Added" };
        if (s.id === "compliance_cert") return { ...s, name: "Remote Work Operations Scaling" };
        if (s.id === "specialty_role") return { ...s, name: "HR Operations Specialists" };
      } else if (isSalesCRM) {
        if (s.id === "exec_hire") return { ...s, name: "Chief Revenue Officer Hire" };
        if (s.id === "dept_hiring") return { ...s, name: "Sales Exec (AE) Expansion" };
        if (s.id === "pricing_update") return { ...s, name: "Self-Serve Pricing Added" };
        if (s.id === "tech_install") return { ...s, name: "Outbound Lead Gen Stack Update" };
        if (s.id === "compliance_cert") return { ...s, name: "Email Deliverability Optimization" };
        if (s.id === "specialty_role") return { ...s, name: "Sales Operations Analysts" };
      } else if (isDevTools) {
        if (s.id === "exec_hire") return { ...s, name: "VP of Engineering Hire" };
        if (s.id === "dept_hiring") return { ...s, name: "DevOps Engineer Expansion" };
        if (s.id === "pricing_update") return { ...s, name: "API Usage Pricing Updated" };
        if (s.id === "tech_install") return { ...s, name: "Zero-trust Infrastructure Deployed" };
        if (s.id === "compliance_cert") return { ...s, name: "Data Residency Controls Updated" };
        if (s.id === "specialty_role") return { ...s, name: "Cloud Architect Expansion" };
      }
      return s;
    });
    setSignals(customSignals);
  }, [offer]);

  // Handle background feed updates
  useEffect(() => {
    if (step !== "dashboard" || accounts.length === 0) return;

    const interval = setInterval(() => {
      // Pick a random company
      const randomAccIndex = Math.floor(Math.random() * accounts.length);
      const acc = accounts[randomAccIndex];
      if (!acc) return;

      // Select a signal that this account doesn't have yet or trigger a new one
      const possibleSignals = signals.filter(s => s.enabled && !acc.signalsDetected.includes(s.id));
      
      let randomSig: SignalConfig;
      let isCustomUrlSignal = false;

      if (possibleSignals.length === 0) {
        // Fallback: If all signals are turned off, dynamically generate real-time signals based on the provided URL
        const domain = offer.websiteUrl || "the product";
        const customUrlSignals = [
          { name: `Evaluating competitor alternatives against ${domain}`, type: "medium" as const, reason: `Web traffic detected routing from ${domain} competitor landing pages.` },
          { name: `Internal documentation mentions ${domain}`, type: "strong" as const, reason: `Company intranet/wiki recently indexed keywords matching ${domain}.` },
          { name: `Procurement search for ${domain} category`, type: "medium" as const, reason: `Buying intent search patterns match ${domain} core category.` }
        ];
        
        const custom = customUrlSignals[Math.floor(Math.random() * customUrlSignals.length)];
        randomSig = {
          id: `custom_url_${Date.now()}`,
          name: custom.name,
          description: "Dynamic URL-based signal detection.",
          category: custom.type,
          weight: 15,
          enabled: true
        };
        isCustomUrlSignal = true;
      } else {
        randomSig = possibleSignals[Math.floor(Math.random() * possibleSignals.length)];
      }
      
      // Update account signals in state
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === acc.id) {
            const updatedSignals = [...a.signalsDetected, randomSig.id];
            
            // Recalculate score specifically for this company
            const computedSignals = updatedSignals.reduce((sum, sigId) => {
              const cfg = signals.find((s) => s.id === sigId && s.enabled);
              return sum + (cfg ? cfg.weight : (isCustomUrlSignal ? 15 : 0));
            }, 0);
            const newSignalScore = Math.round(Math.min(100, Math.max(0, computedSignals * 2.2)));
            const newOppScore = Math.round((a.icpFit * 0.4) + (a.intent * 0.25) + (a.timing * 0.15) + (newSignalScore * 0.2));
            
            let newTier: 1 | 2 | 3 | 4 = 4;
            if (newOppScore >= 90) newTier = 1;
            else if (newOppScore >= 70) newTier = 2;
            else if (newOppScore >= 50) newTier = 3;

            // Generate update text
            const text = `${a.company_name} was detected for: "${randomSig.name}"`;
            
            // Add a log/reasons entry
            const category = getOfferCategory(offer.sell);
            const updatedReasons = [...a.reasons];
            let reasonText = `Detected trigger: ${randomSig.name}`;

            if (isCustomUrlSignal) {
               // We already generated the reason logic in customUrlSignals, let's extract it by matching name (a bit hacky but works for mock)
               const domain = offer.websiteUrl || "the product";
               if (randomSig.name.includes("competitor")) reasonText = `Web traffic detected routing from ${domain} competitor landing pages.`;
               else if (randomSig.name.includes("Internal")) reasonText = `Company intranet/wiki recently indexed keywords matching ${domain}.`;
               else reasonText = `Buying intent search patterns match ${domain} core category.`;
            } else if (randomSig.id === "dept_hiring") {
              if (category === "compliance") reasonText = "Detected hiring for 2+ Security Engineering positions.";
              else if (category === "hr") reasonText = "Detected hiring for Talent Recruiters & Sourcers.";
              else if (category === "sales") reasonText = "Detected hiring for 3+ Account Executives.";
              else if (category === "devtools") reasonText = "Detected hiring for DevOps & SRE Engineers.";
              else reasonText = "Detected expansion in primary operations department.";
            } else if (randomSig.id === "specialty_role") {
              if (category === "compliance") reasonText = "Hiring for Compliance/Legal Counsel roles.";
              else if (category === "hr") reasonText = "Hiring for HR Operations Specialists.";
              else if (category === "sales") reasonText = "Hiring for Sales Operations Analysts.";
              else if (category === "devtools") reasonText = "Hiring for Cloud Security Architects.";
              else reasonText = "Hiring for specialized strategic roles.";
            } else if (randomSig.id === "tech_install") {
              if (category === "compliance") reasonText = "Added secure Trust / Security Center to domain portal.";
              else if (category === "hr") reasonText = "Integrated automated onboarding software to website.";
              else if (category === "sales") reasonText = "Added self-serve Enterprise packages to billing pages.";
              else if (category === "devtools") reasonText = "Added interactive API documentation and developer portal.";
              else reasonText = "Upgraded digital tech stack integrations.";
            } else if (randomSig.id === "compliance_cert") {
              if (category === "compliance") reasonText = "SOC2/HIPAA audit readiness mentioned in vacancies.";
              else if (category === "hr") reasonText = "Rapid headcount targets mentioned in company press.";
              else if (category === "sales") reasonText = "CRM API and integration needs mentioned in listings.";
              else if (category === "devtools") reasonText = "CI/CD automation pipeline expansion mentioned in job posts.";
              else reasonText = "Major operational updates listed in active jobs.";
            } else if (randomSig.id === "funding") {
              reasonText = "Announced a new venture capital funding round recently.";
            } else if (randomSig.id === "pricing_update") {
              reasonText = "Added 'Enterprise' package to standard pricing matrix.";
            } else if (randomSig.id === "exec_hire") {
              if (category === "compliance") reasonText = "Hiring CISO or VP of Security.";
              else if (category === "hr") reasonText = "Hiring Chief People Officer (CPO).";
              else if (category === "sales") reasonText = "Hiring Chief Revenue Officer (CRO).";
              else if (category === "devtools") reasonText = "Hiring VP of Engineering.";
              else reasonText = "Hiring VP or C-level Executive.";
            }

            updatedReasons.unshift(reasonText);

            return {
              ...a,
              signalsDetected: updatedSignals,
              signalScore: newSignalScore,
              opportunityScore: newOppScore,
              priorityTier: newTier,
              reasons: updatedReasons.slice(0, 5)
            };
          }
          return a;
        })
      );

      // Add Feed Event
      addFeedEvent({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        companyName: acc.company_name,
        text: `Triggered "${randomSig.name}" signal (+${randomSig.weight} score)`,
        type: randomSig.category,
        weight: randomSig.weight
      });

    }, 12000); // Trigger a new intelligence signal event every 12s

    return () => clearInterval(interval);
  }, [step, accounts, signals]);

  return (
    <IntelScoutContext.Provider
      value={{
        step,
        setStep,
        offer,
        setOffer,
        icp,
        setIcp,
        icpAnalysis,
        isAnalyzingIcp,
        analyzeBusinessIcp,
        painMap,
        setPainMap,
        signals,
        setSignals,
        accounts,
        setAccounts,
        feedEvents,
        addFeedEvent,
        isResearching,
        setIsResearching,
        researchProgress,
        setResearchProgress,
        consoleLogs,
        addConsoleLog,
        clearConsoleLogs,
        generateWorkspace,
        recalculateScores,
        gtmSummary,
        userRole,
        setUserRole,
        credits,
        setCredits,
        lastSignalAt,
        user,
        isAuthenticated,
        isAuthLoading,
        loginWithEmail,
        signupWithEmail,
        logout
      }}
    >
      {children}
    </IntelScoutContext.Provider>
  );
};

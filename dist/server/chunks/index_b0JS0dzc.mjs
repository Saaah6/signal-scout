import { O as createAstro, b as renderTemplate, k as createComponent, w as renderHead, y as renderComponent } from "./render_D6CBBbyb.mjs";
import { t as __exportAll } from "../entry.mjs";
import "./compiler_Cu2JiHLB.mjs";
import { n as getSession } from "./server_CMkOqLUy.mjs";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ArrowCircleUp, ArrowLeft, ArrowRight, ArrowSquareOut, ArrowsCounterClockwise, Brain, Buildings, CalendarBlank, CaretDoubleLeft, CaretDoubleRight, ChartBar, ChartPie, Chat, Check, CheckCircle, CircleNotch, Clipboard, CloudArrowUp, Compass, Cpu, CurrencyDollar, Database, Download, EnvelopeOpen, Eye, FileText, Flame, Funnel, Globe, Info, Lightbulb, Lightning, MagnifyingGlass, Moon, PaperPlane, PhoneCall, Play, Plus, Pulse, Radio, Robot, Shield, ShieldCheck, SignOut, Sliders, Sparkle, SquaresFour, Stack, Sun, Table, Target, Terminal, ToggleLeft, ToggleRight, TrendUp, UserCheck, Users, Warning, WarningCircle, Wrench, X } from "@phosphor-icons/react";
//#region src/components/CursorGlow.tsx
function CursorGlow() {
	const prefersReducedMotion = useReducedMotion();
	const [isVisible, setIsVisible] = useState(false);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const springConfig = {
		damping: 40,
		stiffness: 150,
		mass: 1
	};
	const smoothX = useSpring(mouseX, springConfig);
	const smoothY = useSpring(mouseY, springConfig);
	useEffect(() => {
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion) return;
		const updateMousePosition = (e) => {
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
	}, [
		mouseX,
		mouseY,
		isVisible,
		prefersReducedMotion
	]);
	if (prefersReducedMotion) return null;
	return /* @__PURE__ */ jsx(motion.div, {
		className: "pointer-events-none fixed inset-0 z-[-1] overflow-hidden",
		initial: { opacity: 0 },
		animate: { opacity: isVisible ? 1 : 0 },
		transition: {
			duration: .8,
			ease: "easeInOut"
		},
		children: /* @__PURE__ */ jsx(motion.div, {
			className: "absolute w-[600px] h-[600px] rounded-full",
			style: {
				x: smoothX,
				y: smoothY,
				translateX: "-50%",
				translateY: "-50%",
				background: "radial-gradient(circle, rgba(100, 100, 100, 0.06) 0%, rgba(150, 150, 150, 0.02) 40%, transparent 70%)",
				filter: "blur(120px)",
				willChange: "transform"
			}
		})
	});
}
//#endregion
//#region src/context/IntelScoutContext.tsx
function getOfferCategory(sell) {
	const sellLower = sell.toLowerCase();
	if (sellLower.includes("compliance") || sellLower.includes("security") || sellLower.includes("cyber") || sellLower.includes("audit") || sellLower.includes("soc2")) return "compliance";
	if (sellLower.includes("hr") || sellLower.includes("people") || sellLower.includes("recruiting") || sellLower.includes("hiring") || sellLower.includes("talent")) return "hr";
	if (sellLower.includes("crm") || sellLower.includes("sales") || sellLower.includes("marketing") || sellLower.includes("revenue") || sellLower.includes("revops")) return "sales";
	if (sellLower.includes("dev") || sellLower.includes("developer") || sellLower.includes("infra") || sellLower.includes("cloud") || sellLower.includes("git") || sellLower.includes("ci/cd") || sellLower.includes("caching")) return "devtools";
	return "general";
}
var IntelScoutContext = createContext(void 0);
var useIntelScout = () => {
	const context = useContext(IntelScoutContext);
	if (!context) throw new Error("useIntelScout must be used within a IntelScoutProvider");
	return context;
};
var DEFAULT_SIGNALS = [
	{
		id: "exec_hire",
		name: "C-Level Executive Hire",
		category: "strong",
		weight: 35,
		enabled: true
	},
	{
		id: "dept_hiring",
		name: "Key Department Expansion",
		category: "strong",
		weight: 30,
		enabled: true
	},
	{
		id: "pricing_update",
		name: "Pricing / Packaging Update",
		category: "strong",
		weight: 25,
		enabled: true
	},
	{
		id: "tech_install",
		name: "New Premium Tech Stack Install",
		category: "strong",
		weight: 20,
		enabled: true
	},
	{
		id: "compliance_cert",
		name: "Regulatory / Compliance Update",
		category: "strong",
		weight: 20,
		enabled: true
	},
	{
		id: "specialty_role",
		name: "Specialized Role Hiring",
		category: "strong",
		weight: 25,
		enabled: true
	},
	{
		id: "regional_exp",
		name: "Regional Market Expansion",
		category: "medium",
		weight: 15,
		enabled: true
	},
	{
		id: "funding",
		name: "Recently Funded (Last 90 Days)",
		category: "medium",
		weight: 15,
		enabled: true
	},
	{
		id: "headcount_growth",
		name: "Rapid Headcount Growth (>10%)",
		category: "medium",
		weight: 12,
		enabled: true
	},
	{
		id: "content_pub",
		name: "New Content / Case Study Published",
		category: "weak",
		weight: 3,
		enabled: true
	},
	{
		id: "gen_hiring",
		name: "General Administrative Hiring",
		category: "weak",
		weight: 2,
		enabled: true
	}
];
var IntelScoutProvider = ({ children, initialSession }) => {
	const [step, setStepState] = useState(1);
	const [offer, setOffer] = useState({
		sell: "AI Compliance Platform",
		websiteUrl: "vanta.com",
		problem: "Reduce compliance effort and automate SOC2 audits",
		dealSize: "$20,000-$100,000",
		salesCycle: "Medium"
	});
	const [icp, setIcp] = useState(null);
	const [icpAnalysis, setIcpAnalysis] = useState(null);
	const [isAnalyzingIcp, setIsAnalyzingIcp] = useState(false);
	const [painMap, setPainMap] = useState(null);
	const [signals, setSignals] = useState(DEFAULT_SIGNALS);
	const [accounts, setAccounts] = useState([]);
	const [feedEvents, setFeedEvents] = useState([]);
	const [isResearching, setIsResearching] = useState(false);
	const [researchProgress, setResearchProgress] = useState(0);
	const [consoleLogs, setConsoleLogs] = useState([]);
	const [gtmSummary, setGtmSummary] = useState("Active GTM Strategy: Targeting growing B2B SaaS companies undergoing security audits (SOC2/ISO). The GTM engine crawls target domains looking for trust directories, job vacancies in cybersecurity, and enterprise pricing updates to capture buying timing windows.");
	const [userRole, setUserRole] = useState("admin");
	const [credits, setCredits] = useState(5);
	const [lastSignalAt, setLastSignalAt] = useState(0);
	const [user, setUser] = useState(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	useEffect(() => {
		if (initialSession && initialSession.user) setUser({
			email: initialSession.user.email,
			name: initialSession.user.name,
			avatar: initialSession.user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + initialSession.user.email
		});
		else setUser(null);
		setIsAuthLoading(false);
	}, [initialSession]);
	const isAuthenticated = !!user;
	const loginWithGoogle = useCallback(() => {
		import("./client_Dgu5cu-m.mjs").then(({ signIn }) => {
			signIn("google");
		});
	}, []);
	const logout = useCallback(() => {
		import("./client_Dgu5cu-m.mjs").then(({ signOut }) => {
			signOut();
		});
	}, []);
	useEffect(() => {
		const interval = setInterval(() => {
			setCredits((prev) => Math.min(5, prev + 1));
		}, 15e3);
		return () => clearInterval(interval);
	}, []);
	const setStep = useCallback((s) => {
		setStepState(s);
	}, []);
	const addConsoleLog = useCallback((l) => {
		setConsoleLogs((prev) => [...prev, `[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${l}`]);
	}, []);
	const clearConsoleLogs = useCallback(() => {
		setConsoleLogs([]);
	}, []);
	const analyzeBusinessIcp = useCallback(() => {
		if (!offer || !icp) return;
		setIsAnalyzingIcp(true);
		setTimeout(() => {
			const results = [];
			const ds = offer.dealSize;
			const cycle = offer.salesCycle;
			const size = icp.firmographics.employeeCount;
			const committeeSize = icp.buyingCommittee.length;
			if ((ds === "<$1,000" || ds === "$1,000-$5,000") && (size.includes("1000") || size.includes("Enterprise"))) results.push({
				status: "critical",
				message: "Your deal size is too small for Enterprise targets.",
				suggestion: "Shift focus to SMBs or consider a Product-Led Growth (PLG) motion."
			});
			if (cycle === "Short" && committeeSize >= 4) results.push({
				status: "warning",
				message: "You have a short sales cycle, but targeting a large buying committee.",
				suggestion: "Target a single champion or end-user to reduce consensus friction."
			});
			if (ds === "$100,000+" && cycle === "Short") results.push({
				status: "warning",
				message: "Enterprise $100k+ deals rarely close in a short sales cycle.",
				suggestion: "Expect 6-9 months and adjust revenue forecasts accordingly."
			});
			if (ds === "$100,000+" && (size.includes("1-50") || size.includes("Startup"))) results.push({
				status: "critical",
				message: "Startups/SMBs rarely have the budget for $100k+ deals.",
				suggestion: "Target mid-market to enterprise companies with >200 employees."
			});
			if (results.length === 0) results.push({
				status: "perfect",
				message: "Your ICP aligns well with your business offer and deal dynamics."
			});
			setIcpAnalysis(results);
			setIsAnalyzingIcp(false);
		}, 1500);
	}, [offer, icp]);
	const addFeedEvent = useCallback((e) => {
		setFeedEvents((prev) => [e, ...prev].slice(0, 50));
		setLastSignalAt(Date.now());
	}, []);
	const recalculateScores = useCallback(() => {
		setAccounts((prev) => prev.map((acc) => {
			const computedSignals = acc.signalsDetected.reduce((sum, sigId) => {
				const cfg = signals.find((s) => s.id === sigId && s.enabled);
				return sum + (cfg ? cfg.weight : 0);
			}, 0);
			const signalScore = Math.min(100, Math.max(0, computedSignals * 2.2));
			const oppScore = Math.round(acc.icpFit * .4 + acc.intent * .25 + acc.timing * .15 + signalScore * .2);
			let tier = 4;
			if (oppScore >= 90) tier = 1;
			else if (oppScore >= 70) tier = 2;
			else if (oppScore >= 50) tier = 3;
			return {
				...acc,
				signalScore: Math.round(signalScore),
				opportunityScore: oppScore,
				priorityTier: tier
			};
		}));
	}, [signals]);
	const generateWorkspace = useCallback((customOffer) => {
		const currentOffer = customOffer || offer;
		const sellLower = currentOffer.sell.toLowerCase();
		const domain = currentOffer.websiteUrl.toLowerCase();
		const isCompliance = sellLower.includes("compliance") || sellLower.includes("security") || sellLower.includes("cyber") || sellLower.includes("audit") || sellLower.includes("soc2");
		const isHR = sellLower.includes("hr") || sellLower.includes("people") || sellLower.includes("recruiting") || sellLower.includes("hiring") || sellLower.includes("talent");
		const isSalesCRM = sellLower.includes("crm") || sellLower.includes("sales") || sellLower.includes("marketing") || sellLower.includes("revenue") || sellLower.includes("revops");
		const isDevTools = sellLower.includes("dev") || sellLower.includes("developer") || sellLower.includes("infra") || sellLower.includes("cloud") || sellLower.includes("git") || sellLower.includes("ci/cd") || sellLower.includes("caching");
		const isMarketing = sellLower.includes("agency") || sellLower.includes("seo") || sellLower.includes("ads") || sellLower.includes("content") || sellLower.includes("marketing");
		let technographics = [
			"AWS",
			"GitHub Actions",
			"Salesforce",
			"Vanta",
			"Snowflake",
			"Sentry",
			"PostgreSQL"
		];
		let growthSignals = [
			"Engineering expansion (>20% YoY)",
			"Compliance requirements in job specifications",
			"Recent funding rounds",
			"Enterprise landing page launches"
		];
		let buyingCommittee = [
			"VP of Engineering",
			"Head of Security",
			"Chief Technology Officer (CTO)",
			"Director of DevOps"
		];
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
			technographics = [
				"Workday",
				"Greenhouse",
				"Slack",
				"Gusto",
				"BambooHR",
				"Lever"
			];
			growthSignals = [
				"Hiring 10+ new employees (rapid headcount growth)",
				"Opened new regional hub",
				"Transitioning to remote-first structure",
				"Adding HR operations tooling"
			];
			buyingCommittee = [
				"VP of HR",
				"Chief People Officer",
				"Head of Talent Acquisition",
				"Director of HR Operations"
			];
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
			technographics = [
				"HubSpot",
				"Salesforce",
				"Marketo",
				"Segment",
				"Intercom",
				"Apollo"
			];
			growthSignals = [
				"Hiring 3+ Account Executives",
				"Launched new product category on Product Hunt",
				"Adding sales coaching tools",
				"CMO/CRO hire announced"
			];
			buyingCommittee = [
				"VP of Sales",
				"VP of Marketing",
				"Chief Revenue Officer (CRO)",
				"Head of Sales Operations"
			];
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
			technographics = [
				"AWS",
				"GitHub Actions",
				"Vercel",
				"Sentry",
				"PostgreSQL",
				"Docker",
				"Kubernetes"
			];
			growthSignals = [
				"Scaling infrastructure nodes",
				"Transitioning to cloud-native setup",
				"Hiring cloud architects",
				"Recent technical blog posts"
			];
			buyingCommittee = [
				"VP of Engineering",
				"Chief Technology Officer (CTO)",
				"Director of DevOps",
				"Engineering Manager"
			];
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
		} else if (!isCompliance) {
			if (!(currentOffer.sell.toLowerCase().includes("ai") || currentOffer.sell.toLowerCase().includes("tech") || currentOffer.sell.toLowerCase().includes("software") || currentOffer.sell.toLowerCase().includes("cyber"))) {
				technographics = [
					"Shopify",
					"Google Analytics",
					"HubSpot",
					"Zendesk",
					"Stripe",
					"Clara"
				];
				growthSignals = [
					"Adding checkout flows",
					"Hiring sales/ops directors",
					"Launching online portals"
				];
				buyingCommittee = [
					"Chief Marketing Officer (CMO)",
					"Head of Sales",
					"Founder & CEO",
					"VP of Revenue Operations"
				];
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
		setIcp({
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
		});
		setPainMap({
			problem: currentOffer.problem,
			pain,
			triggers,
			buyingMotivation
		});
		setGtmSummary(summary);
		setSignals(DEFAULT_SIGNALS.map((s) => {
			if (isMarketing && !isSalesCRM) {
				if (s.id === "exec_hire") return {
					...s,
					name: "Hiring VP of Marketing / CMO"
				};
				if (s.id === "dept_hiring") return {
					...s,
					name: "Marketing Expansion Hiring"
				};
				if (s.id === "pricing_update") return {
					...s,
					name: "Adding Premium Agency Retainers"
				};
				if (s.id === "tech_install") return {
					...s,
					name: "Installed New Ad Tech Stack"
				};
				if (s.id === "compliance_cert") return {
					...s,
					name: "Expanding to New Markets"
				};
				if (s.id === "specialty_role") return {
					...s,
					name: "Hiring SEO / Growth Specialists"
				};
				if (s.id === "content_pub") return {
					...s,
					name: "Publishing New Case Studies"
				};
			} else if (isCompliance) {
				if (s.id === "exec_hire") return {
					...s,
					name: "CISO / VP Security Hire"
				};
				if (s.id === "dept_hiring") return {
					...s,
					name: "Security Hiring / Expansion"
				};
				if (s.id === "pricing_update") return {
					...s,
					name: "Enterprise Pricing Added"
				};
				if (s.id === "tech_install") return {
					...s,
					name: "Trust Center Added to Website"
				};
				if (s.id === "compliance_cert") return {
					...s,
					name: "ISO 27001 / SOC2 Preparation"
				};
				if (s.id === "specialty_role") return {
					...s,
					name: "Compliance / Legal Hiring"
				};
			} else if (isHR) {
				if (s.id === "exec_hire") return {
					...s,
					name: "Chief People Officer Hire"
				};
				if (s.id === "dept_hiring") return {
					...s,
					name: "Talent Recruiter Expansion"
				};
				if (s.id === "pricing_update") return {
					...s,
					name: "Compensation Frameworks Update"
				};
				if (s.id === "tech_install") return {
					...s,
					name: "Onboarding Software Added"
				};
				if (s.id === "compliance_cert") return {
					...s,
					name: "Remote Work Operations Scaling"
				};
				if (s.id === "specialty_role") return {
					...s,
					name: "HR Operations Specialists"
				};
			} else if (isSalesCRM) {
				if (s.id === "exec_hire") return {
					...s,
					name: "Chief Revenue Officer Hire"
				};
				if (s.id === "dept_hiring") return {
					...s,
					name: "Sales Exec (AE) Expansion"
				};
				if (s.id === "pricing_update") return {
					...s,
					name: "Self-Serve Pricing Added"
				};
				if (s.id === "tech_install") return {
					...s,
					name: "Outbound Lead Gen Stack Update"
				};
				if (s.id === "compliance_cert") return {
					...s,
					name: "Email Deliverability Optimization"
				};
				if (s.id === "specialty_role") return {
					...s,
					name: "Sales Operations Analysts"
				};
			} else if (isDevTools) {
				if (s.id === "exec_hire") return {
					...s,
					name: "VP of Engineering Hire"
				};
				if (s.id === "dept_hiring") return {
					...s,
					name: "DevOps Engineer Expansion"
				};
				if (s.id === "pricing_update") return {
					...s,
					name: "API Usage Pricing Updated"
				};
				if (s.id === "tech_install") return {
					...s,
					name: "Zero-trust Infrastructure Deployed"
				};
				if (s.id === "compliance_cert") return {
					...s,
					name: "Data Residency Controls Updated"
				};
				if (s.id === "specialty_role") return {
					...s,
					name: "Cloud Architect Expansion"
				};
			}
			return s;
		}));
	}, [offer]);
	useEffect(() => {
		if (step !== "dashboard" || accounts.length === 0) return;
		const interval = setInterval(() => {
			const acc = accounts[Math.floor(Math.random() * accounts.length)];
			if (!acc) return;
			const possibleSignals = signals.filter((s) => s.enabled && !acc.signalsDetected.includes(s.id));
			let randomSig;
			let isCustomUrlSignal = false;
			if (possibleSignals.length === 0) {
				const domain = offer.websiteUrl || "the product";
				const customUrlSignals = [
					{
						name: `Evaluating competitor alternatives against ${domain}`,
						type: "medium",
						reason: `Web traffic detected routing from ${domain} competitor landing pages.`
					},
					{
						name: `Internal documentation mentions ${domain}`,
						type: "strong",
						reason: `Company intranet/wiki recently indexed keywords matching ${domain}.`
					},
					{
						name: `Procurement search for ${domain} category`,
						type: "medium",
						reason: `Buying intent search patterns match ${domain} core category.`
					}
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
			} else randomSig = possibleSignals[Math.floor(Math.random() * possibleSignals.length)];
			setAccounts((prev) => prev.map((a) => {
				if (a.id === acc.id) {
					const updatedSignals = [...a.signalsDetected, randomSig.id];
					const computedSignals = updatedSignals.reduce((sum, sigId) => {
						const cfg = signals.find((s) => s.id === sigId && s.enabled);
						return sum + (cfg ? cfg.weight : isCustomUrlSignal ? 15 : 0);
					}, 0);
					const newSignalScore = Math.round(Math.min(100, Math.max(0, computedSignals * 2.2)));
					const newOppScore = Math.round(a.icpFit * .4 + a.intent * .25 + a.timing * .15 + newSignalScore * .2);
					let newTier = 4;
					if (newOppScore >= 90) newTier = 1;
					else if (newOppScore >= 70) newTier = 2;
					else if (newOppScore >= 50) newTier = 3;
					`${a.company_name}${randomSig.name}`;
					const category = getOfferCategory(offer.sell);
					const updatedReasons = [...a.reasons];
					let reasonText = `Detected trigger: ${randomSig.name}`;
					if (isCustomUrlSignal) {
						const domain = offer.websiteUrl || "the product";
						if (randomSig.name.includes("competitor")) reasonText = `Web traffic detected routing from ${domain} competitor landing pages.`;
						else if (randomSig.name.includes("Internal")) reasonText = `Company intranet/wiki recently indexed keywords matching ${domain}.`;
						else reasonText = `Buying intent search patterns match ${domain} core category.`;
					} else if (randomSig.id === "dept_hiring") if (category === "compliance") reasonText = "Detected hiring for 2+ Security Engineering positions.";
					else if (category === "hr") reasonText = "Detected hiring for Talent Recruiters & Sourcers.";
					else if (category === "sales") reasonText = "Detected hiring for 3+ Account Executives.";
					else if (category === "devtools") reasonText = "Detected hiring for DevOps & SRE Engineers.";
					else reasonText = "Detected expansion in primary operations department.";
					else if (randomSig.id === "specialty_role") if (category === "compliance") reasonText = "Hiring for Compliance/Legal Counsel roles.";
					else if (category === "hr") reasonText = "Hiring for HR Operations Specialists.";
					else if (category === "sales") reasonText = "Hiring for Sales Operations Analysts.";
					else if (category === "devtools") reasonText = "Hiring for Cloud Security Architects.";
					else reasonText = "Hiring for specialized strategic roles.";
					else if (randomSig.id === "tech_install") if (category === "compliance") reasonText = "Added secure Trust / Security Center to domain portal.";
					else if (category === "hr") reasonText = "Integrated automated onboarding software to website.";
					else if (category === "sales") reasonText = "Added self-serve Enterprise packages to billing pages.";
					else if (category === "devtools") reasonText = "Added interactive API documentation and developer portal.";
					else reasonText = "Upgraded digital tech stack integrations.";
					else if (randomSig.id === "compliance_cert") if (category === "compliance") reasonText = "SOC2/HIPAA audit readiness mentioned in vacancies.";
					else if (category === "hr") reasonText = "Rapid headcount targets mentioned in company press.";
					else if (category === "sales") reasonText = "CRM API and integration needs mentioned in listings.";
					else if (category === "devtools") reasonText = "CI/CD automation pipeline expansion mentioned in job posts.";
					else reasonText = "Major operational updates listed in active jobs.";
					else if (randomSig.id === "funding") reasonText = "Announced a new venture capital funding round recently.";
					else if (randomSig.id === "pricing_update") reasonText = "Added 'Enterprise' package to standard pricing matrix.";
					else if (randomSig.id === "exec_hire") if (category === "compliance") reasonText = "Hiring CISO or VP of Security.";
					else if (category === "hr") reasonText = "Hiring Chief People Officer (CPO).";
					else if (category === "sales") reasonText = "Hiring Chief Revenue Officer (CRO).";
					else if (category === "devtools") reasonText = "Hiring VP of Engineering.";
					else reasonText = "Hiring VP or C-level Executive.";
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
			}));
			addFeedEvent({
				id: Math.random().toString(),
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
				companyName: acc.company_name,
				text: `Triggered "${randomSig.name}" signal (+${randomSig.weight} score)`,
				type: randomSig.category,
				weight: randomSig.weight
			});
		}, 12e3);
		return () => clearInterval(interval);
	}, [
		step,
		accounts,
		signals
	]);
	return /* @__PURE__ */ jsx(IntelScoutContext.Provider, {
		value: {
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
			loginWithGoogle,
			logout
		},
		children
	});
};
//#endregion
//#region src/components/Onboarding/Stage1Offer.tsx
function Stage1Offer() {
	const { offer, setOffer, generateWorkspace, setStep } = useIntelScout();
	const [sell, setSell] = useState(offer.sell);
	const [websiteUrl, setWebsiteUrl] = useState(offer.websiteUrl);
	const [problem, setProblem] = useState(offer.problem);
	const [dealSize, setDealSize] = useState(offer.dealSize);
	const [salesCycle, setSalesCycle] = useState(offer.salesCycle);
	const [isScraping, setIsScraping] = useState(false);
	const [scrapeStep, setScrapeStep] = useState(0);
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!sell || !problem || !websiteUrl) return;
		const newOffer = {
			sell,
			websiteUrl,
			problem,
			dealSize,
			salesCycle
		};
		setOffer(newOffer);
		setIsScraping(true);
		let sec = 0;
		const interval = setInterval(() => {
			sec++;
			setScrapeStep(sec);
			if (sec >= 60) {
				clearInterval(interval);
				generateWorkspace(newOffer);
				setIsScraping(false);
				setStep(2);
			}
		}, 1e3);
	};
	const loadExample = (exSell, exUrl, exProblem, exSize, exCycle) => {
		setSell(exSell);
		setWebsiteUrl(exUrl);
		setProblem(exProblem);
		setDealSize(exSize);
		setSalesCycle(exCycle);
	};
	const getScrapeMessage = (sec) => {
		if (sec < 5) return `Connecting to ${websiteUrl}...`;
		if (sec < 15) return `Scraping homepage and landing pages...`;
		if (sec < 25) return `Crawling pricing and feature matrices...`;
		if (sec < 35) return `Reading blog posts and content marketing...`;
		if (sec < 45) return `Parsing customer case studies and testimonials...`;
		if (sec < 55) return `Extracting core pain points and triggers...`;
		return `Synthesizing GTM blueprint...`;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center space-x-3 mb-6",
				children: [/* @__PURE__ */ jsx("div", {
					className: "p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl",
					children: /* @__PURE__ */ jsx(Compass, { className: "w-6 h-6" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold tracking-tight text-[#111] font-outfit",
					children: "Define Your Offer"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-[#555]",
					children: "Describe what you sell so IntelScout can compile your GTM blueprint."
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2",
					children: "Quick Examples"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => loadExample("AI Compliance Platform", "vanta.com", "Reduce compliance effort and automate SOC2 audits", "$20,000-$100,000", "Medium"),
							className: "text-left p-3 rounded-xl border border-black/10 bg-white hover:border-black/30 hover:bg-black/5 transition text-xs group",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-semibold text-[#111]",
								children: "AI Compliance Software"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[#666] line-clamp-1 mt-0.5",
								children: "Automates audits & reviews"
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => loadExample("Cybersecurity Service", "crowdstrike.com", "Proactive penetration testing and dark web monitoring", "$5,000-$20,000", "Short"),
							className: "text-left p-3 rounded-xl border border-black/10 bg-white hover:border-black/30 hover:bg-black/5 transition text-xs group",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-semibold text-[#111]",
								children: "Cybersecurity Consultant"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[#666] line-clamp-1 mt-0.5",
								children: "Penetration testing & risk mapping"
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => loadExample("DevTools Product", "vercel.com", "Speed up CI/CD pipelines and caching layers", "<$1,000", "Short"),
							className: "text-left p-3 rounded-xl border border-black/10 bg-white hover:border-black/30 hover:bg-black/5 transition text-xs group",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-semibold text-[#111]",
								children: "DevTools Platform"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[#666] line-clamp-1 mt-0.5",
								children: "CI/CD caching tool"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-5",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "sell-input",
							className: "block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2",
							children: "What do you sell?"
						}), /* @__PURE__ */ jsx("input", {
							id: "sell-input",
							type: "text",
							value: sell,
							onChange: (e) => setSell(e.target.value),
							placeholder: "e.g. HR SaaS, Cloud Security Tools...",
							className: "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition",
							required: true
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "url-input",
							className: "block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2",
							children: "Product URL"
						}), /* @__PURE__ */ jsx("input", {
							id: "url-input",
							type: "text",
							value: websiteUrl,
							onChange: (e) => setWebsiteUrl(e.target.value),
							placeholder: "e.g. vanta.com, linear.app",
							className: "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition",
							required: true
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "problem-input",
						className: "block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2",
						children: "What critical problem do you solve?"
					}), /* @__PURE__ */ jsx("textarea", {
						id: "problem-input",
						rows: 3,
						value: problem,
						onChange: (e) => setProblem(e.target.value),
						placeholder: "e.g. Help companies pass SOC2 audits, reduce cloud infrastructure cost, automate candidate hiring filters...",
						className: "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition resize-none",
						required: true
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-5",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "deal-size",
							className: "block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2",
							children: "Avg Deal Size (ACV)"
						}), /* @__PURE__ */ jsxs("select", {
							id: "deal-size",
							value: dealSize,
							onChange: (e) => setDealSize(e.target.value),
							className: "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "<$1,000",
									children: "Less than $1,000"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "$1,000-$5,000",
									children: "$1,000 - $5,000"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "$5,000-$20,000",
									children: "$5,000 - $20,000"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "$20,000-$100,000",
									children: "$20,000 - $100,000"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "$100,000+",
									children: "$100,000+"
								})
							]
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "sales-cycle",
							className: "block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2",
							children: "Sales Cycle Length"
						}), /* @__PURE__ */ jsxs("select", {
							id: "sales-cycle",
							value: salesCycle,
							onChange: (e) => setSalesCycle(e.target.value),
							className: "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "Short",
									children: "Short (1-30 days)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Medium",
									children: "Medium (1-3 months)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Long",
									children: "Long (3-9 months)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Enterprise",
									children: "Enterprise (9+ months)"
								})
							]
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "pt-4 border-t border-black/10 flex flex-col md:flex-row md:justify-between items-center gap-4",
						children: [isScraping ? /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-start gap-1 w-full md:w-auto",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 text-sm font-medium text-[#111] font-outfit",
								children: [/* @__PURE__ */ jsxs("svg", {
									className: "animate-spin h-5 w-5 text-black",
									viewBox: "0 0 24 24",
									children: [/* @__PURE__ */ jsx("circle", {
										className: "opacity-25",
										cx: "12",
										cy: "12",
										r: "10",
										stroke: "currentColor",
										strokeWidth: "4",
										fill: "none"
									}), /* @__PURE__ */ jsx("path", {
										className: "opacity-75",
										fill: "currentColor",
										d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									})]
								}), /* @__PURE__ */ jsx("span", { children: getScrapeMessage(scrapeStep) })]
							}), /* @__PURE__ */ jsx("div", {
								className: "w-full bg-black/5 rounded-full h-1.5 mt-1",
								children: /* @__PURE__ */ jsx("div", {
									className: "bg-black h-1.5 rounded-full transition-all duration-1000 ease-linear",
									style: { width: `${scrapeStep / 60 * 100}%` }
								})
							})]
						}) : /* @__PURE__ */ jsx("div", { className: "hidden md:block" }), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: !sell || !problem || !websiteUrl || isScraping,
							className: "px-6 py-3 bg-black hover:bg-[#222] disabled:opacity-50 disabled:hover:bg-black text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-sm font-outfit",
							children: [/* @__PURE__ */ jsx("span", { children: isScraping ? "Studying Product..." : "Study Product & Generate ICP" }), !isScraping && /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
						})]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/Onboarding/Stage2ICP.tsx
function Stage2ICP() {
	const { icp, setIcp, setStep, icpAnalysis, isAnalyzingIcp, analyzeBusinessIcp } = useIntelScout();
	const [newTech, setNewTech] = useState("");
	const [newSignal, setNewSignal] = useState("");
	const [newRole, setNewRole] = useState("");
	const [aiPrompt, setAiPrompt] = useState("");
	const [isRefining, setIsRefining] = useState(false);
	if (!icp) return null;
	const handleRemoveTech = (index) => {
		setIcp({
			...icp,
			technographics: icp.technographics.filter((_, i) => i !== index)
		});
	};
	const handleAddSignal = (e) => {
		e.preventDefault();
		if (!newSignal.trim()) return;
		setIcp({
			...icp,
			growthSignals: [...icp.growthSignals, newSignal.trim()]
		});
		setNewSignal("");
	};
	const handleRemoveSignal = (index) => {
		setIcp({
			...icp,
			growthSignals: icp.growthSignals.filter((_, i) => i !== index)
		});
	};
	const handleAddRole = (e) => {
		e.preventDefault();
		if (!newRole.trim()) return;
		setIcp({
			...icp,
			buyingCommittee: [...icp.buyingCommittee, newRole.trim()]
		});
		setNewRole("");
	};
	const handleRemoveRole = (index) => {
		setIcp({
			...icp,
			buyingCommittee: icp.buyingCommittee.filter((_, i) => i !== index)
		});
	};
	const handleFirmoChange = (field, value) => {
		setIcp({
			...icp,
			firmographics: {
				...icp.firmographics,
				[field]: value
			}
		});
	};
	const handleRefineWithAI = (e) => {
		e.preventDefault();
		if (!aiPrompt.trim()) return;
		setIsRefining(true);
		setTimeout(() => {
			const promptLower = aiPrompt.toLowerCase();
			let updatedIndustry = icp.firmographics.industry;
			let newRoles = [...icp.buyingCommittee];
			if (promptLower.includes("health") || promptLower.includes("medical")) {
				updatedIndustry = "Healthcare, Medical Tech, Life Sciences";
				newRoles.unshift("Chief Medical Officer");
			} else if (promptLower.includes("finance") || promptLower.includes("fintech") || promptLower.includes("bank")) {
				updatedIndustry = "FinTech, Banking, Financial Services";
				newRoles.unshift("Chief Financial Officer (CFO)");
			} else if (promptLower.includes("edu")) {
				updatedIndustry = "EdTech, Higher Education";
				newRoles.unshift("Provost / Dean");
			} else {
				const words = aiPrompt.split(" ").filter((w) => w.length > 4);
				if (words.length > 0) {
					const cap = words[0].charAt(0).toUpperCase() + words[0].slice(1);
					updatedIndustry = `${cap} Operations, ${icp.firmographics.industry}`;
					newRoles.unshift(`VP of ${cap}`);
				}
			}
			setIcp({
				...icp,
				firmographics: {
					...icp.firmographics,
					industry: updatedIndustry
				},
				buyingCommittee: [...new Set(newRoles)].slice(0, 6)
			});
			setAiPrompt("");
			setIsRefining(false);
		}, 1500);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-8 pb-4 border-b border-black/10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl",
						children: /* @__PURE__ */ jsx(Sparkle, { className: "w-6 h-6" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-bold tracking-tight text-[#111] font-outfit",
						children: "Ideal Customer Profile (ICP)"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-[#555]",
						children: "IntelScout compiled this profile based on your business offer. Customize it below."
					})] })]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: analyzeBusinessIcp,
					disabled: isAnalyzingIcp,
					className: "flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-70",
					children: [isAnalyzingIcp ? /* @__PURE__ */ jsx(CircleNotch, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsx(Brain, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("span", { children: isAnalyzingIcp ? "Analyzing..." : "Analyze Fit" })]
				})]
			}),
			icpAnalysis && icpAnalysis.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mb-8 space-y-3",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-xs font-semibold text-[#888] uppercase tracking-wider mb-2",
					children: "AI Fit Analysis"
				}), icpAnalysis.map((res, i) => /* @__PURE__ */ jsxs("div", {
					className: `p-4 rounded-xl border ${res.status === "perfect" ? "bg-emerald-50/50 border-emerald-200" : res.status === "critical" ? "bg-red-50/50 border-red-200" : "bg-amber-50/50 border-amber-200"} flex items-start space-x-3`,
					children: [/* @__PURE__ */ jsx("div", {
						className: "mt-0.5",
						children: res.status === "perfect" ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-emerald-600" }) : /* @__PURE__ */ jsx(WarningCircle, { className: `w-5 h-5 ${res.status === "critical" ? "text-red-600" : "text-amber-600"}` })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: `text-sm font-medium ${res.status === "perfect" ? "text-emerald-900" : res.status === "critical" ? "text-red-900" : "text-amber-900"}`,
						children: res.message
					}), res.suggestion && /* @__PURE__ */ jsxs("p", {
						className: `text-xs mt-1 ${res.status === "critical" ? "text-red-700" : "text-amber-700"}`,
						children: [
							/* @__PURE__ */ jsx("strong", { children: "Suggestion:" }),
							" ",
							res.suggestion
						]
					})] })]
				}, i))]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mb-8",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: handleRefineWithAI,
					className: "relative shadow-sm rounded-xl overflow-hidden group",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
							children: /* @__PURE__ */ jsx(Brain, { className: `h-5 w-5 ${isRefining ? "text-violet-500 animate-pulse" : "text-violet-500"}` })
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: aiPrompt,
							onChange: (e) => setAiPrompt(e.target.value),
							disabled: isRefining,
							className: "block w-full pl-11 pr-28 py-4 border border-violet-200 bg-violet-50/30 placeholder-violet-400 focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:text-[15px] transition-all disabled:opacity-70 text-black font-medium",
							placeholder: "Refine with AI... (e.g., 'Focus strictly on enterprise healthcare' or 'We only sell to CTOs')"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 right-0 flex items-center pr-2",
							children: /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: isRefining || !aiPrompt.trim(),
								className: "px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:hover:bg-violet-600 transition flex items-center space-x-2",
								children: isRefining ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(CircleNotch, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Learning..." })] }) : /* @__PURE__ */ jsx("span", { children: "Improve" })
							})
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-black/10 rounded-xl p-5 hover:border-black/30 transition shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center space-x-2.5 text-[#333] mb-4",
							children: [/* @__PURE__ */ jsx(Buildings, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-[#111] font-outfit",
								children: "Firmographics"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]",
								children: [/* @__PURE__ */ jsx("span", {
									className: "block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono",
									children: "Target Industry"
								}), /* @__PURE__ */ jsxs("select", {
									value: icp.firmographics.industry,
									onChange: (e) => handleFirmoChange("industry", e.target.value),
									className: "w-full bg-transparent text-[13px] font-semibold text-[#111] leading-snug focus:outline-none cursor-pointer p-0 m-0 pr-6",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											disabled: true,
											children: "Select Target Industry..."
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Software Development",
											children: "Software Development"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Information Technology & Services",
											children: "Information Technology & Services"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Financial Services",
											children: "Financial Services"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Hospital & Health Care",
											children: "Hospital & Health Care"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Education Management",
											children: "Education Management"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Real Estate",
											children: "Real Estate"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Manufacturing",
											children: "Manufacturing"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Retail & Consumer Goods",
											children: "Retail & Consumer Goods"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Telecommunications",
											children: "Telecommunications"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Media & Entertainment",
											children: "Media & Entertainment"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Automotive",
											children: "Automotive"
										}),
										icp.firmographics.industry && ![
											"Software Development",
											"Information Technology & Services",
											"Financial Services",
											"Hospital & Health Care",
											"Education Management",
											"Real Estate",
											"Manufacturing",
											"Retail & Consumer Goods",
											"Telecommunications",
											"Media & Entertainment",
											"Automotive"
										].includes(icp.firmographics.industry) && /* @__PURE__ */ jsx("option", {
											value: icp.firmographics.industry,
											children: icp.firmographics.industry
										})
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-2.5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]",
										children: [/* @__PURE__ */ jsx("span", {
											className: "block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono",
											children: "Company Size"
										}), /* @__PURE__ */ jsxs("select", {
											value: icp.firmographics.employeeCount,
											onChange: (e) => handleFirmoChange("employeeCount", e.target.value),
											className: "w-full bg-transparent text-[13px] font-semibold text-[#111] focus:outline-none cursor-pointer p-0 m-0 pr-6",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "",
													disabled: true,
													children: "Select Size..."
												}),
												/* @__PURE__ */ jsx("option", {
													value: "1-10",
													children: "1-10 employees"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "11-50",
													children: "11-50 employees"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "51-200",
													children: "51-200 employees"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "201-500",
													children: "201-500 employees"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "501-1000",
													children: "501-1,000 employees"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "1001-5000",
													children: "1,001-5,000 employees"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "5001-10000",
													children: "5,001-10,000 employees"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "10001+",
													children: "10,001+ employees"
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]",
										children: [/* @__PURE__ */ jsx("span", {
											className: "block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono",
											children: "Target Revenue"
										}), /* @__PURE__ */ jsxs("select", {
											value: icp.firmographics.revenue,
											onChange: (e) => handleFirmoChange("revenue", e.target.value),
											className: "w-full bg-transparent text-[13px] font-semibold text-[#111] focus:outline-none cursor-pointer p-0 m-0 pr-6",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "",
													disabled: true,
													children: "Select Revenue..."
												}),
												/* @__PURE__ */ jsx("option", {
													value: "<$1M",
													children: "<$1M"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "$1M-$10M",
													children: "$1M - $10M"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "$10M-$50M",
													children: "$10M - $50M"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "$50M-$100M",
													children: "$50M - $100M"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "$100M-$250M",
													children: "$100M - $250M"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "$250M-$1B",
													children: "$250M - $1B"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "$1B+",
													children: "$1B+"
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]",
										children: [/* @__PURE__ */ jsx("span", {
											className: "block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono",
											children: "Geography"
										}), /* @__PURE__ */ jsxs("select", {
											value: icp.firmographics.geography,
											onChange: (e) => handleFirmoChange("geography", e.target.value),
											className: "w-full bg-transparent text-[13px] font-semibold text-[#111] focus:outline-none cursor-pointer p-0 m-0 pr-6",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "",
													disabled: true,
													children: "Select Region..."
												}),
												/* @__PURE__ */ jsx("option", {
													value: "North America",
													children: "North America"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "EMEA",
													children: "EMEA"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "APAC",
													children: "APAC"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "LATAM",
													children: "LATAM"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "United States",
													children: "United States"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "United Kingdom",
													children: "United Kingdom"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Canada",
													children: "Canada"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Australia",
													children: "Australia"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Global",
													children: "Global"
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "bg-[#fafafa] border border-black/[0.04] rounded-lg p-3.5 transition-colors hover:bg-black/[0.02]",
										children: [/* @__PURE__ */ jsx("span", {
											className: "block text-[10px] uppercase font-bold tracking-[0.06em] text-[#888] mb-1.5 font-roboto-mono",
											children: "Funding Phase"
										}), /* @__PURE__ */ jsxs("select", {
											value: icp.firmographics.fundingStage,
											onChange: (e) => handleFirmoChange("fundingStage", e.target.value),
											className: "w-full bg-transparent text-[13px] font-semibold text-[#111] focus:outline-none cursor-pointer p-0 m-0 pr-6",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "",
													disabled: true,
													children: "Select Funding..."
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Pre-Seed",
													children: "Pre-Seed"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Seed",
													children: "Seed"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Series A",
													children: "Series A"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Series B",
													children: "Series B"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Series C",
													children: "Series C"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Series D",
													children: "Series D"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Series E+",
													children: "Series E+"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Private Equity",
													children: "Private Equity"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Post-IPO",
													children: "Post-IPO"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Bootstrapped",
													children: "Bootstrapped"
												})
											]
										})]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-black/10 rounded-xl p-5 hover:border-black/30 transition shadow-sm",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center space-x-2.5 text-[#333] mb-4",
								children: [/* @__PURE__ */ jsx(Users, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-[#111] font-outfit",
									children: "Buying Committee"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-[#666] mb-3",
								children: "Key decision makers and target personas IntelScout will identify:"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-1.5 mb-4 max-h-[140px] overflow-y-auto pr-1",
								children: icp.buyingCommittee.map((role, idx) => /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-[#222] bg-[#f5f5f5] border border-black/10 rounded-lg font-medium",
									children: [/* @__PURE__ */ jsx("span", { children: role }), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => handleRemoveRole(idx),
										className: "hover:text-red-500 hover:bg-black/5 rounded transition p-0.5",
										children: /* @__PURE__ */ jsx(X, { className: "w-2.5 h-2.5" })
									})]
								}, idx))
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleAddRole,
								className: "flex space-x-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									value: newRole,
									onChange: (e) => setNewRole(e.target.value),
									placeholder: "Add persona (e.g. CMO)...",
									className: "flex-1 bg-white border border-black/10 rounded-lg px-3 py-1.5 text-xs text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "px-2.5 py-1.5 bg-black hover:bg-[#222] text-white rounded-lg text-xs font-semibold flex items-center",
									children: /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" })
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-black/10 rounded-xl p-5 hover:border-black/30 transition shadow-sm md:col-span-1",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center space-x-2.5 text-[#333] mb-3",
								children: [/* @__PURE__ */ jsx(Cpu, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-[#111] font-outfit",
									children: "Technographics"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-[#666] mb-3",
								children: "Accounts using these tools will score higher:"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-1.5 mb-4 max-h-[140px] overflow-y-auto pr-1",
								children: icp.technographics.map((tech, idx) => /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-[#222] bg-[#f5f5f5] border border-black/10 rounded-lg font-medium",
									children: [/* @__PURE__ */ jsx("span", { children: tech }), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => handleRemoveTech(idx),
										className: "hover:text-red-500 hover:bg-black/5 rounded transition p-0.5",
										children: /* @__PURE__ */ jsx(X, { className: "w-2.5 h-2.5" })
									})]
								}, idx))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex space-x-2",
								children: /* @__PURE__ */ jsxs("select", {
									value: "",
									onChange: (e) => {
										if (!e.target.value) return;
										if (!icp.technographics.includes(e.target.value)) setIcp({
											...icp,
											technographics: [...icp.technographics, e.target.value]
										});
									},
									className: "flex-1 bg-white border border-black/10 rounded-lg px-3 py-1.5 text-xs text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "Select technology to add..."
									}), Object.entries({
										"CRM & Sales": [
											"Salesforce",
											"HubSpot",
											"Pipedrive",
											"Zoho CRM",
											"Outreach",
											"SalesLoft",
											"Apollo.io"
										],
										"Marketing Automation": [
											"Marketo",
											"Pardot",
											"ActiveCampaign",
											"Mailchimp",
											"Klaviyo",
											"Braze"
										],
										"Cloud & Infrastructure": [
											"AWS",
											"Google Cloud",
											"Microsoft Azure",
											"Vercel",
											"DigitalOcean",
											"Heroku",
											"Cloudflare"
										],
										"DevTools & CI/CD": [
											"GitHub Actions",
											"GitLab CI",
											"Jenkins",
											"CircleCI",
											"Sentry",
											"Datadog",
											"Docker",
											"Kubernetes"
										],
										"Data & Analytics": [
											"Snowflake",
											"Databricks",
											"Google Analytics",
											"Mixpanel",
											"Amplitude",
											"Segment",
											"Tableau",
											"Looker"
										],
										"HR & Recruiting": [
											"Workday",
											"Greenhouse",
											"Lever",
											"BambooHR",
											"Gusto",
											"Rippling",
											"Deel"
										],
										"Customer Support": [
											"Zendesk",
											"Intercom",
											"Freshdesk",
											"Jira Service Desk",
											"Gorgias"
										],
										"E-commerce": [
											"Shopify",
											"Magento",
											"WooCommerce",
											"BigCommerce",
											"Stripe"
										],
										"Productivity & Collaboration": [
											"Slack",
											"Microsoft Teams",
											"Notion",
											"Asana",
											"Monday.com",
											"Google Workspace"
										]
									}).map(([category, tools]) => /* @__PURE__ */ jsx("optgroup", {
										label: category,
										children: tools.map((tool) => /* @__PURE__ */ jsx("option", {
											value: tool,
											disabled: icp.technographics.includes(tool),
											children: tool
										}, tool))
									}, category))]
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-black/10 rounded-xl p-5 hover:border-black/30 transition shadow-sm md:col-span-1",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center space-x-2.5 text-[#333] mb-3",
								children: [/* @__PURE__ */ jsx(Sparkle, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-[#111] font-outfit",
									children: "Hiring & Growth Triggers"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-[#666] mb-3",
								children: "We look for these signals to determine timing:"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-1.5 mb-4 max-h-[140px] overflow-y-auto pr-1",
								children: icp.growthSignals.map((signal, idx) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between px-3 py-1.5 text-xs text-[#222] bg-[#f5f5f5] border border-black/10 rounded-lg font-medium",
									children: [/* @__PURE__ */ jsx("span", {
										className: "line-clamp-1",
										children: signal
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => handleRemoveSignal(idx),
										className: "text-[#888] hover:text-red-500 transition ml-2",
										children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
									})]
								}, idx))
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleAddSignal,
								className: "flex space-x-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									value: newSignal,
									onChange: (e) => setNewSignal(e.target.value),
									placeholder: "Add hiring trigger (e.g. Hiring CMO)...",
									className: "flex-1 bg-white border border-black/10 rounded-lg px-3 py-1.5 text-xs text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "px-2.5 py-1.5 bg-black hover:bg-[#222] text-white rounded-lg text-xs font-semibold flex items-center",
									children: /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" })
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between mt-6 pt-4 border-t border-black/10",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setStep(1),
					className: "px-5 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#555] font-medium text-sm flex items-center space-x-2 transition font-outfit",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Back" })]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setStep(3),
					className: "px-6 py-2.5 bg-black hover:bg-[#222] text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-sm font-outfit",
					children: [/* @__PURE__ */ jsx("span", { children: "Map Pain Points" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/Onboarding/Stage3Pain.tsx
function Stage3Pain() {
	const { painMap, setStep, offer } = useIntelScout();
	if (!painMap) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between mb-8 pb-4 border-b border-black/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl",
						children: /* @__PURE__ */ jsx(TrendUp, { className: "w-6 h-6" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold tracking-tight text-[#111] font-outfit",
							children: "Pain Mapping Blueprint"
						}), /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800 uppercase tracking-widest font-mono border border-violet-200",
							children: ["Synthesized from ", offer?.websiteUrl || "Source URL"]
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-[#555] mt-1",
						children: "IntelScout maps core problem statements to operational pains, triggers, and motivations."
					})] })]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative border-l border-black/10 pl-8 ml-4 space-y-8 mb-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "absolute -left-12 top-0.5 p-1.5 bg-[#fafafa] border border-black/10 text-[#555] rounded-lg group-hover:border-black/30 transition",
							children: /* @__PURE__ */ jsx(Lightbulb, { className: "w-4 h-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-[#888] uppercase tracking-wider block mb-1",
							children: "Core Problem Solved"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-[#111] max-w-2xl bg-white border border-black/10 shadow-sm rounded-xl p-3.5 mt-1.5",
							children: painMap.problem
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "absolute -left-12 top-0.5 p-1.5 bg-[#fafafa] border border-amber-500/30 text-amber-600 rounded-lg group-hover:border-amber-500/50 transition",
							children: /* @__PURE__ */ jsx(Warning, { className: "w-4 h-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2",
							children: "Customer Pain Points"
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-3",
							children: painMap.pain.map((painItem, idx) => /* @__PURE__ */ jsx("div", {
								className: "p-4 bg-white border border-black/10 shadow-sm rounded-xl hover:border-black/30 transition text-xs font-medium text-[#333]",
								children: /* @__PURE__ */ jsx("p", {
									className: "leading-relaxed",
									children: painItem
								})
							}, idx))
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "absolute -left-12 top-0.5 p-1.5 bg-[#fafafa] border border-emerald-500/30 text-emerald-600 rounded-lg group-hover:border-emerald-500/50 transition",
							children: /* @__PURE__ */ jsx(Lightning, { className: "w-4 h-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2",
							children: "Signal Triggers (Buying Window)"
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-3",
							children: painMap.triggers.map((trigger, idx) => /* @__PURE__ */ jsx("div", {
								className: "p-4 bg-white border border-black/10 shadow-sm rounded-xl hover:border-black/30 transition text-xs font-medium text-[#333]",
								children: /* @__PURE__ */ jsx("p", {
									className: "leading-relaxed",
									children: trigger
								})
							}, idx))
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "absolute -left-12 top-0.5 p-1.5 bg-[#fafafa] border border-violet-500/30 text-violet-600 rounded-lg group-hover:border-violet-500/50 transition",
							children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-[#888] uppercase tracking-wider block mb-1",
							children: "Target Buying Motivation"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-violet-900 max-w-2xl bg-violet-50 border border-violet-200 shadow-sm rounded-xl p-3.5 mt-1.5",
							children: painMap.buyingMotivation
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between mt-6 pt-4 border-t border-black/10",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setStep(2),
					className: "px-5 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#555] font-medium text-sm flex items-center space-x-2 transition font-outfit",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Back" })]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setStep(4),
					className: "px-6 py-2.5 bg-black hover:bg-[#222] text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-sm font-outfit",
					children: [/* @__PURE__ */ jsx("span", { children: "Configure Signals" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/Onboarding/Stage4Weights.tsx
function Stage4Weights() {
	const { signals, setSignals, setStep } = useIntelScout();
	const handleToggleSignal = (id) => {
		setSignals(signals.map((sig) => sig.id === id ? {
			...sig,
			enabled: !sig.enabled
		} : sig));
	};
	const handleWeightChange = (id, weight) => {
		setSignals(signals.map((sig) => sig.id === id ? {
			...sig,
			weight
		} : sig));
	};
	const strongSigs = signals.filter((s) => s.category === "strong");
	const mediumSigs = signals.filter((s) => s.category === "medium");
	const weakSigs = signals.filter((s) => s.category === "weak");
	const renderSignalRow = (sig) => /* @__PURE__ */ jsxs("div", {
		className: `flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-black/10 shadow-sm rounded-xl transition ${sig.enabled ? "border-black/20" : "opacity-40 border-black/5"}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-3 md:w-1/3",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => handleToggleSignal(sig.id),
				className: `focus:outline-none transition ${sig.enabled ? "text-violet-600" : "text-[#888]"}`,
				children: sig.enabled ? /* @__PURE__ */ jsx(ToggleRight, { className: "w-9 h-9" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "w-9 h-9" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold text-[#111]",
				children: sig.name
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-[10px] text-[#666]",
				children: ["ID: ", sig.id]
			})] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-4 mt-3 md:mt-0 flex-1 justify-end",
			children: [
				/* @__PURE__ */ jsx(Sliders, { className: "w-3.5 h-3.5 text-[#666]" }),
				/* @__PURE__ */ jsx("input", {
					type: "range",
					min: "1",
					max: "50",
					value: sig.weight,
					disabled: !sig.enabled,
					onChange: (e) => handleWeightChange(sig.id, parseInt(e.target.value)),
					className: "w-48 h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-violet-600 disabled:opacity-30 disabled:cursor-not-allowed"
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "text-xs font-mono font-bold text-[#333] w-12 text-right",
					children: [
						"+",
						sig.weight,
						" pts"
					]
				})
			]
		})]
	}, sig.id);
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between mb-6 pb-4 border-b border-black/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl",
						children: /* @__PURE__ */ jsx(Sliders, { className: "w-6 h-6" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-bold tracking-tight text-[#111] font-outfit",
						children: "Dynamic Signal Engine"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-[#555]",
						children: "Fine-tune the weights for custom trigger events. Higher weights prioritize matching accounts."
					})] })]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-6 mb-8 max-h-[420px] overflow-y-auto pr-1",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold tracking-widest text-emerald-600 uppercase block mb-3",
						children: "Strong Signals (High Intent)"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2.5",
						children: strongSigs.map(renderSignalRow)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold tracking-widest text-blue-600 uppercase block mb-3",
						children: "Medium Signals (Growth / Timing)"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2.5",
						children: mediumSigs.map(renderSignalRow)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold tracking-widest text-[#888] uppercase block mb-3",
						children: "Weak Signals (Informational)"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2.5",
						children: weakSigs.map(renderSignalRow)
					})] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between mt-6 pt-4 border-t border-black/10",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setStep(3),
					className: "px-5 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#555] font-medium text-sm flex items-center space-x-2 transition font-outfit",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Back" })]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setStep(5),
					className: "px-6 py-2.5 bg-black hover:bg-[#222] text-white font-medium text-sm rounded-xl flex items-center space-x-2 transition shadow-sm font-outfit",
					children: [/* @__PURE__ */ jsx("span", { children: "Import Accounts" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/Onboarding/Stage5Import.tsx
function Stage5Import() {
	const { setAccounts, setStep, offer, signals } = useIntelScout();
	const [dragActive, setDragActive] = useState(false);
	const [fileName, setFileName] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [singleDomain, setSingleDomain] = useState("");
	const [isAnalyzingSingle, setIsAnalyzingSingle] = useState(false);
	const fileInputRef = useRef(null);
	const DEMO_COMPANIES = [
		{
			name: "Vanta",
			domain: "vanta.com",
			industry: "B2B SaaS",
			size: 450,
			rev: "$80M",
			stage: "Series B",
			geo: "US",
			tech: [
				"AWS",
				"GitHub Actions",
				"Salesforce",
				"Drata",
				"Vanta"
			]
		},
		{
			name: "Stripe",
			domain: "stripe.com",
			industry: "FinTech",
			size: 8500,
			rev: "$12B",
			stage: "Late Stage",
			geo: "US",
			tech: [
				"AWS",
				"Salesforce",
				"Snowflake",
				"Sentry",
				"PostgreSQL"
			]
		},
		{
			name: "Rippling",
			domain: "rippling.com",
			industry: "HR SaaS",
			size: 2200,
			rev: "$400M",
			stage: "Series E",
			geo: "US",
			tech: [
				"AWS",
				"GitHub Actions",
				"Salesforce",
				"Snowflake"
			]
		},
		{
			name: "Supabase",
			domain: "supabase.com",
			industry: "DevTools Product",
			size: 120,
			rev: "$15M",
			stage: "Series A",
			geo: "US/Remote",
			tech: [
				"AWS",
				"GitHub Actions",
				"Vercel",
				"Sentry",
				"PostgreSQL"
			]
		},
		{
			name: "Cursor",
			domain: "cursor.sh",
			industry: "DevTools Product",
			size: 35,
			rev: "$8M",
			stage: "Seed",
			geo: "US",
			tech: [
				"AWS",
				"GitHub Actions",
				"Vercel",
				"PostgreSQL"
			]
		},
		{
			name: "Retool",
			domain: "retool.com",
			industry: "B2B SaaS",
			size: 550,
			rev: "$95M",
			stage: "Series C",
			geo: "US",
			tech: [
				"AWS",
				"GitHub Actions",
				"Salesforce",
				"Sentry",
				"PostgreSQL"
			]
		},
		{
			name: "Linear",
			domain: "linear.app",
			industry: "B2B SaaS",
			size: 60,
			rev: "$25M",
			stage: "Series A",
			geo: "US/EU",
			tech: [
				"AWS",
				"GitHub Actions",
				"Vercel",
				"Sentry"
			]
		},
		{
			name: "Vercel",
			domain: "vercel.com",
			industry: "DevTools Product",
			size: 480,
			rev: "$75M",
			stage: "Series D",
			geo: "US",
			tech: [
				"AWS",
				"GitHub Actions",
				"Vercel",
				"Sentry"
			]
		},
		{
			name: "Notion",
			domain: "notion.so",
			industry: "B2B SaaS",
			size: 750,
			rev: "$180M",
			stage: "Late Stage",
			geo: "US",
			tech: [
				"AWS",
				"Salesforce",
				"Snowflake"
			]
		},
		{
			name: "Deel",
			domain: "deel.com",
			industry: "FinTech",
			size: 3e3,
			rev: "$500M",
			stage: "Series D",
			geo: "Global",
			tech: [
				"AWS",
				"GitHub Actions",
				"Salesforce",
				"Snowflake"
			]
		},
		{
			name: "Figma",
			domain: "figma.com",
			industry: "B2B SaaS",
			size: 1300,
			rev: "$450M",
			stage: "Late Stage",
			geo: "US",
			tech: [
				"AWS",
				"GitHub Actions",
				"Snowflake",
				"Sentry"
			]
		},
		{
			name: "Sentry",
			domain: "sentry.io",
			industry: "DevTools Product",
			size: 380,
			rev: "$60M",
			stage: "Series C",
			geo: "US",
			tech: [
				"AWS",
				"GitHub Actions",
				"Vercel",
				"Sentry",
				"PostgreSQL"
			]
		}
	];
	const processImportedCompanies = (list) => {
		const category = getOfferCategory(offer.sell);
		const isTechOffer = category !== "general";
		setAccounts(list.map((item, index) => {
			const matchedMock = DEMO_COMPANIES.find((c) => c.domain.toLowerCase() === item.domain.toLowerCase() || c.name.toLowerCase() === item.name.toLowerCase());
			let industry = matchedMock?.industry || "B2B SaaS";
			let techStack = matchedMock?.tech || [
				"AWS",
				"GitHub Actions",
				"PostgreSQL"
			];
			if (category === "compliance") {
				industry = matchedMock?.industry || "B2B SaaS, FinTech, Enterprise Software";
				techStack = matchedMock?.tech || [
					"AWS",
					"GitHub Actions",
					"Salesforce",
					"Vanta",
					"Drata",
					"Vercel"
				];
			} else if (category === "hr") {
				industry = "HR Tech, B2B SaaS, Talent Management Services";
				techStack = [
					"Workday",
					"Greenhouse",
					"Slack",
					"Gusto",
					"BambooHR",
					"Lever"
				];
			} else if (category === "sales") {
				industry = "SalesTech, Marketing Automation, B2B SaaS, Agencies";
				techStack = [
					"HubSpot",
					"Salesforce",
					"Marketo",
					"Segment",
					"Intercom",
					"Apollo"
				];
			} else if (category === "devtools") {
				industry = "DevTools, Infrastructure, Cloud Platform SaaS";
				techStack = [
					"AWS",
					"GitHub Actions",
					"Vercel",
					"Sentry",
					"PostgreSQL",
					"Docker",
					"Kubernetes"
				];
			} else {
				industry = "E-commerce, Retail, Professional Services";
				techStack = [
					"Shopify",
					"Google Analytics",
					"HubSpot",
					"Zendesk",
					"Stripe",
					"Clara"
				];
			}
			const employeeCount = matchedMock?.size || Math.floor(Math.random() * 950) + 50;
			const revenue = matchedMock?.rev || `$${Math.floor(Math.random() * 90) + 10}M`;
			const fundingStage = matchedMock?.stage || [
				"Series A",
				"Series B",
				"Series C",
				"Seed"
			][Math.floor(Math.random() * 4)];
			const geography = matchedMock?.geo || "United States";
			let icpFit = 65;
			if (isTechOffer && (industry.includes("SaaS") || industry.includes("DevTools") || industry.includes("FinTech") || industry.includes("Tech"))) icpFit += 15;
			if (employeeCount >= 50 && employeeCount <= 1e3) icpFit += 10;
			if (geography.includes("US") || geography.includes("Global")) icpFit += 10;
			icpFit = Math.min(100, icpFit);
			const intent = Math.floor(Math.random() * 45) + 50;
			const timing = Math.floor(Math.random() * 45) + 50;
			const signalsDetected = [];
			if (index % 3 === 0) signalsDetected.push("funding");
			if (index % 4 === 0) signalsDetected.push("sec_hiring");
			if (index % 5 === 0) signalsDetected.push("trust_center");
			if (index % 6 === 0) signalsDetected.push("ent_pricing");
			if (signalsDetected.length === 0) signalsDetected.push("blog_post");
			const computedSignalsWeight = signalsDetected.reduce((sum, sigId) => {
				const cfg = signals.find((s) => s.id === sigId && s.enabled);
				return sum + (cfg ? cfg.weight : 0);
			}, 0);
			const signalScore = Math.round(Math.min(100, Math.max(0, computedSignalsWeight * 2.2)));
			const opportunityScore = Math.round(icpFit * .4 + intent * .25 + timing * .15 + signalScore * .2);
			let priorityTier = 4;
			if (opportunityScore >= 90) priorityTier = 1;
			else if (opportunityScore >= 70) priorityTier = 2;
			else if (opportunityScore >= 50) priorityTier = 3;
			const reasons = [];
			if (signalsDetected.includes("sec_hiring")) if (category === "compliance") reasons.push("Currently recruiting for 2+ Security Engineering positions.");
			else if (category === "hr") reasons.push("Currently recruiting for Talent Recruiters & Sourcers.");
			else if (category === "sales") reasons.push("Currently recruiting for 3+ Account Executives.");
			else if (category === "devtools") reasons.push("Currently recruiting for DevOps & SRE Engineers.");
			else reasons.push("Currently recruiting for Sales & Marketing Directors.");
			if (signalsDetected.includes("trust_center")) if (category === "compliance") reasons.push("Added secure trust center directory to landing domains.");
			else if (category === "hr") reasons.push("Integrated automated onboarding software to website.");
			else if (category === "sales") reasons.push("Added self-serve Enterprise packages to billing pages.");
			else if (category === "devtools") reasons.push("Added interactive API documentation and developer portal.");
			else reasons.push("Upgraded digital checkout portal or tech integrations.");
			if (signalsDetected.includes("ent_pricing")) reasons.push("Updated billing structures to include Enterprise pricing tiers.");
			if (signalsDetected.includes("funding")) reasons.push("Announced a new capital venture round recently.");
			if (icpFit >= 90) reasons.push(`Fits core ICP matrix with employee count of ${employeeCount}.`);
			if (reasons.length === 0) reasons.push("Demonstrating baseline compliance signals.");
			let economic = "Founder & CEO";
			let technical = "VP of Engineering / CTO";
			let champion = "Head of Information Security";
			let endUser = "DevOps & Security Engineers";
			if (category === "hr") {
				economic = "Chief People Officer";
				technical = "Director of HR Operations";
				champion = "VP of HR / Head of Talent";
				endUser = "HR & Recruiting Teams";
			} else if (category === "sales") {
				economic = "Chief Revenue Officer (CRO)";
				technical = "Head of Sales Operations";
				champion = "VP of Sales / VP of Marketing";
				endUser = "Account Executives & Growth Marketers";
			} else if (category === "devtools") {
				economic = "VP of Engineering";
				technical = "Chief Technology Officer (CTO)";
				champion = "Director of DevOps";
				endUser = "Software Engineers & Cloud Architects";
			} else if (category === "general") {
				economic = "Founder & CEO";
				technical = "IT Director / Operations Lead";
				champion = "Commercial Operations Lead";
				endUser = "Sales & Marketing Associates";
			}
			let contact = "Head of Information Security";
			let reason = signalsDetected.includes("sec_hiring") ? "Currently hiring security staff, likely scaling compliance requirements." : "Matches technographic footprint and target firmographics.";
			let pain = "Engineers spend hundreds of manual hours prepping compliance reviews.";
			let angle = `Pitch how ${offer.sell} can automate compliance logs, saving engineering cycles.`;
			if (category === "hr") {
				contact = "VP of HR / Head of Talent";
				reason = signalsDetected.includes("sec_hiring") ? "Recruiter hires and headcount growth indicating rapid scaling bottlenecks." : "Matches rapid scaling triggers and target firmographics.";
				pain = "Headcount expansion is breaking manual employee onboarding and compliance cycles.";
				angle = `Pitch how ${offer.sell} simplifies automated onboarding workflows and speeds up time-to-hire.`;
			} else if (category === "sales") {
				contact = "Chief Revenue Officer (CRO)";
				reason = signalsDetected.includes("sec_hiring") ? "Hiring sales hires and adding CRM API tools; indicating pipeline scaling priority." : "Matches active pipeline and marketing operations triggers.";
				pain = "Outbound response rates have crashed due to generic cold outreach.";
				angle = `Pitch how ${offer.sell} leverages buying triggers to personalize prospecting at scale.`;
			} else if (category === "devtools") {
				contact = "VP of Engineering";
				reason = signalsDetected.includes("sec_hiring") ? "Hiring DevOps / Cloud Engineers; indicating infrastructure scalability needs." : "Matches developer workflow and infra signals.";
				pain = "Developers waste hours maintaining custom CI/CD pipelines and manual configs.";
				angle = `Pitch how ${offer.sell} optimizes database caching and reduces build times by 50%.`;
			} else if (category === "general") {
				contact = "Founder / Head of Commercial Operations";
				reason = "Matches targeted firmographic growth profile and regional presence.";
				pain = "Inefficient customer acquisition cost and lack of integrated sales tracking.";
				angle = `Pitch how ${offer.sell} improves pipeline generation metrics and simplifies target engagement.`;
			}
			return {
				id: Math.random().toString(36).substring(7),
				company_name: item.name,
				domain: item.domain,
				icpFit,
				intent,
				timing,
				signalScore,
				opportunityScore,
				priorityTier,
				reasons,
				buyingCommittee: {
					economic,
					technical,
					champion,
					endUser
				},
				gtmRecommendations: {
					contact,
					reason,
					pain,
					angle
				},
				signalsDetected,
				techStack,
				employeeCount,
				revenue,
				geography,
				fundingStage,
				industry
			};
		}));
	};
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
		else if (e.type === "dragleave") setDragActive(false);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
	};
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
	};
	const handleFile = (file) => {
		if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
			setErrorMsg("Please upload a valid CSV file (.csv format)");
			return;
		}
		setErrorMsg("");
		setFileName(file.name);
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result;
			parseCSV(text);
		};
		reader.readAsText(file);
	};
	const parseCSV = (text) => {
		try {
			const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
			if (lines.length <= 1) {
				setErrorMsg("The CSV file is empty or missing data rows.");
				return;
			}
			const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
			const nameIndex = headers.indexOf("company_name");
			const domainIndex = headers.indexOf("domain");
			if (nameIndex === -1 || domainIndex === -1) {
				setErrorMsg("CSV must include columns: 'company_name' and 'domain'");
				return;
			}
			const parsedList = [];
			for (let i = 1; i < lines.length; i++) {
				const cols = lines[i].split(",").map((c) => c.trim());
				if (cols.length > Math.max(nameIndex, domainIndex)) parsedList.push({
					name: cols[nameIndex].replace(/^["']|["']$/g, ""),
					domain: cols[domainIndex].replace(/^["']|["']$/g, "")
				});
			}
			if (parsedList.length === 0) {
				setErrorMsg("Failed to parse any valid company records.");
				return;
			}
			processImportedCompanies(parsedList);
			setStep("research");
		} catch (err) {
			setErrorMsg("Error parsing CSV. Ensure there are no unquoted commas.");
		}
	};
	const handleLoadDemo = () => {
		setErrorMsg("");
		setFileName("Demo Company Dataset");
		processImportedCompanies(DEMO_COMPANIES.map((c) => ({
			name: c.name,
			domain: c.domain
		})));
		setStep("research");
	};
	const downloadSampleCSV = () => {
		const encodedUri = encodeURI("data:text/csv;charset=utf-8,company_name,domain\nVanta,vanta.com\nStripe,stripe.com\nRippling,rippling.com\nRetool,retool.com\nSupabase,supabase.com\nCursor,cursor.sh\n");
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "intelscout_sample_import.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const handleAnalyzeSingleDomain = (e) => {
		e.preventDefault();
		if (!singleDomain.trim()) return;
		setIsAnalyzingSingle(true);
		let cleanDomain = singleDomain.trim().replace(/^(https?:\/\/)?(www\.)?/, "");
		cleanDomain = cleanDomain.split("/")[0].toLowerCase();
		if (!cleanDomain.includes(".")) {
			setErrorMsg("Please enter a valid domain format (e.g. airbnb.com)");
			setIsAnalyzingSingle(false);
			return;
		}
		const namePart = cleanDomain.split(".")[0];
		const companyName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
		setTimeout(() => {
			setErrorMsg("");
			processImportedCompanies([{
				name: companyName,
				domain: cleanDomain
			}]);
			setIsAnalyzingSingle(false);
			setStep("research");
		}, 1200);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full max-w-3xl bg-white/80 backdrop-blur-md border border-black/10 rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center space-x-3 mb-6",
				children: [/* @__PURE__ */ jsx("div", {
					className: "p-2.5 bg-black/5 border border-black/10 text-[#111] rounded-xl",
					children: /* @__PURE__ */ jsx(Database, { className: "w-6 h-6" })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold tracking-tight text-[#111] font-outfit",
					children: "Import Accounts"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-[#555]",
					children: "Define your targets to analyze. Enter a single target enterprise domain or upload a CSV file."
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-6 bg-white border border-black/10 rounded-xl p-5 relative overflow-hidden shadow-sm",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-semibold text-[#888] uppercase tracking-wider block mb-2.5",
					children: "Analyze Single Target Enterprise Domain"
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleAnalyzeSingleDomain,
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ jsx(Globe, { className: "absolute left-3.5 top-3 w-4 h-4 text-[#555]" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Enter domain (e.g. microsoft.com, airbnb.com, stripe.com)...",
							value: singleDomain,
							onChange: (e) => setSingleDomain(e.target.value),
							className: "w-full bg-white border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition",
							required: true,
							disabled: isAnalyzingSingle
						})]
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: isAnalyzingSingle || !singleDomain.trim(),
						className: "px-4 py-2.5 bg-black hover:bg-[#222] disabled:opacity-50 disabled:hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition shrink-0 cursor-pointer font-outfit",
						children: isAnalyzingSingle ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(CircleNotch, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Resolving..." })] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(MagnifyingGlass, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Analyze Domain" })] })
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center my-6 text-[10px] font-bold text-[#888] uppercase tracking-widest",
				children: [
					/* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-black/10" }),
					/* @__PURE__ */ jsx("span", {
						className: "px-3",
						children: "Or upload CSV file"
					}),
					/* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-black/10" })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				onDragEnter: handleDrag,
				onDragOver: handleDrag,
				onDragLeave: handleDrag,
				onDrop: handleDrop,
				onClick: () => fileInputRef.current?.click(),
				className: `border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${dragActive ? "border-black/50 bg-black/5" : "border-black/10 bg-white hover:border-black/30 hover:bg-[#fafafa]"}`,
				children: [
					/* @__PURE__ */ jsx("input", {
						type: "file",
						ref: fileInputRef,
						onChange: handleFileChange,
						accept: ".csv",
						className: "hidden"
					}),
					/* @__PURE__ */ jsx(CloudArrowUp, { className: "w-10 h-10 text-[#666] mb-3" }),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold text-[#111]",
						children: fileName ? `Selected: ${fileName}` : "Drag & drop your CSV file here"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-[#666] mt-1",
						children: "Supports files up to 10,000 accounts. Must include company_name, domain headers."
					}),
					fileName && /* @__PURE__ */ jsxs("div", {
						className: "mt-4 px-3 py-1 bg-[#fafafa] border border-black/10 text-[11px] font-mono text-[#555] rounded-lg flex items-center space-x-1",
						children: [/* @__PURE__ */ jsx(FileText, { className: "w-3 h-3 text-[#111]" }), /* @__PURE__ */ jsx("span", { children: "Ready to process." })]
					})
				]
			}),
			errorMsg && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-red-500 text-center font-medium mt-3",
				children: errorMsg
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mt-5 gap-3",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: downloadSampleCSV,
					className: "text-xs font-semibold text-[#888] hover:text-[#111] flex items-center space-x-1.5 transition",
					children: [/* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Download Sample CSV template" })]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: handleLoadDemo,
					className: "text-xs font-semibold text-[#555] hover:text-[#111] flex items-center space-x-1.5 transition",
					children: [/* @__PURE__ */ jsx(Play, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Or, Load Pre-loaded Demo Dataset (12 companies)" })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-between mt-8 pt-4 border-t border-black/10",
				children: /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setStep(4),
					className: "px-5 py-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#555] font-medium text-sm flex items-center space-x-2 transition font-outfit",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Back" })]
				})
			})
		]
	});
}
//#endregion
//#region src/components/Onboarding/ResearchEngine.tsx
function ResearchEngine() {
	const { accounts, setStep, researchProgress, setResearchProgress, consoleLogs, addConsoleLog, clearConsoleLogs } = useIntelScout();
	useEffect(() => {
		clearConsoleLogs();
		setResearchProgress(0);
		if (accounts.length === 0) {
			addConsoleLog("Warning: No accounts imported. Initializing default crawl queue...");
			return;
		}
		let isSubscribed = true;
		async function startCrawl() {
			try {
				const response = await fetch("/api/crawl", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						accounts,
						productOffer: "AI Compliance Platform",
						icp: "Mid-market to Enterprise SaaS"
					})
				});
				if (!response.ok) {
					addConsoleLog(`Error: Backend returned ${response.status} ${response.statusText}`);
					return;
				}
				const reader = response.body?.getReader();
				const decoder = new TextDecoder();
				let buffer = "";
				if (!reader) return;
				while (isSubscribed) {
					const { done, value } = await reader.read();
					if (done) break;
					buffer += decoder.decode(value, { stream: true });
					let eolIndex;
					while ((eolIndex = buffer.indexOf("\n\n")) >= 0) {
						const eventChunk = buffer.slice(0, eolIndex);
						buffer = buffer.slice(eolIndex + 2);
						const lines = eventChunk.split("\n");
						let eventType = "message";
						let data = "";
						for (const line of lines) if (line.startsWith("event: ")) eventType = line.substring(7).trim();
						else if (line.startsWith("data: ")) data += line.substring(6);
						if (data) if (eventType === "result") addConsoleLog(`[SYSTEM] Received structured intel for ${JSON.parse(data).domain}`);
						else if (eventType === "done") {
							setResearchProgress(100);
							setTimeout(() => {
								if (isSubscribed) setStep("dashboard");
							}, 2500);
						} else {
							addConsoleLog(data);
							setResearchProgress((prev) => Math.min(99, prev + 100 / (accounts.length * 5)));
						}
					}
				}
			} catch (err) {
				if (isSubscribed) addConsoleLog(`Error: Failed to connect to GTM Engine (${err})`);
			}
		}
		startCrawl();
		return () => {
			isSubscribed = false;
		};
	}, [
		accounts,
		setStep,
		setResearchProgress,
		clearConsoleLogs,
		addConsoleLog
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full max-w-3xl bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col h-[520px]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute top-0 left-0 right-0 h-1 bg-black/10",
				children: /* @__PURE__ */ jsx("div", {
					className: "h-full bg-black transition-all duration-300",
					style: { width: `${researchProgress}%` }
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-black/10 pb-4 mb-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-2 text-[#111]",
					children: [/* @__PURE__ */ jsx(Terminal, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("h3", {
						className: "font-semibold text-[#111] font-outfit text-sm",
						children: "GTM Engine Crawler logs"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-3 text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[#888]",
						children: "Progress:"
					}), /* @__PURE__ */ jsxs("span", {
						className: "font-mono font-bold text-[#111] bg-[#fafafa] px-2 py-1 border border-black/10 rounded",
						children: [researchProgress, "%"]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 bg-white/50 backdrop-blur-md border border-black/5 rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-[#666] overflow-y-auto space-y-2 shadow-[inset_0_4px_15px_rgba(0,0,0,0.03)] scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent",
				children: consoleLogs.map((log, index) => {
					const match = log.match(/^(\[[^\]]+\])\s*(?:(\[[^\]]+\])\s*)?(?:(\[[^\]]+\])\s*)?(.*)$/);
					if (!match) return /* @__PURE__ */ jsx("p", {
						className: "text-[#666]",
						children: log
					}, index);
					const timestamp = match[1];
					const tag = match[2];
					const domain = match[3];
					const message = match[4];
					let tagColor = "text-[#666]";
					if (tag) {
						if (tag.includes("[SCAN]")) tagColor = "text-blue-500 font-bold";
						else if (tag.includes("[TECH]")) tagColor = "text-amber-500 font-bold";
						else if (tag.includes("[JOBS]")) tagColor = "text-violet-500 font-bold";
						else if (tag.includes("[QUAL]")) tagColor = "text-emerald-500 font-bold";
						else if (tag.includes("[DONE]")) tagColor = "text-[#111] font-bold";
					}
					let msgColor = "text-[#555]";
					if (message.includes("🎉")) msgColor = "text-emerald-600 font-semibold";
					else if (message.includes("Warning")) msgColor = "text-amber-600";
					return /* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-1.5 font-mono break-all sm:break-normal",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-[#aaa] shrink-0",
								children: timestamp
							}),
							tag && /* @__PURE__ */ jsx("span", {
								className: `${tagColor} shrink-0`,
								children: tag
							}),
							domain && /* @__PURE__ */ jsx("span", {
								className: "text-[#888] shrink-0",
								children: domain
							}),
							/* @__PURE__ */ jsx("span", {
								className: msgColor,
								children: message
							})
						]
					}, index);
				})
			}),
			researchProgress === 100 && /* @__PURE__ */ jsxs("div", {
				className: "mt-4 p-4 bg-emerald-50 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-pulse",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-3 text-emerald-700 text-sm font-medium",
					children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("span", { children: "Research Audit Complete. Launching GTM Console..." })]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: () => setStep("dashboard"),
					className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center space-x-1.5 transition",
					children: [/* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Enter Console" })]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/AnimatedLogo.tsx
function AnimatedLogo({ className = "", showText = true }) {
	return /* @__PURE__ */ jsx("div", {
		className: `flex items-center select-none ${className}`,
		children: showText ? /* @__PURE__ */ jsx(motion.span, {
			className: "font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#000] via-[#888] to-[#000]",
			animate: { backgroundPosition: ["-200% center", "200% center"] },
			transition: {
				duration: 3,
				repeat: Infinity,
				ease: "linear"
			},
			style: { backgroundSize: "200% auto" },
			children: "IntelScout"
		}) : /* @__PURE__ */ jsx(motion.span, {
			className: "font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#000] via-[#888] to-[#000] mx-auto",
			animate: { backgroundPosition: ["-200% center", "200% center"] },
			transition: {
				duration: 3,
				repeat: Infinity,
				ease: "linear"
			},
			style: { backgroundSize: "200% auto" },
			children: "IS"
		})
	});
}
//#endregion
//#region src/components/Dashboard/Sidebar.tsx
function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
	const { setStep, accounts, user, logout } = useIntelScout();
	const navItems = [
		{
			id: "dashboard",
			label: "Analytics Overview",
			icon: SquaresFour
		},
		{
			id: "accounts",
			label: "Prioritized Accounts",
			icon: Table,
			badge: accounts.length
		},
		{
			id: "signals",
			label: "Signal Tuning",
			icon: Sliders
		},
		{
			id: "feed",
			label: "Intelligence Feed",
			icon: Pulse
		},
		{
			id: "environments",
			label: "Environments",
			icon: Stack
		},
		{
			id: "audience",
			label: "Audience & Auth",
			icon: Users
		}
	];
	return /* @__PURE__ */ jsxs("aside", {
		className: `bg-white/60 backdrop-blur-md border-r border-black/10 hidden md:flex flex-col transition-all duration-300 relative ${collapsed ? "w-16" : "w-64"}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "h-16 flex items-center px-4 justify-between border-b border-black/10",
				children: [/* @__PURE__ */ jsx("div", {
					className: "overflow-hidden",
					children: /* @__PURE__ */ jsx(AnimatedLogo, {
						className: "w-6 h-6",
						showText: !collapsed
					})
				}), !collapsed && /* @__PURE__ */ jsx("button", {
					onClick: () => setCollapsed(true),
					className: "p-1 hover:bg-[#fafafa] rounded-lg text-[#888] hover:text-[#111] transition",
					children: /* @__PURE__ */ jsx(CaretDoubleLeft, { className: "w-4 h-4" })
				})]
			}),
			collapsed && /* @__PURE__ */ jsx("button", {
				onClick: () => setCollapsed(false),
				className: "absolute -right-3.5 top-20 bg-white border border-black/10 p-1 rounded-full text-[#666] hover:text-[#111] shadow-sm transition z-20",
				children: /* @__PURE__ */ jsx(CaretDoubleRight, { className: "w-3 h-3" })
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "flex-1 px-3 py-4 space-y-1",
				children: navItems.map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab(item.id),
						className: `w-full flex items-center p-2.5 rounded-lg text-xs font-semibold tracking-wide transition relative group ${activeTab === item.id ? "bg-black/5 border border-black/10 text-black" : "text-[#555] hover:bg-black/5 hover:text-black"}`,
						children: [
							/* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 shrink-0 ${collapsed ? "mx-auto" : "mr-3"}` }),
							!collapsed && /* @__PURE__ */ jsx("span", { children: item.label }),
							!collapsed && item.badge !== void 0 && /* @__PURE__ */ jsx("span", {
								className: "absolute right-3.5 bg-[#fafafa] border border-black/10 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-[#555]",
								children: item.badge
							}),
							collapsed && /* @__PURE__ */ jsx("div", {
								className: "absolute left-16 bg-white border border-black/10 text-[#111] text-[10px] px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-55 shadow-sm",
								children: item.label
							})
						]
					}, item.id);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "p-3 border-t border-black/10 space-y-2",
				children: [user && /* @__PURE__ */ jsxs("div", {
					className: `flex items-center p-1.5 rounded-lg bg-[#fafafa] border border-black/10 ${collapsed ? "justify-center" : "space-x-2.5"}`,
					children: [/* @__PURE__ */ jsx("img", {
						src: user.avatar,
						alt: user.name,
						className: "w-6 h-6 rounded-full border border-black/10 bg-white p-0.5 shrink-0"
					}), !collapsed && /* @__PURE__ */ jsxs("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[10px] font-bold text-[#111] truncate leading-snug",
							children: user.name
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[9px] text-[#666] truncate leading-none",
							children: user.email
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setStep(1),
						className: "w-full flex items-center p-2 rounded-lg text-[10px] font-bold text-[#888] hover:text-[#111] hover:bg-black/5 transition group",
						children: [
							/* @__PURE__ */ jsx(Sliders, { className: `w-3.5 h-3.5 shrink-0 ${collapsed ? "mx-auto" : "mr-2.5"}` }),
							!collapsed && /* @__PURE__ */ jsx("span", {
								className: "uppercase tracking-wider",
								children: "Reset Campaign"
							}),
							collapsed && /* @__PURE__ */ jsx("div", {
								className: "absolute left-16 bg-white border border-black/10 text-[#333] text-[9px] px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-55 shadow-sm uppercase tracking-wider",
								children: "Reset Campaign"
							})
						]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: logout,
						className: "w-full flex items-center p-2 rounded-lg text-[10px] font-bold text-[#888] hover:text-red-500 hover:bg-red-50 transition group",
						children: [
							/* @__PURE__ */ jsx(SignOut, { className: `w-3.5 h-3.5 shrink-0 ${collapsed ? "mx-auto" : "mr-2.5"}` }),
							!collapsed && /* @__PURE__ */ jsx("span", {
								className: "uppercase tracking-wider",
								children: "Sign Out"
							}),
							collapsed && /* @__PURE__ */ jsx("div", {
								className: "absolute left-16 bg-white border border-black/10 text-red-500 text-[9px] px-2 py-1 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-55 shadow-sm uppercase tracking-wider",
								children: "Sign Out"
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/Dashboard/Navbar.tsx
function Navbar$1({ activeTab, setSidebarCollapsed, sidebarCollapsed }) {
	const { offer, userRole, setUserRole, user, logout, setStep } = useIntelScout();
	const getTitle = () => {
		switch (activeTab) {
			case "dashboard": return "Analytics Console";
			case "accounts": return "Accounts Prioritization Engine";
			case "signals": return "Dynamic Signal Configurations";
			case "feed": return "GTM Intelligence Feed";
			case "audience": return "Audience & Auth Logs";
			default: return "Dashboard";
		}
	};
	return /* @__PURE__ */ jsxs("header", {
		className: "h-16 bg-white/60 backdrop-blur-md border-b border-black/10 px-6 flex items-center justify-between shrink-0 z-30",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: "p-1.5 bg-black/5 border border-black/10 text-black rounded-lg md:hidden",
				children: /* @__PURE__ */ jsx(Target, { className: "w-4 h-4" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-sm font-bold tracking-tight text-[#111] font-outfit",
				children: getTitle()
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-[10px] text-[#555] font-medium hidden md:block",
				children: [
					"Offer: ",
					/* @__PURE__ */ jsx("span", {
						className: "text-[#111] font-semibold",
						children: offer.sell
					}),
					" • deal size: ",
					/* @__PURE__ */ jsx("span", {
						className: "text-[#333]",
						children: offer.dealSize
					})
				]
			})] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-3",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-1.5 px-3 py-1.5 bg-[#fafafa] border border-black/10 rounded-xl relative",
					children: [
						/* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5 text-[#555]" }),
						/* @__PURE__ */ jsx("span", {
							className: "text-[9px] font-bold text-[#888] uppercase tracking-wider hidden sm:inline",
							children: "Role:"
						}),
						/* @__PURE__ */ jsxs("select", {
							value: userRole,
							onChange: (e) => setUserRole(e.target.value),
							className: "bg-transparent text-[9px] font-bold text-[#333] focus:outline-none cursor-pointer uppercase tracking-wider pr-1 border-none focus:ring-0 outline-none",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "admin",
									className: "bg-white text-[#333]",
									children: "Admin"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "sales",
									className: "bg-white text-[#333]",
									children: "Sales Rep"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "marketing",
									className: "bg-white text-[#333]",
									children: "Marketing"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-2 px-3 py-1.5 bg-[#fafafa] border border-black/10 rounded-xl",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "relative flex h-2 w-2",
						children: [/* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold text-[#555] uppercase tracking-wider hidden lg:inline",
						children: "GTM Crawler Live"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-1.5 px-3 py-1.5 bg-violet-50 border border-violet-100 text-violet-600 rounded-xl",
					children: [/* @__PURE__ */ jsx("span", { className: "relative w-1.5 h-1.5 rounded-full bg-violet-500" }), /* @__PURE__ */ jsx("span", {
						className: "text-[9px] font-bold uppercase tracking-wider hidden sm:inline",
						children: "AI Active"
					})]
				}),
				user && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-2 md:hidden",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setStep(1),
						title: "Reset Campaign",
						className: "p-1.5 bg-[#fafafa] hover:bg-black/5 border border-black/10 text-[#555] hover:text-[#111] rounded-lg transition cursor-pointer",
						children: /* @__PURE__ */ jsx(Sliders, { className: "w-3.5 h-3.5" })
					}), /* @__PURE__ */ jsx("button", {
						onClick: logout,
						title: "Sign Out",
						className: "p-1.5 bg-[#fafafa] hover:bg-red-50 border border-black/10 text-[#555] hover:text-red-500 rounded-lg transition cursor-pointer",
						children: /* @__PURE__ */ jsx(SignOut, { className: "w-3.5 h-3.5" })
					})]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/Dashboard/KPIWidgets.tsx
function KPIWidgets() {
	const { accounts, offer } = useIntelScout();
	const totalAnalyzed = accounts.length;
	const highPriorityCount = accounts.filter((a) => a.opportunityScore >= 70).length;
	const highPriorityPercent = totalAnalyzed > 0 ? Math.round(highPriorityCount / totalAnalyzed * 100) : 0;
	const totalSignals = accounts.reduce((sum, a) => sum + a.signalsDetected.length, 0);
	const avgFit = totalAnalyzed > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.icpFit, 0) / totalAnalyzed) : 0;
	const avgIntent = totalAnalyzed > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.intent, 0) / totalAnalyzed) : 0;
	let avgDealValue = 5e4;
	if (offer.dealSize === "<$1,000") avgDealValue = 800;
	else if (offer.dealSize === "$1,000-$5,000") avgDealValue = 3e3;
	else if (offer.dealSize === "$5,000-$20,000") avgDealValue = 12500;
	else if (offer.dealSize === "$20,000-$100,000") avgDealValue = 6e4;
	else if (offer.dealSize === "$100,000+") avgDealValue = 25e4;
	const totalPipeline = highPriorityCount * avgDealValue;
	const formatPipeline = (val) => {
		if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
		if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}k`;
		return `$${val}`;
	};
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6",
		children: [
			{
				label: "Accounts Analyzed",
				value: totalAnalyzed,
				desc: "Processed in current run",
				icon: Buildings,
				color: "text-violet-600 bg-violet-500/10 border-violet-500/20"
			},
			{
				label: "High Priority Accounts",
				value: highPriorityCount,
				desc: `${highPriorityPercent}% of total accounts`,
				icon: WarningCircle,
				color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
			},
			{
				label: "Signals Detected",
				value: totalSignals,
				desc: "Dynamic triggers matched",
				icon: Pulse,
				color: "text-blue-600 bg-blue-500/10 border-blue-500/20"
			},
			{
				label: "ICP Match Rate",
				value: `${avgFit}%`,
				desc: "Average profile overlap",
				icon: Compass,
				color: "text-amber-600 bg-amber-500/10 border-amber-500/20"
			},
			{
				label: "Average Intent",
				value: `${avgIntent}%`,
				desc: "Signal weight index",
				icon: Flame,
				color: "text-orange-600 bg-orange-500/10 border-orange-500/20"
			},
			{
				label: "Pipeline Opportunities",
				value: formatPipeline(totalPipeline),
				desc: `Est. from ${offer.dealSize} ACV`,
				icon: CurrencyDollar,
				color: "text-pink-600 bg-pink-500/10 border-pink-500/20"
			}
		].map((card, idx) => {
			const Icon = card.icon;
			return /* @__PURE__ */ jsxs("div", {
				className: "bg-white/80 backdrop-blur-md border border-black/10 rounded-xl p-4 flex flex-col justify-between hover:border-black/30 hover:shadow-md transition relative overflow-hidden group",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold text-[#888] uppercase tracking-widest block truncate",
						children: card.label
					}), /* @__PURE__ */ jsx("div", {
						className: `p-1.5 rounded-lg border shrink-0 ${card.color}`,
						children: /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" })
					})]
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-xl font-bold font-outfit text-[#111] leading-none tracking-tight mb-1 group-hover:text-violet-600 transition",
					children: card.value
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[10px] text-[#555] font-medium truncate",
					children: card.desc
				})] })]
			}, idx);
		})
	});
}
//#endregion
//#region src/components/Dashboard/AnalyticsCharts.tsx
function AnalyticsCharts() {
	const { accounts, signals, feedEvents, lastSignalAt } = useIntelScout();
	const [hoveredBar, setHoveredBar] = useState(null);
	const [hoveredTech, setHoveredTech] = useState(null);
	const [hoveredSig, setHoveredSig] = useState(null);
	const [mounted, setMounted] = useState(false);
	const [pulsing, setPulsing] = useState(false);
	useEffect(() => {
		const t = setTimeout(() => setMounted(true), 80);
		return () => clearTimeout(t);
	}, []);
	useEffect(() => {
		if (lastSignalAt === 0) return;
		setPulsing(true);
		const t = setTimeout(() => setPulsing(false), 1400);
		return () => clearTimeout(t);
	}, [lastSignalAt]);
	const ranges = [
		{
			label: "<50",
			sublabel: "Tier 4",
			count: 0,
			color: "#71717a",
			glow: "#71717a"
		},
		{
			label: "50–69",
			sublabel: "Tier 3",
			count: 0,
			color: "#3b82f6",
			glow: "#3b82f6"
		},
		{
			label: "70–89",
			sublabel: "Tier 2",
			count: 0,
			color: "#f59e0b",
			glow: "#f59e0b"
		},
		{
			label: "90+",
			sublabel: "Tier 1",
			count: 0,
			color: "#10b981",
			glow: "#10b981"
		}
	];
	accounts.forEach((acc) => {
		if (acc.opportunityScore >= 90) ranges[3].count++;
		else if (acc.opportunityScore >= 70) ranges[2].count++;
		else if (acc.opportunityScore >= 50) ranges[1].count++;
		else ranges[0].count++;
	});
	const maxCount = Math.max(...ranges.map((r) => r.count), 1);
	const avgScore = accounts.length > 0 ? Math.round(accounts.reduce((s, a) => s + a.opportunityScore, 0) / accounts.length) : 0;
	const techCounts = {};
	accounts.forEach((acc) => acc.techStack.forEach((tech) => {
		techCounts[tech] = (techCounts[tech] || 0) + 1;
	}));
	const sortedTech = Object.entries(techCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
	const maxTechCount = Math.max(...sortedTech.map((t) => t[1]), 1);
	const sigCategoryTotals = {
		strong: 0,
		medium: 0,
		weak: 0
	};
	accounts.forEach((acc) => {
		acc.signalsDetected.forEach((sigId) => {
			const cfg = signals.find((s) => s.id === sigId);
			if (cfg) sigCategoryTotals[cfg.category]++;
		});
	});
	const sigCategories = [
		{
			label: "Strong",
			count: sigCategoryTotals.strong,
			color: "#10b981",
			bg: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
		},
		{
			label: "Medium",
			count: sigCategoryTotals.medium,
			color: "#f59e0b",
			bg: "bg-amber-500/20 border-amber-500/30 text-amber-400"
		},
		{
			label: "Weak",
			count: sigCategoryTotals.weak,
			color: "#8b5cf6",
			bg: "bg-violet-500/20 border-violet-500/30 text-violet-400"
		}
	];
	const totalSignalsFired = sigCategoryTotals.strong + sigCategoryTotals.medium + sigCategoryTotals.weak;
	const maxSigCount = Math.max(sigCategoryTotals.strong, sigCategoryTotals.medium, sigCategoryTotals.weak, 1);
	const emptyState = /* @__PURE__ */ jsxs("div", {
		className: "flex-1 flex flex-col items-center justify-center py-12 text-center opacity-40",
		children: [/* @__PURE__ */ jsx(TrendUp, { className: "w-7 h-7 text-[#888] mb-2" }), /* @__PURE__ */ jsx("p", {
			className: "text-xs text-[#666]",
			children: "Import accounts to populate charts"
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: `bg-white border rounded-xl p-5 shadow-sm flex flex-col transition-all duration-500 ${pulsing ? "border-violet-300 shadow-violet-500/10" : "border-black/10 hover:border-black/20"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-3 border-b border-black/10 pb-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-2",
						children: [/* @__PURE__ */ jsx(ChartBar, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold text-[#111] uppercase tracking-wider font-outfit",
							children: "Score Distribution"
						})]
					}), accounts.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[9px] font-semibold text-[#888] uppercase tracking-wider",
							children: "Avg"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs font-black font-mono text-violet-600",
							children: avgScore
						})]
					})]
				}), accounts.length === 0 ? emptyState : /* @__PURE__ */ jsxs("div", {
					className: "flex-1 min-h-[180px] flex items-end justify-around px-2 pb-1 relative",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 flex flex-col justify-between pointer-events-none pb-8",
						children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-full border-t border-black/5" }, i))
					}), ranges.map((range, idx) => {
						const heightPercent = mounted ? range.count / maxCount * 78 : 0;
						const isHovered = hoveredBar === idx;
						return /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center flex-1 group z-10 cursor-pointer",
							onMouseEnter: () => setHoveredBar(idx),
							onMouseLeave: () => setHoveredBar(null),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative w-10 sm:w-12 flex flex-col justify-end",
								style: { height: "130px" },
								children: [
									range.count > 0 && /* @__PURE__ */ jsx("span", {
										className: "absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black font-mono transition-opacity duration-200",
										style: {
											color: range.color,
											opacity: isHovered ? 1 : .6
										},
										children: range.count
									}),
									isHovered && /* @__PURE__ */ jsxs("div", {
										className: "absolute -top-10 left-1/2 -translate-x-1/2 bg-white border border-black/10 text-[10px] text-[#111] font-mono px-2 py-0.5 rounded shadow-sm whitespace-nowrap z-50",
										children: [
											range.count,
											" account",
											range.count !== 1 ? "s" : ""
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "w-full rounded-t-md relative overflow-hidden",
										style: {
											height: `${Math.max(range.count === 0 ? 0 : 3, heightPercent)}%`,
											backgroundColor: range.color,
											boxShadow: isHovered ? `0 0 18px ${range.glow}50` : `0 0 6px ${range.glow}18`,
											transition: "height 0.6s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease"
										},
										children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-white/5" })
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-center mt-2",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-[10px] font-bold font-mono",
									style: { color: range.color },
									children: range.label
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[9px] text-[#666] uppercase tracking-wide",
									children: range.sublabel
								})]
							})]
						}, range.label);
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white border border-black/10 rounded-xl p-5 hover:border-black/20 transition shadow-sm flex flex-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center space-x-2 mb-4 border-b border-black/10 pb-3",
					children: [/* @__PURE__ */ jsx(ChartPie, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
						className: "text-xs font-bold text-[#111] uppercase tracking-wider font-outfit",
						children: "Tech Stack Matches"
					})]
				}), sortedTech.length === 0 ? emptyState : /* @__PURE__ */ jsx("div", {
					className: "flex-1 flex flex-col justify-center space-y-3 pb-1",
					children: sortedTech.map(([tech, count], idx) => {
						const widthPercent = mounted ? count / maxTechCount * 100 : 0;
						const isHovered = hoveredTech === idx;
						return /* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							onMouseEnter: () => setHoveredTech(idx),
							onMouseLeave: () => setHoveredTech(null),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center text-[11px] font-medium",
								children: [/* @__PURE__ */ jsx("span", {
									className: `font-semibold transition-colors duration-150 ${isHovered ? "text-violet-600" : "text-[#333]"}`,
									children: tech
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[#888] font-mono text-[10px]",
									children: count
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-2 bg-[#fafafa] border border-black/10 rounded-full overflow-hidden cursor-pointer",
								children: /* @__PURE__ */ jsx("div", {
									className: `h-full rounded-full transition-all duration-700 ease-out ${isHovered ? "bg-gradient-to-r from-violet-600 to-violet-500" : "bg-gradient-to-r from-violet-400 to-violet-300"}`,
									style: {
										width: `${widthPercent}%`,
										transitionDelay: `${idx * 60}ms`
									}
								})
							})]
						}, tech);
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white border border-black/10 rounded-xl p-5 hover:border-black/20 transition shadow-sm flex flex-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-3 border-b border-black/10 pb-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-2",
						children: [/* @__PURE__ */ jsx(Radio, { className: `w-4 h-4 text-violet-600 ${pulsing ? "animate-ping" : "animate-pulse"}` }), /* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold text-[#111] uppercase tracking-wider font-outfit",
							children: "Signal Breakdown"
						})]
					}), totalSignalsFired > 0 && /* @__PURE__ */ jsxs("span", {
						className: "text-[9px] font-bold font-mono text-[#888] uppercase",
						children: [totalSignalsFired, " fired"]
					})]
				}), accounts.length === 0 ? emptyState : /* @__PURE__ */ jsxs("div", {
					className: "flex-1 flex flex-col justify-center space-y-5",
					children: [sigCategories.map((cat, idx) => {
						const isHovered = hoveredSig === idx;
						const barW = mounted ? cat.count / maxSigCount * 100 : 0;
						const pct = totalSignalsFired > 0 ? Math.round(cat.count / totalSignalsFired * 100) : 0;
						return /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							onMouseEnter: () => setHoveredSig(idx),
							onMouseLeave: () => setHoveredSig(null),
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex items-center space-x-2",
									children: /* @__PURE__ */ jsx("span", {
										className: `px-1.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${cat.bg}`,
										children: cat.label
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center space-x-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono font-bold",
										style: { color: cat.color },
										children: cat.count
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[9px] text-[#666] font-mono",
										children: [pct, "%"]
									})]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-2.5 bg-[#fafafa] border border-black/10 rounded-full overflow-hidden cursor-pointer",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full rounded-full transition-all duration-700 ease-out",
									style: {
										width: `${barW}%`,
										backgroundColor: cat.color,
										opacity: isHovered ? 1 : .75,
										boxShadow: isHovered ? `0 0 10px ${cat.color}60` : "none",
										transitionDelay: `${idx * 100}ms`
									}
								})
							})]
						}, cat.label);
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-auto pt-3 border-t border-black/10 flex items-center space-x-2",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "relative flex h-1.5 w-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" })]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-[#888] font-medium",
							children: feedEvents.length > 0 ? `${feedEvents.length} live event${feedEvents.length !== 1 ? "s" : ""} captured` : "Waiting for live triggers..."
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/Dashboard/AccountsTable.tsx
function AccountsTable({ onRevealInsights }) {
	const { accounts, signals, userRole } = useIntelScout();
	const isMarketing = userRole === "marketing";
	const [searchTerm, setSearchTerm] = useState("");
	const [activeTierFilter, setActiveTierFilter] = useState("all");
	const [techFilter, setTechFilter] = useState("all");
	const allTechs = Array.from(new Set(accounts.reduce((acc, curr) => [...acc, ...curr.techStack], [])));
	const filteredAccounts = accounts.filter((acc) => {
		const matchesSearch = acc.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || acc.domain.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesTier = activeTierFilter === "all" || acc.priorityTier === activeTierFilter;
		const matchesTech = techFilter === "all" || acc.techStack.includes(techFilter);
		return matchesSearch && matchesTier && matchesTech;
	});
	const getTierBadgeClass = (tier) => {
		switch (tier) {
			case 1: return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
			case 2: return "bg-amber-500/10 text-amber-600 border-amber-500/20";
			case 3: return "bg-blue-500/10 text-blue-600 border-blue-500/20";
			default: return "bg-[#fafafa] text-[#666] border-black/10";
		}
	};
	const getTierName = (tier) => {
		switch (tier) {
			case 1: return "Tier 1 - Immediate";
			case 2: return "Tier 2 - This Week";
			case 3: return "Tier 3 - Nurture";
			default: return "Tier 4 - Monitor";
		}
	};
	const getScoreColor = (score) => {
		if (score >= 90) return "text-emerald-600";
		if (score >= 70) return "text-amber-600";
		if (score >= 50) return "text-blue-600";
		return "text-[#666]";
	};
	const exportToCSV = () => {
		if (accounts.length === 0) return;
		const headers = [
			"Company",
			"Domain",
			"Opportunity Score",
			"Priority Tier",
			"Fit Score",
			"Intent Score",
			"Timing Score",
			"Explainable Prioritization",
			"Economic Buyer",
			"Technical Buyer",
			"Recommended Contact",
			"Suggested Angle"
		];
		const rows = accounts.map((a) => [
			a.company_name,
			a.domain,
			a.opportunityScore,
			`Tier ${a.priorityTier}`,
			a.icpFit,
			a.intent,
			a.timing,
			a.reasons.join(" | "),
			a.buyingCommittee.economic,
			a.buyingCommittee.technical,
			a.gtmRecommendations.contact,
			a.gtmRecommendations.angle.replace(/,/g, ";")
		]);
		const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `intelscout_gtm_export_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white/80 backdrop-blur-md border border-black/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-black/10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ jsx(MagnifyingGlass, { className: "absolute left-3 top-2.5 w-4 h-4 text-[#888]" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Search companies or domains...",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value),
							className: "w-full bg-white border border-black/10 rounded-xl pl-9 pr-4 py-2 text-xs text-[#111] focus:outline-none focus:border-black/30 transition"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative shrink-0 flex items-center bg-white border border-black/10 rounded-xl px-2.5",
						children: [/* @__PURE__ */ jsx(Funnel, { className: "w-3.5 h-3.5 text-[#888] mr-2" }), /* @__PURE__ */ jsxs("select", {
							value: techFilter,
							onChange: (e) => setTechFilter(e.target.value),
							className: "bg-transparent text-xs text-[#333] py-2 focus:outline-none cursor-pointer pr-4 font-semibold",
							children: [/* @__PURE__ */ jsx("option", {
								value: "all",
								children: "All Technographics"
							}), allTechs.map((tech) => /* @__PURE__ */ jsx("option", {
								value: tech,
								children: tech
							}, tech))]
						})]
					})]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: exportToCSV,
					disabled: accounts.length === 0 || isMarketing,
					title: isMarketing ? "CSV Export restricted to Admin & Sales roles" : "Export accounts to CSV",
					className: "px-4 py-2 bg-[#fafafa] hover:bg-black/5 border border-black/10 disabled:opacity-40 text-[#333] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition shrink-0 cursor-pointer disabled:cursor-not-allowed",
					children: [/* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: isMarketing ? "Export Restricted" : "Export CSV" })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-1 mb-4 border-b border-black/10 pb-2",
				children: [
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTierFilter("all"),
						className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTierFilter === "all" ? "bg-[#fafafa] text-[#111] border border-black/10" : "text-[#555] hover:text-[#111]"}`,
						children: [
							"All Accounts (",
							accounts.length,
							")"
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTierFilter(1),
						className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${activeTierFilter === 1 ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600" : "text-[#555] hover:text-[#111]"}`,
						children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }), /* @__PURE__ */ jsxs("span", { children: [
							"Tier 1 (",
							accounts.filter((a) => a.priorityTier === 1).length,
							")"
						] })]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTierFilter(2),
						className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${activeTierFilter === 2 ? "bg-amber-500/10 border border-amber-500/20 text-amber-600" : "text-[#555] hover:text-[#111]"}`,
						children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }), /* @__PURE__ */ jsxs("span", { children: [
							"Tier 2 (",
							accounts.filter((a) => a.priorityTier === 2).length,
							")"
						] })]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTierFilter(3),
						className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${activeTierFilter === 3 ? "bg-blue-500/10 border border-blue-500/20 text-blue-600" : "text-[#555] hover:text-[#111]"}`,
						children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }), /* @__PURE__ */ jsxs("span", { children: [
							"Tier 3 (",
							accounts.filter((a) => a.priorityTier === 3).length,
							")"
						] })]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTierFilter(4),
						className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${activeTierFilter === 4 ? "bg-[#fafafa] border border-black/10 text-[#666]" : "text-[#555] hover:text-[#111]"}`,
						children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#888]" }), /* @__PURE__ */ jsxs("span", { children: [
							"Tier 4 (",
							accounts.filter((a) => a.priorityTier === 4).length,
							")"
						] })]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-x-auto min-h-[300px] scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left border-collapse",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b border-black/10 text-[10px] font-bold text-[#888] uppercase tracking-wider",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4",
								children: "Company"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4",
								children: "Opportunity Score"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4",
								children: "Priority Tier"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4",
								children: "Signals Detected"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3 px-4 text-right",
								children: "Action"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-black/5 text-xs",
						children: filteredAccounts.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 5,
							className: "py-16 text-center",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col items-center justify-center opacity-60",
								children: [/* @__PURE__ */ jsxs("svg", {
									width: "64",
									height: "64",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "mb-4 text-[#888]",
									children: [/* @__PURE__ */ jsx("path", { d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }), /* @__PURE__ */ jsx("line", {
										x1: "10",
										y1: "10",
										x2: "10",
										y2: "10",
										strokeWidth: "2"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[#555] font-semibold",
									children: "No accounts found matching current query or filters."
								})]
							})
						}) }) : filteredAccounts.map((account) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-[#fafafa] group transition",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 px-4",
									children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-[#111] group-hover:text-violet-600 transition",
										children: account.company_name
									}), /* @__PURE__ */ jsxs("a", {
										href: `https://${account.domain}`,
										target: "_blank",
										rel: "noreferrer",
										className: "text-[10px] text-[#666] hover:text-[#111] inline-flex items-center space-x-0.5 ml-2",
										children: [/* @__PURE__ */ jsx("span", { children: account.domain }), /* @__PURE__ */ jsx(ArrowSquareOut, { className: "w-2.5 h-2.5" })]
									})] })
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "py-3.5 px-4 font-mono font-bold",
									children: [/* @__PURE__ */ jsx("span", {
										className: getScoreColor(account.opportunityScore),
										children: account.opportunityScore
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-[#888]",
										children: " / 100"
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 px-4",
									children: /* @__PURE__ */ jsx("span", {
										className: `px-2 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-wider ${getTierBadgeClass(account.priorityTier)}`,
										children: getTierName(account.priorityTier)
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 px-4",
									children: /* @__PURE__ */ jsx("span", {
										className: "text-[#333] font-medium line-clamp-1 max-w-[240px]",
										children: account.reasons[0] || "No signal triggers detected."
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3.5 px-4 text-right",
									children: /* @__PURE__ */ jsxs("button", {
										onClick: () => onRevealInsights(account),
										className: "px-3 py-1.5 bg-white group-hover:bg-black border border-black/10 group-hover:border-black text-[#555] group-hover:text-white rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1.5 ml-auto transition shadow-sm",
										children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Drill Down" })]
									})
								})
							]
						}, account.id))
					})]
				})
			})
		]
	});
}
//#endregion
//#region src/components/Dashboard/CompanyDetailsDrawer.tsx
function CompanyDetailsDrawer({ account, onClose }) {
	const { signals, offer, credits, setCredits, userRole } = useIntelScout();
	const isMarketing = userRole === "marketing";
	const [isGenerating, setIsGenerating] = useState(false);
	const [aiResponse, setAiResponse] = useState(null);
	const [copySuccess, setCopySuccess] = useState(false);
	const [channel, setChannel] = useState("email");
	const [tone, setTone] = useState("professional");
	const [customPrompt, setCustomPrompt] = useState("");
	const [loadingStep, setLoadingStep] = useState("");
	if (!account) return null;
	const generateOutreachContent = (acc, off, chan, t, promptText) => {
		const championName = acc.buyingCommittee.champion;
		const championFirstName = championName.split(" ")[0] || "there";
		const company = acc.company_name;
		const detectedTech = acc.techStack.slice(0, 2).join(" and ") || "your tech stack";
		getOfferCategory(off.sell);
		const lowerPrompt = promptText.toLowerCase();
		const isShort = lowerPrompt.includes("short") || lowerPrompt.includes("brief") || lowerPrompt.includes("under") || lowerPrompt.includes("limit");
		let subject = "";
		let body = "";
		if (chan === "email") {
			if (t === "professional") subject = `Regarding GTM scalability and operational overhead at ${company}`;
			else if (t === "friendly") subject = `Quick question about ${company}'s tech stack`;
			else if (t === "bold") subject = `Scaling pipeline at ${company} - direct offer`;
			else subject = `Free audit report regarding GTM efficiency for ${company}`;
			if (t === "professional") body = `Hi ${championFirstName},

I hope this email finds you well. I'm reaching out because I noticed ${company} is currently expanding its operational footprint while utilizing ${detectedTech}. 

As you navigate this stage of growth, managing pipeline efficiency can divert considerable focus from your core development cycles. We built ${off.sell} specifically to resolve this bottleneck—helping teams automate target segments, personalize outreach, and address identified operational friction.

Given your role as ${acc.buyingCommittee.champion}, I wanted to see if you'd be open to a brief 10-minute introductory call next Tuesday at 10 AM to discuss how we might optimize similar workflows at ${company}?

Best regards,

[Your Name]
GTM Analyst, IntelScout`;
			else if (t === "friendly") body = `Hi ${championFirstName},

Hope you're having a great week! 

I was browsing through ${company}'s technographics and noticed you guys are running a stack with ${detectedTech}. It's a solid setup, but we've found that scaling teams often run into manual bottlenecks when mapping data triggers to active campaigns.

We developed ${off.sell} as a simple solution to automate that entire flow, saving teams about 15-20 hours a week. Just wanted to drop you a quick line and see if you'd be interested in taking a look at a 2-minute demo?

Cheers,

[Your Name]
IntelScout`;
			else if (t === "bold") body = `Hi ${championFirstName},

Let's skip the fluff. Right now, ${company} is hiring for core roles, which usually indicates an influx of operational overhead and potential process leaks.

We solve this problem at its root. With ${off.sell}, we help organizations pass compliance checks, optimize sales pipeline speed, and reduce CPA by up to 40% using automated target intelligence.

Are you open to a direct 10-minute call this Thursday at 2 PM to see if we're a fit for ${company}? If not, no worries at all.

Best,

[Your Name]
Outbound Lead, IntelScout`;
			else body = `Hi ${championFirstName},

I hope you're doing well. I put together a quick, custom analysis of ${company}'s current public indicators. 

Based on your tech stack involving ${detectedTech} and active growth triggers, we've identified three specific areas where outbound operational efficiency could be improved:
1. Automated segment alignment to eliminate manual data entry.
2. Real-time signal tracking to optimize campaign timing.
3. Tech stack synchronization to prevent prospect leakage.

We've automated these fixes via ${off.sell}. If you'd like, I can send over the full PDF report or discuss the findings in a quick 5-minute sync?

Warm regards,

[Your Name]
GTM Architect, IntelScout`;
			if (isShort) body = `Hi ${championFirstName},\n\nI noticed ${company} is scaling and using ${detectedTech}. We built ${off.sell} to specifically automate target qualification, cutting manual work by 50%.\n\nWould you be open to a 5-minute call next Tuesday at 11 AM to see how this fits your roadmap?\n\nBest,\n[Your Name]`;
			return `Subject: ${subject}\n\n${body}`;
		} else if (chan === "linkedin") {
			if (t === "professional") body = `Hi ${championFirstName}, I noticed your role as ${acc.buyingCommittee.champion} at ${company}. Given your stack with ${detectedTech}, I'd love to connect to share insights on how other growing teams are automating GTM pipelines and reducing developer overhead. Let's connect!`;
			else if (t === "friendly") body = `Hi ${championFirstName}! I saw you're leading team workflows at ${company}. Love what you guys are building. Would love to connect and keep up with your growth milestones this year. Cheers!`;
			else if (t === "bold") body = `Hey ${championFirstName}, congrats on the recent growth triggers at ${company}! If you're looking to automate outbound outreach and solve GTM leaks, let's connect. I have a brief idea that might save your team 20+ hours a week.`;
			else body = `Hi ${championFirstName}, I compiled a short technographic comparison report for ${company} showing optimizations for ${detectedTech}. I'd love to connect and send it over if you find it interesting.`;
			if (promptText) body += `\n\n[Custom instructions applied: "${promptText}"]`;
			return body;
		} else return `[Cold Call Script - Tone: ${t.toUpperCase()}]
[Target Info: ${company} | Champion: ${championName} (${acc.buyingCommittee.champion})]

📞 INTRO:
"Hi ${championName}, this is [Your Name] from IntelScout. I know I caught you out of the blue, do you have 45 seconds to see if this is worth your time?"

🚀 ELEVATOR PITCH:
"The reason I'm calling is I noticed ${company} is using ${detectedTech} and scaling active hiring. Typically, ${acc.buyingCommittee.champion}s tell us they are wasting hours of engineering cycles or sales time manually mapping compliance and outreach targets.
We built ${off.sell} to automate that entire signal qualification, allowing you to pass reviews in days and scale pipeline with zero manual input."

🙋 OBJECTIONS:
- If "Too busy": "Completely understand. That's why I wanted to schedule a specific 10-minute slot next Tuesday at 11 AM so we don't disrupt your day. Does that work?"
- If "No budget": "No problem, we aren't asking for budget today. I just want to show you how we cut setup costs by 40% so you have the data for when you are ready."

🎯 THE CTA:
"Do you have your calendar handy for a quick 10-minute Zoom call next Wednesday at 2 PM to explore this?"

${promptText ? `[Note: Custom instruction: "${promptText}"]` : ""}`;
	};
	const handleGenerateOutreach = () => {
		if (isMarketing || credits <= 0) return;
		setIsGenerating(true);
		setAiResponse(null);
		setLoadingStep("Scanning target company technographics...");
		setCredits(credits - 1);
		setTimeout(() => {
			setLoadingStep("Identifying Buying Committee champion...");
			setTimeout(() => {
				setLoadingStep("Synthesizing buying trigger points...");
				setTimeout(() => {
					setLoadingStep("Drafting custom pitch copy with GPT-4...");
					setTimeout(() => {
						setAiResponse(generateOutreachContent(account, offer, channel, tone, customPrompt));
						setIsGenerating(false);
						setLoadingStep("");
					}, 600);
				}, 500);
			}, 500);
		}, 500);
	};
	const handleCopyEmail = () => {
		if (!aiResponse) return;
		navigator.clipboard.writeText(aiResponse);
		setCopySuccess(true);
		setTimeout(() => setCopySuccess(false), 2e3);
	};
	const getTierName = (tier) => {
		switch (tier) {
			case 1: return "Tier 1 - Contact Immediately";
			case 2: return "Tier 2 - Contact This Week";
			case 3: return "Tier 3 - Nurture";
			default: return "Tier 4 - Monitor";
		}
	};
	const getTierColor = (tier) => {
		switch (tier) {
			case 1: return "text-emerald-600 border-emerald-500/20 bg-emerald-500/10";
			case 2: return "text-amber-600 border-amber-500/20 bg-amber-500/10";
			case 3: return "text-blue-600 border-blue-500/20 bg-blue-500/10";
			default: return "text-[#666] border-black/10 bg-[#fafafa]";
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 flex justify-end",
		children: [/* @__PURE__ */ jsx(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: .5 },
			exit: { opacity: 0 },
			onClick: onClose,
			className: "absolute inset-0 bg-black backdrop-blur-sm"
		}), /* @__PURE__ */ jsxs(motion.div, {
			initial: { x: "100%" },
			animate: { x: 0 },
			exit: { x: "100%" },
			transition: {
				type: "spring",
				damping: 20,
				stiffness: 100
			},
			className: "relative w-full max-w-lg bg-[#fafafa] border-l border-black/10 shadow-2xl h-full z-10 flex flex-col overflow-y-auto",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "p-6 border-b border-black/10 flex items-center justify-between bg-white",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("span", {
						className: `px-2 py-0.5 border rounded-lg text-[9px] font-bold uppercase tracking-wider ${getTierColor(account.priorityTier)}`,
						children: getTierName(account.priorityTier)
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold text-[#111] tracking-tight mt-1.5 font-outfit",
						children: account.company_name
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-[#666] font-medium",
						children: account.domain
					})
				] }), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "p-1.5 hover:bg-black/5 rounded-lg text-[#888] hover:text-[#111] transition",
					children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-6 space-y-6 flex-1 bg-white",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#fafafa] border border-black/10 rounded-xl p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center mb-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-bold text-[#888] uppercase tracking-wider block",
									children: "Explainable Qualification Score"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-2xl font-black font-outfit text-[#111]",
									children: [account.opportunityScore, /* @__PURE__ */ jsx("span", {
										className: "text-xs font-normal text-[#888]",
										children: " / 100"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "h-2 w-full bg-black/5 border border-black/10 rounded-full overflow-hidden flex mb-4",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "h-full bg-emerald-500",
										style: { width: `${account.icpFit * .4}%` },
										title: "ICP Fit contribution"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "h-full bg-amber-500",
										style: { width: `${account.intent * .25}%` },
										title: "Intent contribution"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "h-full bg-blue-500",
										style: { width: `${account.timing * .15}%` },
										title: "Timing contribution"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "h-full bg-purple-500",
										style: { width: `${account.signalScore * .2}%` },
										title: "Signal contribution"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-4 gap-2 text-center text-[10px] text-[#555]",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "bg-white border border-black/10 rounded-lg p-2",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-emerald-600 font-mono",
											children: account.icpFit
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[8px] text-[#888] uppercase font-semibold mt-0.5",
											children: "ICP Fit (40%)"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "bg-white border border-black/10 rounded-lg p-2",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-amber-600 font-mono",
											children: account.intent
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[8px] text-[#888] uppercase font-semibold mt-0.5",
											children: "Intent (25%)"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "bg-white border border-black/10 rounded-lg p-2",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-blue-600 font-mono",
											children: account.timing
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[8px] text-[#888] uppercase font-semibold mt-0.5",
											children: "Timing (15%)"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "bg-white border border-black/10 rounded-lg p-2",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-purple-600 font-mono",
											children: account.signalScore
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[8px] text-[#888] uppercase font-semibold mt-0.5",
											children: "Signals (20%)"
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-2 text-[#333] mb-3 border-b border-black/10 pb-2",
						children: [/* @__PURE__ */ jsx(Lightbulb, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold uppercase tracking-wider text-[#111] font-outfit",
							children: "Qualification Reasons"
						})]
					}), /* @__PURE__ */ jsx("ul", {
						className: "space-y-2.5",
						children: account.reasons.map((reason, idx) => /* @__PURE__ */ jsxs("li", {
							className: "flex items-start space-x-2.5 text-xs text-[#555]",
							children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-violet-600 rounded-full mt-1.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: reason })]
						}, idx))
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-2 text-[#333] mb-3 border-b border-black/10 pb-2",
						children: [/* @__PURE__ */ jsx(Compass, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold uppercase tracking-wider text-[#111] font-outfit",
							children: "Technographics Detected"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-1.5",
						children: account.techStack.map((tech, idx) => /* @__PURE__ */ jsx("span", {
							className: "px-2 py-1 bg-[#fafafa] border border-black/10 rounded-lg text-xs font-medium text-[#555]",
							children: tech
						}, idx))
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-2 text-[#333] mb-3 border-b border-black/10 pb-2",
						children: [/* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold uppercase tracking-wider text-[#111] font-outfit",
							children: "Buying Committee Map"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-2 text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "bg-[#fafafa] border border-black/10 rounded-xl p-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-bold text-[#888] uppercase tracking-wider",
									children: "Economic Buyer"
								}), /* @__PURE__ */ jsx("p", {
									className: "font-semibold text-[#111] mt-0.5",
									children: account.buyingCommittee.economic
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-[#fafafa] border border-black/10 rounded-xl p-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-bold text-[#888] uppercase tracking-wider",
									children: "Technical Buyer"
								}), /* @__PURE__ */ jsx("p", {
									className: "font-semibold text-[#111] mt-0.5",
									children: account.buyingCommittee.technical
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-[#fafafa] border border-black/10 rounded-xl p-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-bold text-[#888] uppercase tracking-wider",
									children: "GTM Champion"
								}), /* @__PURE__ */ jsx("p", {
									className: "font-semibold text-[#111] mt-0.5",
									children: account.buyingCommittee.champion
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-[#fafafa] border border-black/10 rounded-xl p-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-bold text-[#888] uppercase tracking-wider",
									children: "Target User"
								}), /* @__PURE__ */ jsx("p", {
									className: "font-semibold text-[#111] mt-0.5",
									children: account.buyingCommittee.endUser
								})]
							})
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-2 text-[#333] mb-3 border-b border-black/10 pb-2",
						children: [/* @__PURE__ */ jsx(PaperPlane, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold uppercase tracking-wider text-[#111] font-outfit",
							children: "Outbound GTM Recommendation"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-[#fafafa] border border-black/10 rounded-xl p-4.5 space-y-3.5 text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-[9px] font-bold text-[#888] uppercase tracking-wider block",
								children: "Recommended Contact Persona"
							}), /* @__PURE__ */ jsx("p", {
								className: "font-semibold text-[#111] mt-0.5",
								children: account.gtmRecommendations.contact
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-[9px] font-bold text-[#888] uppercase tracking-wider block",
								children: "Why They Care / Motivation Trigger"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[#333] mt-0.5 leading-relaxed",
								children: account.gtmRecommendations.reason
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-[9px] font-bold text-[#888] uppercase tracking-wider block",
								children: "Identified Target Pain"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[#333] mt-0.5 leading-relaxed",
								children: account.gtmRecommendations.pain
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "p-3 bg-violet-50 border border-violet-100 rounded-lg",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-bold text-violet-600 uppercase tracking-wider block",
									children: "Suggested Pitch Angle"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[#111] font-medium mt-1 leading-relaxed italic",
									children: [
										"“",
										account.gtmRecommendations.angle,
										"”"
									]
								})]
							})
						]
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "border-t border-black/10 pt-6 space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-2 border-b border-black/10",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center space-x-2 text-[#555]",
								children: [/* @__PURE__ */ jsx(Sparkle, { className: "w-4 h-4 text-violet-600 animate-pulse" }), /* @__PURE__ */ jsx("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-[#111] font-outfit",
									children: "AI Outreach Copilot"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center space-x-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-mono text-[#888] uppercase",
									children: "Limit:"
								}), /* @__PURE__ */ jsxs("span", {
									className: `px-2 py-0.5 rounded font-mono text-[9px] font-bold ${credits > 0 ? "bg-[#fafafa] border border-black/10 text-violet-600" : "bg-red-50 border border-red-200 text-red-600"}`,
									children: [credits, " / 5 req/min"]
								})]
							})]
						}), isMarketing ? /* @__PURE__ */ jsxs("div", {
							className: "p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start space-x-3 text-xs leading-normal",
							children: [/* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-red-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "font-bold block uppercase tracking-wide mb-0.5",
								children: "Access Restricted"
							}), /* @__PURE__ */ jsx("span", { children: "AI outreach response generation is restricted to Sales and GTM Administrator roles. Switch your role in the navigation bar to proceed." })] })]
						}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold text-[#888] uppercase tracking-wider block mb-2",
								children: "Select Channel"
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-3 gap-1.5",
								children: [
									/* @__PURE__ */ jsxs("button", {
										onClick: () => {
											setChannel("email");
											setAiResponse(null);
										},
										className: `py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${channel === "email" ? "bg-violet-50 border-violet-200 text-violet-600" : "bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-[#111]"}`,
										children: [/* @__PURE__ */ jsx(PaperPlane, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Email" })]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => {
											setChannel("linkedin");
											setAiResponse(null);
										},
										className: `py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${channel === "linkedin" ? "bg-violet-50 border-violet-200 text-violet-600" : "bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-[#111]"}`,
										children: [/* @__PURE__ */ jsx(Chat, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "LinkedIn" })]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => {
											setChannel("call");
											setAiResponse(null);
										},
										className: `py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${channel === "call" ? "bg-violet-50 border-violet-200 text-violet-600" : "bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-[#111]"}`,
										children: [/* @__PURE__ */ jsx(PhoneCall, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Call Script" })]
									})
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold text-[#888] uppercase tracking-wider block mb-2",
								children: "Outreach Tone"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-4 gap-1",
								children: [
									"professional",
									"friendly",
									"bold",
									"value"
								].map((t) => /* @__PURE__ */ jsx("button", {
									onClick: () => {
										setTone(t);
										setAiResponse(null);
									},
									className: `py-1.5 border rounded-lg text-[9px] font-bold uppercase tracking-wider transition capitalize cursor-pointer ${tone === t ? "bg-black border-black text-white" : "bg-[#fafafa] border-black/10 text-[#555] hover:text-[#111] hover:bg-black/5"}`,
									children: t
								}, t))
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								htmlFor: "custom-prompt",
								className: "text-[10px] font-bold text-[#888] uppercase tracking-wider block mb-2",
								children: "Additional Instructions / Context"
							}), /* @__PURE__ */ jsx("textarea", {
								id: "custom-prompt",
								rows: 2,
								value: customPrompt,
								onChange: (e) => setCustomPrompt(e.target.value),
								placeholder: "e.g. Keep under 80 words, mention competitor is Stripe, focus on database caching speed...",
								className: "w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-300 transition resize-none"
							})] }),
							credits <= 0 && /* @__PURE__ */ jsxs("div", {
								className: "p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl flex items-start space-x-2.5 text-xs leading-normal",
								children: [/* @__PURE__ */ jsx(Lightning, { className: "w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" }), /* @__PURE__ */ jsx("span", { children: "Rate limit exceeded (5 requests/min). AI quota resets in 15 seconds. Please wait or upgrade." })]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: handleGenerateOutreach,
								disabled: isGenerating || credits <= 0,
								className: "w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-violet-600/10 font-outfit cursor-pointer disabled:cursor-not-allowed",
								children: [isGenerating ? /* @__PURE__ */ jsx(CircleNotch, { className: "w-4 h-4 shrink-0 animate-spin" }) : /* @__PURE__ */ jsx(Sparkle, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: isGenerating ? "AI Outreach Agent working..." : "Generate AI Outreach Copy" })]
							}),
							isGenerating && /* @__PURE__ */ jsxs("div", {
								className: "p-4 bg-white border border-black/10 rounded-xl flex items-center space-x-3 text-xs text-[#555]",
								children: [/* @__PURE__ */ jsx(CircleNotch, { className: "w-4 h-4 text-violet-600 animate-spin shrink-0" }), /* @__PURE__ */ jsx("span", {
									className: "animate-pulse font-medium",
									children: loadingStep
								})]
							}),
							aiResponse && !isGenerating && /* @__PURE__ */ jsxs("div", {
								className: "bg-[#fafafa] border border-black/10 rounded-xl p-4 relative group",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between items-center mb-2.5 pb-2 border-b border-black/10",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[9px] font-bold text-violet-600 uppercase tracking-wider block",
										children: "AI Generated Outbound Copy"
									}), /* @__PURE__ */ jsx("button", {
										onClick: handleCopyEmail,
										className: "text-[10px] text-[#888] hover:text-[#111] font-semibold transition cursor-pointer flex items-center space-x-1",
										children: copySuccess ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ jsx("span", {
											className: "text-emerald-600",
											children: "Copied!"
										})] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Clipboard, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Copy" })] })
									})]
								}), /* @__PURE__ */ jsx("pre", {
									className: "text-[11px] text-[#333] leading-relaxed font-mono whitespace-pre-wrap break-words",
									children: aiResponse
								})]
							})
						] })]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/components/Dashboard/IntelligenceFeed.tsx
function IntelligenceFeed() {
	const { feedEvents } = useIntelScout();
	const getEventIcon = (type) => {
		switch (type) {
			case "strong": return /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-600" });
			case "medium": return /* @__PURE__ */ jsx(Flame, { className: "w-4 h-4 text-amber-600" });
			default: return /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 text-blue-600" });
		}
	};
	const getEventBorderColor = (type) => {
		switch (type) {
			case "strong": return "border-emerald-500/20 bg-emerald-500/10";
			case "medium": return "border-amber-500/20 bg-amber-500/10";
			default: return "border-blue-500/20 bg-blue-500/10";
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white/80 backdrop-blur-md border border-black/10 rounded-xl p-5 shadow-sm flex flex-col h-full overflow-hidden min-h-[400px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center space-x-2 mb-4 border-b border-black/10 pb-3",
				children: [/* @__PURE__ */ jsx(Pulse, { className: "w-4 h-4 text-violet-600 animate-pulse" }), /* @__PURE__ */ jsx("h3", {
					className: "text-xs font-bold text-[#111] uppercase tracking-wider font-outfit",
					children: "Live GTM Signal Feed"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-[10px] text-[#666] mb-4",
				children: "Dynamic intent triggers crawling from domain headers, job listings, and news channels in real-time."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent",
				children: /* @__PURE__ */ jsx(AnimatePresence, {
					initial: false,
					children: feedEvents.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "h-full flex flex-col items-center justify-center text-center py-20",
						children: [/* @__PURE__ */ jsx(Pulse, { className: "w-8 h-8 text-[#ccc] mb-2.5 animate-spin" }), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-[#888] font-medium",
							children: "Listening for GTM trigger webhooks..."
						})]
					}) : feedEvents.map((event) => /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: -20,
							height: 0
						},
						animate: {
							opacity: 1,
							y: 0,
							height: "auto"
						},
						exit: {
							opacity: 0,
							scale: .95
						},
						transition: {
							type: "spring",
							damping: 15,
							stiffness: 150
						},
						className: `p-3.5 border rounded-xl flex items-start space-x-3 hover:border-black/20 transition ${getEventBorderColor(event.type)}`,
						children: [/* @__PURE__ */ jsx("div", {
							className: "p-1.5 bg-white border border-black/10 rounded-lg shrink-0 mt-0.5",
							children: getEventIcon(event.type)
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold text-[#111] truncate font-outfit",
									children: event.companyName
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-mono text-[#888] shrink-0",
									children: event.timestamp
								})]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-[#555] mt-1 leading-normal",
								children: event.text
							})]
						})]
					}, event.id))
				})
			})
		]
	});
}
//#endregion
//#region src/components/Dashboard/SettingsPanel.tsx
function SettingsPanel() {
	const { signals, setSignals, recalculateScores, userRole } = useIntelScout();
	const [saveSuccess, setSaveSuccess] = React.useState(false);
	const isSales = userRole === "sales";
	const handleToggleSignal = (id) => {
		if (isSales) return;
		setSignals(signals.map((sig) => sig.id === id ? {
			...sig,
			enabled: !sig.enabled
		} : sig));
	};
	const handleWeightChange = (id, weight) => {
		if (isSales) return;
		setSignals(signals.map((sig) => sig.id === id ? {
			...sig,
			weight
		} : sig));
	};
	const handleApplyConfig = () => {
		if (isSales) return;
		recalculateScores();
		setSaveSuccess(true);
		setTimeout(() => setSaveSuccess(false), 2e3);
	};
	const [prefLocation, setPrefLocation] = React.useState("Global");
	const [prefFirmographics, setPrefFirmographics] = React.useState("Mid-Market");
	const [prefSalesCycle, setPrefSalesCycle] = React.useState("Medium (3-6m)");
	React.useEffect(() => {
		if (isSales) return;
		let updated = [...signals];
		updated = updated.map((sig) => {
			let weight = sig.weight;
			let enabled = sig.enabled;
			if (prefLocation === "EMEA" && sig.id === "regional_exp") {
				weight = 45;
				enabled = true;
			} else if (prefLocation !== "EMEA" && sig.id === "regional_exp") weight = 15;
			if (prefFirmographics === "Enterprise") {
				if (sig.id === "compliance_cert" || sig.id === "tech_install" || sig.id === "exec_hire") {
					weight = 40;
					enabled = true;
				}
				if (sig.id === "funding") {
					weight = 5;
					enabled = false;
				}
			} else if (prefFirmographics === "SMB") {
				if (sig.id === "funding" || sig.id === "headcount_growth") {
					weight = 35;
					enabled = true;
				}
				if (sig.id === "compliance_cert" || sig.id === "exec_hire") {
					weight = 5;
					enabled = false;
				}
			}
			if (prefSalesCycle === "Short (1-3m)") {
				if (sig.id === "pricing_update" || sig.id === "tech_install") {
					weight = 30;
					enabled = true;
				}
				if (sig.category === "weak") enabled = false;
			} else if (prefSalesCycle === "Long (6m+)") {
				if (sig.id === "exec_hire" || sig.id === "dept_hiring" || sig.id === "specialty_role") {
					weight = 35;
					enabled = true;
				}
			}
			return {
				...sig,
				weight: Math.min(50, Math.max(1, weight)),
				enabled
			};
		});
		if (updated.some((u, i) => u.weight !== signals[i].weight || u.enabled !== signals[i].enabled)) setSignals(updated);
	}, [
		prefLocation,
		prefFirmographics,
		prefSalesCycle,
		isSales
	]);
	const strongSigs = signals.filter((s) => s.category === "strong");
	const mediumSigs = signals.filter((s) => s.category === "medium");
	const weakSigs = signals.filter((s) => s.category === "weak");
	const renderSignalRow = (sig) => /* @__PURE__ */ jsxs("div", {
		className: `flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#fafafa] border border-black/10 rounded-xl transition shadow-sm ${sig.enabled ? "border-black/20" : "opacity-40 border-black/10"}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-3 sm:w-1/2",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				disabled: isSales,
				onClick: () => handleToggleSignal(sig.id),
				className: `focus:outline-none transition ${isSales ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${sig.enabled ? "text-violet-600" : "text-[#888]"}`,
				children: sig.enabled ? /* @__PURE__ */ jsx(ToggleRight, { className: "w-8 h-8" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "w-8 h-8" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold text-[#111]",
				children: sig.name
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-[10px] text-[#666] font-mono",
				children: ["ID: ", sig.id]
			})] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center space-x-4 mt-3 sm:mt-0 flex-1 justify-end",
			children: [/* @__PURE__ */ jsx("input", {
				type: "range",
				min: "1",
				max: "50",
				value: sig.weight,
				disabled: !sig.enabled || isSales,
				onChange: (e) => handleWeightChange(sig.id, parseInt(e.target.value)),
				className: "w-full sm:w-44 h-1 bg-[#e0e0e0] rounded-lg appearance-none cursor-pointer accent-violet-600 disabled:opacity-30 disabled:cursor-not-allowed"
			}), /* @__PURE__ */ jsxs("span", {
				className: "text-xs font-mono font-bold text-[#333] w-12 text-right",
				children: [
					"+",
					sig.weight,
					" pts"
				]
			})]
		})]
	}, sig.id);
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white border border-black/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full",
		children: [
			isSales && /* @__PURE__ */ jsxs("div", {
				className: "mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start space-x-3 text-xs leading-normal",
				children: [/* @__PURE__ */ jsx(Sliders, { className: "w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "font-bold block uppercase tracking-wide mb-0.5",
					children: "Read-Only Mode"
				}), /* @__PURE__ */ jsx("span", { children: "Your role (Sales Representative) does not have privileges to alter GTM signal configurations. Contact your GTM administrator to customize weights." })] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8 p-4 bg-[#f8f9fa] border border-black/10 rounded-xl",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-xs font-bold text-[#111] uppercase tracking-widest font-outfit mb-4",
						children: "Targeting Preferences"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[10px] font-bold text-[#666] mb-1.5 uppercase tracking-wide",
									children: "Location"
								}), /* @__PURE__ */ jsxs("select", {
									value: prefLocation,
									onChange: (e) => setPrefLocation(e.target.value),
									disabled: isSales,
									className: "text-sm px-3 py-2 border border-black/10 rounded-lg bg-white focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-shadow disabled:opacity-50",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "Global",
											children: "Global"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "North America",
											children: "North America"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "EMEA",
											children: "EMEA"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "APAC",
											children: "APAC"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "LATAM",
											children: "LATAM"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[10px] font-bold text-[#666] mb-1.5 uppercase tracking-wide",
									children: "Firmographics"
								}), /* @__PURE__ */ jsxs("select", {
									value: prefFirmographics,
									onChange: (e) => setPrefFirmographics(e.target.value),
									disabled: isSales,
									className: "text-sm px-3 py-2 border border-black/10 rounded-lg bg-white focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-shadow disabled:opacity-50",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "SMB",
											children: "SMB (1-50)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Mid-Market",
											children: "Mid-Market (51-500)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Enterprise",
											children: "Enterprise (500+)"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[10px] font-bold text-[#666] mb-1.5 uppercase tracking-wide",
									children: "Sales Cycle"
								}), /* @__PURE__ */ jsxs("select", {
									value: prefSalesCycle,
									onChange: (e) => setPrefSalesCycle(e.target.value),
									disabled: isSales,
									className: "text-sm px-3 py-2 border border-black/10 rounded-lg bg-white focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-shadow disabled:opacity-50",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "Short (1-3m)",
											children: "Short (1-3m)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Medium (3-6m)",
											children: "Medium (3-6m)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Long (6m+)",
											children: "Long (6m+)"
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-[10px] text-[#777] mt-3 font-mono",
						children: "Modifying these preferences dynamically recalibrates the underlying intelligence signals."
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between pb-4 border-b border-black/10 mb-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-bold text-[#111] uppercase tracking-wider font-outfit",
					children: "Qualification Weighting Center"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[10px] text-[#666]",
					children: "Manually fine-tune dynamic signal weights. Changes will impact Opportunity Scores."
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: handleApplyConfig,
					disabled: isSales,
					className: `px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition ${isSales ? "bg-[#fafafa] text-[#888] border border-black/10 cursor-not-allowed opacity-50" : saveSuccess ? "bg-emerald-600 text-white" : "bg-black hover:bg-[#222] text-white shadow-sm cursor-pointer"}`,
					children: saveSuccess ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Applied!" })] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(ArrowsCounterClockwise, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Apply & Recalculate" })] })
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-6 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-[9px] font-bold tracking-widest text-emerald-600 uppercase block mb-3",
						children: "Strong Signal Weights"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: strongSigs.map(renderSignalRow)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-[9px] font-bold tracking-widest text-blue-600 uppercase block mb-3",
						children: "Medium Signal Weights"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: mediumSigs.map(renderSignalRow)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-[9px] font-bold tracking-widest text-[#555] uppercase block mb-3",
						children: "Weak Signal Weights"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: weakSigs.map(renderSignalRow)
					})] })
				]
			})
		]
	});
}
//#endregion
//#region src/components/Dashboard/AudiencePanel.tsx
function AudiencePanel() {
	const [activeSubTab, setActiveSubTab] = useState("users");
	const [users, setUsers] = useState([]);
	const [subscribers, setSubscribers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const fetchData = async () => {
		setLoading(true);
		setError("");
		try {
			const usersRes = await fetch("/api/auth/users");
			const usersData = await usersRes.json();
			const subsRes = await fetch("/api/newsletter/subscribers");
			const subsData = await subsRes.json();
			if (usersRes.ok && usersData.success) setUsers(usersData.users || []);
			else setError(usersData.error || "Failed to retrieve registered users.");
			if (subsRes.ok && subsData.success) setSubscribers(subsData.subscribers || []);
			else setError(subsData.error || "Failed to retrieve newsletter subscribers.");
		} catch (err) {
			setError("Failed to fetch data from the server API. Confirm the server is running.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	const formatDate = (isoString) => {
		try {
			return new Date(isoString).toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		} catch (e) {
			return isoString;
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white border border-black/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between pb-4 border-b border-black/10 mb-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-bold text-[#111] uppercase tracking-wider font-outfit",
					children: "Stored Audience & Auth Logs"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[10px] text-[#666]",
					children: "Direct server-side view of registered Google users and newsletter subscribers stored in local JSON files."
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: fetchData,
					disabled: loading,
					className: "px-3.5 py-2 text-xs font-bold bg-[#fafafa] border border-black/10 hover:bg-black/5 text-[#555] hover:text-[#111] rounded-xl flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50",
					children: [loading ? /* @__PURE__ */ jsx(CircleNotch, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(ArrowsCounterClockwise, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Refresh Data" })]
				})]
			}),
			error && /* @__PURE__ */ jsx("div", {
				className: "mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs",
				children: error
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center space-x-1.5 bg-[#fafafa] p-1 border border-black/10 rounded-xl mb-5 w-fit",
				children: [/* @__PURE__ */ jsxs("button", {
					onClick: () => setActiveSubTab("users"),
					className: `px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${activeSubTab === "users" ? "bg-black text-white shadow-sm" : "text-[#666] hover:text-[#111]"}`,
					children: [
						"Google Registrations (",
						users.length,
						")"
					]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: () => setActiveSubTab("subscribers"),
					className: `px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${activeSubTab === "subscribers" ? "bg-black text-white shadow-sm" : "text-[#666] hover:text-[#111]"}`,
					children: [
						"Newsletter Subscribers (",
						subscribers.length,
						")"
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent",
				children: loading ? /* @__PURE__ */ jsxs("div", {
					className: "h-64 flex flex-col items-center justify-center space-y-2.5",
					children: [/* @__PURE__ */ jsx(CircleNotch, { className: "w-8 h-8 text-violet-600 animate-spin" }), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-[#555] font-semibold",
						children: "Loading data logs from server..."
					})]
				}) : activeSubTab === "users" ? users.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "h-64 flex flex-col items-center justify-center border border-dashed border-black/20 rounded-xl text-center p-6",
					children: [
						/* @__PURE__ */ jsx(ShieldCheck, { className: "w-10 h-10 text-[#ccc] mb-3 animate-pulse" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold text-[#888] uppercase tracking-wide",
							children: "No Google Accounts Registered"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[10px] text-[#666] max-w-xs mt-1 leading-relaxed",
							children: "Log out and sign in using the simulated Google Account selector to see records appear here."
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "border border-black/10 rounded-xl overflow-hidden bg-white",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-[#fafafa] border-b border-black/10 text-[9px] font-bold text-[#666] uppercase tracking-widest",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "User Profile"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Email Address"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Provider"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Created At"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-black/5",
							children: users.map((u, i) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-[#fafafa] text-xs transition duration-150",
								children: [
									/* @__PURE__ */ jsxs("td", {
										className: "p-3.5 flex items-center space-x-2.5",
										children: [/* @__PURE__ */ jsx("img", {
											src: u.avatar,
											alt: u.name,
											className: "w-7 h-7 rounded-full border border-black/10 bg-[#fafafa] p-0.5"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-bold text-[#111] leading-none",
											children: u.name
										})]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3.5 font-medium text-[#555]",
										children: u.email
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3.5",
										children: /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-md text-[9px] font-bold uppercase tracking-wider",
											children: [/* @__PURE__ */ jsx(UserCheck, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ jsx("span", { children: "Google" })]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3.5 font-mono text-[10px] text-[#888]",
										children: formatDate(u.createdAt)
									})
								]
							}, i))
						})]
					})
				}) : subscribers.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "h-64 flex flex-col items-center justify-center border border-dashed border-black/20 rounded-xl text-center p-6",
					children: [
						/* @__PURE__ */ jsx(EnvelopeOpen, { className: "w-10 h-10 text-[#ccc] mb-3 animate-pulse" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold text-[#888] uppercase tracking-wide",
							children: "No Newsletter Subscribers"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[10px] text-[#666] max-w-xs mt-1 leading-relaxed",
							children: "Subscribe via the Newsletter Form on the Landing Page to see subscribers list update."
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "border border-black/10 rounded-xl overflow-hidden bg-white",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-[#fafafa] border-b border-black/10 text-[9px] font-bold text-[#666] uppercase tracking-widest",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Subscriber Email"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3.5",
									children: "Subscribed Date"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-black/5",
							children: subscribers.map((s, i) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-[#fafafa] text-xs transition duration-150",
								children: [
									/* @__PURE__ */ jsxs("td", {
										className: "p-3.5 font-semibold text-[#111] flex items-center space-x-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "p-1 bg-violet-50 border border-violet-200 text-violet-600 rounded-md",
											children: /* @__PURE__ */ jsx(EnvelopeOpen, { className: "w-3.5 h-3.5" })
										}), /* @__PURE__ */ jsx("span", { children: s.email })]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3.5",
										children: /* @__PURE__ */ jsx("span", {
											className: "inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-md text-[9px] font-bold uppercase tracking-wider",
											children: /* @__PURE__ */ jsx("span", { children: "Active" })
										})
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "p-3.5 font-mono text-[10px] text-[#888] flex items-center space-x-1.5 pt-4",
										children: [/* @__PURE__ */ jsx(CalendarBlank, { className: "w-3.5 h-3.5 text-[#aaa]" }), /* @__PURE__ */ jsx("span", { children: formatDate(s.subscribedAt) })]
									})
								]
							}, i))
						})]
					})
				})
			})
		]
	});
}
//#endregion
//#region src/components/Dashboard/EnvironmentsPanel.tsx
function EnvironmentsPanel() {
	const [environments, setEnvironments] = useState([
		{
			id: "prod",
			name: "Production",
			type: "production",
			domain: "intelscout-snowy.vercel.app",
			branchTracking: true,
			attachDomain: true,
			importVariables: false,
			status: "active"
		},
		{
			id: "prev",
			name: "Preview",
			type: "preview",
			domain: "No custom domains",
			branchTracking: true,
			attachDomain: false,
			importVariables: false,
			status: "active"
		},
		{
			id: "dev",
			name: "Development",
			type: "development",
			domain: "No custom domains",
			branchTracking: false,
			attachDomain: false,
			importVariables: false,
			status: "active"
		}
	]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [envName, setEnvName] = useState("");
	const [description, setDescription] = useState("");
	const [branchTracking, setBranchTracking] = useState(false);
	const [attachDomain, setAttachDomain] = useState(false);
	const [importVariables, setImportVariables] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleCreateEnvironment = (e) => {
		e.preventDefault();
		const name = envName.trim() || "staging";
		setIsSubmitting(true);
		setTimeout(() => {
			const newEnv = {
				id: name.toLowerCase().replace(/\s+/g, "-"),
				name: name.charAt(0).toUpperCase() + name.slice(1),
				type: "pre-production",
				domain: attachDomain ? `intelscout-${name.toLowerCase()}.vercel.app` : "No custom domains",
				description: description.trim() || "A place for all staging deployments",
				branchTracking,
				attachDomain,
				importVariables,
				status: "active"
			};
			setEnvironments((prev) => [...prev, newEnv]);
			setIsSubmitting(false);
			setIsModalOpen(false);
			setEnvName("");
			setDescription("");
			setBranchTracking(false);
			setAttachDomain(false);
			setImportVariables(false);
		}, 1200);
	};
	const getEnvIcon = (type) => {
		switch (type) {
			case "production": return /* @__PURE__ */ jsx(ArrowCircleUp, { className: "w-4 h-4 text-emerald-600" });
			case "preview": return /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 text-[#888]" });
			case "development": return /* @__PURE__ */ jsx(Wrench, { className: "w-4 h-4 text-[#888]" });
			default: return /* @__PURE__ */ jsx(Stack, { className: "w-4 h-4 text-violet-600" });
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white border border-black/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between pb-4 border-b border-black/10 mb-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-bold text-[#111] uppercase tracking-wider font-outfit",
					children: "Environments"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[10px] text-[#666]",
					children: "Environments help manage the lifecycle of your deployments, enabling preview, testing, and production workflows."
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: () => setIsModalOpen(true),
					className: "px-3.5 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-550 text-white rounded-xl flex items-center space-x-1.5 transition cursor-pointer shadow-lg shadow-violet-600/10",
					children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 font-bold" }), /* @__PURE__ */ jsx("span", { children: "New Environment" })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent",
				children: /* @__PURE__ */ jsx("div", {
					className: "border border-black/10 rounded-xl overflow-hidden bg-white",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-[#fafafa] border-b border-black/10 text-[9px] font-bold text-[#666] uppercase tracking-widest",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-4",
									children: "Name"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-4",
									children: "Domains"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-4",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-black/5",
							children: environments.map((env) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-[#fafafa] text-xs transition duration-150",
								children: [
									/* @__PURE__ */ jsxs("td", {
										className: "p-4 flex items-center space-x-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "p-1.5 bg-[#fafafa] border border-black/10 rounded-lg shrink-0",
											children: getEnvIcon(env.type)
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "font-bold text-[#111] leading-none block",
											children: env.name
										}), env.description && /* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-[#666] block mt-0.5",
											children: env.description
										})] })]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-4 font-mono text-[#555]",
										children: env.domain !== "No custom domains" ? /* @__PURE__ */ jsxs("a", {
											href: `https://${env.domain}`,
											target: "_blank",
											rel: "noreferrer",
											className: "text-violet-600 hover:underline flex items-center space-x-1",
											children: [/* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 inline mr-1 shrink-0" }), /* @__PURE__ */ jsx("span", { children: env.domain })]
										}) : /* @__PURE__ */ jsx("span", {
											className: "text-[#aaa]",
											children: env.domain
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-4",
										children: /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-md text-[9px] font-bold uppercase tracking-wider",
											children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1" }), /* @__PURE__ */ jsx("span", { children: "Active" })]
										})
									})
								]
							}, env.id))
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: isModalOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 flex items-center justify-center z-50 p-4",
				children: [/* @__PURE__ */ jsx(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					onClick: () => !isSubmitting && setIsModalOpen(false),
					className: "absolute inset-0 bg-black/60 backdrop-blur-sm"
				}), /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						scale: .95,
						y: 10
					},
					animate: {
						opacity: 1,
						scale: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						scale: .95,
						y: 10
					},
					className: "bg-white border border-black/10 rounded-2xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl z-10",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							disabled: isSubmitting,
							onClick: () => setIsModalOpen(false),
							className: "absolute top-4 right-4 p-1.5 hover:bg-black/5 rounded-lg text-[#888] hover:text-[#111] transition disabled:opacity-30",
							children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mb-6",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-[#111] font-outfit",
								children: "Create Pre-production Environment"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-[#666] mt-1",
								children: "Pre-production environments dedicated to development and reviewing deployed changes without affecting production."
							})]
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleCreateEnvironment,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-[10px] font-bold text-[#888] uppercase tracking-wider block",
										children: "Environment Name"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative flex items-center",
										children: [/* @__PURE__ */ jsx("div", {
											className: "absolute left-3.5 text-[#555]",
											children: /* @__PURE__ */ jsx(Database, { className: "w-4 h-4" })
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											disabled: isSubmitting,
											value: envName,
											onChange: (e) => setEnvName(e.target.value),
											placeholder: "staging",
											className: "w-full bg-[#fafafa] border border-black/10 focus:border-violet-300 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition text-[#111]"
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-[10px] font-bold text-[#888] uppercase tracking-wider block",
										children: "Description (optional)"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										disabled: isSubmitting,
										value: description,
										onChange: (e) => setDescription(e.target.value),
										placeholder: "A place for all staging deployments",
										className: "w-full bg-[#fafafa] border border-black/10 focus:border-violet-300 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition text-[#111]"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-3 pt-2",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs font-semibold text-[#111] block",
												children: "Branch Tracking"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-[#666] block",
												children: "When enabled, each qualifying merge will generate a deployment"
											})] }), /* @__PURE__ */ jsx("button", {
												type: "button",
												disabled: isSubmitting,
												onClick: () => setBranchTracking(!branchTracking),
												className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${branchTracking ? "bg-violet-600" : "bg-[#e0e0e0]"}`,
												children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${branchTracking ? "translate-x-4" : "translate-x-0"}` })
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs font-semibold text-[#111] block",
												children: "Attach Domain"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-[#666] block",
												children: "Automatically assign a domain to the newest deployment"
											})] }), /* @__PURE__ */ jsx("button", {
												type: "button",
												disabled: isSubmitting,
												onClick: () => setAttachDomain(!attachDomain),
												className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${attachDomain ? "bg-violet-600" : "bg-[#e0e0e0]"}`,
												children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${attachDomain ? "translate-x-4" : "translate-x-0"}` })
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs font-semibold text-[#111] block",
												children: "Import Variables From Another Environment"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-[#666] block",
												children: "Attach current environment variables from another environment"
											})] }), /* @__PURE__ */ jsx("button", {
												type: "button",
												disabled: isSubmitting,
												onClick: () => setImportVariables(!importVariables),
												className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${importVariables ? "bg-violet-600" : "bg-[#e0e0e0]"}`,
												children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${importVariables ? "translate-x-4" : "translate-x-0"}` })
											})]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex space-x-3 pt-4 border-t border-black/10",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										disabled: isSubmitting,
										onClick: () => setIsModalOpen(false),
										className: "flex-1 py-2.5 bg-[#fafafa] hover:bg-black/5 border border-black/10 text-[10px] font-bold text-[#888] hover:text-[#111] rounded-xl uppercase tracking-wider transition cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: isSubmitting,
										className: "flex-1 py-2.5 bg-violet-600 hover:bg-violet-550 text-[10px] font-bold text-white rounded-xl uppercase tracking-wider transition shadow-lg shadow-violet-600/10 cursor-pointer flex items-center justify-center space-x-1.5",
										children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(CircleNotch, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Creating..." })] }) : /* @__PURE__ */ jsx("span", { children: "Create" })
									})]
								})
							]
						})
					]
				})]
			}) })
		]
	});
}
//#endregion
//#region src/components/Dashboard/DashboardLayout.tsx
function DashboardLayout() {
	const { gtmSummary, accounts } = useIntelScout();
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const navItems = [
		{
			id: "dashboard",
			label: "Analytics Overview",
			icon: SquaresFour
		},
		{
			id: "accounts",
			label: "Prioritized Accounts",
			icon: Table,
			badge: accounts.length
		},
		{
			id: "signals",
			label: "Signal Tuning",
			icon: Sliders
		},
		{
			id: "feed",
			label: "Intelligence Feed",
			icon: Pulse
		},
		{
			id: "environments",
			label: "Environments",
			icon: Stack
		},
		{
			id: "audience",
			label: "Audience & Auth",
			icon: Users
		}
	];
	const handleRevealInsights = (account) => {
		setSelectedAccount(account);
	};
	const handleCloseDrawer = () => {
		setSelectedAccount(null);
	};
	const renderTabContent = () => {
		switch (activeTab) {
			case "dashboard": return /* @__PURE__ */ jsxs("div", {
				className: "space-y-6 flex-1 flex flex-col",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-black/10 rounded-xl p-4 flex items-start space-x-3.5 shadow-sm relative overflow-hidden",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-0 right-0 p-6 opacity-[0.03] text-black pointer-events-none",
								children: /* @__PURE__ */ jsx(Sparkle, { className: "w-32 h-32" })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "p-2 bg-violet-500/10 border border-violet-500/20 text-violet-600 rounded-lg shrink-0 mt-0.5 animate-pulse",
								children: /* @__PURE__ */ jsx(Sparkle, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-[9px] font-bold text-violet-600 uppercase tracking-widest block mb-0.5",
								children: "AI GTM Executive Summary"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-[#333] leading-relaxed font-medium",
								children: gtmSummary
							})] })
						]
					}),
					/* @__PURE__ */ jsx(KPIWidgets, {}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 items-start",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "xl:col-span-2 space-y-6 flex flex-col h-full",
							children: [/* @__PURE__ */ jsx(AnalyticsCharts, {}), /* @__PURE__ */ jsx(AccountsTable, { onRevealInsights: handleRevealInsights })]
						}), /* @__PURE__ */ jsx("div", {
							className: "h-full",
							children: /* @__PURE__ */ jsx(IntelligenceFeed, {})
						})]
					})
				]
			});
			case "accounts": return /* @__PURE__ */ jsx("div", {
				className: "flex-1 flex flex-col h-full",
				children: /* @__PURE__ */ jsx(AccountsTable, { onRevealInsights: handleRevealInsights })
			});
			case "signals": return /* @__PURE__ */ jsx("div", {
				className: "flex-1 flex flex-col h-full items-center",
				children: /* @__PURE__ */ jsx(SettingsPanel, {})
			});
			case "feed": return /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start",
				children: [/* @__PURE__ */ jsx("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ jsx(IntelligenceFeed, {})
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-white border border-black/10 rounded-xl p-5 text-xs text-[#555] space-y-3 shadow-sm",
					children: [
						/* @__PURE__ */ jsx("h4", {
							className: "font-bold text-[#111] uppercase tracking-wider font-outfit",
							children: "Feed Configuration"
						}),
						/* @__PURE__ */ jsx("p", { children: "The intelligence feed displays alerts from our crawler as they happen." }),
						/* @__PURE__ */ jsx("p", { children: "As accounts trigger events in the background, they automatically get priority bumps and move up our prioritizations matrices." }),
						/* @__PURE__ */ jsxs("div", {
							className: "p-3 bg-[#fafafa] border border-black/10 rounded-lg",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-bold text-[#333] block mb-1",
								children: "Active Crawler Gateways:"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "list-disc pl-4 space-y-1 text-[#666]",
								children: [
									/* @__PURE__ */ jsx("li", { children: "sec_hiring (Security Positions)" }),
									/* @__PURE__ */ jsx("li", { children: "comp_hiring (Compliance / GTM Positions)" }),
									/* @__PURE__ */ jsx("li", { children: "soc2_ment (Job Specifications crawling)" }),
									/* @__PURE__ */ jsx("li", { children: "trust_center (Homepage audit scan)" }),
									/* @__PURE__ */ jsx("li", { children: "ent_pricing (SaaS package matrices check)" })
								]
							})]
						})
					]
				})]
			});
			case "environments": return /* @__PURE__ */ jsx("div", {
				className: "flex-1 flex flex-col h-full items-center",
				children: /* @__PURE__ */ jsx(EnvironmentsPanel, {})
			});
			case "audience": return /* @__PURE__ */ jsx("div", {
				className: "flex-1 flex flex-col h-full items-center",
				children: /* @__PURE__ */ jsx(AudiencePanel, {})
			});
			default: return null;
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-screen bg-transparent text-[#333] overflow-hidden font-sans selection:bg-black selection:text-white",
		children: [
			/* @__PURE__ */ jsx(Sidebar, {
				activeTab,
				setActiveTab,
				collapsed: sidebarCollapsed,
				setCollapsed: setSidebarCollapsed
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 flex flex-col min-w-0 overflow-hidden relative",
				children: [/* @__PURE__ */ jsx(Navbar$1, {
					activeTab,
					setSidebarCollapsed,
					sidebarCollapsed
				}), /* @__PURE__ */ jsx("main", {
					className: "flex-1 overflow-y-auto p-6 pb-24 md:pb-6 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent",
					children: renderTabContent()
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-black/80 border border-white/10 backdrop-blur-xl rounded-full shadow-2xl py-2 px-3 flex items-center justify-around z-45",
				children: navItems.map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab(item.id),
						className: `p-2.5 rounded-full transition relative cursor-pointer ${activeTab === item.id ? "bg-white/20 text-white border border-white/10" : "text-[#888] hover:text-white"}`,
						children: [/* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" }), item.badge !== void 0 && item.badge > 0 && /* @__PURE__ */ jsx("span", {
							className: "absolute -top-1 -right-1 bg-white text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none",
							children: item.badge
						})]
					}, item.id);
				})
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: selectedAccount && /* @__PURE__ */ jsx(CompanyDetailsDrawer, {
				account: selectedAccount,
				onClose: handleCloseDrawer
			}) })
		]
	});
}
//#endregion
//#region src/components/Navbar.tsx
var NavLink = React.memo(function NavLink({ href, children }) {
	return /* @__PURE__ */ jsx("a", {
		href,
		className: "text-[13px] font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/[0.08] px-3 py-1.5 rounded-full transition-all duration-200 font-roboto flex items-center gap-1.5",
		children
	});
});
function Navbar({ onOpenAuth }) {
	const { scrollY } = useScroll();
	const [hidden, setHidden] = useState(false);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	useMotionValueEvent(scrollY, "change", (latest) => {
		const previous = scrollY.getPrevious();
		if (!previous) return;
		if (latest > previous && latest > 150) setHidden(true);
		else setHidden(false);
	});
	return /* @__PURE__ */ jsx(motion.div, {
		variants: {
			visible: {
				y: 0,
				opacity: 1
			},
			hidden: {
				y: "-150%",
				opacity: 0
			}
		},
		animate: hidden ? "hidden" : "visible",
		transition: {
			duration: .35,
			ease: "easeInOut"
		},
		className: "fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none",
		children: /* @__PURE__ */ jsxs("header", {
			className: "w-full max-w-[1100px] pointer-events-auto bg-background/70 backdrop-blur-md border border-foreground/10 rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] h-14 md:h-16 flex items-center justify-between px-6 transition-colors duration-300",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 min-w-max flex items-center",
					children: /* @__PURE__ */ jsx(AnimatedLogo, {
						className: "w-5 h-5",
						showText: true
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "hidden md:flex items-center justify-center flex-1",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-0.5 p-1 bg-foreground/[0.03] border border-border-light rounded-full",
						children: [
							/* @__PURE__ */ jsx(NavLink, {
								href: "#features",
								children: "Signals"
							}),
							/* @__PURE__ */ jsx(NavLink, {
								href: "#how-it-works",
								children: "Workflow"
							}),
							/* @__PURE__ */ jsx(NavLink, {
								href: "#newsletter",
								children: "Digest"
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-6 flex-1 min-w-max",
					children: [
						mounted && /* @__PURE__ */ jsx("button", {
							onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
							className: "text-foreground/60 hover:text-foreground hover:bg-foreground/5 p-2 rounded-full transition-colors duration-200",
							"aria-label": "Toggle Dark Mode",
							children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: onOpenAuth,
							className: "text-[13px] font-medium text-foreground/60 hover:text-foreground transition-colors duration-200 font-roboto hidden md:block",
							children: "Sign in"
						}),
						/* @__PURE__ */ jsxs(motion.button, {
							onClick: onOpenAuth,
							className: "inline-flex items-center justify-center gap-2 bg-foreground text-background text-[13px] font-semibold rounded-full px-5 h-9 transition-all duration-200 group font-roboto shrink-0 hover:opacity-90 shadow-sm",
							children: ["Get started", /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" })]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/LandingPage.tsx
var STATS = [
	{
		val: "94.8%",
		label: "ICP match rate",
		brand: "TIER 1"
	},
	{
		val: "18×",
		label: "signals detected",
		brand: "DAILY"
	},
	{
		val: "< 3s",
		label: "crawl latency",
		brand: "P99"
	},
	{
		val: "1,200+",
		label: "revenue leaders",
		brand: "USERS"
	}
];
var MARQUEE_ITEMS = [...STATS, ...STATS];
var JSON_LD_STR = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: "IntelScout AI",
	operatingSystem: "All",
	applicationCategory: "BusinessApplication",
	description: "Real-time AI crawler, technographics parser, and account qualification scoring engine.",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD"
	}
});
var FEATURES = [
	{
		num: "01",
		title: "Continuous Crawler Engine",
		body: "Scrapes web infrastructure, hiring targets, corporate news, and pricing tables automatically. Eliminates manual research overhead entirely.",
		delay: 0
	},
	{
		num: "02",
		title: "Dynamic Intent Scoring",
		body: "Set exact weights for compliance requirements, dev tool changes, or marketing roles. Watch matching profiles float straight to the top.",
		delay: .08
	},
	{
		num: "03",
		title: "GTM Contact Blueprints",
		body: "Maps target accounts to buying committees and writes highly contextual, personalized email sequences tailored to exact active pain points.",
		delay: .16
	},
	{
		num: "04",
		title: "Real-time Signal Feed",
		body: "Live alerts when a target account triggers a qualifying event — funding, headcount changes, tech adoption, or compliance filings.",
		delay: .24
	}
];
var STEPS = [
	{
		roman: "I",
		title: "Define your ICP",
		body: "Describe your offer and ideal customer. IntelScout compiles a full GTM blueprint — ICP fit, pain map, and signal weights.",
		active: true
	},
	{
		roman: "II",
		title: "Crawl & score accounts",
		body: "The crawler monitors thousands of domains continuously, scoring each account against your qualification vectors in real-time.",
		active: false
	},
	{
		roman: "III",
		title: "Launch personalized outreach",
		body: "Export AI-written email sequences, call scripts, and LinkedIn hooks tailored to each account's exact active signals.",
		active: false
	}
];
var CODE_LINES = [
	{
		line: 1,
		delay: 0,
		text: "import { intelscout } from \"@/core\""
	},
	{
		line: 2,
		delay: 80,
		text: ""
	},
	{
		line: 3,
		delay: 160,
		text: "intelscout.crawl({"
	},
	{
		line: 4,
		delay: 240,
		text: "  source: 'your-domain.com',"
	},
	{
		line: 5,
		delay: 320,
		text: "  sync: true,"
	},
	{
		line: 6,
		delay: 400,
		text: "  signals: [\"hiring\",\"pricing\"]"
	},
	{
		line: 7,
		delay: 480,
		text: "})"
	}
];
var FADE_UP = {
	initial: {
		opacity: 0,
		y: 16
	},
	whileInView: {
		opacity: 1,
		y: 0
	},
	viewport: { once: true },
	transition: {
		duration: .7,
		ease: [
			.16,
			1,
			.3,
			1
		]
	}
};
var MODAL_VARIANTS = {
	initial: {
		scale: .94,
		opacity: 0,
		y: 12
	},
	animate: {
		scale: 1,
		opacity: 1,
		y: 0
	},
	exit: {
		scale: .94,
		opacity: 0,
		y: 12
	},
	transition: {
		duration: .25,
		ease: [
			.16,
			1,
			.3,
			1
		]
	}
};
var AnimatedWord = React.memo(function AnimatedWord({ word, delay = 0 }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "relative inline-block",
		children: [/* @__PURE__ */ jsx("span", {
			className: "inline-flex",
			children: word.split("").map((char, i) => /* @__PURE__ */ jsx("span", {
				className: "animate-char-in",
				style: { animationDelay: `${delay + i * 40}ms` },
				children: char
			}, i))
		}), /* @__PURE__ */ jsx("span", {
			className: "absolute -bottom-1 left-0 right-0 h-[6px] rounded-sm",
			style: { background: "rgba(0,0,0,0.07)" }
		})]
	});
});
var FeatureRow = React.memo(function FeatureRow({ num, title, body, delay = 0 }) {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 32
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: { once: true },
		transition: {
			duration: .6,
			delay,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		className: "group border-b border-black/10 py-10 lg:py-14 flex flex-col lg:flex-row gap-8 lg:gap-16 cursor-default",
		children: [/* @__PURE__ */ jsx("div", {
			className: "shrink-0",
			children: /* @__PURE__ */ jsx("span", {
				className: "font-roboto-mono text-sm text-[#888888]",
				children: num
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 grid lg:grid-cols-2 gap-6 items-start",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-3xl lg:text-4xl font-black tracking-tight text-foreground group-hover:translate-x-2 transition-transform duration-500 font-roboto leading-tight",
				children: title
			}), /* @__PURE__ */ jsx("p", {
				className: "text-lg text-[#555555] leading-relaxed font-roboto font-normal",
				children: body
			})]
		})]
	});
});
var PanelICP = React.memo(function PanelICP() {
	return /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -10
		},
		transition: { duration: .4 },
		className: "p-8 h-full flex flex-col justify-center min-h-[320px]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "p-4 bg-white/[0.03] border border-white/10 rounded-xl",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[11px] text-[#888] font-roboto-mono tracking-widest mb-1.5",
						children: "TARGET_INDUSTRY"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-sm font-semibold font-roboto text-white",
						children: "B2B SaaS, FinTech, DevTools"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-4 bg-white/[0.03] border border-white/10 rounded-xl",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[11px] text-[#888] font-roboto-mono tracking-widest mb-1.5",
						children: "MANDATORY_SIGNALS"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2 mt-2",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "px-2 py-1 bg-white/10 border border-white/5 rounded text-[11px] font-roboto text-white",
								children: "Security Audit (SOC2)"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "px-2 py-1 bg-white/10 border border-white/5 rounded text-[11px] font-roboto text-white",
								children: "Executive Hire"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "px-2 py-1 bg-white/10 border border-white/5 rounded text-[11px] font-roboto text-white",
								children: "Funding"
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-4 bg-white/[0.03] border border-white/10 rounded-xl",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-center mb-1.5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[11px] text-[#888] font-roboto-mono tracking-widest",
							children: "ICP_FIT_THRESHOLD"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[11px] text-white font-roboto-mono",
							children: "85%"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden",
						children: /* @__PURE__ */ jsx(motion.div, {
							initial: { width: 0 },
							animate: { width: "85%" },
							transition: {
								delay: .2,
								duration: 1,
								ease: "easeOut"
							},
							className: "h-full bg-white rounded-full"
						})
					})]
				})
			]
		})
	});
});
var PanelCrawl = React.memo(function PanelCrawl() {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -10
		},
		transition: { duration: .4 },
		className: "h-full flex flex-col min-h-[320px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "px-5 py-3.5 flex items-center justify-between border-b border-white/10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-white/20" }),
						/* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-white/20" }),
						/* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-white/20" })
					]
				}), /* @__PURE__ */ jsx("span", {
					className: "text-xs font-roboto-mono text-[#666]",
					children: "intelscout.crawl.ts"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-7 font-roboto-mono text-sm flex-1 flex flex-col justify-center",
				children: /* @__PURE__ */ jsx("pre", {
					className: "text-[#aaa] leading-loose",
					children: CODE_LINES.map((l) => /* @__PURE__ */ jsxs("div", {
						className: "code-line-reveal",
						style: { animationDelay: `${l.delay}ms` },
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[#444] select-none w-7 inline-block",
							children: l.line
						}), /* @__PURE__ */ jsx("span", { children: l.text })]
					}, l.line))
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "px-5 py-3 flex items-center gap-3 border-t border-white/10",
				children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-green-400 animate-pulse" }), /* @__PURE__ */ jsx("span", {
					className: "text-xs font-roboto-mono text-[#666]",
					children: "ICP_SCORE: 94.8 // 18 signals detected"
				})]
			})
		]
	});
});
var PanelOutreach = React.memo(function PanelOutreach() {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -10
		},
		transition: { duration: .4 },
		className: "p-6 h-full flex flex-col gap-4 min-h-[320px] bg-foreground dark:bg-[#0a0a0a]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between w-full p-3 bg-white/5 border border-white/10 rounded-lg",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ jsx("span", {
					className: "text-[11px] font-mono text-[#aaa] uppercase tracking-wider",
					children: "Workflow: Signal → Sequence"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ jsx("span", {
					className: "px-2 py-1 bg-white/10 text-white text-[10px] rounded border border-white/5 font-mono",
					children: "SOC2 INTENT"
				}), /* @__PURE__ */ jsx("span", {
					className: "px-2 py-1 bg-white/10 text-white text-[10px] rounded border border-white/5 font-mono",
					children: "CISO HIRE"
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 grid grid-cols-1 md:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-white/[0.02] border border-white/10 rounded-xl flex flex-col h-full overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "px-4 py-2.5 border-b border-white/10 bg-white/[0.01] flex items-center gap-2 text-xs text-[#888] font-roboto",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-red-400/50" }),
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400/50" }),
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-green-400/50" }),
							/* @__PURE__ */ jsx("span", {
								className: "ml-2 font-mono",
								children: "Email Generation"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "px-4 py-3 border-b border-white/10 flex items-center justify-between text-[11px] text-[#aaa]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-white/40",
								children: "To:"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-white bg-white/10 px-1.5 py-0.5 rounded",
								children: "alex@target.com"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-white/40",
							children: "Subj: Streamline SOC2"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-4 text-[13px] text-[#ccc] leading-relaxed font-roboto flex-1",
						children: [
							"Hi Alex,",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("br", {}),
							"Saw the news about your recent appointment as ",
							/* @__PURE__ */ jsx("span", {
								className: "text-emerald-400 bg-emerald-400/10 px-1 rounded",
								children: "CISO"
							}),
							"—congrats!",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("br", {}),
							"Noticed you are ramping up for a ",
							/* @__PURE__ */ jsx("span", {
								className: "text-amber-400 bg-amber-400/10 px-1 rounded",
								children: "SOC2 Type II"
							}),
							" audit next quarter. Our engine automates the evidence collection, saving typical teams 400+ hours.",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("br", {}),
							"Open to a brief chat to see how we could help?"
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-4 h-full",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-[#0A66C2]/10 border border-[#0A66C2]/30 rounded-xl flex-1 flex flex-col overflow-hidden relative",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "px-4 py-2 bg-[#0A66C2]/20 border-b border-[#0A66C2]/30 text-[11px] font-bold text-white flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-3 h-3 bg-white rounded-sm flex justify-center items-center text-[#0A66C2] text-[8px]",
								children: "in"
							}), "LinkedIn Connect"]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "p-4 text-[12px] text-white/90 leading-relaxed font-roboto relative z-10",
							children: "\"Hi Alex, massive congrats on taking the CISO role! I've been following your work since Stripe. Let's connect.\""
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 -right-4 w-24 h-24 bg-[#0A66C2]/20 rounded-full blur-xl pointer-events-none" })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "p-4 bg-white/[0.03] border border-white/10 rounded-xl flex flex-col justify-center items-center gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-[11px] text-[#888] font-mono text-center",
						children: ["Personalization confidence: ", /* @__PURE__ */ jsx("span", {
							className: "text-emerald-400",
							children: "98%"
						})]
					}), /* @__PURE__ */ jsx("button", {
						className: "w-full py-2.5 bg-white hover:bg-[#e5e5e5] text-black text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all transform hover:scale-[1.02]",
						children: "Launch Omni-Channel Sequence"
					})]
				})]
			})]
		})]
	});
});
function ScrollStep({ step, idx, activeProcessStep, setActiveProcessStep }) {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		margin: "-40% 0px -40% 0px",
		amount: .1
	});
	useEffect(() => {
		if (isInView) setActiveProcessStep(idx);
	}, [
		isInView,
		idx,
		setActiveProcessStep
	]);
	return /* @__PURE__ */ jsx("div", {
		ref,
		className: "min-h-[40vh] flex flex-col justify-center py-4 cursor-default",
		children: /* @__PURE__ */ jsx("div", {
			className: `w-full text-left transition-all duration-700 ${activeProcessStep === idx ? "opacity-100" : "opacity-30"}`,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-6",
				children: [/* @__PURE__ */ jsx("span", {
					className: `font-black text-3xl font-roboto shrink-0 transition-colors duration-700 ${activeProcessStep === idx ? "text-foreground" : "text-[#555]"}`,
					children: step.roman
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ jsx("h3", {
						className: `text-2xl lg:text-3xl font-black mb-3 transition-all duration-700 font-roboto ${activeProcessStep === idx ? "text-foreground translate-x-1" : "text-foreground/60"}`,
						children: step.title
					}), /* @__PURE__ */ jsx("p", {
						className: `leading-relaxed font-normal font-roboto transition-colors duration-700 ${activeProcessStep === idx ? "text-foreground/80" : "text-foreground/50"}`,
						children: step.body
					})]
				})]
			})
		})
	});
}
function LandingPage() {
	const { loginWithGoogle, isAuthLoading } = useIntelScout();
	const [showAuth, setShowAuth] = useState(false);
	const [heroVisible, setHeroVisible] = useState(false);
	const [activeProcessStep, setActiveProcessStep] = useState(0);
	useEffect(() => {
		console.log("[HMR] Scroll-story layout updated");
		const t = setTimeout(() => setHeroVisible(true), 100);
		return () => clearTimeout(t);
	}, []);
	const openAuth = useCallback(() => {
		setShowAuth(true);
	}, []);
	const closeAuth = useCallback(() => setShowAuth(false), []);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative min-h-screen bg-transparent text-foreground overflow-x-hidden noise-overlay font-roboto transition-colors duration-300",
		children: [
			/* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON_LD_STR }
			}),
			/* @__PURE__ */ jsx(Navbar, { onOpenAuth: openAuth }),
			/* @__PURE__ */ jsxs("section", {
				className: "relative overflow-hidden pt-32 lg:pt-48 pb-16 lg:pb-24",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 max-w-[1100px] mx-auto w-full px-6 lg:px-8 flex flex-col md:items-center text-left md:text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "animate-line-in mb-6 w-full flex md:justify-center",
							style: { animationDelay: "200ms" },
							children: /* @__PURE__ */ jsxs("div", {
								className: "text-sm font-roboto-mono text-[#888888] flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", { className: "w-8 h-px bg-black/20 dark:bg-white/30 inline-block" }), "The GTM intelligence platform"]
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mb-6 w-full",
							children: /* @__PURE__ */ jsxs("h1", {
								className: "font-black font-roboto flex flex-col items-start md:items-center",
								style: { fontSize: "clamp(3rem, 9vw, 8.5rem)" },
								children: [/* @__PURE__ */ jsx("span", {
									className: "leading-[1] md:leading-[0.92] animate-line-in tracking-tight text-[#222]",
									style: { animationDelay: "350ms" },
									children: "Qualify B2B"
								}), /* @__PURE__ */ jsxs("span", {
									className: "leading-[1] md:leading-[0.92] animate-line-in tracking-tighter text-foreground",
									style: { animationDelay: "500ms" },
									children: ["accounts to ", heroVisible && /* @__PURE__ */ jsx(AnimatedWord, {
										word: "win.",
										delay: 600
									})]
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-start md:items-center gap-6 md:gap-8 w-full max-w-[640px] mx-auto",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-[17px] md:text-xl text-[#555] leading-relaxed font-normal animate-line-in",
								style: { animationDelay: "500ms" },
								children: "IntelScout crawls target domains in real-time — tracking hiring signals, pricing changes, and tech stack shifts — then scores every account automatically."
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-line-in",
								style: { animationDelay: "620ms" },
								children: [/* @__PURE__ */ jsxs("button", {
									onClick: openAuth,
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-[#1a1a1a] text-white font-bold text-[15px] rounded-full px-6 h-12 transition-all duration-200 group font-roboto shadow-sm",
									children: ["Start free trial", /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })]
								}), /* @__PURE__ */ jsx("a", {
									href: "#how-it-works",
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-[15px] rounded-full px-6 h-12 transition-all duration-200 font-roboto text-black hover:bg-black/5",
									style: { border: "1.5px solid rgba(0,0,0,0.12)" },
									children: "Watch demo"
								})]
							})]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "w-full mt-24 animate-line-in overflow-hidden border-y border-black/[0.04] bg-[#fafafa] py-8 relative z-10",
					style: { animationDelay: "800ms" },
					children: /* @__PURE__ */ jsx("div", {
						className: "flex gap-16 marquee whitespace-nowrap select-none",
						children: MARQUEE_ITEMS.map((s, i) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline gap-4 shrink-0",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-black font-roboto text-black",
								style: { fontSize: "clamp(2rem, 4vw, 3.5rem)" },
								children: s.val
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-sm text-[#666666] font-roboto",
								children: [s.label, /* @__PURE__ */ jsx("span", {
									className: "block font-roboto-mono text-[10px] mt-0.5 tracking-widest text-[#999999]",
									children: s.brand
								})]
							})]
						}, i))
					})
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "features",
				className: "relative py-24 bg-transparent transition-colors duration-300",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-[1100px] mx-auto px-6 lg:px-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-16",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-3 text-sm font-roboto-mono text-[#888888] mb-6",
							children: [/* @__PURE__ */ jsx("span", { className: "w-8 h-px bg-black/25 inline-block" }), "Capabilities"]
						}), /* @__PURE__ */ jsxs(motion.h2, {
							...FADE_UP,
							className: "text-4xl lg:text-5xl font-black tracking-tight font-roboto leading-[1.05] text-foreground",
							children: [
								"Know who's buying.",
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx("span", {
									className: "text-foreground/65",
									children: "Before they tell you."
								})
							]
						})]
					}), /* @__PURE__ */ jsx("div", { children: FEATURES.map((f) => /* @__PURE__ */ jsx(FeatureRow, { ...f }, f.num)) })]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "how-it-works",
				className: "relative py-24 bg-foreground dark:bg-[#0a0a0a] text-background dark:text-white overflow-hidden transition-colors duration-300",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 opacity-[0.04] pointer-events-none",
					style: { backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)" }
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative z-10 max-w-[1100px] mx-auto px-6 lg:px-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-3 text-sm font-roboto-mono text-[#888888] mb-4",
							children: [/* @__PURE__ */ jsx("span", { className: "w-8 h-px bg-white/30 inline-block" }), "Process"]
						}), /* @__PURE__ */ jsxs(motion.h2, {
							initial: {
								opacity: 0,
								y: 16
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							transition: { duration: .7 },
							className: "text-4xl lg:text-5xl font-black tracking-tight font-roboto leading-[1.1]",
							children: ["Three steps. ", /* @__PURE__ */ jsx("span", {
								className: "text-[#666666]",
								children: "Infinite pipeline."
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid lg:grid-cols-2 gap-16 lg:gap-24 items-start relative",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex flex-col relative z-10 pb-[20vh]",
							children: STEPS.map((step, idx) => /* @__PURE__ */ jsx(ScrollStep, {
								step,
								idx,
								activeProcessStep,
								setActiveProcessStep
							}, step.roman))
						}), /* @__PURE__ */ jsx("div", {
							className: "sticky top-32 w-full border border-border-light rounded-2xl overflow-hidden bg-background shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[450px]",
							children: /* @__PURE__ */ jsxs(AnimatePresence, {
								mode: "wait",
								children: [
									activeProcessStep === 0 && /* @__PURE__ */ jsx(PanelICP, {}, "panel0"),
									activeProcessStep === 1 && /* @__PURE__ */ jsx(PanelCrawl, {}, "panel1"),
									activeProcessStep === 2 && /* @__PURE__ */ jsx(PanelOutreach, {}, "panel2")
								]
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "relative pt-12 pb-6 bg-transparent transition-colors duration-300 overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-[1100px] mx-auto px-6 lg:px-8",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-foreground/5 dark:bg-foreground/[0.02] border border-border-light rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative z-10 w-full max-w-xl",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/50 mb-4",
									children: [/* @__PURE__ */ jsx(Robot, { className: "w-4 h-4" }), " Autonomous Intelligence"]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl md:text-4xl font-black tracking-tight font-roboto leading-tight text-foreground mb-4",
									children: "Stop guessing. Start closing."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-foreground/70 text-base font-roboto mb-8",
									children: "Join 1,200+ revenue leaders using IntelScout to identify high-intent buyers the moment they enter the market."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row gap-3 w-full",
									children: [/* @__PURE__ */ jsx("input", {
										type: "email",
										placeholder: "Enter your work email",
										className: "flex-1 h-12 px-4 rounded-xl border border-border-light bg-background text-sm text-foreground focus:outline-none focus:border-foreground/30 shadow-sm"
									}), /* @__PURE__ */ jsxs("button", {
										onClick: () => setShowAuth(true),
										className: "px-6 h-12 bg-foreground hover:opacity-90 text-background rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap",
										children: ["Configure Signals ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-6 mt-8",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Target, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-mono text-foreground/60",
											children: "1.2M+ Accounts Scored"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-mono text-foreground/60",
											children: "SOC2 Type II Certified"
										})]
									})]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "relative z-10 hidden md:flex flex-col items-center justify-center",
							children: /* @__PURE__ */ jsx("div", {
								className: "w-56 h-56 bg-foreground/[0.02] rounded-full border border-foreground/5 flex items-center justify-center relative",
								children: /* @__PURE__ */ jsx("div", {
									className: "w-40 h-40 bg-foreground/[0.03] rounded-full border border-foreground/5 flex items-center justify-center",
									children: /* @__PURE__ */ jsx("div", {
										className: "w-24 h-24 bg-foreground/[0.05] rounded-full border border-foreground/10 flex items-center justify-center",
										children: /* @__PURE__ */ jsx(AnimatedLogo, {
											className: "w-10 h-10 text-foreground",
											showText: false
										})
									})
								})
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "pt-8 pb-8 bg-transparent transition-colors duration-300",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-[1100px] mx-auto px-6 lg:px-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 w-full",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "md:col-span-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 mb-4",
										children: [/* @__PURE__ */ jsx(AnimatedLogo, {
											className: "w-7 h-7 text-foreground",
											showText: false
										}), /* @__PURE__ */ jsx("span", {
											className: "text-lg font-black tracking-tight text-foreground font-roboto",
											children: "IntelScout"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm text-foreground/60 font-roboto leading-relaxed mb-6 max-w-sm",
										children: "The autonomous scoring engine that maps real-time technographic and behavioral signals to your ideal customer profile."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-xs font-mono text-foreground/50",
										children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), "Systems operational"]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "font-bold text-foreground mb-5 text-sm",
								children: "Product"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-3 text-[13px] text-foreground/60 font-roboto",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "#features",
										className: "hover:text-foreground transition",
										children: "Signal Engine"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "#how-it-works",
										className: "hover:text-foreground transition",
										children: "Qualification"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "#",
										className: "hover:text-foreground transition",
										children: "Integrations"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "#",
										className: "hover:text-foreground transition",
										children: "Pricing"
									}) })
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "font-bold text-foreground mb-5 text-sm",
								children: "Company"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-3 text-[13px] text-foreground/60 font-roboto",
								children: [
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "#",
										className: "hover:text-foreground transition",
										children: "About"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "#",
										className: "hover:text-foreground transition",
										children: "Blog"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "#",
										className: "hover:text-foreground transition",
										children: "Careers"
									}) }),
									/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
										href: "#",
										className: "hover:text-foreground transition",
										children: "Contact"
									}) })
								]
							})] })
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-12 pt-6 border-t border-border-light flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-xs text-[#999] font-roboto",
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" IntelScout AI Inc. All rights reserved."
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-[#999] font-roboto",
							children: [/* @__PURE__ */ jsx("a", {
								href: "#",
								className: "hover:text-foreground transition",
								children: "Privacy Policy"
							}), /* @__PURE__ */ jsx("a", {
								href: "#",
								className: "hover:text-foreground transition",
								children: "Terms of Service"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: showAuth && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4",
				style: {
					background: "rgba(0,0,0,0.5)",
					backdropFilter: "blur(8px)"
				},
				children: /* @__PURE__ */ jsxs(motion.div, {
					...MODAL_VARIANTS,
					className: "bg-background rounded-2xl shadow-2xl w-full max-w-sm p-6 relative transition-colors duration-300",
					style: { border: "1px solid var(--border-light)" },
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: closeAuth,
							className: "absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#888888] hover:text-black hover:bg-black/5 transition",
							children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2.5 pb-5 mb-5",
							style: { borderBottom: "1px solid rgba(0,0,0,0.08)" },
							children: /* @__PURE__ */ jsx(AnimatedLogo, {
								className: "w-5 h-5",
								showText: true
							})
						}),
						isAuthLoading ? /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center py-10 gap-3",
							children: [/* @__PURE__ */ jsx("span", { className: "w-7 h-7 border-2 border-[#888888] border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", {
								className: "text-sm text-[#888888] font-roboto",
								children: "Connecting..."
							})]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "space-y-4 w-full",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "text-center mb-6",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-xl font-bold",
									children: "Welcome"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-[#888888] mt-1",
									children: "Sign in to access the platform"
								})]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => {
									loginWithGoogle();
								},
								className: "w-full relative z-10 flex justify-center items-center gap-3 px-4 py-3.5 bg-black hover:bg-black/90 text-white rounded-xl transition duration-200 text-sm font-roboto font-bold cursor-pointer mt-6",
								children: "Continue with Google"
							})]
						})
					]
				})
			}) })
		]
	});
}
//#endregion
//#region src/components/LiquidCurtain.tsx
function LiquidCurtain({ children, stageKey }) {
	const [displayChildren, setDisplayChildren] = useState(children);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const prevStageKeyRef = useRef(stageKey);
	useEffect(() => {
		if (stageKey !== prevStageKeyRef.current) {
			prevStageKeyRef.current = stageKey;
			setIsTransitioning(true);
			const timer = setTimeout(() => {
				setDisplayChildren(children);
			}, 450);
			const finishTimer = setTimeout(() => {
				setIsTransitioning(false);
			}, 900);
			return () => {
				clearTimeout(timer);
				clearTimeout(finishTimer);
			};
		} else setDisplayChildren(children);
	}, [stageKey, children]);
	const animCurtain = {
		initial: { d: "M 100 0 L 100 100 L 100 100 L 100 0 Z" },
		mid: {
			d: [
				"M 100 0 L 100 100 L 100 100 L 100 0 Z",
				"M 100 0 L 100 100 L 40 100 Q -20 50 40 0 Z",
				"M 100 0 L 100 100 L 0 100 L 0 0 Z"
			],
			transition: {
				duration: .45,
				ease: [
					.76,
					0,
					.24,
					1
				]
			}
		},
		exit: {
			d: [
				"M 0 0 L 0 100 L 100 100 L 100 0 Z",
				"M 0 0 L 0 100 L 60 100 Q 120 50 60 0 Z",
				"M 0 0 L 0 100 L 0 100 L 0 0 Z"
			],
			transition: {
				duration: .45,
				ease: [
					.76,
					0,
					.24,
					1
				]
			}
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "relative w-full min-h-[420px] flex items-center justify-center",
		children: [/* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				scale: .96,
				y: 10
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .96,
				y: -10
			},
			transition: {
				duration: .4,
				ease: "easeOut"
			},
			className: "w-full",
			children: displayChildren
		}, stageKey), /* @__PURE__ */ jsx(AnimatePresence, { children: isTransitioning && /* @__PURE__ */ jsx(motion.div, {
			initial: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { delay: .9 },
			className: "fixed inset-0 pointer-events-none z-50 w-full h-full",
			children: /* @__PURE__ */ jsxs("svg", {
				viewBox: "0 0 100 100",
				preserveAspectRatio: "none",
				className: "w-full h-[120vh] -mt-[10vh] fill-[#111]",
				children: [/* @__PURE__ */ jsx(motion.path, {
					variants: animCurtain,
					initial: "initial",
					animate: "mid",
					exit: "exit",
					className: "opacity-10"
				}), /* @__PURE__ */ jsx(motion.path, {
					variants: animCurtain,
					initial: "initial",
					animate: "mid",
					exit: "exit"
				})]
			})
		}) })]
	});
}
//#endregion
//#region src/components/App.tsx
function OnboardingSteps() {
	const { step, user, logout } = useIntelScout();
	const getStepTitle = (s) => {
		switch (s) {
			case 1: return "Define GTM Offer";
			case 2: return "Build Customer Profile";
			case 3: return "Map Operational Pains";
			case 4: return "Tune Intent Weights";
			case 5: return "Import Accounts Queue";
			default: return "";
		}
	};
	const renderWizardStep = () => {
		switch (step) {
			case 1: return /* @__PURE__ */ jsx(Stage1Offer, {});
			case 2: return /* @__PURE__ */ jsx(Stage2ICP, {});
			case 3: return /* @__PURE__ */ jsx(Stage3Pain, {});
			case 4: return /* @__PURE__ */ jsx(Stage4Weights, {});
			case 5: return /* @__PURE__ */ jsx(Stage5Import, {});
			default: return null;
		}
	};
	if (typeof step === "string") return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-transparent flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-black selection:text-white",
		children: [
			user && /* @__PURE__ */ jsxs("div", {
				className: "absolute top-6 right-6 flex items-center space-x-2 sm:space-x-3 bg-white/80 border border-black/10 rounded-full py-1.5 px-2.5 sm:pl-2.5 sm:pr-4 shadow-sm backdrop-blur-md z-40",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: user.avatar,
						alt: user.name,
						className: "w-5 h-5 rounded-full ring-1 ring-black/10"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "hidden sm:flex flex-col text-left",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-bold text-[#111] max-w-[100px] truncate leading-tight font-outfit",
							children: user.name
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[8px] text-[#666] truncate leading-none max-w-[100px]",
							children: user.email
						})]
					}),
					/* @__PURE__ */ jsx("div", { className: "hidden sm:block w-px h-5 bg-black/10" }),
					/* @__PURE__ */ jsxs("button", {
						onClick: logout,
						className: "text-[#555] hover:text-red-500 transition text-[9px] font-bold flex items-center space-x-1.5 uppercase tracking-wider cursor-pointer",
						title: "Sign Out",
						children: [/* @__PURE__ */ jsx(SignOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "Sign Out"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-3xl flex flex-col items-center mb-8 text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center justify-center mb-2 text-black",
						children: /* @__PURE__ */ jsx(AnimatedLogo, {
							className: "w-6 h-6",
							showText: true
						})
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-xl font-bold text-[#111] mb-4 font-outfit tracking-tight",
						children: "Campaign Configuration"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center space-x-2 w-full max-w-sm mt-2",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((s) => /* @__PURE__ */ jsx("div", {
							className: "flex-1 flex items-center",
							children: /* @__PURE__ */ jsx("div", { className: `h-1.5 w-full rounded-full transition-all duration-500 ${s <= step ? "bg-black shadow-sm" : "bg-black/10"}` })
						}, s))
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "text-[10px] font-bold text-[#666] uppercase tracking-widest mt-3.5",
						children: [
							"Step ",
							step,
							" of 5 • ",
							getStepTitle(step)
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "w-full flex justify-center items-center",
				children: /* @__PURE__ */ jsx(LiquidCurtain, {
					stageKey: step,
					children: renderWizardStep()
				})
			})
		]
	});
}
function MainAppContent() {
	const { step, isAuthenticated, isAuthLoading } = useIntelScout();
	if (isAuthLoading) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-transparent flex flex-col justify-center items-center p-6 font-sans",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center space-y-3",
			children: [/* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-black" }), /* @__PURE__ */ jsx("span", {
				className: "text-[#555] text-xs font-semibold",
				children: "Initializing IntelScout Engine..."
			})]
		})
	});
	if (!isAuthenticated) return /* @__PURE__ */ jsx(LandingPage, {});
	if (step === "research") return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-transparent flex flex-col justify-center items-center p-6 font-sans",
		children: /* @__PURE__ */ jsx(ResearchEngine, {})
	});
	if (step === "dashboard") return /* @__PURE__ */ jsx(DashboardLayout, {});
	return /* @__PURE__ */ jsx(OnboardingSteps, {});
}
function Page() {
	return /* @__PURE__ */ jsx(IntelScoutProvider, { children: /* @__PURE__ */ jsx(MainAppContent, {}) });
}
//#endregion
//#region src/components/Root.tsx
function Root() {
	return /* @__PURE__ */ jsxs(ThemeProvider, {
		attribute: "class",
		defaultTheme: "system",
		enableSystem: true,
		disableTransitionOnChange: true,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none z-[-2] flex justify-center overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", { className: "w-full h-full grid-bg absolute inset-0" }), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-vignette" })]
			}),
			/* @__PURE__ */ jsx(CursorGlow, {}),
			/* @__PURE__ */ jsx("div", {
				className: "relative z-10 flex flex-col min-h-screen",
				children: /* @__PURE__ */ jsx(Page, {})
			})
		]
	});
}
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://signal-scout.com");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const session = await getSession(Astro.request);
	return renderTemplate`<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5"><title>IntelScout AI - Enterprise GTM Intelligence & Qualification</title><meta name="description" content="IntelScout crawls target domains in real-time — tracking hiring signals, pricing changes, and tech stack shifts — then scores every account automatically."><!-- SEO & Crawlability --><link rel="canonical" href="https://signal-scout.com/"><meta name="robots" content="index, follow"><meta name="author" content="IntelScout AI"><meta name="keywords" content="B2B intent data, GTM intelligence, account scoring, real-time crawler, technographics, compliance signals, sales pipeline"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url" content="https://signal-scout.com/"><meta property="og:title" content="IntelScout AI - Enterprise GTM Intelligence &amp; Qualification"><meta property="og:description" content="Real-time AI crawler, technographics parser, and account qualification scoring engine. Know who's buying before they tell you."><meta property="og:image" content="https://signal-scout.com/og-image.jpg"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url" content="https://signal-scout.com/"><meta property="twitter:title" content="IntelScout AI - Enterprise GTM Intelligence"><meta property="twitter:description" content="Qualify B2B accounts to win using real-time technographic and behavioral signals."><meta property="twitter:image" content="https://signal-scout.com/og-image.jpg">${renderHead($$result)}</head><body class="min-h-screen w-full overflow-x-hidden flex flex-col relative noise-overlay bg-background text-foreground transition-colors duration-300">${renderComponent($$result, "Root", Root, {
		"session": session,
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "@/components/Root",
		"client:component-export": "default"
	})}</body></html>`;
}, "D:/demo/signal-scout/src/pages/index.astro", void 0);
var $$file = "D:/demo/signal-scout/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };

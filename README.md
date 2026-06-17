# SignalScout AI: The GTM Operating System

SignalScout is a premium, AI-powered GTM intelligence platform that acts as a GTM analyst, transforming raw company target lists into prioritized revenue opportunities.

![SignalScout Dashboard Console](docs/vanta_drawer_open.png)

---

## 🎯 GTM Philosophy
Every GTM team asks:
1. Who should we target?
2. Why are they a fit?
3. Why would they buy?
4. Why now?
5. Who should we contact?
6. What angle should we use?
7. Which accounts should be prioritized first?

SignalScout automates this entire qualification, scoring, and research lifecycle.

---

## ⚙️ Technical Architecture
- **Frontend Framework**: Next.js 16 (React 19, TypeScript)
- **Styling Tokens**: Tailwind CSS v4 & custom Outfit/Inter typography configurations
- **Animations**: Framer Motion (for modal drawer slide-overs and real-time feed cards)
- **Icons**: Lucide React
- **Local Runtime**: Node.js v20.11.1 (portable package setup inside workspace)

---

## 🚀 14-Stage Product Lifecycle

1. **Stage 1: Define Offer**: Configure GTM selling targets, problem resolutions, deal metrics, and sales cycles.
2. **Stage 2: ICP Builder**: Generates ideal customer firmographics, technographics, growth signals, and buying committees.
3. **Stage 3: Pain Mapping**: Connects target customer problems to operational pains, triggers, and buying motivations.
4. **Stage 4: Dynamic Signal Generation**: Weight configurations for high, medium, and weak intent matches.
5. **Stage 5: Account Import**: Drag-and-drop CSV parser mapping columns and domains.
6. **Stage 6: Research Engine**: Real-time simulated crawling logger executing homepage meta checks, job board reviews, and technology stack audits.
7. **Stage 7: Qualification Engine**: Computes Opportunity Score using:
   $$\text{Opportunity Score} = (\text{ICP Fit} \times 0.4) + (\text{Intent} \times 0.25) + (\text{Timing} \times 0.15) + (\text{Signal Score} \times 0.2)$$
8. **Stage 8: Why This Account**: Detailed explainable priority logs.
9. **Stage 9: Buying Committee Mapping**: Predicts Economic Buyers, Technical Buyers, Champions, and Target End Users.
10. **Stage 10: GTM Recommendations**: Direct outbound messaging blueprints containing contacts, pain summaries, and pitch scripts.
11. **Stage 11: Account Prioritization**: Groups accounts into Tier 1 (Immediate outreach), Tier 2 (Contact this week), Tier 3 (Nurture), and Tier 4 (Monitor).
12. **Stage 12: Intelligence Feed**: Active background webhook feed firing new alerts and dynamically updating target opportunity scores.
13. **Stage 13: Dashboard**: KPI counters, deal sizing trackers, and live interactive SVG score charts.
14. **Stage 14: Exports**: HTML5 Client-side CSV download exporter.

---

## 📂 Project Directory Structure
```
signal-scout/
├── docs/                      # Verification reports and visual assets
│   ├── implementation_plan.md
│   ├── task.md
│   ├── walkthrough.md
│   └── vanta_drawer_open.png
├── public/                    # Next.js static files
├── src/
│   ├── app/
│   │   ├── globals.css        # Stylesheets & dark theme tokens
│   │   ├── layout.tsx         # HTML shell wrapper
│   │   └── page.tsx           # Step router dispatcher
│   ├── context/
│   │   └── SignalScoutContext.tsx # Central GTM logic state and simulators
│   └── components/
│       ├── Onboarding/        # Stages 1 to 6 setup wizard components
│       │   ├── Stage1Offer.tsx
│       │   ├── Stage2ICP.tsx
│       │   ├── Stage3Pain.tsx
│       │   ├── Stage4Weights.tsx
│       │   ├── Stage5Import.tsx
│       │   └── ResearchEngine.tsx
│       └── Dashboard/         # Workspace dashboard layouts & modules
│           ├── DashboardLayout.tsx
│           ├── Sidebar.tsx
│           ├── Navbar.tsx
│           ├── KPIWidgets.tsx
│           ├── AnalyticsCharts.tsx
│           ├── AccountsTable.tsx
│           ├── CompanyDetailsDrawer.tsx
│           ├── IntelligenceFeed.tsx
│           └── SettingsPanel.tsx
├── package.json
└── tsconfig.json
```

---

## 💻 Running Locally

To run the development server using the portable Node.js runtime environment installed in the workspace directory, run:

```powershell
# Prepend portable Node path and run dev
$env:PATH = "d:\demo\node-portable;" + $env:PATH
npm run dev
```

Then open your browser and navigate to **`http://localhost:3000`** to view the application.

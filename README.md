# ⚡ DAO AUTOPILOT

> **AI-driven governance infrastructure.**
> Generate proposals. Analyze votes. Automate operations.

---

## 🎯 CAPABILITIES

### 🧠 Proposal Generation
- Context-aware AI proposal creation using Claude
- DAO-specific formatting and tone adaptation
- Historical proposal pattern analysis
- Real-time execution timer

### 📊 Governance Intelligence
- Live Snapshot voting statistics
- 20 pre-loaded top DAOs (Arbitrum, Uniswap, ENS, Gitcoin, Optimism, etc.)
- Real-time metrics: quorum %, voting periods, success rates
- GraphQL integration with Snapshot API

### 🖥️ Operator Interface
- Ghost Layer aesthetic: calm, lethal, zero corporate theater
- Mobile-responsive tactical layout
- Smart input locking during execution
- Scrollable output with one-click copy

---

## 🔩 STACK
```
Frontend:     Next.js 16, React 19, TypeScript
Styling:      Tailwind v4, Ghost Layer design system
AI:           Anthropic Claude API
Data:         Snapshot GraphQL, Supabase
Deploy:       Vercel-ready
```

---

## ⚙️ SETUP

**Prerequisites**
- Node.js 20+
- Anthropic API key
- Supabase project *(optional — future features)*

**Install**
```bash
git clone https://github.com/intenxe-ops/dao-autopilot.git
cd dao-autopilot
npm install
```

**Environment**
```bash
cp .env.example .env.local
```

Required variables:
```
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

**Run**
```bash
npm run dev
```

Navigate to `http://localhost:3000`

---

## 🗺️ ARCHITECTURE
```
src/
├── app/
│   ├── api/
│   │   ├── proposals/        → Proposal generation endpoint
│   │   └── snapshot/         → Snapshot data fetching
│   ├── dashboard/            → Future: multi-DAO dashboard
│   ├── globals.css           → Ghost Layer color system
│   ├── layout.tsx            → Root layout
│   └── page.tsx              → Landing + hero
├── components/
│   └── ProposalGenerator.tsx → Main UI (dropdown + stats + form)
├── lib/
│   ├── claude.ts             → Claude API client
│   ├── dao-data.ts           → Top 20 DAO constants
│   ├── snapshot-api.ts       → Snapshot GraphQL queries (stats)
│   ├── snapshot.ts           → Snapshot utilities
│   ├── supabase.ts           → DB client (future use)
│   └── utils.ts              → Shared utilities
└── types/
    └── index.ts              → TypeScript definitions
```

---

## 🚀 USAGE

**Generate Proposal**
1. Select DAO from dropdown or enter custom Snapshot space
2. Review live governance stats *(quorum, voting period, success rate)*
3. Describe proposal idea
4. Generate → AI creates full governance proposal
5. Copy → paste into Snapshot. Done.

**DAO Stats**
- Fetches last 20 proposals from selected DAO
- Calculates average quorum participation
- Shows typical voting duration
- Displays proposal success rate
- Updates in real-time on DAO selection

---

## 🛣️ ROADMAP

**Phase 1: Generation** ✅ Complete
- AI proposal generation
- DAO selector with stats
- Ghost Layer UI

**Phase 2: Intelligence** 🔄 In Progress
- Voting pattern analysis
- Historical proposal learning
- Sentiment scoring
- Template library

**Phase 3: Automation** 📌 Planned
- Auto-monitor quorum thresholds
- Proposal lifecycle tracking
- Agent voting assistant
- Multi-DAO dashboard

---

## 🎨 DESIGN PHILOSOPHY

**Ghost Layer** aesthetic principles:
- ☠️ Calm lethal energy
- 🚫 Zero corporate speak
- 🎯 Operator-grade interfaces
- 📡 Maximum information density
- ⚡ Minimal friction workflows
```
Color:      Pure grayscale (#0a0a0a → #ffffff)
Type:       Thin display, tactical mono tracking
Spacing:    Generous breathing room, sharp edges
Motion:     Subtle, purposeful, no theater
```

---

## 🔌 API STRUCTURE

**POST** `/api/proposals/generate`
```json
{
  "daoSpace": "gitcoindao.eth",
  "idea": "Allocate 100K GTC for developer tooling grants"
}
```

Response:
```json
{
  "success": true,
  "proposal": "# [Proposal] ...",
  "metadata": {
    "daoSpace": "gitcoindao.eth",
    "generatedAt": "2026-03-09T14:30:00Z"
  }
}
```

---

## 🌐 DEPLOYMENT

**Vercel** *(Recommended)*
```bash
vercel --prod
```

Required env vars:
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🤝 CONTRIBUTING

Building in public. Day-by-day ops documentation.

**Current focus:**
- 🔍 Voting pattern analysis integration
- 📚 Proposal template library
- 🧬 Historical learning layer

**Stack requirements:**
- TypeScript strict mode
- Ghost Layer design compliance
- Zero fluff, maximum utility
- Operator-first UX

---

## 📄 LICENSE

MIT

---

> **Building the operator interface for DAO governance.**
> Not just tools. Cognitive infrastructure.

*[@intenxe-ops](https://github.com/intenxe-ops)*
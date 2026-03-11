# ⚡ DAO AUTOPILOT

> **Governance intelligence platform for protocol DAOs.**
> AI-powered proposal generation optimized for voting patterns. Built for governance teams.

---

## 🎯 CAPABILITIES

### 🧠 AI Proposal Generation
- Context-aware proposals using Claude Sonnet 4
- Optimized for DAO-specific voting patterns
- Success keyword integration (based on historical data)
- Risk signal avoidance (keywords correlated with failure)
- Real-time execution tracking

### 📊 Governance Intelligence
- Live Snapshot voting statistics
- 20 pre-loaded top DAOs (Arbitrum, Uniswap, ENS, Gitcoin, Optimism, etc.)
- Real-time metrics: quorum %, voting periods, success rates
- Voting pattern analysis: power distribution, proposal success patterns
- Keyword extraction: risk signals vs success signals
- Behavioral intelligence: voter profiling, governance activity tracking
- Intelligence-driven optimization: proposals designed to pass

### 🔐 Authentication & Access
- **Google OAuth**: One-click sign in for governance teams
- **MetaMask**: Web3-native wallet authentication
- Dual auth tracking in Supabase
- User session management

### 💰 Revenue Infrastructure
- **Free Tier**: 10 proposals/month
- **Pro Tier**: Unlimited proposals ($999/month)
- Usage tracking per user (both auth types)
- Hard limit enforcement with upgrade path
- Self-serve monetization ready

### 🖥️ Operator Interface
- Ghost Layer aesthetic: calm, lethal, zero theater
- Mobile-responsive tactical layout
- Smart input locking during execution
- Usage counter with limit enforcement
- One-click copy/download proposals

---

## 🔩 STACK
```
Frontend:     Next.js 16, React 19, TypeScript
Styling:      Tailwind v4, Ghost Layer design system
AI:           Anthropic Claude Sonnet 4
Auth:         Supabase Auth (Google OAuth + custom)
Wallet:       wagmi (MetaMask connector)
Data:         Snapshot GraphQL, Supabase
Deploy:       Vercel-ready
```

---

## ⚙️ SETUP

**Prerequisites**
- Node.js 20+
- Anthropic API key
- Supabase project
- Google OAuth credentials (for auth)

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
# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Snapshot (optional - uses default hub URL if not set)
SNAPSHOT_HUB_URL=https://hub.snapshot.org/graphql

# Alchemy (optional - for enhanced RPC)
ALCHEMY_API_KEY=your_alchemy_key
```

**Database Setup**
Run SQL migrations in Supabase:
```sql
-- Run supabase/schema.sql for initial setup
-- Includes: profiles, user_proposals tables
-- RLS policies for both Google + wallet users
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
│   │   └── proposals/generate/  → AI proposal endpoint
│   ├── providers.tsx            → Wagmi + Auth providers
│   ├── globals.css             → Ghost Layer color system
│   ├── layout.tsx              → Root layout
│   └── page.tsx                → Landing + auth gates
├── components/
│   ├── ProposalGenerator.tsx  → Main UI (usage tracking + limits)
│   └── SignInModal.tsx        → Google + MetaMask auth
├── lib/
│   ├── auth-context.tsx       → Auth provider (dual auth)
│   ├── wagmi-config.ts        → MetaMask connector
│   ├── claude.ts              → Claude API client (intelligence-aware)
│   ├── dao-data.ts            → Top 20 DAO constants
│   ├── snapshot-api.ts        → Snapshot GraphQL (stats)
│   ├── voting-analysis.ts     → Voting intelligence engine
│   ├── usage-tracking.ts      → Free tier limits + tracking
│   └── supabase.ts            → DB client
└── types/
    └── index.ts               → TypeScript definitions
```

---

## 🚀 USAGE

**Sign In**
1. Click "Sign In" → Choose Google OAuth or MetaMask
2. Authenticate and gain access to generator
3. Free tier: 10 proposals/month

**Generate Proposal**
1. Select DAO from dropdown or enter custom Snapshot space
2. Review live governance stats (quorum, voting period, success rate)
3. 🔍 Analyze voting intelligence (power distribution, success patterns)
4. Describe proposal idea
5. Generate → AI creates optimized proposal
6. Copy/download for Snapshot

**🧠 Voting Intelligence**
- Analyzes last 50 proposals + 1000 votes from selected DAO
- 🐋 Power distribution: whale voters and concentration %
- 📈 Success patterns: proposal categories with pass rates
- 🗝️ Keyword analysis: language correlated with success/failure
- ⚡ Activity level: governance velocity tracking
- 🎯 Agent optimization: proposals written to maximize pass rate

**💰 Upgrade to Pro**
- Hit 10 proposal limit → Upgrade prompt appears
- Contact for Pro tier: unlimited proposals
- Admin sets `tier = 'pro'` in profiles table

---

## 🛣️ ROADMAP

**Phase 1: Generation** ✅ Complete
- AI proposal generation with Claude
- DAO selector with live stats
- Ghost Layer UI/UX

**Phase 2: Intelligence** ✅ Complete
- Voting pattern analysis
- Voter power distribution profiling
- Proposal category success detection
- Keyword extraction (risk vs success)
- Context-aware agent optimization

**Phase 2.5: Authentication** ✅ Complete
- Google OAuth integration
- MetaMask wallet connect
- Dual auth tracking in Supabase
- User session management

**Phase 2.6: Revenue** ✅ Complete
- Usage tracking (both auth types)
- Free tier limits (10 proposals/month)
- Hard enforcement at limit
- Pro tier ready ($999/month unlimited)

**Phase 3: Automation** 📌 Next
- Stripe integration (self-serve Pro upgrades)
- Multi-DAO dashboard
- Proposal lifecycle tracking
- Auto-monitor quorum thresholds
- Team collaboration features

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
  "proposal": "# [Proposal] Developer Tooling Grant Program\n\n## Summary\n...",
  "usedIntelligence": true,
  "metadata": {
    "daoSpace": "gitcoindao.eth",
    "generatedAt": "2026-03-11T18:30:00Z"
  }
}
```

**Intelligence Integration**
- Agent receives voting intelligence context
- Optimizes language for success keywords
- Avoids risk signals from historical failures
- Adapts to DAO-specific patterns

---

## 💾 DATABASE SCHEMA

**profiles**
```sql
- id (uuid, pk)
- email (text, nullable)
- wallet_address (text, nullable, unique)
- tier (text: 'free' | 'pro' | 'enterprise')
- auth_type (text: 'google' | 'wallet')
```

**user_proposals**
```sql
- id (uuid, pk)
- user_id (uuid, nullable, fk profiles.id)
- wallet_address (text, nullable)
- dao_space (text)
- proposal_text (text)
- created_at (timestamp)
```

**Usage Tracking**
- Free tier: 10 proposals/month
- Count resets on calendar month boundary
- Queries: `WHERE created_at >= start_of_month`

---

## 🌐 DEPLOYMENT

**Vercel** (Recommended)
```bash
vercel --prod
```

**Required Environment Variables**
```
ANTHROPIC_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Google OAuth Setup**
1. Create OAuth app in Google Cloud Console
2. Add credentials to Supabase Auth providers
3. Configure redirect URL: `{SUPABASE_URL}/auth/v1/callback`

**Database Migrations**
Run `supabase/schema.sql` in Supabase SQL Editor before deployment.

---

## 🤝 CONTRIBUTING

Building in public. Operator-first development.

**Current Focus**
- Stripe integration for self-serve Pro upgrades
- Team collaboration features (multi-seat Pro tier)
- API access for Pro users
- Proposal template library

**Stack Requirements**
- TypeScript strict mode
- Ghost Layer design compliance
- Zero fluff, maximum utility
- Operator-first UX

---

## 📊 MONETIZATION

**Free Tier**
- 10 proposals/month
- Full voting intelligence
- All 20 pre-loaded DAOs
- Download/copy proposals

**Pro Tier** ($999/month)
- Unlimited proposals
- Team seats (10 users)
- API access
- Priority support

**Enterprise** (Custom pricing)
- White-label deployment
- Unlimited seats
- Custom integrations
- Dedicated support channel

**Revenue Infrastructure**
- Self-serve auth (Google + MetaMask)
- Usage tracking per user
- Hard limit enforcement
- Upgrade path ready
- Stripe integration planned

---

## 📄 LICENSE

MIT

---

> **Governance intelligence platform built for protocol DAOs.**
> Not just tools. Revenue-ready infrastructure for DAO operations teams.

**Open Source** • **Built in Public** • **Operator-Grade**

*[@intenxe-ops](https://github.com/intenxe-ops)*
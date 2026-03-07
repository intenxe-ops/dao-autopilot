# DAO Autopilot 🤖

> **AI-powered governance proposal generator that learns from your DAO's history**

Generate professional DAO proposals in 15 seconds. Trained on 13,000+ DAOs via Snapshot.

[![GitHub](https://img.shields.io/github/stars/intenxe-ops/dao-autopilot?style=social)](https://github.com/intenxe-ops/dao-autopilot)

---

## ⚡ What It Does

DAO Autopilot generates governance proposals by:
1. **Learning from your DAO** - Pulls recent proposals from any Snapshot space
2. **Analyzing patterns** - Claude AI studies structure, tone, and format
3. **Generating proposals** - Creates new proposals matching your DAO's style

**Example:** Enter `arbitrumfoundation.eth` + your idea → Get a full Arbitrum-style proposal in 15 seconds.

---

## 🎯 Why This Exists

**The Problem:**
- Writing governance proposals takes hours
- Generic templates don't match DAO culture
- Contributors struggle with formatting/structure

**The Solution:**
- AI that learns each DAO's unique style
- Instant generation with proper structure
- Works with any DAO on Snapshot (13,000+)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Claude API key ([get one here](https://console.anthropic.com))
- Supabase account (free tier works)

### Installation
```bash
# Clone the repo
git clone https://github.com/intenxe-ops/dao-autopilot.git
cd dao-autopilot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Shadcn/ui
- **Backend:** Next.js API routes
- **AI:** Claude Sonnet 4 (Anthropic)
- **Data:** Snapshot GraphQL API
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

---

## 📊 Features

### ✅ Current
- AI proposal generation from any DAO's history
- Snapshot API integration (13,000+ DAOs)
- Copy to clipboard
- Markdown output

### 🚧 Coming Soon
- DAO selector dropdown (popular DAOs)
- Markdown preview toggle
- Voting analytics dashboard
- Telegram alerts for governance events
- Multi-DAO comparison

---

## 🎯 Use Cases

**For Individual Contributors:**
- Draft proposals quickly for your DAO
- Learn from successful proposal patterns
- Improve proposal quality

**For DAOs:**
- Standardize proposal formats
- Reduce contributor friction
- Automate governance operations

---

## 🔧 Configuration

### Environment Variables
```bash
# Claude AI
ANTHROPIC_API_KEY=your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Database Setup

Run the SQL schema from `/supabase/schema.sql` in your Supabase dashboard.

---

## 📖 How It Works

1. **User enters DAO space** (e.g., `arbitrumfoundation.eth`) and proposal idea
2. **System fetches** last 5 proposals from Snapshot API
3. **Claude analyzes** proposal structure, tone, sections, formatting
4. **AI generates** new proposal matching the DAO's style
5. **User gets** formatted proposal ready to post

---

## 🤝 Contributing

This is an open-source project built in public. Contributions welcome.

**Current focus areas:**
- Frontend UI/UX improvements
- Additional DAO integrations (Tally, Aragon)
- Analytics features
- Performance optimizations

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🔗 Links

- **Twitter:** [@intenxe-ops](https://twitter.com/intenxe_ops)
- **GitHub:** [intenxe-ops](https://github.com/intenxe-ops)

---

## ⚡ Built by [@intenxe-ops](https://github.com/intenxe-ops)

Building autonomous governance infrastructure for DAOs.

*Day 2 of building in public.*

---

**Questions?** Open an issue or DM on Twitter.
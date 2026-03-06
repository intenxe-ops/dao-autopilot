# DAO Autopilot

Autonomous governance infrastructure for DAOs. AI agents that generate proposals, analyze voting patterns, and automate operations.

## What It Does

- **AI Proposal Generation**: Generate governance proposals in minutes by learning from past successful proposals
- **Voting Analytics**: Real-time insights on voter behavior and participation patterns  
- **Smart Alerts**: Never miss quorum or important governance events

## Tech Stack

- Next.js 14 + TypeScript
- Claude AI (Anthropic)
- Snapshot API
- Supabase
- Tailwind CSS

## Status

🚧 **Day 1 Complete** - Working proposal generation API

## Setup
```bash
npm install
cp .env.local.example .env.local
# Add your API keys
npm run dev
```

## API Usage
```bash
curl -X POST http://localhost:3000/api/proposals/generate \
  -H "Content-Type: application/json" \
  -d '{"daoSpace": "arbitrumfoundation.eth", "idea": "Your proposal idea"}'
```

---

**Building in public.** Follow progress: [@intenxe-ops](https://github.com/intenxe-ops)
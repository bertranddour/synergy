# 7 Flows Synergy -- Pricing Strategy

> Internal strategy document -- April 2026

## Pricing Decision

| Plan | Price | Effective monthly | Savings |
|------|-------|-------------------|---------|
| **Monthly** | **$29/month** | $29/mo | -- |
| **Yearly** | **$290/year** | $24.17/mo | 2 months free ($58 saved) |

---

## Table of Contents

1. [Product Value Analysis](#1-product-value-analysis)
2. [Infrastructure Cost Breakdown](#2-infrastructure-cost-breakdown)
3. [AI Token Cost Model](#3-ai-token-cost-model)
4. [Competitive Landscape](#4-competitive-landscape)
5. [Pricing Rationale](#5-pricing-rationale)
6. [Revenue Projections](#6-revenue-projections)
7. [Future Growth Path](#7-future-growth-path)

---

## 1. Product Value Analysis

### Complete Feature Inventory

| Category | Features | Value Signal |
|----------|----------|-------------|
| **4 Frameworks** | Core X (validation), Air X (flex work), Max X (scaling), Synergy X (human-AI collab) | Structured methodology |
| **29 Modes** | Guided business exercises with field-by-field coaching, decisions, metrics | Depth of content |
| **AI Coach (Alicia)** | Real-time streaming coaching, 5 surfaces, cross-framework intelligence, 6 tools | Unlimited AI coaching |
| **Health Dashboard** | 5 health categories, 0-100 scoring, trends, sparklines, risk identification | Business intelligence |
| **Progress Rings** | 3-ring system (completion/consistency/growth), 12-week history, streaks | Gamification & habits |
| **Assessments** | 4 framework assessments (28 scenarios), maturity levels, AI debriefs | Diagnostic capability |
| **Training Programs** | Multi-day structured learning paths per framework + full cross-framework program | Guided onboarding |
| **Teams** | Team creation, member management, aggregated health, role-based access | Collaboration |
| **Mode Composability** | Connected mode chains with AI-suggested next steps | Intelligent workflow |
| **Proactive Nudges** | AI-generated observations (stale assumptions, procrastination, readiness) | Behavioral coaching |
| **Data Export** | GDPR-compliant full data download | Trust & compliance |

### Unique Differentiators

- **Only product** that operationalizes human-AI collaboration as a structured framework (Synergy X)
- **Cross-framework intelligence**: Alicia diagnoses if a problem in one area is actually rooted in another (e.g., execution issue is actually a flex work problem)
- **Dual metrics**: Performance AND dynamics (learning, collaboration, fun) -- not just OKRs
- **Composability chains**: Modes connect logically, Alicia suggests the next step
- **Contextual AI**: Coaching based on actual business data, not generic advice
- **29 modes with assessments**: Deepest structured methodology in the market

### Value Comparison

A business coach charges $200-500/hour. At 2 sessions/month that's $400-1,000/mo. Synergy offers unlimited AI coaching with structured methodology for $29/mo -- a **93-97% cost reduction** vs. human coaching.

---

## 2. Infrastructure Cost Breakdown

### Cloudflare Stack (Paid Plan: $5/month base)

| Service | Included Allowance | Per-user estimate | Notes |
|---------|-------------------|-------------------|-------|
| **Workers** | 10M requests/mo | ~$0.002 | ~200 API calls/user/mo |
| **D1 (SQLite)** | 25B rows read, 50M writes | ~$0.001 | Generous free tier |
| **Durable Objects** | 1M requests, 1GB storage | ~$0.005 | 1 DO per user (Alicia state) |
| **KV** | 10M reads, 1M writes | ~$0.001 | Rate limiting + cache |
| **R2** | 10GB storage, 10M reads | ~$0.001 | Data exports |
| **AI Gateway** | Unlimited | $0.00 | Request logging/caching |
| **Queues** | 1M operations | ~$0.000 | Background jobs |

**Infrastructure cost per user: ~$0.01/month**

At scale, the $5/month base fee is amortized across users. Cloudflare's generous included tiers mean infrastructure costs are negligible until tens of thousands of users.

### Infrastructure Scaling Thresholds

| Users | Monthly infra cost | Per-user cost |
|-------|-------------------|---------------|
| 100 | ~$6 | $0.06 |
| 500 | ~$8 | $0.016 |
| 1,000 | ~$12 | $0.012 |
| 5,000 | ~$25 | $0.005 |
| 10,000 | ~$50 | $0.005 |

---

## 3. AI Token Cost Model

### Claude Sonnet 4.6 Pricing

- **Input**: $3.00 per million tokens
- **Output**: $15.00 per million tokens
- **Prompt caching** (available, not yet implemented): Cache reads at 0.1x price

### Token Usage Per Interaction

| AI Feature | System prompt | Context | Response | Total tokens | Cost |
|------------|--------------|---------|----------|-------------|------|
| **Coaching stream** | ~7,400 | ~2,600 | ~3,000 | ~13,000 | $0.075 |
| **Assessment debrief** | ~1,500 | ~500 | ~250 | ~2,250 | $0.009 |
| **Proactive observation** | ~1,500 | ~300 | ~250 | ~2,050 | $0.008 |
| **Program summary** | ~1,500 | ~500 | ~250 | ~2,250 | $0.009 |

### System Prompt Breakdown (Coaching Stream)

| Component | File | Tokens |
|-----------|------|--------|
| Personality | `agents/alicia/prompts/personality.ts` | ~3,500 |
| Cross-framework rules | `agents/alicia/prompts/cross-fw.ts` | ~1,200 |
| Surface context | `agents/alicia/prompts/surfaces.ts` | ~1,800 |
| Mode coaching | `agents/alicia/prompts/mode-coach.ts` | ~900 |
| **Total system prompt** | | **~7,400** |

### Monthly AI Cost Per User Profile

| Profile | Description | Coaching | Assessments | Nudges | **Total AI** |
|---------|-------------|----------|-------------|--------|-------------|
| **Light** | Casual, 1x/week | 4 sessions ($0.30) | 0.5 ($0.005) | 4 ($0.03) | **$0.34** |
| **Medium** | Regular, 2x/week | 8 sessions ($0.60) | 1 ($0.009) | 8 ($0.06) | **$0.67** |
| **Heavy** | Active, 5x/week | 20 sessions ($1.50) | 2 ($0.018) | 12 ($0.10) | **$1.62** |
| **Power** | Daily+ | 40 sessions ($3.00) | 4 ($0.036) | 16 ($0.13) | **$3.17** |

### Blended Average Cost

Estimated user distribution: 60% light, 25% medium, 10% heavy, 5% power.

**Blended AI cost: ~$0.62/month per user**

### Cost Optimization Opportunities

| Optimization | Savings | Effort | Priority |
|-------------|---------|--------|----------|
| **Prompt caching** | ~60% on system prompts | Low | High |
| **Batch API** for debriefs/nudges | 50% on non-streaming | Low | High |
| **Haiku** for simple nudges | ~90% on observations | Medium | Medium |
| **Response length tuning** | 10-20% overall | Low | Low |

With prompt caching + Batch API, blended cost drops to **~$0.30/month per user**.

---

## 4. Competitive Landscape

### Direct Competitors: AI Coaching Platforms

| Product | Price | Model | Strengths | Weaknesses vs. Synergy |
|---------|-------|-------|-----------|----------------------|
| **BetterUp** | $71-223/mo (individual) | Human + AI hybrid | Brand, enterprise trust, human coaches | 10-50x more expensive, no structured frameworks |
| **Risely** | $59/mo ($708/yr) | AI-native | 83 skill assessments, Slack integration | No business frameworks, no composability |
| **Rocky.ai** | $10-13/mo | AI chatbot | Affordable, simple | Very light, no structured modes, no health tracking |
| **CoachHub** | $3-5K/yr (enterprise) | Human coaches | Enterprise positioning | Expensive, no AI-native features, enterprise-only |
| **Marlee (F4S)** | $0-29/mo | AI motivational | Free tier, team analysis | Personality-focused, no business operations |
| **MyCoach AI** | $20+/mo | AI coaching | Affordable | Generic, no domain-specific frameworks |

### Adjacent Competitors: Business & People Management

| Product | Price/user/mo | What they do | Gap vs. Synergy |
|---------|--------------|-------------|----------------|
| **Lattice** | $4-11 | Performance reviews, OKRs, engagement | HR-centric, no business fitness methodology |
| **15Five** | $4-14 | Weekly check-ins, performance, engagement | No AI coaching, no frameworks |
| **Culture Amp** | $9-14 | Employee surveys, analytics | Survey tool, no coaching or training |
| **Leapsome** | $8-18 | Goals, reviews, surveys, learning | Modular HR, no business coaching |
| **Asana** | $13-30 | Project management | Task tracking only |
| **ClickUp** | $7-12 | Work management | Productivity tool, not coaching |
| **Monday.com** | $9-12 | Work OS | Visual workflows, no methodology |

### Pricing Map

```
Price/mo    Category
$200+       BetterUp, CoachHub (human coaching)
 $59        Risely (AI coaching, skill assessments)
 $29    --> SYNERGY (AI coaching + business frameworks + health)  <--
 $13        Rocky.ai (AI chatbot only)
 $9-18      Lattice, Leapsome, Culture Amp (HR tools, no coaching)
 $7-12      ClickUp, Monday (PM tools)
```

### Key Market Insights

1. **AI coaching is 5-20x cheaper** than human coaching -- customers expect value, not discounts
2. **$29/mo is the median** for AI-native SaaS with differentiated value
3. **Annual discount of ~17%** (2 months free) is standard and expected
4. **No competitor** combines structured business frameworks + AI coaching + health metrics

---

## 5. Pricing Rationale

### Why $29/month

**Value-based:**
- Unlimited AI coaching (vs. BetterUp's $71 for 1 session/month)
- 29 structured modes (vs. Risely's 83 generic skill assessments)
- 4 complete frameworks with assessments + training programs
- Team features included (competitors charge $4-14/user extra)
- Proactive AI nudges + health tracking + progress gamification

**Cost-based:**
- Blended COGS: ~$0.62/mo (current), ~$0.30/mo (with optimizations)
- **Gross margin: 97.9%** (current), **99.0%** (optimized)
- Even power users ($3.20 COGS) yield **89% margin**
- Sustainable even if AI costs increase 10x

**Market-based:**
- Below Risely ($59) -- room to raise later
- Above Rocky.ai ($13) -- reflects deeper value
- Within business tools range ($9-30) but with AI coaching
- Yearly at $290 -- below the $300 psychological barrier

**Strategic:**
- Accessible for solo founders (primary entry point)
- Credible for growing teams (not a "cheap tool")
- Room to add Pro/Team/Enterprise tiers above

### Why $290/year (2 months free)

- $348 at monthly rate --> $290 annually = **$58 saved (16.7%)**
- Round number under $300/year psychological barrier
- 2 months free is a compelling, easy-to-communicate offer
- Improves cash flow and reduces churn (annual commitment)
- Industry standard: most SaaS offer 15-20% annual discount

---

## 6. Revenue Projections

### Monthly Recurring Revenue (MRR)

Assuming 70% monthly / 30% annual split initially:

| Users | Monthly MRR | Annual ARR |
|-------|------------|-----------|
| 100 | $2,763 | $33,156 |
| 500 | $13,815 | $165,780 |
| 1,000 | $27,630 | $331,560 |
| 5,000 | $138,150 | $1,657,800 |

*MRR formula: (users x 0.7 x $29) + (users x 0.3 x $24.17)*

### Unit Economics

| Metric | Value |
|--------|-------|
| **ARPU** (blended) | ~$27.55/mo |
| **COGS** (blended) | ~$0.62/mo |
| **Gross margin** | 97.7% |
| **Breakeven users** (covering $5 Cloudflare base) | 1 user |

### AI Cost at Scale

| Users | Monthly AI spend | % of Revenue |
|-------|-----------------|--------------|
| 100 | $62 | 2.2% |
| 500 | $310 | 2.2% |
| 1,000 | $620 | 2.2% |
| 5,000 | $3,100 | 2.2% |

AI costs scale linearly with users and remain ~2.2% of revenue.

---

## 7. Future Growth Path

### Phase 1: Launch ($29/mo)

Single plan, all features included. Build user base, gather usage data, validate pricing.

### Phase 2: Team Tier ($49-79/mo)

When team features mature:
- Admin dashboard and reporting
- Team-level coaching insights
- Custom frameworks / modes
- Priority support
- SSO / SAML

### Phase 3: Enterprise (Custom)

When targeting 50+ seat organizations:
- Volume licensing
- Dedicated Alicia instance
- Custom framework development
- API access
- SLA guarantees
- Compliance certifications

### Price Increase Strategy

Starting at $29 preserves room to increase:
- **Grandfather existing users** at original price for 12 months
- **Add features to higher tiers**, not remove from base
- Market benchmark: $39-59/mo is sustainable long-term for this category

---

## Sources

### Competitive Pricing (April 2026)
- [AI Coaching Platform Pricing Guide 2026](https://risely.me/compare/pricing-guide/)
- [BetterUp Pricing](https://elearningindustry.com/directory/elearning-software/betterup/pricing)
- [15Five vs Lattice Pricing 2026](https://comparetiers.com/compare/15five-vs-lattice)
- [ClickUp Pricing 2026](https://costbench.com/software/project-management/clickup/)

### Infrastructure Pricing
- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [Cloudflare Durable Objects Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)

### AI API Pricing
- [Claude API Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Claude Sonnet 4.6 Pricing](https://pricepertoken.com/pricing-page/model/anthropic-claude-sonnet-4.6)

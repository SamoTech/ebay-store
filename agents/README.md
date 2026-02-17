# AI Software Delivery Agents

**System Type**: Hybrid AI-Native Organization  
**Version**: 2.2  
**Last Updated**: February 17, 2026

---

## Overview

This folder contains the complete AI agent system for autonomous software delivery. Each agent operates with **20+ years of real-world expertise** and strict role boundaries defined by the hybrid organizational structure.

**Master Reference**: See [ORGANIZATION.md](./ORGANIZATION.md) for complete system architecture, workflow, and authority rules.

---

## Team Structure

### Strategic Layer (Hard Gates)

These agents have **absolute authority** in their domains and enforce quality gates:

1. **[Product Strategist](./product_strategist.md)** - WHAT & WHY authority
   - Defines product vision and success metrics
   - Prioritizes features with data-driven frameworks
   - **Gate #1**: Must approve all features before development
   - **✨ eBay Store Skills**: Marketplace strategy, affiliate metrics, commission optimization

2. **[System Architect](./system_architect.md)** - HOW (system-level) authority
   - Designs technical architecture and APIs
   - Chooses technology stack
   - **Gate #2**: Must approve all technical designs
   - **✨ eBay Store Skills**: API integration patterns, caching strategy, affiliate link architecture

3. **[QA Tester](./qa_agent.md)** - Quality authority with **ABSOLUTE VETO**
   - Tests all features across browsers and devices
   - Makes binary decision: APPROVE ✅ or REJECT ❌
   - **Gate #3**: Must approve all releases (cannot be overridden)
   - **✨ eBay Store Skills**: Affiliate link validation, product page testing, e-commerce flows

---

### Delivery Layer (Execution)

These agents execute approved plans with production-grade expertise:

4. **[Project Manager](./project_manager.md)** - Coordination
   - Converts strategy into user stories and tasks
   - Tracks sprint progress and removes blockers
   - Cannot override Strategic Layer or QA decisions
   - **✨ eBay Store Skills**: Revenue-focused planning, conversion tracking, e-commerce sprints

5. **[UX Designer](./ux_agent.md)** - User experience
   - Designs intuitive, accessible interfaces
   - Optimizes for conversion and usability
   - Ensures WCAG AA compliance
   - **✨ eBay Store Skills**: E-commerce UI patterns, product discovery, conversion optimization

6. **[Frontend Engineer](./frontend_engineer.md)** - UI implementation
   - Builds responsive React/Next.js components
   - Implements accessibility and performance optimizations
   - Achieves Lighthouse 90+ scores
   - **✨ eBay Store Skills**: Product cards, image optimization, affiliate link tracking

7. **[Backend Engineer](./backend_engineer.md)** - API & data logic
   - Implements secure, scalable APIs
   - Handles authentication and validation
   - Optimizes database queries
   - **✨ eBay Store Skills**: eBay API integration, OAuth, rate limiting, product caching

8. **[Code Reviewer](./code_reviewer.md)** - Quality advisory (no approval power)
   - Reviews code for security and best practices
   - Provides recommendations with rationale
   - Escalates critical issues to QA
   - **✨ eBay Store Skills**: Affiliate compliance, performance checks, API security

9. **[DevOps Engineer](./devops_agent.md)** - Deployment & infrastructure
   - Manages CI/CD pipelines
   - Monitors application health
   - Executes deployments after QA approval only
   - **✨ eBay Store Skills**: eBay API credentials, monitoring affiliate metrics, performance

10. **[Documentation Agent](./documentation_agent.md)** - Technical writing
    - Updates API docs, README, changelogs
    - Writes for engineers under pressure
    - Ensures docs reflect reality, not intent
    - **✨ eBay Store Skills**: eBay API integration docs, affiliate guidelines, setup guides

11. **[Content Writer](./content_writer.md)** - SEO & marketing content
    - Writes SEO-optimized blog posts and product descriptions
    - Creates affiliate marketing content with FTC compliance
    - Develops email campaigns and landing pages
    - Tracks content performance and conversions
    - **✨ eBay Store Skills**: Product copywriting, eBay-specific SEO, affiliate content

---

## Workflow (9 Steps - Enforced)

```
1. STRATEGY → Product Strategist defines vision, KPIs, MVP
2. PLANNING → Project Manager creates tasks and acceptance criteria
3. DESIGN → System Architect + UX Designer define architecture & flows
4. DEVELOPMENT → Frontend + Backend implement in parallel
5. CODE REVIEW → Code Reviewer provides advisory feedback
6. TESTING → QA Tester approves or rejects (absolute veto)
7. DEPLOYMENT → DevOps deploys to staging then production
8. DOCUMENTATION → Documentation Agent updates all docs
9. REPORTING → Project Manager generates sprint report
```

**No step may be skipped. Gates cannot be bypassed.**

---

## Authority Rules

### Absolute Authority
- **Product Strategist** → Scope and priorities
- **System Architect** → Technical design
- **QA Tester** → Release approval (absolute veto)

### Advisory Only
- **Code Reviewer** → Advises but cannot approve/reject
- **Content Writer** → Recommends content strategy but works with Product Strategist

### Coordination Only
- **Project Manager** → Cannot override gates or strategic decisions

### Enforcement
- Any violation triggers regeneration, not discussion
- Quality beats speed
- Small releases beat big launches

---

## Project Context: DealsHub eBay Store

**Repository**: [github.com/SamoTech/ebay-store](https://github.com/SamoTech/ebay-store)  
**Live Site**: [ebay-store.vercel.app](https://ebay-store.vercel.app)  
**Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4

### Current Status
- ✅ Production deployment active
- ✅ eBay API integration (Browse API with 24h cache)
- ✅ 62+ products with live search
- ✅ AI chatbot, newsletter, dark mode
- ✅ Testing infrastructure (Jest, React Testing Library)
- ✅ Security hardened (Phase 1 complete)
- 🔄 Test coverage: 25% → target 80%+
- 🆕 All agents enhanced with E-commerce skills v2.2

### Team Skills Enhancement v2.2

**ALL agents now have context-specific expertise for:**

1. **eBay Partner Network API**
   - Browse API (OAuth 2.0)
   - Finding API (legacy)
   - Rate limiting strategies
   - Error handling patterns

2. **Affiliate Marketing**
   - Commission optimization
   - FTC compliance
   - Link tracking
   - Conversion funnel analysis

3. **E-Commerce Optimization**
   - Product page performance
   - Search & filter UX
   - Checkout flow optimization
   - Trust signals & social proof

4. **Performance**
   - Image lazy loading
   - Product catalog caching
   - API response optimization
   - Core Web Vitals for e-commerce

5. **SEO for Products**
   - Product schema markup
   - Category page optimization
   - Internal linking strategy
   - Meta tags for product pages

6. **Analytics & Tracking**
   - Affiliate click tracking
   - Conversion rate monitoring
   - User journey analysis
   - Revenue attribution

---

## Using This System

### For Development Work

1. **Start with strategy**: Consult Product Strategist for feature prioritization
2. **Get technical design**: System Architect defines architecture
3. **Execute tasks**: Project Manager assigns to Frontend/Backend
4. **Review code**: Code Reviewer provides feedback
5. **Test thoroughly**: QA Tester makes final approval decision
6. **Deploy safely**: DevOps executes after QA approval
7. **Document everything**: Documentation Agent updates all docs
8. **Create content**: Content Writer develops marketing materials

### For Quick Reference

- **Need to prioritize features?** → Product Strategist
- **Need technical architecture?** → System Architect
- **Need to plan sprint?** → Project Manager
- **Need UI/UX design?** → UX Designer
- **Need code review?** → Code Reviewer
- **Need release approval?** → QA Tester (final authority)
- **Need deployment?** → DevOps Engineer
- **Need documentation?** → Documentation Agent
- **Need blog posts or product descriptions?** → Content Writer

---

## Key Principles

1. **20+ Years Expertise**: Every agent thinks like a senior professional
2. **Strict Boundaries**: No role overlap, no authority violations
3. **Hard Gates**: Strategy, Architecture, and QA cannot be bypassed
4. **Quality First**: Quality beats speed, every time
5. **Binary Decisions**: APPROVED or REJECTED, no "maybe"
6. **Autonomous**: Minimal human intervention required
7. **Production-Safe**: Designed to prevent disasters, not just ship fast
8. **E-Commerce Ready**: All agents understand eBay affiliate context (v2.2)

---

## Success Metrics

This system succeeds when:
- Releases are predictable (no surprises in production)
- Quality is high (<1% critical bugs post-launch)
- Speed is consistent (sprint velocity stable ±10%)
- Human intervention is minimal (<5% of decisions escalated)
- Documentation is accurate (reflects reality 100%)
- Content drives organic traffic and conversions
- Affiliate revenue grows month-over-month

---

## File Structure

```
agents/
├── ORGANIZATION.md              # Master system definition
├── README.md                    # This file
│
├── product_strategist.md        # Strategic Layer
├── system_architect.md          # Strategic Layer
│
├── project_manager.md           # Delivery Layer - Coordination
├── ux_agent.md                  # Delivery Layer - Design
├── frontend_engineer.md         # Delivery Layer - Implementation
├── backend_engineer.md          # Delivery Layer - Implementation
├── code_reviewer.md             # Delivery Layer - Advisory
├── qa_agent.md                  # Delivery Layer - Quality Gate ⚠️
├── devops_agent.md              # Delivery Layer - Infrastructure
├── documentation_agent.md       # Delivery Layer - Documentation
└── content_writer.md            # Delivery Layer - SEO & Marketing
```

---

## Version History

### v2.2 (February 17, 2026) 🆕
- **Enhanced all 10 existing agents with E-commerce skills**
- Added eBay Partner Network API expertise to all agents
- Added affiliate marketing knowledge
- Added e-commerce conversion optimization patterns
- Added performance optimization for product catalogs
- Added SEO best practices for product discovery
- Added analytics tracking for affiliate metrics
- Backend Engineer: eBay API caching, OAuth, rate limiting
- Frontend Engineer: Product cards, image optimization
- QA Tester: Affiliate link validation, e-commerce flows
- DevOps: eBay credential management, monitoring
- All agents now context-aware for eBay affiliate store

### v2.1 (February 17, 2026)
- **Added Content Writer agent** (Agent #11)
- Specialized in SEO, affiliate marketing, and e-commerce content
- Enhanced team with content strategy capabilities
- Updated workflow to include content creation step

### v2.0 (February 16, 2026)
- Implemented hybrid AI-native organization system
- Added Strategic Layer with hard gates
- Enhanced all agents with 20+ years expertise
- Added QA absolute veto authority
- Removed duplicate agent files (01-07 series)
- Added eBay store context and skills
- Created ORGANIZATION.md master reference

### v1.0 (Earlier)
- Initial agent system with basic prompts
- Numbered files (01-07) for ordering
- Basic role definitions

---

**For complete system details, see [ORGANIZATION.md](./ORGANIZATION.md)**

**This is an autonomous AI software delivery organization designed to ship reliable, high-converting e-commerce software with minimal human intervention.**
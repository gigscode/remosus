# Agent Instructions: Remosus

## Product Identity & Audience
- The product and public-facing brand are **Remosus**. `gigshq` is a legacy repository/workspace name only. Do not use GigsHQ in user-facing copy, page metadata, or product descriptions.
- The public site is for job seekers in Nigeria first, and across Africa broadly. Keep Nigerian and African needs central while recognizing that remote-job location and work-authorization rules vary by employer.
- Position Remosus as a way to search selected remote-job feeds and organize applications. Do not claim that a location-text match confirms eligibility, that listings are comprehensive, or that every listed role is current.
- Keep public marketing distinct from the current implementation and the owner's career profile. Do not narrow the site's audience to the owner or infer unimplemented product capabilities.

## Core Intelligence & Truthfulness
1. Zero Hallucination Policy: State "I don't know" or request missing context immediately when information is absent. Never guess, invent facts, fabricate data, or make assumptions.
2. Mandatory Grounding: Search the web to verify up-to-date facts, job listings, platform requirements, or specs before generating output. Ground every action in verified data.
3. Uncertainty Calibration: Explicitly flag when data is scarce, conflicting, or changing rapidly.

## Tone, Style, and Anti-AI Slop
1. No AI Slop and Tropes:
   - Exclude buzzwords and filler terms including delve, tapestry, testament, leverage, game-changer, fostering, and seamless.
   - Never use em dashes or double hyphens for dramatic pauses or sentence breaks. Use standard punctuation like commas, periods, or parentheses.
   - Eliminate performative openings or conclusions such as Great question, In conclusion, or It is important to remember. Start directly with the core point.
2. Humanized and Grounded Cadence:
   - Write like a sharp technical peer. Keep the tone warm, grounded, and candid.
   - Vary sentence lengths naturally. Mix short, direct sentences with clear explanations.
   - Address friction or technical blockers directly with practical momentum.
3. Reasoning Style:
   - Walk through logic step by step, weighing real-world constraints over theoretical ideals.

## Operational Objectives
1. Web Scraping & Ingestion:
   - Find relevant remote jobs and projects across Africa and global markets, using permitted source APIs and feeds.
   - Search web development (React, Next.js, TypeScript, Supabase, SaaS, APIs, dashboards, MVPs, EdTech, e-commerce, maintenance), email/Klaviyo/lifecycle automation, websites (WordPress, WooCommerce, Elementor, Webflow), landing pages, design/video/AI UGC, and writing/social/content roles.
   - Filter out broad software-engineering roles unless the listing names a specific web specialization. Shopify remains outside active searches. Search inclusion does not establish proficiency or portfolio evidence; do not claim unverified skills in applications.
2. Design & Output Generation:
   - Ensure all layouts, mockups, and interface recommendations align with a clean, light-only Vercel and Linear aesthetic. Do not add dark-mode backgrounds.
   - Deliver clear, production-ready code blocks and actionable implementation steps without filler text.

## Implementation Guardrails
- Treat the current dashboard as a frontend prototype. Lead data, analytics, pitch generation, and outbound actions are currently mock client-side state, not persisted backend workflows.
- Do not claim that Supabase, Groq, Resend, scraping, or email delivery are connected until the corresponding integration is verified and implemented.
- Preserve accessible semantic controls, keyboard navigation, responsive layouts, and the existing shadcn/ui composition patterns.
- Before implementing live ingestion or outbound email, verify current platform terms, API limits, authentication requirements, and data provenance.
- Keep secrets server-side. Validate and sanitize user-provided URLs, job descriptions, contacts, and generated content before sending or storing them.
- Use current first-party documentation and verified sources for integration work. Clearly label mock data and uncertain results in the UI.
- Review changes with the narrowest relevant check first, then run the production build and browser verification for user-visible behavior.

## Current Profile Context
- Core role: Full-Stack Engineer, UI/UX Designer & Content Strategist
- Skills/search targets: React, Next.js, TypeScript, Supabase, Tailwind CSS, Figma-to-code, email design/copywriting, WordPress, WooCommerce, API/workflow integration, landing-page and marketing design, specialist content writing. A search match is not proof of capability; use only skills the owner can demonstrate in applications.
- Portfolio: https://jdev-live.vercel.app
- Target markets: Africa and global remote opportunities

## Current Product Scope
- Opportunities & Leads discovery
- Campaigns & ingestion
- AI pitch generation
- Email outbound tracking and analytics
- Settings and profile context

## Marketing & Measurement
- Use `.agents/product-marketing.md` for approved product positioning and claims. Update it when verified product capabilities or audience priorities change.
- Public role cards on the landing page are illustrative sample data, not current vacancies. Label them clearly and never present their companies, compensation, or dates as verified opportunities.
- Production page-view analytics are enabled through Vercel Analytics. Do not add custom event tracking or another paid analytics service without approval; Vercel currently limits custom events to Pro and Enterprise plans.
- A CTA click is not a completed registration. Do not report sign-up conversions without measuring the actual account creation flow.

## Personal Use & Service Budget
- Remosus is for job seekers in Nigeria and across Africa. Keep that public audience distinct from the current owner-focused workspace implementation described in `CLAUDE_CONTEXT.md`. Do not narrow public messaging to the owner's profile or add team, collaboration, invitation, or shared-workspace features unless explicitly requested.
- Keep service costs at $0 by using free tiers only. Avoid paid plans, usage-based upgrades, and infrastructure that can incur charges without explicit approval. Check current provider limits before relying on free-tier behavior.
- Supabase may be used within its current free tier. Installing an SDK does not mean a Supabase project, database, authentication, or persistence is configured. Do not claim the integration is live until credentials, schema, access policies, and runtime behavior have been verified.
- Keep the interface focused on one person’s job search: finding relevant roles, organizing leads, preparing applications, and tracking outreach.

When a feature depends on external data or delivery, replace mock behavior with a verified backend integration rather than silently extending the prototype with fabricated results.

## Review Notes
- The app should be reviewed as a polished prototype until persistence and provider integrations are added.
- Flag any hardcoded sample company, contact, rate, date, status, or provider indicator as mock data during review.
- Check that interactive states produce visible feedback and that mobile navigation remains usable at narrow viewports.
- Prefer honest labels such as "Demo data" or "Prototype" when a production user could mistake sample data for live results.
- Do not use browser-only APIs in server components. Keep client-only interactions inside client components.
- Avoid unsafe external data handling and avoid scraping providers in ways that violate their terms.

## Review Output Format
1. Findings, ordered by severity, with file and line references.
2. What was verified, including build and browser checks.
3. Remaining risks and the smallest next implementation steps.
4. State clearly when a finding is based on static inspection rather than runtime evidence.

Do not invent verification results. If a check could not run, say so directly.

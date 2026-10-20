# remosus: App Context for Claude

## What this app is

Remosus is a job-search product for Nigerians and Africans looking for remote work. The public site should speak to that audience, not just the owner's profile. The current authenticated workspace is owner-focused: it helps organize relevant opportunities, prepare tailored applications, and follow up on outreach. Do not infer unimplemented multi-user, team, or collaboration features from the broader public audience.

This is not a multi-tenant SaaS product. Do not add team, invitation, collaboration, or shared-workspace features unless explicitly requested.

## Owner profile and target work

- Core positioning: Full-Stack Engineer, UI/UX Designer, and Content Strategist.
- Priority searches: web and full-stack development (React, Next.js, TypeScript, Supabase, SaaS, APIs, dashboards, MVPs, EdTech, and e-commerce); email marketing and design (Klaviyo, lifecycle, automation, deliverability, and ESP migration); landing pages and website development/maintenance (including WordPress, WooCommerce, Elementor, and Webflow); design and creative production (including graphic, brand, logo, presentation, AI ad/UGC, and short-form video work); and writing/content support (including social media, SaaS, technical, AI-assisted, and repurposing work).
- Search terms are not proof of experience. Do not claim Klaviyo, AI-generated UGC, social-account management, logo design, or other unverified capabilities in applications without evidence from the owner's portfolio or confirmation. Shopify is not an active search.
- Portfolio: https://jdev-live.vercel.app
- Target markets: African opportunities and global remote work.
- Active discovery uses the expanded terms across the six search lanes below. Shopify and broad Web3/software roles are not active searches. Search inclusion does not mean the owner has verified experience in every listed service.

## Current product areas

The public landing page is at `/`. The authenticated personal workspace is at `/app`, and sign-in / account creation is at `/login`. The dashboard is focused on discovering roles first. Its navigation contains:

1. **Job discovery**: Reads Jobicy, Remote OK, and Freehire job feeds through an authenticated server route. The initial view combines Remote OK with up to 200 Jobicy listings and Freehire search results; a cursor-based “Load more” requests further Jobicy pages. The server filters listings using six target-work lanes: web development, AI/business and email automation, email/Klaviyo, websites/WooCommerce, design/creative production, and writing/content. The expanded terms include SaaS, MVP, API, dashboard, EdTech, e-commerce, lifecycle email, deliverability, ESP migration, WordPress/Elementor/Webflow, landing-page, graphic/brand/logo/presentation design, AI UGC/video, and social/content roles. A result needs a matching role signal and relevant skill evidence in its title, full description, or source tags. Broad “Software Engineer” titles are excluded unless they clearly name a full-stack/frontend/React/Next.js role. The server includes the matched category with each result so the UI uses the same decision. This is a keyword rule, not an AI fit score or proof the owner meets every requirement. Results are de-duplicated by source URL, cached upstream for up to 6 hours, and link to their original source. Cards show each source's posting date when valid date data is available; otherwise the date is marked unavailable, not estimated. Location filters are heuristics; verify eligibility and listing availability on the original page.
2. **Opportunities & Leads**: Add, edit, search, filter, update status, and delete opportunities. Saved Jobicy, Remote OK, and Freehire listings are added to the signed-in user's Supabase account, with their source name and URL retained.
3. **Campaigns & Ingestion**: Navigation exists, but campaign management and ingestion workflows are not connected.
4. **AI Pitch Generator**: A review-only draft tool using OpenRouter's `nvidia/nemotron-3.5-lightning:free` model. It accepts one saved opportunity and a selected PDF, DOCX, or TXT CV, extracts CV text on the server, and returns an editable pitch draft in the browser. It does not persist or send the draft. Runtime behavior still needs verification with a signed-in account, configured `OPENROUTER_API_KEY`, an opportunity, and a supported CV.
5. **Email Outbound Tracker**: Navigation exists, but email sending and outreach tracking are not connected.
6. **Settings / Profile Context**: Includes account details and three private career-document categories:
   - Master CV
   - Social media & content writer CV
   - WordPress CV

The CV uploader accepts PDF, DOC, DOCX, and TXT files up to 10 MB. It uploads to the private Supabase Storage bucket named `career-documents`, organizes objects under the authenticated user's ID and CV category, lists saved files, and supports removing files.

The owner reports that the Supabase Storage SQL setup ran successfully. The setup script is in `supabase/migrations/20261016000000_create_private_career_documents_bucket.sql`. This report is not the same as an independently verified end-to-end upload test.

## What is connected and what is not

### Connected in the code

- Next.js app using the App Router and React.
- Supabase authentication gates `/app` and the job feed. Unauthenticated visitors to the workspace are redirected to sign-in. `/` is a public product landing page; account creation is available at `/login?mode=sign-up`.
- The migration `supabase/migrations/20261016220700_create_profiles_for_auth_users.sql` creates a profile row for every new Supabase Auth user and backfills existing users. It must be applied to the Supabase project before claiming profile rows are being created in production; email confirmation settings do not affect the database trigger.
- Supabase client and server helpers are configured in `lib/supabase/`.
- Opportunity records are read and managed through the `opportunities` table.
- Job discovery uses Jobicy's public API (`https://jobicy.com/api/v2/remote-jobs`), Remote OK's public feed (`https://remoteok.com/api`), and Freehire's search endpoint (`https://freehire.me/api/v1/jobs/search`) from `app/api/jobs/route.ts`. The route requires an authenticated session, fetches sources concurrently on initial load, reports partial source failures, and paginates Jobicy with its cursor on request. Upstream requests are cached for 6 hours. The UI credits sources and sends application clicks to original listings. Remotive is excluded from discovery because its public API terms prohibit displaying its listings to collect signups; reconsider only after written permission or an appropriate paid API agreement. Freehire's terms prohibit scraping beyond its documented API, but do not clearly establish commercial reuse rights; confirm the endpoint's terms and permissions with Freehire before charging users.
- Career documents use Supabase Storage with owner-folder access policies in the migration above.
- Mobile navigation and responsive dashboard layouts are present.

### Not connected yet

- Jobicy, Remote OK, and Freehire are the connected sources; the current source set primarily returns remote roles. The app does not yet include local/on-site African roles, freelance marketplaces, or scheduled ingestion. Jobicy pagination is user-triggered. Feed results are not persisted until the user saves an individual role as a lead. These sources are not comprehensive enough to claim broad African-market coverage.
- The target-role rules use simple role and skill phrases. They can miss relevant work described with unusual wording, and can still return a role that requires skills the owner does not have. General “Software Engineer” roles are excluded unless a specific web specialization appears in the title; .NET-led titles are excluded because .NET is not in the active skill profile. Shopify is not an active search. Search inclusion for AI UGC, social-media management, logo design, or other services does not establish portfolio evidence or proficiency.
- The pitch generator calls OpenRouter from `app/api/ai/pitch/route.ts`. It requires `OPENROUTER_API_KEY` in local and deployed server environments. The selected CV and opportunity details are sent to OpenRouter and its model provider for generation, as disclosed in the UI.
- The current model ID has the `:free` variant. Availability and provider limits can change; check current OpenRouter model pricing/limits before relying on free service. Do not add credits or paid usage without explicit approval.
- The server can extract text from PDF, DOCX, and TXT files for a pitch. DOC files can be stored but cannot currently be parsed for generation.
- No email delivery provider or automatic sending. Do not build auto-send unless explicitly requested; generated messages should be reviewable first.
- Campaigns and outbound analytics are not implemented as live workflows.
- Do not describe mock UI, example data, or planned integrations as live functionality.

## AI API direction and privacy

The owner wants a free option. OpenRouter free model variants are a possible starting point, but model availability and free limits can change. Verify the selected model's current pricing, limits, and provider policies before implementing. Do not add paid credits, paid services, or infrastructure that can incur charges without explicit approval.

If AI generation is implemented:

- Make provider calls from a server-side route or server action. Never expose the API key in client-side code.
- Use an environment variable such as `OPENROUTER_API_KEY`; do not commit secrets.
- Start from the shortest relevant CV information and job description. Do not transmit full documents, contact data, or unrelated personal information without a clear need and user awareness.
- Validate input sizes and types, handle provider errors visibly, and clearly identify generated text as a draft that needs human review.
- Do not send emails automatically.

## Design and implementation preferences

- Keep the interface light-only, clean, and focused, with a restrained Vercel/Linear-style visual language.
- Build for one person's job search, not a B2B team workflow.
- Preserve accessible semantic controls, keyboard operation, responsive behavior, and existing shadcn/ui composition patterns.
- Treat this as a working prototype until the related backend and provider workflows have actually been configured and tested.
- Show clear feedback for success and failure. Label sample data and prototype behavior honestly.
- Keep secrets server-side. Validate and sanitize user-controlled text, URLs, files, and generated content.
- Prefer small, direct changes consistent with the existing codebase. Avoid unrelated refactors.
- Before changing dependencies, inspect the package manifest and lockfile. There may already be ongoing local changes.
- Run the narrowest relevant check first, then the production build for substantial changes. Do not claim a browser, provider, or Supabase flow was tested unless it was.

## Practical near-term priority

The two-week goal favors useful, low-friction work over building a broad automation platform. Prioritize:

1. Verify all three feeds, Jobicy cursor pagination, profile keyword filtering, source attribution, apply links, partial-source error display, and saving a listing into the user's opportunity pipeline.
2. Add further job sources only after verifying their access methods, free limits, terms, geographic coverage, freshness, and attribution rules. The target includes local African, global remote, freelance, and contract work; the two remote feeds are not sufficient coverage.
3. Keep AI-assisted application drafts secondary to job discovery, free-only, editable, truthful, and human-reviewed.
4. Do not automate email sending or claim listings are current without checking the source page.

# Remosus Product Marketing Context

## Product overview

Remosus helps job seekers search selected remote-job feeds, save promising opportunities, and organize application follow-up in one workspace.

## Audience

- Primary audience: job seekers in Nigeria.
- Broader audience: job seekers across Africa looking for remote work.
- The site should recognize practical friction such as unclear country eligibility, work-authorization limits, scattered listings, and keeping track of applications.
- Do not imply that every role is open to applicants in Nigeria or Africa. Employers set their own location and work-authorization rules.

## Positioning

**Working description:** A clearer remote job search for Nigerians and Africans.

**Practical value:** Search selected feeds, match roles and location terms, save opportunities, and keep application details together.

## Verified product facts and limits

- The authenticated discovery page reads selected feeds, currently Jobicy, Remote OK, and Freehire, and links listings to their original sources.
- Role and region matching uses listing text and keyword rules. It does not verify hiring eligibility or work authorization.
- The public landing page's role cards and dashboard mockups are illustrative examples, not live vacancies or verified company, compensation, and application data.
- The current product does not comprehensively cover all African jobs, local/on-site roles, or freelance marketplaces.
- The existing implementation and integration limits are documented in `CLAUDE_CONTEXT.md`. Do not infer features beyond what is verified there.

## Voice and claims

- Be direct, warm, candid, and specific to Nigerian and African job seekers.
- Keep sentences short. Acknowledge uncertainty around remote eligibility and stale listings.
- Never invent user results, testimonials, job coverage, hiring outcomes, or product capabilities.
- Prefer "matches location text" to "verifies eligibility."
- Avoid implying that a sample card is a real vacancy or that a search result guarantees fit.

## Measurement

- Production page-view analytics use Vercel Analytics.
- Custom events are not implemented. Vercel's current documentation says custom events require Pro or Enterprise, so do not add them or another paid service without approval.
- Do not count landing-page CTA clicks as completed registrations. Measure registration only if the actual account-creation outcome is instrumented.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Secrets and environment handling

- Never commit real API keys, tokens, or credentials.
- Keep secrets only in local environment files such as `.env.local` and never paste them into chats, PRs, or code comments.
- This project ignores `.env`, `.env.*`, and `.env.local` in Git so the real OpenRouter key stays out of source control.
- Use `.env.example` as the safe template and replace the placeholder value locally only.
- If a key is entered into the shell, terminal history, logs, or tool output, rotate it immediately.

## Remosus design and engineering standards

These rules apply to all UI work in this project. Follow them without exception.

### Brand colors

- Primary brand purple: `#7c3aed` (violet-600). Use for CTAs, active states, pill labels, icon fills.
- Hover brand purple: `#6d28d9` (violet-700). Use on hover only.
- Accent purple (lighter text): `#7e22ce` (purple-700).
- Background: `#fcfbfa` (warm off-white). Avoid pure `#ffffff` for page backgrounds.
- Heading text: `text-slate-900`.
- Body text: `text-slate-600`.
- Muted / metadata text: `text-slate-400` or `text-slate-500`.
- Emerald accent: `#059669` / `#0d9488` for success and "open" states.
- Do not introduce new brand colors without explicit user approval.

### Typography

- Use `font-extrabold` + `tracking-[-0.04em]` for all primary headings.
- Hero headline minimum: `text-4xl sm:text-5xl lg:text-6xl`.
- Body minimum: `text-base leading-relaxed` (`sm:text-lg sm:leading-8` in hero).
- Never use `font-light` or `font-thin` for body copy.

### Product identity and copy voice
- The product and public-facing brand are **Remosus**. `gigshq` is a legacy repository/workspace name only. Do not use GigsHQ in user-facing copy or product metadata.
- The public site is for job seekers in Nigeria first, and across Africa broadly. Do not narrow the audience to the owner's profile.
- Write as a knowledgeable friend, not a brand manager. Speak directly to African remote job seekers: Nigeria, Ghana, Kenya, and the continent broadly.
- Be empathetic. Acknowledge real obstacles: time zones, visa walls, bandwidth drops, inconsistent hiring signals.
- Keep sentences short and grounded. Avoid corporate buzzwords: "synergy", "leverage", "ecosystem", "empower", "robust", "seamless", "supercharge".
- Never invent statistics, testimonials, customer logos, certifications, or product capabilities that are not verified in the codebase.
- Flag missing content with a `<!-- CONTENT NEEDED: ... -->` comment instead of fabricating it.
- **No em dashes anywhere in source copy.** Use a comma, period, or rewrite the sentence instead. Em dashes in `AGENTS.md` lines added by `next dev` are exempt.

### Icons

- Use Lucide React exclusively. Import only what you use.
- No AI-generic icons: do not use `Sparkles`, `Zap`, `Bot`, `Cpu`, `BrainCircuit`, `Network`, or any radar-ping / ripple animation pattern.
- Icon sizes follow a predictable scale: `size-3` (inline metadata), `size-3.5` (small inline), `size-4` (standard inline), `size-5` (compact UI element), `size-6` (card header), `size-12` (feature card hero icon).

### Layout and spacing

- Floating navbar: `fixed top-4 left-0 right-0 z-50` with `rounded-2xl` border and backdrop blur.
- Section padding scale: `py-12 sm:py-20 lg:py-28` for major sections. Never `py-20` as the mobile base for a full section.
- Trust ribbon: `py-4 sm:py-6` vertical padding, `gap-y-2 sm:gap-y-3` for item rows.
- Feature cards: `p-5 sm:p-9` (never `p-7` as the mobile base).
- Job cards: `p-4` on mobile. Pill badges: `py-0.5` height.
- Use `gap-1.5` (not `gap-2`) for tight pill badge rows.
- Filter pills: `px-3 py-1` on all screen sizes. Do not use `px-4 py-1.5` for filter controls.

### Accessibility

- All interactive elements must have visible focus styles: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]`.
- Buttons used for navigation (e.g. job card) must have `aria-label` describing the target.
- Icons are always `aria-hidden="true"` when accompanied by visible text.
- Modals must trap focus and close on `Escape`.
- Motion: all translate/scale/opacity transitions must be wrapped in or respect `prefers-reduced-motion`. Use `motion-safe:` Tailwind prefix when adding keyframe animations.
- Minimum contrast: 4.5:1 for body text, 3:1 for large text and UI components.

### Semantic HTML

- Use the correct element for the job: `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<a>`. Do not use `<div onClick>` where a `<button>` or `<a>` is appropriate.
- Every `<section>` must have an `id` for nav anchor links.
- Landmark regions (`<header>`, `<main>`, `<footer>`) must each appear once per page.

### Responsive design

- Mobile-first. The base class is the mobile style. Use `sm:`, `lg:`, `xl:` to enhance upward.
- Test mental-model at 375px, 768px, 1280px.
- Two-column grid for job cards: `grid-cols-1 sm:grid-cols-2`. Never force a grid that breaks at 375px.
- Images and mockups: use `w-full max-w-xs sm:max-w-sm` patterns for phone mockups in hero.

### Component patterns

- `'use client'` only on components that use hooks, browser APIs, or event handlers. Server components by default.
- Supabase auth via `@/lib/supabase/client`. Never call auth outside of client components or server actions.
- Form inputs: use `bg-white border-slate-200 focus:ring-[#7c3aed]/20` styling. Never use tinted lavender fill (`bg-[#f0edf8]`) as it looks like a disabled state.
- Inputs in forms must be `disabled={pending}` during async submit to prevent double-submission.
- "Forgot password?" link belongs inline with the Password label, right-aligned, not between fields.

### Validation

- Run `npx tsc --noEmit` after every code change. It must exit 0 before declaring a task done.
- Do not declare a task done if TypeScript errors exist, even if the UI looks correct.
- Do not change authentication flows, database schemas, environment files, or unrelated pages unless the user explicitly requests it.

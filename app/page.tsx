'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BookmarkCheck,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  FolderKanban,
  Globe,
  Heart,
  MapPin,
  Play,
  Search,
  Send,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react'
import { JobCard, JobDetailModal, type JobCardData } from '@/components/job-card'

/* ─────────────────────────────────────────
   Sticky-nav: Floating rounded island
───────────────────────────────────────── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="sticky top-4 z-50 mx-auto w-full max-w-5xl px-4 sm:px-6">
      <header
        className={`flex items-center justify-between rounded-full border border-slate-200/90 bg-white/85 px-4 py-2.5 shadow-lg shadow-slate-900/5 backdrop-blur-md transition-all duration-300 sm:px-6 ${
          scrolled ? 'border-slate-300/80 bg-white/95 shadow-md' : 'bg-white/85'
        }`}
      >
        {/* Closed gap between logo icon and text */}
        <Link href="/" aria-label="Remosus home" className="group flex items-center gap-1.5">
          <Image
            src="/gigshqicon.png"
            alt=""
            width={30}
            height={30}
            className="rounded-xl transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-[1.1rem] font-extrabold tracking-tight text-slate-900">
            remo<span className="text-[#7c3aed]">sus</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-6">
          <a
            href="#how-it-works"
            className="hidden text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:inline focus-visible:outline-2 focus-visible:outline-[#7c3aed] rounded"
          >
            How it works
          </a>
          <a
            href="#latest-jobs"
            className="hidden text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 md:inline focus-visible:outline-2 focus-visible:outline-[#7c3aed] rounded"
          >
            Latest jobs
          </a>
          <a
            href="#transparency"
            className="hidden text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 lg:inline focus-visible:outline-2 focus-visible:outline-[#7c3aed] rounded"
          >
            Transparency
          </a>
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[#7c3aed] rounded px-1"
          >
            Sign in
          </Link>
          <Link
            href="/login?mode=sign-up"
            className="inline-flex min-h-[2.35rem] items-center gap-1.5 rounded-full bg-[#7c3aed] px-4.5 text-xs font-bold text-white shadow-xs transition-all hover:-translate-y-px hover:bg-[#6d28d9] hover:shadow-[0_6px_18px_-3px_rgba(124,58,237,0.6)] focus-visible:outline-2 focus-visible:outline-[#7c3aed]"
          >
            Get started <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </nav>
      </header>
    </div>
  )
}

/* ─────────────────────────────────────────
   Accordion item for the FAQ / Transparency
───────────────────────────────────────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`

  return (
    <div className="border-b border-slate-200/80 last:border-0">
      <button
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-[#7c3aed] focus-visible:outline-2 focus-visible:outline-[#7c3aed] rounded"
      >
        <span className="text-sm font-bold text-slate-900 sm:text-base">{question}</span>
        <ChevronDown
          aria-hidden="true"
          className={`mt-0.5 size-5 shrink-0 text-[#7c3aed] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={id}
        role="region"
        aria-labelledby={id}
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-48 pb-5' : 'max-h-0'}`}
      >
        <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Curated Job Listings Data
───────────────────────────────────────── */
const allCuratedJobs: JobCardData[] = [
  {
    id: 'job-1',
    title: 'Ui/Ux Designer Web',
    company: 'Northwind',
    category: 'Design',
    logoBg: 'bg-[#4353ff]',
    logoText: 'W',
    type: 'Full Time',
    location: 'Chicago',
    salary: '$450 - $500 / month',
    deadlineOrDate: '56 days left to apply',
    skills: ['Figma', 'Webflow CMS', 'UI Systems', 'Interaction Design', 'Responsive Prototyping'],
    description: 'Northwind is seeking a UI/UX Designer to craft responsive web components and interactive modules for global customers.',
    responsibilities: [
      'Design clean, accessible web components and interface layouts in Figma and Webflow.',
      'Work alongside marketing and engineering teams on high-impact web initiatives.',
      'Conduct usability reviews and maintain design system tokens for consistency.',
    ],
  },
  {
    id: 'job-2',
    title: 'Ui/Ux Designer Web',
    company: 'Coralbyte',
    category: 'Design',
    logoBg: 'bg-gradient-to-tr from-amber-500 to-orange-500',
    logoText: 'C',
    type: 'Full Time',
    location: 'Chicago',
    salary: '$450 - $500 / month',
    deadlineOrDate: '56 days left to apply',
    skills: ['Visual Design', 'Web Apps', 'Design Systems', 'Micro-interactions', 'User Testing'],
    description: 'Coralbyte is expanding its core creative tooling and seeking a talented web designer to shape responsive user workflows.',
    responsibilities: [
      'Create polished user journey prototypes and interactive micro-animations.',
      'Collaborate with remote product engineers across international time zones.',
      'Refine existing UI patterns to streamline creator workflows.',
    ],
  },
  {
    id: 'job-3',
    title: 'Ui/Ux Designer Web',
    company: 'Apexline',
    category: 'Design',
    logoBg: 'bg-slate-900',
    logoText: '▲',
    type: 'Full Time',
    location: 'Chicago',
    salary: '$450 - $500 / month',
    deadlineOrDate: '56 days left to apply',
    skills: ['Enterprise UX', 'Design Thinking', 'Accessibility (WCAG)', 'Information Architecture'],
    description: 'Join Apexline’s remote digital product team to simplify complex enterprise risk analysis workflows into intuitive user interfaces.',
    responsibilities: [
      'Translate data-heavy risk reports into responsive, readable dashboards.',
      'Establish enterprise WCAG AA accessibility standards across customer portals.',
      'Partner with cross-functional stakeholders on UX research and feedback loops.',
    ],
  },
  {
    id: 'job-4',
    title: 'Ui/Ux Designer Web',
    company: 'Stackly',
    category: 'Design',
    logoBg: 'bg-[#4a154b]',
    logoText: 'S',
    type: 'Full Time',
    location: 'Chicago',
    salary: '$450 - $500 / month',
    deadlineOrDate: '56 days left to apply',
    skills: ['Figma', 'Design Systems', 'Product Design', 'Collaboration Tools', 'Typography'],
    description: 'Stackly is hiring a UI/UX Web Designer to focus on productivity surfaces and customer onboarding journeys.',
    responsibilities: [
      'Prototype new interaction patterns for asynchronous communication tools.',
      'Enhance design system documentation and reusable component libraries.',
      'Partner with UX researchers to validate interface usability.',
    ],
  },
  {
    id: 'job-5',
    title: 'Senior Frontend Engineer',
    company: 'Loopware',
    category: 'Engineering',
    logoBg: 'bg-indigo-600',
    logoText: 'L',
    type: 'Full Time',
    location: 'Remote · Worldwide',
    salary: '$5,500 - $7,000 / month',
    deadlineOrDate: '42 days left to apply',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Web Performance', 'State Management'],
    description: 'Loopware is looking for a thoughtful frontend engineer who obsesses over keyboard navigation and sub-100ms interactions.',
    responsibilities: [
      'Build snappy, offline-first client interfaces using React and TypeScript.',
      'Optimize rendering pipelines and keyboard shortcuts for lightning-fast issue tracking.',
      'Ship clean, maintainable code with thorough unit and integration testing.',
    ],
  },
  {
    id: 'job-6',
    title: 'Full-Stack Web Developer',
    company: 'Sundial',
    category: 'Engineering',
    logoBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
    logoText: 'S',
    type: 'Full Time',
    location: 'Nigeria · Remote',
    salary: '$4,800 - $6,500 / month',
    deadlineOrDate: '30 days left to apply',
    skills: ['Next.js', 'PostgreSQL', 'TypeScript', 'Auth Systems', 'REST & GraphQL'],
    description: 'Sundial helps developers build faster. We are seeking a full-stack engineer in Africa to develop dashboard features.',
    responsibilities: [
      'Develop cloud database dashboard management views and analytics charts.',
      'Maintain reliable API endpoints and database migration scripts.',
      'Engage with open-source community contributors and address technical issues.',
    ],
  },
  {
    id: 'job-7',
    title: 'Product Marketing Lead',
    company: 'Bluepeak',
    category: 'Marketing',
    logoBg: 'bg-sky-500',
    logoText: 'B',
    type: 'Full Time',
    location: 'Remote · Worldwide',
    salary: '$4,000 - $5,500 / month',
    deadlineOrDate: '24 days left to apply',
    skills: ['Product Messaging', 'Launch Strategy', 'SaaS Growth', 'Content Strategy'],
    description: 'Bluepeak is an all-remote company looking for a product marketer to drive feature adoption and product launches.',
    responsibilities: [
      'Formulate go-to-market strategies for quarterly product releases.',
      'Craft compelling customer case studies, release notes, and email briefings.',
      'Analyze customer onboarding funnels to optimize activation rates.',
    ],
  },
  {
    id: 'job-8',
    title: 'WordPress & React Specialist',
    company: 'Wavelength',
    category: 'Websites',
    logoBg: 'bg-blue-600',
    logoText: 'W',
    type: 'Contract',
    location: 'Remote · Worldwide',
    salary: '$3,800 - $5,200 / month',
    deadlineOrDate: '18 days left to apply',
    skills: ['Gutenberg', 'React', 'PHP', 'Headless WordPress', 'Performance Tuning'],
    description: 'Wavelength is seeking a WordPress & React developer to build modern custom block themes and high-traffic publisher solutions.',
    responsibilities: [
      'Develop custom Gutenberg blocks with React and Tailwind CSS.',
      'Audit and optimize Core Web Vitals for global enterprise sites.',
      'Contribute to open-source WordPress core projects and theme repositories.',
    ],
  },
]

/* ─────────────────────────────────────────
   Main Landing Page Component
───────────────────────────────────────── */
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activePage, setActivePage] = useState<number>(0)
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null)
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set())
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Filter jobs by category
  const filteredJobs = allCuratedJobs.filter((job) => {
    if (activeCategory === 'all') return true
    return job.category.toLowerCase() === activeCategory.toLowerCase()
  })

  // 4 cards per page (2x2 grid matching reference)
  const pageSize = 4
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize))
  const displayedJobs = filteredJobs.slice(
    activePage * pageSize,
    (activePage + 1) * pageSize
  )

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setActivePage(0)
  }

  const handleSaveToggle = (id: string, saved: boolean) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev)
      if (saved) next.add(id)
      else next.delete(id)
      return next
    })

    const targetJob = allCuratedJobs.find((j) => j.id === id)
    if (saved && targetJob) {
      setToastMessage(`Saved "${targetJob.title}" at ${targetJob.company} to your leads`)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-slate-900 selection:bg-[#7c3aed]/15 selection:text-[#7c3aed]">
      <NavBar />

      {/* ══════════════════════════════════════
          HERO SECTION (Centered Composition with Human Empathy)
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
        {/* Soft atmospheric ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-96 bg-gradient-to-b from-[#f3e8ff]/70 via-[#fcfbfa]/40 to-transparent"
        />

        {/* Geometric dot matrix accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-8 top-12 hidden opacity-40 lg:block"
        >
          <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
            <circle cx="10" cy="10" r="2" fill="#7c3aed" />
            <circle cx="30" cy="10" r="2" fill="#7c3aed" />
            <circle cx="50" cy="10" r="2" fill="#7c3aed" />
            <circle cx="70" cy="10" r="2" fill="#7c3aed" />
            <circle cx="10" cy="30" r="2" fill="#7c3aed" />
            <circle cx="30" cy="30" r="2" fill="#7c3aed" />
            <circle cx="50" cy="30" r="2" fill="#7c3aed" />
            <circle cx="70" cy="30" r="2" fill="#7c3aed" />
            <circle cx="10" cy="50" r="2" fill="#7c3aed" />
            <circle cx="30" cy="50" r="2" fill="#7c3aed" />
            <circle cx="50" cy="50" r="2" fill="#7c3aed" />
            <circle cx="70" cy="50" r="2" fill="#7c3aed" />
            <circle cx="10" cy="70" r="2" fill="#7c3aed" />
            <circle cx="30" cy="70" r="2" fill="#7c3aed" />
            <circle cx="50" cy="70" r="2" fill="#7c3aed" />
            <circle cx="70" cy="70" r="2" fill="#7c3aed" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
          {/* Centered Headline with vibrant color-accented font */}
          <h1 className="mx-auto max-w-4xl text-[clamp(2.75rem,6.5vw,5.25rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-slate-900">
            Take control of your <span className="text-[#7c3aed]">remote career</span>
          </h1>

          {/* Subtitle speaking directly to African remote talent */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
            Landing a global remote role from Nigeria or anywhere in Africa is hard enough. Remosus curates verified remote feeds, filters for real location eligibility, and keeps your applications in one workspace.
          </p>

          {/* Dual Pill Action Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:mt-9">
            <Link
              href="/login?mode=sign-up"
              className="inline-flex min-h-[3.15rem] items-center justify-center gap-2 rounded-full bg-[#7c3aed] px-8 text-sm font-bold text-white shadow-[0_12px_28px_-6px_rgba(124,58,237,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#6d28d9] hover:shadow-[0_16px_32px_-6px_rgba(124,58,237,0.65)] focus-visible:outline-2 focus-visible:outline-[#7c3aed]"
            >
              Start searching free <ArrowRight aria-hidden="true" className="size-4" />
            </Link>

            <a
              href="#latest-jobs"
              className="inline-flex min-h-[3.15rem] items-center justify-center gap-2.5 rounded-full border border-slate-200/90 bg-white/95 px-7 text-sm font-bold text-slate-700 shadow-2xs backdrop-blur-xs transition-all hover:border-slate-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-[#7c3aed]"
            >
              <Play aria-hidden="true" className="size-3.5 fill-[#7c3aed] text-[#7c3aed]" />
              Explore latest roles
            </a>
          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">
            Honest location text matching · No subscription required to search
          </p>

          {/* ══════════════════════════════════════
              3-PIECE VISUAL STAGE (Center Phone + Left & Right Floating Cards)
          ══════════════════════════════════════ */}
          <div className="relative mx-auto mt-14 max-w-5xl sm:mt-18">

            {/* Left Floating Card: Recent Leads + Handwritten Callout */}
            <div className="hidden lg:block absolute -left-4 top-12 z-20 w-72 text-left animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="mb-2.5 flex items-center gap-2 pl-4">
                <span className="font-serif italic text-sm font-semibold tracking-wide text-[#7c3aed]">
                  Curated daily, never generic
                </span>
                <svg className="size-7 text-[#7c3aed]" fill="none" viewBox="0 0 32 32">
                  <path
                    d="M6 8 C 14 14, 22 18, 26 24 M 26 24 L 20 23 M 26 24 L 24 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold text-slate-800">Recent Leads</span>
                  <span className="text-[0.7rem] font-bold text-[#7c3aed]">3 saved</span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {[
                    { company: 'Northwind', role: 'UI/UX Designer', pay: '$500/mo', color: 'bg-[#4353ff]' },
                    { company: 'Loopware', role: 'Frontend Engineer', pay: '$6,500/mo', color: 'bg-indigo-600' },
                    { company: 'Coralbyte', role: 'Product Designer', pay: '$5,000/mo', color: 'bg-amber-500' },
                  ].map((item) => (
                    <div
                      key={item.company}
                      onClick={() => setSelectedJob(allCuratedJobs[0])}
                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 transition-all hover:bg-violet-50/50 hover:border-violet-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold text-white ${item.color}`}>
                          {item.company.charAt(0)}
                        </div>
                        <div className="min-w-0 truncate">
                          <p className="truncate text-xs font-bold text-slate-800 group-hover:text-[#7c3aed]">{item.role}</p>
                          <p className="text-[0.68rem] text-slate-500">{item.company}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 shrink-0">{item.pay}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Floating Card: Weekly Goal Target + Handwritten Callout */}
            <div className="hidden lg:block absolute -right-4 top-16 z-20 w-72 text-left animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-2.5 flex items-center justify-end gap-2 pr-4">
                <svg className="size-7 text-[#7c3aed]" fill="none" viewBox="0 0 32 32">
                  <path
                    d="M26 8 C 18 14, 10 18, 6 24 M 6 24 L 12 23 M 6 24 L 8 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-serif italic text-sm font-semibold tracking-wide text-[#7c3aed]">
                  Every step organized
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold text-slate-800">Weekly Goal</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold text-emerald-700">
                    On track
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="relative grid size-16 shrink-0 place-items-center">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#7c3aed]"
                        strokeDasharray="68, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-sm font-extrabold text-slate-900">68%</span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800">Application Sprint</p>
                    <p className="mt-0.5 text-xs text-slate-500">4 of 6 submitted</p>
                    <p className="mt-1 text-[0.7rem] font-semibold text-emerald-600">Next: Loopware follow-up</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Device Frame (Phone Mockup) */}
            <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px]">
              <div className="relative rounded-[2.75rem] border-[7px] border-slate-900 bg-white p-3 shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)]">
                <div className="mx-auto mb-3 h-4 w-24 rounded-full bg-slate-900" />

                <div className="flex items-center justify-between px-3 text-[0.7rem] font-bold text-slate-800">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>5G</span>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl bg-slate-50/80 p-3 text-left">
                  <p className="text-[0.7rem] font-bold text-slate-400">Welcome back</p>
                  <h3 className="text-sm font-extrabold text-slate-900">Opportunity Pipeline</h3>

                  <div className="mt-3 rounded-2xl bg-[#7c3aed] p-4 text-white shadow-md">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-violet-200">
                      Curated remote roles
                    </span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold tracking-tight">Live</span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                        Fresh daily
                      </span>
                    </div>

                    <div className="mt-3 h-8 w-full opacity-85">
                      <svg viewBox="0 0 200 40" fill="none" className="size-full">
                        <path
                          d="M0 25 Q 30 10, 60 20 T 120 15 T 170 30 T 200 8"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
                    {[
                      { icon: Search, label: 'Search' },
                      { icon: BookmarkCheck, label: 'Saved' },
                      { icon: FolderKanban, label: 'Pipeline' },
                      { icon: Compass, label: 'Feeds' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="rounded-xl bg-white p-2 text-slate-600 shadow-2xs">
                        <Icon className="mx-auto size-3.5 text-[#7c3aed]" />
                        <span className="mt-1 block text-[0.6rem] font-bold">{label}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    onClick={() => setSelectedJob(allCuratedJobs[0])}
                    className="mt-3 cursor-pointer rounded-xl border border-slate-200/80 bg-white p-2.5 transition-all hover:border-[#7c3aed]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[0.6rem] font-bold text-[#7c3aed]">Northwind</span>
                      <span className="text-[0.65rem] font-bold text-emerald-600">$500/mo</span>
                    </div>
                    <p className="mt-1 truncate text-xs font-bold text-slate-900">Ui/Ux Designer Web</p>
                    <p className="text-[0.65rem] text-slate-500">Tap to open full role preview →</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST & CAPABILITY CONTINUOUS MARQUEE
      ══════════════════════════════════════ */}
      <div className="border-y border-slate-200/80 bg-white py-3.5 sm:py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
            Built for people who know the African remote job search hustle
          </p>
          <div className="marquee-mask relative overflow-hidden py-0.5">
            <div className="animate-marquee flex items-center gap-4 sm:gap-6">
              {[
                { icon: ShieldCheck, label: 'Direct Feed Verification' },
                { icon: Compass, label: 'Curated for Africa & Global' },
                { icon: FolderKanban, label: 'Personal Opportunity Pipeline' },
                { icon: CheckCircle2, label: '100% Free & Transparent' },
                { icon: ShieldCheck, label: 'Direct Feed Verification' },
                { icon: Compass, label: 'Curated for Africa & Global' },
                { icon: FolderKanban, label: 'Personal Opportunity Pipeline' },
                { icon: CheckCircle2, label: '100% Free & Transparent' },
              ].map(({ icon: Icon, label }, index) => (
                <div
                  key={`${label}-${index}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:border-violet-200 hover:bg-violet-50/60"
                >
                  <div className="grid size-5 place-items-center rounded-full bg-[#f3e8ff] text-[#7c3aed]">
                    <Icon className="size-3" />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TAGLINE STRIP — "Cut out the noise."
      ══════════════════════════════════════ */}
      <div className="bg-[#fcfbfa] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-[#f3e8ff] px-3.5 py-1 text-xs font-bold text-[#7c3aed]">
            Built for African talent
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 sm:text-4xl lg:text-5xl">
            Cut out the noise. <span className="text-[#7c3aed]">Protect your energy.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Job hunting while managing power cuts, unstable internet, and silent rejections takes a toll. Remosus is built to give you back clarity and control.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          LATEST JOBS SHOWCASE (Clickable 2x2 Grid + Category Filters)
      ══════════════════════════════════════ */}
      <section id="latest-jobs" className="border-t border-slate-200/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  Latest jobs
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                  <span className="size-2 rounded-full bg-emerald-500" /> Sample roles
                </span>
              </div>
              <p className="mt-1.5 text-sm font-medium text-slate-500 sm:text-base">
                A sample of the remote roles we surface. Sign up to search the full live feed. Click any role to preview requirements before applying.
              </p>
            </div>
            <Link
              href="/login?mode=sign-up"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#0d9488] underline underline-offset-4 decoration-2 decoration-[#0d9488] transition-colors hover:text-[#0f766e] hover:decoration-[#0f766e]"
            >
              View all jobs <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All roles' },
              { id: 'Design', label: 'Design' },
              { id: 'Engineering', label: 'Engineering' },
              { id: 'Marketing', label: 'Marketing' },
              { id: 'Websites', label: 'Websites' },
            ].map(({ id, label }) => {
              const active = activeCategory === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleCategoryChange(id)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#7c3aed] ${
                    active
                      ? 'bg-[#7c3aed] text-white shadow-xs'
                      : 'border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:gap-6">
            {displayedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                initiallySaved={savedJobIds.has(job.id)}
                onSaveToggle={handleSaveToggle}
                onClick={(selected) => setSelectedJob(selected)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-9 flex items-center justify-center gap-2.5">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActivePage(index)}
                  aria-label={`Show job set ${index + 1}`}
                  className={`transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d9488] ${
                    activePage === index
                      ? 'h-2 w-7 rounded-full bg-[#0d9488]'
                      : 'size-2 rounded-full bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════
          HOW IT WORKS (OPTION A: INTERACTIVE MICRO-UI PIPELINE CARDS)
      ══════════════════════════════════════ */}
      <section id="how-it-works" className="border-t border-slate-200/80 bg-slate-50/50 px-5 py-12 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-[#f3e8ff] px-3.5 py-1 text-xs font-bold text-[#7c3aed]">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.045em] text-slate-900 sm:text-4xl lg:text-5xl">
              From search to application
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              A grounded three-step process built to save your hours and prevent mental fatigue.
            </p>
          </div>

          {/* 3 Step Cards with Micro-UI Artifacts (Option A) */}
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {/* Step 1: Discover with Real Filters */}
            <div className="flex flex-col justify-between rounded-2xl border border-violet-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-7">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-xl bg-[#f3e8ff] text-[#7c3aed]">
                    <Search aria-hidden="true" className="size-5" />
                  </div>
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-extrabold text-[#7c3aed]">
                    Step 01
                  </span>
                </div>

                <h3 className="mt-5 text-base font-extrabold tracking-tight text-slate-900">
                  Filter where you&apos;re actually eligible
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Tired of finding &ldquo;remote&rdquo; roles only to hit a country restriction on the final dropdown? We filter for listings that explicitly accept Nigeria, Africa, or genuine worldwide applicants.
                </p>
              </div>

              {/* Micro-UI 1: Active Filter Simulation */}
              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 text-[0.68rem] font-bold">
                  <span className="rounded-md bg-violet-100/80 px-2 py-0.5 text-[#7c3aed]">Role: Web & Frontend</span>
                  <span className="rounded-md bg-emerald-100/80 px-2 py-0.5 text-emerald-800">Region: Nigeria / Africa / Global</span>
                </div>
                <div className="flex items-center justify-between text-[0.7rem] font-semibold text-slate-700 pt-1.5 border-t border-slate-200/60">
                  <span>Verified eligible roles</span>
                  <span className="text-emerald-600 font-bold">Live feed</span>
                </div>
              </div>
            </div>

            {/* Step 2: One-Click Save */}
            <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-7">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <BookmarkCheck aria-hidden="true" className="size-5" />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700">
                    Step 02
                  </span>
                </div>

                <h3 className="mt-5 text-base font-extrabold tracking-tight text-slate-900">
                  Save the lead before you lose it
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Internet cuts out, power flickers, or you spot a role while commuting. Tap the heart to stash the listing and direct source link into your personal pipeline. No more 40 lost browser tabs.
                </p>
              </div>

              {/* Micro-UI 2: Saved Lead Row */}
              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="grid size-5.5 place-items-center rounded-md bg-[#4353ff] text-[0.62rem] font-extrabold text-white shrink-0">W</span>
                    <span className="truncate text-xs font-bold text-slate-800">Northwind · UI Designer</span>
                  </div>
                  <span className="text-rose-500 font-bold text-xs flex items-center gap-1 shrink-0">
                    <Heart className="size-3.5 fill-rose-500" /> Saved
                  </span>
                </div>
                <p className="text-[0.68rem] text-slate-500 pt-1.5 border-t border-slate-200/60">
                  Stored in your workspace with original apply link
                </p>
              </div>
            </div>

            {/* Step 3: Organized Follow-Through */}
            <div className="flex flex-col justify-between rounded-2xl border border-amber-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-7">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
                    <Send aria-hidden="true" className="size-5" />
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-extrabold text-amber-700">
                    Step 03
                  </span>
                </div>

                <h3 className="mt-5 text-base font-extrabold tracking-tight text-slate-900">
                  Stay sane through every follow-up
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Sending applications into silence is draining. Remosus gives you a quiet, organized system to track where you applied, log dates, and follow up with confidence until you land the role.
                </p>
              </div>

              {/* Micro-UI 3: Pipeline Tracker Progression */}
              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-600 mb-2">
                  <span>Loopware status</span>
                  <span className="text-[#7c3aed]">Interview stage</span>
                </div>
                <div className="flex items-center gap-1 text-[0.65rem] font-bold">
                  <span className="flex-1 rounded-md bg-emerald-100 text-emerald-800 px-1.5 py-1 text-center">Saved</span>
                  <span className="text-slate-300 font-bold">→</span>
                  <span className="flex-1 rounded-md bg-emerald-100 text-emerald-800 px-1.5 py-1 text-center">Applied</span>
                  <span className="text-slate-300 font-bold">→</span>
                  <span className="flex-1 rounded-md bg-violet-100 text-[#7c3aed] px-1.5 py-1 text-center font-extrabold">Interview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRANSPARENCY & CLEAR EXPECTATIONS
      ══════════════════════════════════════ */}
      <section id="transparency" className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:px-12 lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="inline-flex items-center rounded-full bg-[#f3e8ff] px-3.5 py-1 text-xs font-bold text-[#7c3aed]">
              Clear expectations
            </span>
            {/* Same purple color as requested */}
            <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-tight tracking-[-0.045em] text-[#7c3aed] sm:text-4xl">
              Useful tools, without pretending every listing is perfect.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              We won&apos;t sell you a false dream. Here is the honest truth about how Remosus works and what to expect.
            </p>
          </div>

          <div className="divide-y divide-slate-200/80">
            {[
              {
                question: 'Does a Nigeria filter mean the employer accepts applications from Nigeria?',
                answer:
                  "No. It matches location text such as 'Nigeria', 'Africa', or 'worldwide' in the listing. Always confirm country eligibility and work-authorization requirements on the employer's original listing before applying.",
              },
              {
                question: 'Are the posting dates guaranteed to be current?',
                answer:
                  'Dates are shown when a source provides a valid posting date. Feeds can lag and roles can close, so check the original listing before applying.',
              },
              {
                question: 'Is this a directory of every job in Nigeria?',
                answer:
                  'No. The current product focuses on remote roles from selected feeds. Local, on-site, freelance, and contract opportunities are not comprehensively covered.',
              },
              {
                question: 'What data do you store about me?',
                answer:
                  'We store your account credentials and the leads and notes you save in your workspace. We do not sell your data or share it with third parties.',
              },
            ].map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CALL TO ACTION
      ══════════════════════════════════════ */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-14 text-center text-white sm:rounded-[2.5rem] sm:px-14 sm:py-20">
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-violet-900/60 px-4 py-1 text-xs font-bold text-violet-300">
              Keep moving forward
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Your next remote opportunity is out there. <span className="text-violet-400">Stay consistent.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
              Stop losing tabs and guessing eligibility. Build a daily search habit with a personal workspace that has your back.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/login?mode=sign-up"
                className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full bg-[#7c3aed] px-8 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#6d28d9]"
              >
                Start your search free <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 text-sm font-bold text-white transition-all hover:bg-white/20"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Brand - Closed gap */}
            <div className="flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-1.5 group">
                <Image
                  src="/gigshqicon.png"
                  alt=""
                  width={26}
                  height={26}
                  className="rounded-lg transition-transform group-hover:scale-105"
                />
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  remo<span className="text-[#7c3aed]">sus</span>
                </span>
              </Link>
              <p className="max-w-xs text-xs leading-relaxed text-slate-500">
                Built to help remote digital workers in Africa search, organize, and follow through. All listings link to original sources.
              </p>
            </div>

            {/* Nav links */}
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-12 gap-y-4 text-sm">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Product</p>
                <a href="#how-it-works" className="font-semibold text-slate-600 transition-colors hover:text-[#7c3aed]">How it works</a>
                <a href="#latest-jobs" className="font-semibold text-slate-600 transition-colors hover:text-[#7c3aed]">Latest jobs</a>
                <a href="#transparency" className="font-semibold text-slate-600 transition-colors hover:text-[#7c3aed]">Transparency</a>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account</p>
                <Link href="/login" className="font-semibold text-slate-600 transition-colors hover:text-[#7c3aed]">Sign in</Link>
                <Link href="/login?mode=sign-up" className="font-semibold text-[#7c3aed] transition-colors hover:text-[#6d28d9]">Get started →</Link>
              </div>
            </nav>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Remosus. All rights reserved.</p>
            <p>Remote job search, organized.</p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          INTERACTIVE JOB DETAIL MODAL
      ══════════════════════════════════════ */}
      <JobDetailModal
        job={selectedJob}
        isOpen={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
        isSaved={selectedJob ? savedJobIds.has(selectedJob.id) : false}
        onToggleSave={handleSaveToggle}
      />

      {/* ══════════════════════════════════════
          LIVE TOAST NOTIFICATION
      ══════════════════════════════════════ */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 sm:bottom-6 left-1/2 z-60 -translate-x-1/2 flex w-[calc(100%-2rem)] sm:w-auto max-w-md items-center justify-between gap-2.5 rounded-2xl sm:rounded-full border border-slate-200/90 bg-white/95 px-4 py-3 sm:px-5 text-xs font-medium text-slate-800 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex min-w-0 items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span className="truncate text-slate-700 font-semibold">{toastMessage}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/login?mode=sign-up"
              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#7c3aed] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#6d28d9] focus-visible:outline-2 focus-visible:outline-[#7c3aed]"
            >
              Sign up to sync
            </Link>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              aria-label="Dismiss notification"
              className="grid size-6 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-[#7c3aed]"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

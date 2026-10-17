'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

export function NavBar() {
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
            href="/#how-it-works"
            className="hidden text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:inline focus-visible:outline-2 focus-visible:outline-[#7c3aed] rounded"
          >
            How it works
          </a>
          <a
            href="/#latest-jobs"
            className="hidden text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 md:inline focus-visible:outline-2 focus-visible:outline-[#7c3aed] rounded"
          >
            Latest jobs
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

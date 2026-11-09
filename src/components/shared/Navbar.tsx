"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { cn } from "cn";

const links = [
  { label: "Home", href: "/", active: true },
  { label: "All Books", href: "/books", active: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink shadow-[0_8px_30px_rgba(25,40,56,0.18)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="BookNook home">
            <span className="grid size-9 place-items-center rounded-lg bg-sage text-white shadow-sm">
              <BookOpen className="size-5" strokeWidth={2} />
            </span>
            <span className="font-display text-[1.65rem] leading-none font-semibold tracking-tight text-white">
              BookNook
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className={cn(
                  "text-[0.95rem] font-medium transition-colors",
                  link.active
                    ? "text-sage"
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-lg border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center rounded-lg bg-sage px-4 text-sm font-semibold text-deep shadow-sm transition-colors hover:bg-terracotta hover:text-white"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-lg text-white hover:bg-white/10 md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-deep px-4 pt-2 pb-4 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  link.active ? "text-sage" : "text-white/75 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2 px-1">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-white/25 bg-white/5 text-sm font-semibold text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-sage text-sm font-semibold text-deep"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

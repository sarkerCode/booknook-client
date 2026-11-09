import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-beige bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-paper">
            <BookOpen className="size-4" />
          </span>
          <div>
            <p className="font-display text-lg leading-none font-semibold text-heading">
              BookNook
            </p>
            <p className="mt-1 text-sm text-body">Share the books on your shelf.</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-body" aria-label="Footer">
          <Link href="/" className="transition-colors hover:text-terracotta">
            Home
          </Link>
          <Link href="/books" className="transition-colors hover:text-terracotta">
            All Books
          </Link>
          <Link href="/login" className="transition-colors hover:text-terracotta">
            Login
          </Link>
          <Link href="/register" className="transition-colors hover:text-terracotta">
            Register
          </Link>
        </nav>

        <p className="text-sm text-body/80">© 2026 BookNook. Made for readers.</p>
      </div>
    </footer>
  );
}

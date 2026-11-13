import Link from "next/link";
import { BookOpen, Home, Library, Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 - Page Not Found | BookNook Editorial Library",
  description:
    "The chapter or volume you are looking for could not be found in our library collection.",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-paper flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Literary Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-terracotta/10 border border-terracotta/20 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
          <Compass className="size-3.5" />
          <span>Catalog Notice • 404 Error</span>
        </div>

        {/* Large 404 Heading */}
        <div className="relative select-none">
          <span className="font-display text-8xl sm:text-9xl font-extrabold tracking-tight text-ink/15 block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-20 sm:size-24 items-center justify-center rounded-3xl bg-card border border-beige shadow-[0_12px_40px_rgba(36,52,71,0.08)] text-terracotta">
              <BookOpen className="size-10 sm:size-12 text-terracotta" />
            </div>
          </div>
        </div>

        {/* Error Title & Narrative */}
        <div className="space-y-3 pt-2">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-heading">
            Lost in the Stacks
          </h1>
          <p className="text-sm sm:text-base text-slate max-w-md mx-auto leading-relaxed">
            The volume or shelf you are searching for might have been archived,
            loaned out to another reader, or never existed in our library catalog.
          </p>
        </div>

        {/* Action Buttons: "Back to Home" & "Browse Library" */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Link href="/" className="w-full sm:w-auto flex-1">
            <Button
              className="w-full h-12 bg-ink text-white hover:bg-deep font-medium rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2 px-6 transition-all"
            >
              <Home className="size-4" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <Link href="/books" className="w-full sm:w-auto flex-1">
            <Button
              variant="outline"
              className="w-full h-12 border-beige bg-card text-heading hover:bg-paper hover:text-ink hover:border-ink/30 font-medium rounded-xl cursor-pointer flex items-center justify-center gap-2 px-6 transition-all"
            >
              <Library className="size-4 text-terracotta" />
              <span>Browse Books</span>
            </Button>
          </Link>
        </div>

        {/* Suggested Shelves */}
        <div className="pt-8 border-t border-beige/70">
          <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-3">
            Popular Collections
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {["Fiction", "Science", "History", "Kids"].map((category) => (
              <Link
                key={category}
                href="/books"
                className="inline-flex items-center gap-1 rounded-full border border-beige bg-card px-3.5 py-1 font-medium text-slate hover:text-terracotta hover:border-terracotta/40 transition-colors"
              >
                <span>{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

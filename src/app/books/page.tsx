import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { BookOpen, PlusCircle, Library, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BooksClient, type ApiBook } from "./BooksClient";

export const metadata: Metadata = {
  title: "All Books | BookNook Editorial Library",
  description:
    "Explore our complete community collection of novels, scientific works, historical accounts, and stories available for borrowing.",
};

function BooksPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search & Filter Bar Skeleton */}
      <div className="h-16 w-full rounded-2xl border border-beige bg-card animate-pulse" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-beige bg-card overflow-hidden flex flex-col shadow-xs"
          >
            <div className="aspect-[3/4] w-full bg-beige/30 animate-pulse" />
            <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-beige/50 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-beige/40 animate-pulse rounded" />
                <div className="h-4 w-full bg-beige/30 animate-pulse rounded" />
              </div>
              <div className="h-11 w-full bg-beige/40 animate-pulse rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function BooksContent() {
  await connection();

  let books: ApiBook[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
      cache: "no-store",
    });

    if (res.ok) {
      books = ((await res.json()) as ApiBook[]) ?? [];
    }
  } catch (err) {
    console.error("Failed to load books:", err);
  }

  return <BooksClient initialBooks={books} />;
}

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-paper text-body pb-20">
      {/* Editorial Header Section */}
      <header className="border-b border-beige bg-card py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
              <Sparkles className="size-3.5" />
              <span>BookNook Archive • Complete Collection</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-heading">
              All Books
            </h1>
            <p className="text-sm sm:text-base text-slate leading-relaxed">
              Explore our complete community catalog of novels, scientific works,
              histories, and children&apos;s literature available for 14-day borrowing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/add-book">
              <Button className="h-11 bg-terracotta text-white hover:bg-terracotta-hover font-semibold rounded-xl px-5 cursor-pointer flex items-center gap-2 shadow-[0_6px_20px_rgba(200,117,85,0.25)] transition-all">
                <PlusCircle className="size-4" />
                <span>Add a Book</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Books Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Suspense fallback={<BooksPageSkeleton />}>
          <BooksContent />
        </Suspense>
      </main>
    </div>
  );
}

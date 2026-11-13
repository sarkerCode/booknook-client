import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import type { Metadata } from "next";
import {
  BookOpen,
  Bookmark,
  Layers,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookText,
  ShieldCheck,
  Library,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { auth } from "@/lib/auth";
import { BorrowAction } from "./BorrowAction";

type ApiBookDetail = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies?: string | number;
  bookImage?: string;
  shortDescription?: string;
  addedBy?: { name?: string; email?: string } | string | null;
  userName?: string;
  userEmail?: string;
  user?: { name?: string; email?: string } | string | null;
  addedByName?: string;
  createdAt?: string;
};

type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: BookDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const book = (await res.json()) as ApiBookDetail;
      return {
        title: `${book.bookTitle} by ${book.authorName} | BookNook`,
        description:
          book.shortDescription ||
          `Explore ${book.bookTitle} in the BookNook Editorial Library.`,
      };
    }
  } catch {
    // Fall back to default
  }
  return {
    title: "Book Details | BookNook Editorial Library",
  };
}

function BookDetailsError() {
  return (
    <div className="min-h-[70vh] bg-paper flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-2xl border border-beige bg-card p-8 text-center shadow-[0_10px_30px_rgba(36,52,71,0.06)]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <BookOpen className="size-7" />
        </div>
        <p className="text-[11px] font-bold tracking-[0.25em] text-terracotta uppercase">
          BookNook • Editorial Library
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-heading">
          Volume Not Available
        </h2>
        <p className="mt-2 text-sm text-slate leading-relaxed">
          The book you are looking for could not be found in our current library
          catalog. It may have been relocated or archived.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/books" className="w-full">
            <Button className="w-full bg-ink text-white hover:bg-deep h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2">
              <Library className="size-4" />
              <span>Browse Books</span>
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button
              variant="outline"
              className="w-full border-beige text-slate hover:text-heading h-11 rounded-xl cursor-pointer"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BookDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Top Bar Skeleton */}
      <div className="border-b border-beige bg-card/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-4 w-48 bg-beige/60 animate-pulse rounded-md" />
          <div className="h-4 w-28 bg-beige/60 animate-pulse rounded-md" />
        </div>
      </div>

      <main className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-5">
            <div className="rounded-2xl border border-beige bg-card p-5">
              <div className="aspect-[3/4] w-full rounded-xl bg-beige/40 animate-pulse" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="h-12 rounded-xl bg-beige/30 animate-pulse" />
                <div className="h-12 rounded-xl bg-beige/30 animate-pulse" />
              </div>
            </div>
            <div className="h-16 rounded-xl bg-beige/30 animate-pulse" />
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-beige/40 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-beige/40 animate-pulse" />
            </div>
            <div className="h-12 w-3/4 rounded-lg bg-beige/50 animate-pulse" />
            <div className="h-6 w-1/3 rounded-lg bg-beige/40 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="h-20 rounded-xl bg-beige/30 animate-pulse" />
              <div className="h-20 rounded-xl bg-beige/30 animate-pulse" />
              <div className="h-20 rounded-xl bg-beige/30 animate-pulse" />
              <div className="h-20 rounded-xl bg-beige/30 animate-pulse" />
            </div>
            <div className="h-56 rounded-2xl bg-card border border-beige p-6 space-y-3">
              <div className="h-6 w-44 bg-beige/40 animate-pulse rounded-md" />
              <div className="h-4 w-full bg-beige/30 animate-pulse rounded-md" />
              <div className="h-4 w-5/6 bg-beige/30 animate-pulse rounded-md" />
              <div className="h-4 w-3/4 bg-beige/30 animate-pulse rounded-md" />
            </div>
            <div className="h-14 rounded-xl bg-beige/40 animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}

async function BookDetailsContent({ params }: BookDetailsPageProps) {
  const { id } = await params;

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err) {
    console.error("Session check error:", err);
  }

  let data: ApiBookDetail | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      data = (await res.json()) as ApiBookDetail;
    }
  } catch (err) {
    console.error("Fetch book error:", err);
  }

  if (!data) {
    return <BookDetailsError />;
  }

  // Resolve the username of the person who added this book
  const addedByName =
    (typeof data.addedBy === "object" && data.addedBy?.name) ||
    (typeof data.addedBy === "string" && data.addedBy.trim().length > 0
      ? data.addedBy
      : null) ||
    data.userName ||
    (typeof data.user === "object" && data.user?.name) ||
    (typeof data.user === "string" && data.user.trim().length > 0
      ? data.user
      : null) ||
    data.addedByName ||
    session?.user?.name ||
    "Community Member";

  const addedByEmail =
    (typeof data.addedBy === "object" && data.addedBy?.email) ||
    data.userEmail ||
    (typeof data.user === "object" && data.user?.email) ||
    session?.user?.email ||
    null;

  const copiesCount = Math.max(0, Number(data.totalCopies) || 0);
  const isOutOfStock = copiesCount <= 0;

  // Check if current user already borrowed this book (No Double Borrow)
  let alreadyBorrowed = false;
  if (session?.user?.email) {
    try {
      const borrowsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-borrows/${encodeURIComponent(session.user.email)}`,
        { cache: "no-store" }
      );
      if (borrowsRes.ok) {
        const userBorrows = (await borrowsRes.json()) as Array<{ bookId?: string }>;
        alreadyBorrowed = userBorrows.some((b) => b.bookId === id);
      }
    } catch (err) {
      console.error("Check active borrows error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-paper text-body">
      {/* Editorial Navigation Top Bar */}
      <div className="border-b border-beige bg-card/75 backdrop-blur-xs py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/books" />}>
                  All Books
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-heading max-w-[220px] sm:max-w-xs truncate">
                  {data.bookTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Books</span>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Editorial Layout */}
      <main className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
          {/* Side 1: Book Cover Image & Physical Spec Column */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl border border-beige bg-card p-4 sm:p-5 shadow-[0_12px_40px_rgba(36,52,71,0.06)]">
              {/* Book Cover Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-paper/60 shadow-md group">
                {data.bookImage ? (
                  <>
                    <Image
                      src={data.bookImage}
                      alt={data.bookTitle}
                      fill
                      sizes="(max-width: 1024px) 100vw, 440px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    {/* Realistic book spine gradient on left edge */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/35 via-black/15 to-transparent"
                    />
                    {/* Category floating chip */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-card/95 backdrop-blur-md border border-beige px-3 py-1 text-xs font-semibold text-heading shadow-sm">
                        <Bookmark className="size-3 text-terracotta" />
                        {data.category}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-paper via-card to-paper border-2 border-dashed border-beige">
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-ink/5 text-ink mb-4 shadow-inner">
                      <BookOpen className="size-10 text-ink/70" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-terracotta">
                      Editorial Library
                    </span>
                    <p className="mt-2 font-display text-lg font-semibold text-heading line-clamp-2">
                      {data.bookTitle}
                    </p>
                    <p className="mt-1 text-xs text-slate">by {data.authorName}</p>
                  </div>
                )}
              </div>

              {/* Physical Spec Bar below Image */}
              <div className="mt-5 pt-4 border-t border-beige/70 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-paper/50 p-2.5 border border-beige/50">
                  <span className="block text-[11px] text-slate">Edition Format</span>
                  <span className="font-semibold text-heading">
                    Hardcover Archive
                  </span>
                </div>
                <div className="rounded-xl bg-paper/50 p-2.5 border border-beige/50">
                  <span className="block text-[11px] text-slate">Catalog Status</span>
                  {isOutOfStock ? (
                    <span className="font-semibold text-danger flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-danger" />
                      Not Available
                    </span>
                  ) : (
                    <span className="font-semibold text-success flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-success animate-pulse" />
                      {copiesCount} {copiesCount === 1 ? "Copy" : "Copies"} Ready
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Permanent Collection Preservation Badge */}
            <div className="rounded-xl border border-beige/80 bg-card/70 p-4 text-xs text-slate flex items-start gap-3 shadow-xs">
              <ShieldCheck className="size-4 text-sage shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Preserved in the BookNook Permanent Collection. Inspected and
                available for 14-day community lending.
              </p>
            </div>
          </div>

          {/* Side 2: Book Content, Details & Actions */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-8">
            {/* Header & Title Area */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/20 border border-sage/40 px-3 py-0.5 text-xs font-semibold text-ink">
                  <Sparkles className="size-3 text-terracotta" />
                  {data.category}
                </span>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 border border-danger/30 px-3 py-0.5 text-xs font-semibold text-danger">
                    <AlertCircle className="size-3" />
                    Not Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 border border-success/30 px-3 py-0.5 text-xs font-semibold text-success">
                    <CheckCircle2 className="size-3" />
                    Available to Borrow
                  </span>
                )}
                <span className="text-xs text-slate ml-auto font-mono">
                  Catalog #{data._id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-heading leading-[1.12]">
                {data.bookTitle}
              </h1>

              <p className="mt-3 text-lg sm:text-xl text-slate font-normal">
                by{" "}
                <span className="font-semibold text-heading underline decoration-terracotta/40 underline-offset-4">
                  {data.authorName}
                </span>
              </p>
            </div>

            {/* Key Metadata Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-beige bg-card p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-slate text-xs mb-1">
                  <Bookmark className="size-3.5 text-terracotta" />
                  <span>Category</span>
                </div>
                <p className="font-semibold text-heading text-sm truncate">
                  {data.category}
                </p>
              </div>

              <div className="rounded-xl border border-beige bg-card p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-slate text-xs mb-1">
                  <Layers className="size-3.5 text-sage" />
                  <span>Inventory</span>
                </div>
                <p
                  className={cn(
                    "font-semibold text-sm",
                    isOutOfStock ? "text-danger" : "text-heading"
                  )}
                >
                  {isOutOfStock
                    ? "0 Copies (Not Available)"
                    : `${copiesCount} ${copiesCount === 1 ? "Copy" : "Copies"}`}
                </p>
              </div>

              <div className="rounded-xl border border-beige bg-card p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-slate text-xs mb-1">
                  <Clock className="size-3.5 text-amber" />
                  <span>Lending Term</span>
                </div>
                <p className="font-semibold text-heading text-sm">14 Days (Free)</p>
              </div>

              <div className="rounded-xl border border-beige bg-card p-3.5 shadow-xs">
                <div className="flex items-center gap-2 text-slate text-xs mb-1">
                  <User className="size-3.5 text-ink" />
                  <span>Added By</span>
                </div>
                <p
                  className="font-semibold text-heading text-sm truncate"
                  title={addedByName}
                >
                  {addedByName}
                </p>
              </div>
            </div>

            {/* Book Description / Synopsis */}
            <div className="rounded-2xl border border-beige bg-card p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-beige/60">
                <BookText className="size-5 text-terracotta" />
                <h2 className="font-display text-xl font-semibold text-heading">
                  Synopsis & Editorial Overview
                </h2>
              </div>

              <div className="text-slate text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
                {data.shortDescription ? (
                  data.shortDescription
                ) : (
                  <p className="italic text-slate/75">
                    No editorial summary has been filed for this title yet. Borrow
                    or inspect the hardcover copy to explore this piece from our
                    collection.
                  </p>
                )}
              </div>
            </div>

            {/* Added By & Contributor Note */}
            <div className="rounded-2xl border border-beige bg-card p-5 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink text-white font-display text-lg font-bold shadow-xs">
                  {addedByName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-slate">Added By</p>
                  <p className="font-semibold text-heading text-sm sm:text-base">
                    {addedByName}
                  </p>
                  {addedByEmail && (
                    <p className="text-xs text-slate/80">{addedByEmail}</p>
                  )}
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-sage/15 border border-sage/30 px-3 py-1 text-xs font-semibold text-ink">
                <Sparkles className="size-3 text-terracotta" />
                Community Member
              </span>
            </div>

            {/* Borrow Action Area */}
            <div className="rounded-2xl border border-beige bg-card p-6 shadow-sm space-y-3">
              <BorrowAction
                bookId={data._id}
                bookTitle={data.bookTitle}
                authorName={data.authorName}
                category={data.category}
                totalCopies={copiesCount}
                bookImage={data.bookImage || ""}
                isLoggedIn={!!session?.user}
                userName={session?.user?.name || "Reader"}
                userEmail={session?.user?.email || ""}
                alreadyBorrowed={alreadyBorrowed}
              />
            </div>

            {/* BookNook Editorial Library Brand Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-beige bg-gradient-to-r from-card via-paper/50 to-card p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-xl">
                  <p className="text-[11px] font-bold tracking-[0.25em] text-terracotta uppercase">
                    BookNook • Editorial Library
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-heading">
                    Find your next favorite story.
                  </h3>
                  <p className="text-sm text-slate leading-relaxed">
                    A quiet place for curious minds and beautiful stories. Explore
                    our shelves and reserve your next read with ease.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link href="/books">
                    <Button
                      variant="outline"
                      className="border-beige bg-card text-heading hover:bg-paper hover:text-ink hover:border-ink/30 text-sm font-semibold rounded-xl h-11 px-5 cursor-pointer flex items-center gap-2"
                    >
                      <Library className="size-4 text-slate" />
                      <span>Explore Library</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  return (
    <Suspense fallback={<BookDetailsSkeleton />}>
      <BookDetailsContent params={params} />
    </Suspense>
  );
}

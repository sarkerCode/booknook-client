import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Bookmark, Library, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export type BookArrival = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies?: string | number;
  bookImage?: string;
  shortDescription?: string;
};

export function NewArrivalsSkeleton() {
  return (
    <section aria-label="Loading new arrivals" className="bg-paper border-b border-beige/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="h-4 w-44 bg-beige/50 animate-pulse rounded" />
            <div className="h-8 w-64 bg-beige/60 animate-pulse rounded-lg" />
            <div className="h-4 w-96 bg-beige/40 animate-pulse rounded" />
          </div>
          <div className="h-6 w-32 bg-beige/40 animate-pulse rounded hidden md:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-beige bg-card overflow-hidden p-0 shadow-xs flex flex-col"
            >
              <div className="aspect-[3/4] w-full bg-beige/30 animate-pulse" />
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
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

        <div className="mt-12 flex justify-center">
          <div className="h-12 w-48 bg-beige/50 animate-pulse rounded-xl" />
        </div>
      </div>
    </section>
  );
}

export default async function NewArrivals() {
  let books: BookArrival[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/books?limit=6&sort=newest`,
      {
        cache: "no-store",
      }
    );

    if (res.ok) {
      books = (await res.json()) as BookArrival[];
    }
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: string }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("HANGING_PROMISE")
    ) {
      throw err;
    }
    console.error("Failed to load new arrivals:", err);
  }

  // Graceful fallback if no books are returned
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="new-arrivals-heading"
      className="bg-paper border-b border-beige/60 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
              <Sparkles className="size-3.5" />
              <span>Fresh From Our Curators</span>
            </div>
            <h2
              id="new-arrivals-heading"
              className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-heading"
            >
              New Arrivals
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate max-w-xl leading-relaxed">
              Explore the latest acquisitions added to our editorial shelves.
              Read honest stories and reserve your next read with ease.
            </p>
          </div>

          <Link
            href="/books"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:text-terracotta-hover transition-colors group"
          >
            <span>Explore full catalog</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic 6-Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {books.map((book) => {
            const copies = Math.max(0, Number(book.totalCopies) || 0);

            return (
              <article
                key={book._id}
                className="group flex flex-col rounded-2xl border border-beige bg-card overflow-hidden shadow-[0_4px_20px_rgba(36,52,71,0.05)] hover:shadow-[0_16px_36px_rgba(36,52,71,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Book Cover Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper/70">
                  {book.bookImage ? (
                    <Image
                      src={book.bookImage}
                      alt={`Cover of ${book.bookTitle} by ${book.authorName}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-paper via-card to-paper">
                      <BookOpen className="size-12 text-ink/30 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                        Editorial Archive
                      </span>
                      <p className="font-display font-semibold text-heading text-sm mt-1 line-clamp-2">
                        {book.bookTitle}
                      </p>
                    </div>
                  )}

                  {/* Realistic Book Spine Shadow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent z-10"
                  />

                  {/* Category Pill Floating */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-card/95 backdrop-blur-md border border-beige px-3 py-1 text-xs font-semibold text-heading shadow-xs">
                      <Bookmark className="size-3 text-terracotta" />
                      <span>{book.category}</span>
                    </span>
                  </div>

                  {/* New Arrival Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-terracotta text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      <Sparkles className="size-2.5" />
                      <span>New</span>
                    </span>
                  </div>
                </div>

                {/* Book Metadata & View Details Action */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-heading group-hover:text-terracotta transition-colors line-clamp-1">
                      <Link href={`/books/${book._id}`}>
                        {book.bookTitle}
                      </Link>
                    </h3>
                    <p className="text-sm text-slate mt-1 line-clamp-1">
                      by{" "}
                      <span className="font-medium text-heading/90">
                        {book.authorName}
                      </span>
                    </p>

                    {book.shortDescription && (
                      <p className="text-xs text-slate/80 mt-2 line-clamp-2 leading-relaxed">
                        {book.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Footer with Inventory Indicator and View Details */}
                  <div className="pt-3 border-t border-beige/60 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <span
                          className={`size-1.5 rounded-full ${
                            copies > 0 ? "bg-success" : "bg-danger"
                          }`}
                        />
                        <span className={copies > 0 ? "text-slate" : "text-danger"}>
                          {copies > 0
                            ? `${copies} ${copies === 1 ? "copy" : "copies"} available`
                            : "Out of Stock"}
                        </span>
                      </span>
                      <span className="text-[11px] font-medium text-terracotta uppercase tracking-wider">
                        14-day loan
                      </span>
                    </div>

                    <Link href={`/books/${book._id}`} className="block w-full">
                      <Button
                        className="w-full bg-ink text-white hover:bg-deep h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2 group/btn shadow-xs transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Centered See All Books Button */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link href="/books">
            <Button
              className="h-12 px-8 bg-terracotta text-white hover:bg-terracotta-hover text-base font-semibold rounded-xl shadow-[0_8px_24px_rgba(200,117,85,0.3)] transition-all cursor-pointer inline-flex items-center gap-2.5 hover:gap-3"
            >
              <Library className="size-4" />
              <span>See All Books</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

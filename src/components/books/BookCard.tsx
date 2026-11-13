"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Bookmark, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookCardProps } from "@/types";

export type { BookCardProps };

export function BookCard({ book }: BookCardProps) {
  const copies =
    book.totalCopies !== undefined
      ? Math.max(0, Number(book.totalCopies) || 0)
      : null;

  return (
    <article className="group flex flex-col rounded-2xl border border-beige bg-card overflow-hidden shadow-[0_4px_20px_rgba(36,52,71,0.05)] hover:shadow-[0_16px_36px_rgba(36,52,71,0.12)] hover:-translate-y-1 transition-all duration-300">
      {/* Book Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper/70">
        {book.image ? (
          <Image
            src={book.image}
            alt={`Cover of ${book.title} by ${book.author}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-paper via-card to-paper">
            <BookOpen className="size-12 text-ink/30 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
              BookNook
            </span>
            <p className="font-display font-semibold text-heading text-sm mt-1 line-clamp-2">
              {book.title}
            </p>
          </div>
        )}

        {/* Realistic Book Spine Depth Shadow */}
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
      </div>

      {/* Book Metadata Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-heading group-hover:text-terracotta transition-colors line-clamp-1">
            <Link href={`/books/${book.id}`}>
              {book.title}
            </Link>
          </h3>
          <p className="text-sm text-slate mt-1 line-clamp-1">
            by <span className="font-medium text-heading/90">{book.author}</span>
          </p>

          {book.shortDescription && (
            <p className="text-xs text-slate/80 mt-2 line-clamp-2 leading-relaxed">
              {book.shortDescription}
            </p>
          )}
        </div>

        {/* Footer & Details Button */}
        <div className="pt-3 border-t border-beige/60 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate">
            {copies !== null ? (
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span
                  className={`size-1.5 rounded-full ${
                    copies > 0 ? "bg-success" : "bg-danger"
                  }`}
                />
                <span className={copies > 0 ? "text-slate" : "text-danger"}>
                  {copies > 0
                    ? `${copies} ${copies === 1 ? "copy" : "copies"} available`
                    : "Not Available"}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-slate">
                <Layers className="size-3 text-sage" />
                <span>Editorial Library</span>
              </span>
            )}
            <span className="text-[11px] font-medium text-terracotta uppercase tracking-wider">
              14-day loan
            </span>
          </div>

          <Link href={`/books/${book.id}`} className="block w-full">
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
}

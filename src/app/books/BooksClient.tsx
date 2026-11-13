"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, PlusCircle, BookOpen, X, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/BookCard";

export type ApiBook = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  bookImage?: string;
  totalCopies?: string | number;
  shortDescription?: string;
};

const CATEGORIES = ["All", "Fiction", "Science", "History", "Kids"];

interface BooksClientProps {
  initialBooks: ApiBook[];
}

export function BooksClient({ initialBooks }: BooksClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter books by search query and category
  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (book.category || "").toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        (book.bookTitle || "").toLowerCase().includes(query) ||
        (book.authorName || "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialBooks, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card border border-beige p-4 sm:p-5 rounded-2xl shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate/70" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl border border-beige bg-paper/60 pl-10 pr-10 text-sm text-heading placeholder:text-slate/60 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-heading cursor-pointer p-1"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isSelected
                    ? "bg-ink text-white shadow-xs"
                    : "bg-paper/70 text-slate hover:bg-paper hover:text-heading border border-beige/60"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header / Counter */}
      <div className="flex items-center justify-between text-xs text-slate px-1">
        <span className="font-medium text-heading">
          Showing{" "}
          <strong className="text-terracotta font-semibold">
            {filteredBooks.length}
          </strong>{" "}
          {filteredBooks.length === 1 ? "volume" : "volumes"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {(selectedCategory !== "All" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-terracotta hover:underline font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-2xl border border-beige bg-card p-12 text-center shadow-xs max-w-lg mx-auto my-12">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sage/20 text-ink mb-4 shadow-inner">
            <BookOpen className="size-7 text-ink" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-heading">
            No Books Found
          </h3>
          <p className="mt-2 text-sm text-slate leading-relaxed">
            We couldn&apos;t find any volumes matching your criteria. Try adjusting
            your search term or clearing the category filter.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="border-beige text-slate hover:text-heading h-10 rounded-xl cursor-pointer"
            >
              Clear All Filters
            </Button>
            <Link href="/add-book">
              <Button className="bg-terracotta text-white hover:bg-terracotta-hover h-10 rounded-xl px-4 cursor-pointer flex items-center gap-2">
                <PlusCircle className="size-4" />
                <span>Add This Book</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={{
                id: book._id,
                title: book.bookTitle,
                author: book.authorName,
                category: book.category,
                image: book.bookImage,
                totalCopies: book.totalCopies,
                shortDescription: book.shortDescription,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

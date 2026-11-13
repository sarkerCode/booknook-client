"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Undo2,
  Calendar,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Library,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

export type BorrowRecord = {
  _id: string;
  bookId?: string;
  bookTitle: string;
  bookImage?: string;
  userEmail: string;
  userName?: string;
  borrowDate: string;
  returnDate: string;
};

interface MyBorrowsClientProps {
  initialBorrows: BorrowRecord[];
  userEmail: string;
}

export function MyBorrowsClient({
  initialBorrows,
  userEmail,
}: MyBorrowsClientProps) {
  const router = useRouter();
  const [borrows, setBorrows] = useState<BorrowRecord[]>(initialBorrows);
  const [searchQuery, setSearchQuery] = useState("");

  // Returning state & modal
  const [returningRecord, setReturningRecord] = useState<BorrowRecord | null>(
    null
  );
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  // Filtered borrows by search
  const filteredBorrows = useMemo(() => {
    if (!searchQuery.trim()) return borrows;
    return borrows.filter((b) =>
      (b.bookTitle || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [borrows, searchQuery]);

  // Open return confirmation dialog
  const handleStartReturn = (record: BorrowRecord) => {
    setReturningRecord(record);
  };

  // Submit return (DELETE /my-borrows/:id)
  const handleConfirmReturn = async () => {
    if (!returningRecord) return;

    setIsSubmittingReturn(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-borrows/${returningRecord._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        // Remove from local list immediately
        setBorrows((prev) => prev.filter((b) => b._id !== returningRecord._id));
        toast.success("Book returned successfully! Inventory has been restored.");
        setReturningRecord(null);
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to return book.");
      }
    } catch (err) {
      console.error("Error returning book:", err);
      toast.error("Failed to return book. Please try again.");
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  // Helper date formatter
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-paper text-body pb-20">
      {/* Header Section */}
      <header className="border-b border-beige bg-card py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
              <Sparkles className="size-3.5" />
              <span>Editorial Library • Member Loans</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-heading tracking-tight">
              My Borrowed Books
            </h1>
            <p className="text-sm text-slate">
              Track your active library checkouts, due return dates, and return books
              when you finish reading.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/books">
              <Button className="h-10 bg-ink text-white hover:bg-deep font-medium rounded-xl px-4 cursor-pointer flex items-center gap-2 shadow-xs">
                <Library className="size-4" />
                <span>Browse Library</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Search & Loan Summary */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate/70" />
            <input
              type="text"
              placeholder="Search borrowed titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-xl border border-beige bg-card pl-10 pr-4 text-sm text-heading placeholder:text-slate/60 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-heading cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Active Loans Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 border border-sage/30 px-3 py-1 font-semibold text-heading">
              <BookOpen className="size-3.5 text-sage" />
              <span>
                {borrows.length} Active {borrows.length === 1 ? "Loan" : "Loans"}
              </span>
            </span>
            <span className="hidden sm:inline">Borrower: {userEmail}</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredBorrows.length === 0 ? (
          <div className="rounded-2xl border border-beige bg-card p-12 text-center shadow-xs max-w-lg mx-auto my-12">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sage/20 text-ink mb-4 shadow-inner">
              <BookOpen className="size-7 text-ink" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-heading">
              {borrows.length === 0
                ? "No Borrowed Books Yet"
                : "No Matching Borrows"}
            </h3>
            <p className="mt-2 text-sm text-slate leading-relaxed">
              {borrows.length === 0
                ? "You have no active checkouts right now. Find your next favorite story in our curated library collection!"
                : "No borrowed titles match your search. Try clearing your search term."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {borrows.length === 0 ? (
                <Link href="/books">
                  <Button className="bg-terracotta text-white hover:bg-terracotta-hover h-11 rounded-xl px-5 cursor-pointer flex items-center gap-2">
                    <Library className="size-4" />
                    <span>Explore Library</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="border-beige text-slate hover:text-heading h-10 rounded-xl cursor-pointer"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Borrows Table */
          <div className="rounded-2xl border border-beige bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-paper/70 border-b border-beige">
                  <TableRow className="border-beige hover:bg-transparent">
                    <TableHead className="w-[80px] font-semibold text-heading text-xs uppercase tracking-wider pl-5">
                      Image
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider min-w-[200px]">
                      Title
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider">
                      Borrow Date
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider">
                      Return Date
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider text-right pr-6 min-w-[140px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBorrows.map((record) => (
                    <TableRow
                      key={record._id}
                      className="border-beige hover:bg-paper/40 transition-colors"
                    >
                      {/* Image Thumbnail */}
                      <TableCell className="py-3.5 pl-5">
                        <div className="relative aspect-[3/4] w-12 overflow-hidden rounded-lg bg-paper border border-beige/80 shadow-xs">
                          {record.bookImage ? (
                            <Image
                              src={record.bookImage}
                              alt={record.bookTitle}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate">
                              <BookOpen className="size-5 opacity-40" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Title */}
                      <TableCell className="py-3.5">
                        {record.bookId ? (
                          <Link
                            href={`/books/${record.bookId}`}
                            className="font-display font-semibold text-heading hover:text-terracotta text-base leading-snug transition-colors line-clamp-1 inline-flex items-center gap-1 group"
                          >
                            <span>{record.bookTitle}</span>
                            <ExternalLink className="size-3 text-slate opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ) : (
                          <span className="font-display font-semibold text-heading text-base leading-snug line-clamp-1">
                            {record.bookTitle}
                          </span>
                        )}
                        <span className="block text-[11px] text-slate mt-0.5 font-mono">
                          ID: #{record._id.slice(-6).toUpperCase()}
                        </span>
                      </TableCell>

                      {/* Borrow Date */}
                      <TableCell className="py-3.5">
                        <div className="inline-flex items-center gap-1.5 text-xs text-heading font-medium">
                          <Calendar className="size-3.5 text-sage" />
                          <span>{formatDate(record.borrowDate)}</span>
                        </div>
                      </TableCell>

                      {/* Return Date */}
                      <TableCell className="py-3.5">
                        <div className="inline-flex items-center gap-1.5 text-xs text-terracotta font-semibold">
                          <Clock className="size-3.5" />
                          <span>{formatDate(record.returnDate)}</span>
                        </div>
                      </TableCell>

                      {/* Return Book Button */}
                      <TableCell className="py-3.5 text-right pr-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartReturn(record)}
                          className="h-8 border-terracotta/40 text-terracotta hover:bg-terracotta hover:text-white rounded-lg px-3 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1.5"
                        >
                          <Undo2 className="size-3.5" />
                          <span>Return Book</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>

      {/* Return Book Confirmation Modal */}
      <Dialog
        open={!!returningRecord}
        onOpenChange={(open) => {
          if (!open) setReturningRecord(null);
        }}
      >
        <DialogContent className="sm:max-w-md bg-card border-beige p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage mb-2">
              <Undo2 className="size-6 text-ink" />
            </div>
            <DialogTitle className="font-display text-2xl font-semibold text-center text-heading">
              Return Book to Library
            </DialogTitle>
            <DialogDescription className="text-center text-slate text-xs leading-relaxed">
              Confirm that you are returning this volume to the BookNook
              collection. This will remove it from your active checkouts.
            </DialogDescription>
          </DialogHeader>

          {returningRecord && (
            <div className="rounded-xl border border-beige bg-paper/60 p-4 space-y-2 text-sm my-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                Volume Returning
              </span>
              <h4 className="font-display text-base font-semibold text-heading leading-snug">
                {returningRecord.bookTitle}
              </h4>
              <div className="flex justify-between text-xs text-slate pt-2 border-t border-beige/60">
                <span>Borrowed on:</span>
                <span className="font-medium text-heading">
                  {formatDate(returningRecord.borrowDate)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate">
                <span>Due Date:</span>
                <span className="font-medium text-terracotta">
                  {formatDate(returningRecord.returnDate)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="m-0 p-0 border-t-0 bg-transparent flex flex-col-reverse sm:flex-row gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReturningRecord(null)}
              className="w-full sm:flex-1 border-beige text-slate hover:text-heading hover:bg-paper h-11 rounded-xl cursor-pointer font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReturn}
              disabled={isSubmittingReturn}
              className="w-full sm:flex-1 bg-terracotta text-white hover:bg-terracotta-hover h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <CheckCircle2 className="size-4" />
              <span>
                {isSubmittingReturn ? "Returning..." : "Confirm Return"}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

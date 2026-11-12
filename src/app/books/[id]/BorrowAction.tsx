"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Library,
  LogIn,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BorrowActionProps {
  bookId: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies?: string | number;
  isLoggedIn: boolean;
  userName?: string;
}

export function BorrowAction({
  bookId,
  bookTitle,
  authorName,
  category,
  totalCopies = 1,
  isLoggedIn,
  userName = "Reader",
}: BorrowActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate return date (14 days from today)
  const today = new Date();
  const returnDate = new Date();
  returnDate.setDate(today.getDate() + 14);

  const formattedReturnDate = returnDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleOpenBorrow = () => {
    setIsConfirmed(false);
    setIsOpen(true);
  };

  const handleConfirmBorrow = () => {
    setIsSubmitting(true);
    // Simulate brief network submission for responsiveness
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          onClick={handleOpenBorrow}
          className="flex-1 h-12 bg-terracotta text-white hover:bg-terracotta-hover text-base font-medium rounded-xl shadow-[0_6px_20px_rgba(200,117,85,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2.5 px-6"
        >
          <BookmarkCheck className="size-5" />
          <span>Borrow This Book</span>
        </Button>

        <Link href="/books" className="flex-1 sm:flex-initial">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-12 border-beige bg-card text-heading hover:bg-paper hover:text-ink hover:border-ink/30 text-base font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 px-6"
          >
            <Library className="size-4 text-slate" />
            <span>Browse Books</span>
          </Button>
        </Link>
      </div>

      {/* Lending Policy Reassurance */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate pt-1">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5 text-sage" />
          <span>14-day lending period</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-success" />
          <span>Free for all BookNook members</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Info className="size-3.5 text-terracotta" />
          <span>Instant reservation & renewal</span>
        </span>
      </div>

      {/* Borrow Confirmation / Sign-in Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-card border-beige p-6 rounded-2xl shadow-xl">
          {!isLoggedIn ? (
            // Non-logged-in User Prompt
            <div className="space-y-5">
              <DialogHeader>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-terracotta/15 text-terracotta mb-2">
                  <LogIn className="size-6" />
                </div>
                <DialogTitle className="font-display text-2xl font-semibold text-center text-heading">
                  Sign in to Borrow
                </DialogTitle>
                <DialogDescription className="text-center text-slate text-sm">
                  You need a BookNook account to borrow books from our Editorial
                  Library. It only takes a moment to join our community of
                  readers.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border border-beige bg-paper/60 p-4 space-y-2 text-sm text-heading">
                <p className="font-medium text-ink">Selected Volume:</p>
                <p className="font-display text-base font-semibold text-heading">
                  {bookTitle}
                </p>
                <p className="text-xs text-slate">by {authorName}</p>
              </div>

              <DialogFooter className="m-0 p-0 border-t-0 bg-transparent flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:flex-1 border-beige text-slate hover:text-heading hover:bg-paper h-11 rounded-xl cursor-pointer font-medium"
                >
                  Cancel
                </Button>
                <Link href="/login" className="w-full sm:flex-1">
                  <Button
                    type="button"
                    className="w-full bg-ink text-white hover:bg-deep h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="size-4" />
                    <span>Sign In to Continue</span>
                  </Button>
                </Link>
              </DialogFooter>
            </div>
          ) : isConfirmed ? (
            // Success Confirmation View
            <div className="space-y-5 text-center py-2">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="size-8" />
              </div>

              <div className="space-y-2">
                <DialogTitle className="font-display text-2xl font-semibold text-heading">
                  Borrow Request Confirmed!
                </DialogTitle>
                <DialogDescription className="text-slate text-sm">
                  We have reserved a copy of{" "}
                  <strong className="text-heading font-medium">
                    {bookTitle}
                  </strong>{" "}
                  for you.
                </DialogDescription>
              </div>

              <div className="rounded-xl border border-beige bg-paper/60 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-beige/60">
                  <span className="text-slate">Borrower:</span>
                  <span className="font-medium text-heading">{userName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-beige/60">
                  <span className="text-slate">Loan Period:</span>
                  <span className="font-medium text-heading">14 Days</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate">Due Return Date:</span>
                  <span className="font-semibold text-terracotta">
                    {formattedReturnDate}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-ink text-white hover:bg-deep h-11 rounded-xl font-medium cursor-pointer"
                >
                  Close & View Details
                </Button>
                <Link href="/books" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-beige text-heading hover:bg-paper h-11 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Explore More Books</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // Confirmation Form View
            <div className="space-y-5">
              <DialogHeader>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage mb-2">
                  <BookOpen className="size-6 text-ink" />
                </div>
                <DialogTitle className="font-display text-2xl font-semibold text-center text-heading">
                  Confirm Borrow Request
                </DialogTitle>
                <DialogDescription className="text-center text-slate text-sm">
                  Please review your borrowing details before confirming.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border border-beige bg-paper/60 p-4 space-y-2.5 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider text-terracotta font-semibold">
                    {category}
                  </span>
                  <h4 className="font-display text-lg font-semibold text-heading leading-snug">
                    {bookTitle}
                  </h4>
                  <p className="text-xs text-slate">by {authorName}</p>
                </div>

                <div className="pt-2 border-t border-beige/60 space-y-1.5 text-xs text-slate">
                  <div className="flex justify-between">
                    <span>Borrower:</span>
                    <span className="font-medium text-heading">{userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lending Term:</span>
                    <span className="font-medium text-heading">14 Days (Free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span className="font-semibold text-terracotta">
                      {formattedReturnDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Copies:</span>
                    <span className="font-medium text-heading">{totalCopies}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="m-0 p-0 border-t-0 bg-transparent flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:flex-1 border-beige text-slate hover:text-heading hover:bg-paper h-11 rounded-xl cursor-pointer font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmBorrow}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 bg-terracotta text-white hover:bg-terracotta-hover h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <BookmarkCheck className="size-4" />
                  <span>{isSubmitting ? "Processing..." : "Confirm & Borrow"}</span>
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

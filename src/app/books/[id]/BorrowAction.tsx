"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Library,
  LogIn,
  Info,
  Layers,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface BorrowActionProps {
  bookId: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies?: string | number;
  bookImage?: string;
  isLoggedIn: boolean;
  userName?: string;
  userEmail?: string;
  alreadyBorrowed?: boolean;
}

export function BorrowAction({
  bookId,
  bookTitle,
  authorName,
  category,
  totalCopies = 1,
  bookImage = "",
  isLoggedIn,
  userName = "Reader",
  userEmail = "",
  alreadyBorrowed = false,
}: BorrowActionProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manage inventory state (never negative)
  const [availableCopies, setAvailableCopies] = useState<number>(() =>
    Math.max(0, Number(totalCopies) || 0)
  );

  // Track double-borrow state
  const [isAlreadyBorrowed, setIsAlreadyBorrowed] = useState(Boolean(alreadyBorrowed));

  useEffect(() => {
    setAvailableCopies(Math.max(0, Number(totalCopies) || 0));
  }, [totalCopies]);

  useEffect(() => {
    setIsAlreadyBorrowed(Boolean(alreadyBorrowed));
  }, [alreadyBorrowed]);

  const isOutOfStock = availableCopies <= 0;

  // Calculate borrow & return dates (14-day checkout)
  const today = new Date();
  const returnDate = new Date();
  returnDate.setDate(today.getDate() + 14);

  const borrowDateISO = today.toISOString().split("T")[0];
  const returnDateISO = returnDate.toISOString().split("T")[0];

  const formattedBorrowDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedReturnDate = returnDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleOpenBorrow = () => {
    if (isOutOfStock) {
      toast.error("This book is not available.");
      return;
    }

    // No Double Borrow Check
    if (isAlreadyBorrowed) {
      toast.error(
        "You cannot borrow the same book two times at the same time."
      );
      return;
    }

    setIsConfirmed(false);
    setIsOpen(true);
  };

  const handleConfirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOutOfStock) {
      toast.error("This book is not available.");
      return;
    }

    // No Double Borrow Check
    if (isAlreadyBorrowed) {
      toast.error(
        "You cannot borrow the same book two times at the same time."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const borrowRecord = {
        bookId,
        bookTitle,
        bookImage,
        userEmail,
        userName,
        borrowDate: borrowDateISO,
        returnDate: returnDateISO,
      };

      const token = await getTokenFromClient();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-borrows`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(borrowRecord),
        }
      );

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        // Decrease inventory state (decreased by 1 with $inc on server)
        const newCopies =
          typeof result.remainingCopies === "number"
            ? Math.max(0, result.remainingCopies)
            : Math.max(0, availableCopies - 1);
        setAvailableCopies(newCopies);
        setIsAlreadyBorrowed(true);
        toast.success("Book borrowed successfully!");
        setIsConfirmed(true);
        router.refresh();
      } else {
        toast.error(
          result.message ||
            "You cannot borrow the same book two times at the same time."
        );
        if (
          result.message?.toLowerCase().includes("already borrowed") ||
          result.message?.toLowerCase().includes("twice") ||
          result.message?.toLowerCase().includes("two times")
        ) {
          setIsAlreadyBorrowed(true);
          setIsOpen(false);
        }
        if (
          res.status === 400 &&
          (result.message?.toLowerCase().includes("available") ||
            result.message?.toLowerCase().includes("stock"))
        ) {
          setAvailableCopies(0);
          setIsOpen(false);
        }
      }
    } catch (err) {
      console.error("Borrow error:", err);
      toast.error("Failed to borrow book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* If copies are 0: disable the Borrow button and show "Not Available" */}
        {isOutOfStock ? (
          <Button
            disabled
            className="flex-1 h-12 bg-slate/15 text-slate border border-beige/80 text-base font-medium rounded-xl cursor-not-allowed flex items-center justify-center gap-2 px-6 shadow-none"
          >
            <AlertCircle className="size-5 text-amber" />
            <span>Not Available</span>
          </Button>
        ) : isAlreadyBorrowed ? (
          <Button
            type="button"
            onClick={() => {
              toast.error(
                "You cannot borrow the same book two times at the same time."
              );
            }}
            className="flex-1 h-12 bg-sage/20 text-heading border border-sage/50 hover:bg-sage/30 text-base font-medium rounded-xl cursor-pointer flex items-center justify-center gap-2 px-6 shadow-none transition-colors"
          >
            <BookmarkCheck className="size-5 text-sage" />
            <span>Already Borrowed</span>
          </Button>
        ) : (
          <Button
            onClick={handleOpenBorrow}
            className="flex-1 h-12 bg-terracotta text-white hover:bg-terracotta-hover text-base font-medium rounded-xl shadow-[0_6px_20px_rgba(200,117,85,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2.5 px-6"
          >
            <BookmarkCheck className="size-5" />
            <span>Borrow This Book ({availableCopies} available)</span>
          </Button>
        )}

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

      {/* Lending Policy & Inventory Reassurance */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate pt-1">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-3.5 text-sage" />
          <span
            className={
              isOutOfStock ? "text-danger font-semibold" : "text-heading"
            }
          >
            {isOutOfStock
              ? "0 copies remaining (Not Available)"
              : `${availableCopies} copies in stock`}
          </span>
        </span>
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
          <span>Single loan per title</span>
        </span>
      </div>

      {/* Borrow Modal */}
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
                  Library. Join our community of readers in seconds.
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
                  A copy of{" "}
                  <strong className="text-heading font-medium">
                    {bookTitle}
                  </strong>{" "}
                  has been added to your borrowed shelf.
                </DialogDescription>
              </div>

              <div className="rounded-xl border border-beige bg-paper/60 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-beige/60">
                  <span className="text-slate">Borrower:</span>
                  <span className="font-medium text-heading">{userName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-beige/60">
                  <span className="text-slate">Borrow Date:</span>
                  <span className="font-medium text-heading">
                    {formattedBorrowDate}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-beige/60">
                  <span className="text-slate">Due Return Date:</span>
                  <span className="font-semibold text-terracotta">
                    {formattedReturnDate}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate">Remaining Stock:</span>
                  <span className="font-medium text-heading">
                    {availableCopies} {availableCopies === 1 ? "Copy" : "Copies"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <Link href="/my-borrows" className="w-full sm:flex-1">
                  <Button className="w-full bg-terracotta text-white hover:bg-terracotta-hover h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2">
                    <BookOpen className="size-4" />
                    <span>View My Borrows</span>
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:flex-1 border-beige text-heading hover:bg-paper h-11 rounded-xl cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            // Borrow Form View (Read-only User Name & Email, Confirm Borrow button)
            <div className="space-y-4">
              <DialogHeader>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sage/20 text-sage mb-1">
                  <BookOpen className="size-6 text-ink" />
                </div>
                <DialogTitle className="font-display text-2xl font-semibold text-center text-heading">
                  Borrow This Book
                </DialogTitle>
                <DialogDescription className="text-center text-slate text-xs">
                  Review your borrower information and confirm your 14-day checkout.
                </DialogDescription>
              </DialogHeader>

              {/* Book Details Summary */}
              <div className="rounded-xl border border-beige bg-paper/60 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                    {category}
                  </span>
                  <span className="text-[11px] font-medium text-slate">
                    {availableCopies} {availableCopies === 1 ? "copy" : "copies"} left
                  </span>
                </div>
                <h4 className="font-display text-base font-semibold text-heading leading-snug">
                  {bookTitle}
                </h4>
                <p className="text-xs text-slate">by {authorName}</p>
              </div>

              {isOutOfStock && (
                <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger font-medium flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>
                    This book is currently not available and cannot be borrowed.
                  </span>
                </div>
              )}

              {/* Form with read-only User Name and Email */}
              <form onSubmit={handleConfirmBorrow} className="space-y-3.5 pt-1">
                <div className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold text-heading">
                    User Name
                  </FieldLabel>
                  <Input
                    type="text"
                    value={userName}
                    readOnly
                    className="rounded-xl border-beige bg-paper/50 text-slate cursor-not-allowed font-medium text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold text-heading">
                    User Email
                  </FieldLabel>
                  <Input
                    type="email"
                    value={userEmail}
                    readOnly
                    className="rounded-xl border-beige bg-paper/50 text-slate cursor-not-allowed font-medium text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-beige bg-paper/40 p-2.5 text-xs">
                    <span className="block text-[11px] text-slate">Borrow Date</span>
                    <span className="font-semibold text-heading">
                      {formattedBorrowDate}
                    </span>
                  </div>
                  <div className="rounded-xl border border-beige bg-paper/40 p-2.5 text-xs">
                    <span className="block text-[11px] text-slate">Return Date</span>
                    <span className="font-semibold text-terracotta">
                      {formattedReturnDate}
                    </span>
                  </div>
                </div>

                <DialogFooter className="m-0 p-0 border-t-0 bg-transparent flex flex-col-reverse sm:flex-row gap-2.5 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:flex-1 border-beige text-slate hover:text-heading hover:bg-paper h-11 rounded-xl cursor-pointer font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isOutOfStock || isAlreadyBorrowed}
                    className="w-full sm:flex-1 bg-terracotta text-white hover:bg-terracotta-hover h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <BookmarkCheck className="size-4" />
                    <span>{isSubmitting ? "Processing..." : "Confirm Borrow"}</span>
                  </Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

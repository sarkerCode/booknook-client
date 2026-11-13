import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals, { NewArrivalsSkeleton } from "@/components/home/NewArrivals";
import BrowseCollections from "@/components/home/BrowseCollections";
import HowBorrowingWorks from "@/components/home/HowBorrowingWorks";

export const metadata: Metadata = {
  title: "BookNook | Editorial Library & Book Borrowing",
  description:
    "A quiet place for curious minds and beautiful stories. Discover new arrivals, explore curated literature collections, and borrow books freely from our community library.",
  openGraph: {
    title: "BookNook | Editorial Library & Book Borrowing",
    description:
      "A quiet place for curious minds and beautiful stories. Discover new arrivals, explore curated literature collections, and borrow books freely from our community library.",
  },
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-paper">
      {/* 1. Hero Slider Section */}
      <Suspense fallback={<div className="min-h-[540px] bg-deep" />}>
        <HeroSlider />
      </Suspense>

      {/* 2. New Arrivals Section (Dynamic 6 books sorted newest first) */}
      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>

      {/* 3. Browse Collections Section */}
      <BrowseCollections />

      {/* 4. How Borrowing Works Section */}
      <HowBorrowingWorks />
    </main>
  );
}

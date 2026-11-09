import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import BrowseCollections from "@/components/home/BrowseCollections";
import HowBorrowingWorks from "@/components/home/HowBorrowingWorks";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-paper">
      <Suspense fallback={<div className="min-h-[540px] bg-deep" />}>
        <HeroSlider />
      </Suspense>
      <BrowseCollections />
      <HowBorrowingWorks />
    </main>
  );
}

import Link from "next/link";
import { ArrowRight, BookOpen, Radar, ClockArrowUpIcon, BlocksIcon } from "lucide-react";


const collections = [
  {
    title: "Fiction",
    description: "Novels, stories, and new releases readers can't put down.",
    icon: BookOpen,
    accent: "bg-terracotta/10 text-terracotta",
  },
  {
    title: "Science",
    description: "Timeless shelves — revisit the books that shaped us.",
    icon: Radar,
    accent: "bg-sage/15 text-success",
  },
  {
    title: "History",
    description: "Discover the stories behind the stories, from ancient to modern times.",
    icon: ClockArrowUpIcon,
    accent: "bg-amber/15 text-warning",
  },
  {
    title: "Kids",
    description: "A world of imagination and learning for young readers.",
    icon: BlocksIcon,
    accent: "bg-ink/10 text-ink",
  },
];

export default function BrowseCollections() {
  return (
    <section aria-labelledby="browse-heading" className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.3em] text-terracotta uppercase">
              Start exploring
            </p>
            <h2
              id="browse-heading"
              className="mt-2 text-3xl font-semibold tracking-tight text-heading sm:text-4xl"
            >
              Browse by mood, not just title
            </h2>
          </div>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta transition-colors hover:text-terracotta-hover"
          >
            View all books
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((item) => (
            <Link
              key={item.title}
              href="/books"
              className="group rounded-2xl border border-beige bg-card p-5 shadow-[0_2px_12px_rgba(32,42,53,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(32,42,53,0.10)]"
            >
              <span
                className={`inline-grid size-11 place-items-center rounded-xl ${item.accent}`}
              >
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-heading">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
                Browse
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Search, BookMarked, Undo2 } from "lucide-react";

const steps = [
  {
    step: "Step 1",
    title: "Pick a book you love",
    description:
      "Skim community shelves, read honest reviews, and tap the book that calls to you.",
    icon: Search,
  },
  {
    step: "Step 2",
    title: "Borrow it",
    description:
      "Confirm your borrow in one tap. We hold it for you while you pick it up.",
    icon: BookMarked,
  },
  {
    step: "Step 3",
    title: "Return & share again",
    description:
      "Finished reading? Return it from My Borrows and add your thoughts for the next reader.",
    icon: Undo2,
  },
];

export default function HowBorrowingWorks() {
  return (
    <section
      aria-labelledby="how-heading"
      className="relative overflow-hidden bg-deep text-paper"
    >
      {/* Subtle warm glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_0%,rgba(200,117,85,0.14),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold tracking-[0.3em] text-terracotta uppercase">
            Share in minutes
          </p>
          <h2
            id="how-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-paper sm:text-4xl lg:text-[2.75rem]"
          >
            Borrow in three easy steps
          </h2>
          <p className="mt-3 text-base leading-relaxed text-paper/70">
            No cards, no queues — just readers sharing with readers.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-6">
          {steps.map((item) => (
            <li
              key={item.step}
              className="group flex flex-col items-center rounded-2xl border border-beige/15 bg-ink/60 px-6 py-8 text-center shadow-[0_8px_30px_rgba(25,40,56,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/35 hover:shadow-[0_16px_40px_rgba(25,40,56,0.35)]"
            >
              <span className="grid size-14 place-items-center rounded-full bg-sage text-deep shadow-[0_6px_20px_rgba(140,155,136,0.35)] transition-transform duration-300 group-hover:scale-105">
                <item.icon className="size-6" strokeWidth={2} />
              </span>

              <p className="mt-5 text-sm font-semibold tracking-wide text-terracotta">
                {item.step}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-paper">
                {item.title}
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/70">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

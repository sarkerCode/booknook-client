export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  badge: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "share-shelf",
    eyebrow: "BOOKNOOK",
    title: "Share the books on ",
    highlight: "your shelf",
    description:
      "Add the books you have finished. Let other readers enjoy them too.",
    ctaLabel: "Browse Books",
    ctaHref: "/books",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Grand library shelves filled with books",
    badge: "12k+ community shelves",
  },
  {
    id: "discover-next",
    eyebrow: "DISCOVER NEXT",
    title: "Find your next ",
    highlight: "great read",
    description:
      "Recommendations from readers like you — honest, personal, and always fresh.",
    ctaLabel: "Explore Collections",
    ctaHref: "/books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Open books and coffee on a wooden table",
    badge: "Curated by real readers",
  },
  {
    id: "read-together",
    eyebrow: "READ TOGETHER",
    title: "Stories are better ",
    highlight: "shared",
    description:
      "Trade, lend, and discuss the books you love with a warmer kind of reader.",
    ctaLabel: "Start Sharing",
    ctaHref: "/books",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920&auto=format&fit=crop",
    imageAlt: "Cozy library corner with bookshelves",
    badge: "Free to share forever",
  },
];

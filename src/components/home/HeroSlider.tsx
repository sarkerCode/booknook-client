"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ArrowRight, Sparkles } from "lucide-react";
import { heroSlides } from "@/lib/data/hero-slides";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section aria-label="Featured" className="relative bg-deep">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={800}
        navigation={{ nextEl: ".hero-next", prevEl: ".hero-prev" }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="hero-swiper h-[calc(100svh-4rem)] min-h-[540px] max-h-[760px] w-full"
        aria-live="polite"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />

              {/* Readability gradient — Ink Navy → transparent */}
              <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/70 to-deep/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-deep/30" />

              <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-bold tracking-[0.35em] text-terracotta uppercase sm:text-xs">
                    {slide.eyebrow}
                  </p>

                  <h1 className="mt-5 font-display text-5xl leading-[1.02] font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                    {slide.title}
                    <span className="block">{slide.highlight}</span>
                  </h1>

                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.ctaHref}
                      className="inline-flex h-11 items-center gap-2 rounded-lg bg-terracotta px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(200,117,85,0.35)] transition-colors hover:bg-terracotta-hover"
                    >
                      {slide.ctaLabel}
                      <ArrowRight className="size-4" />
                    </Link>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Sparkles className="size-3.5 text-terracotta" />
                      {slide.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay controls — outside slides so Swiper binds once */}
      <button
        type="button"
        aria-label="Previous slide"
        className="hero-prev swiper-button-prev !left-5 !hidden lg:!flex"
      />
      <button
        type="button"
        aria-label="Next slide"
        className="hero-next swiper-button-next !right-5 !hidden lg:!flex"
      />
      <div className="hero-pagination swiper-pagination !bottom-6" />

      <div className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {heroSlides.length}: {heroSlides[activeIndex]?.title}
        {heroSlides[activeIndex]?.highlight}
      </div>
    </section>
  );
}

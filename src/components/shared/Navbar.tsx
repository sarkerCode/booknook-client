
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Check user session
  const { data: session, isPending } = useSession();

  const user = session?.user;

  // Navigation links based on authentication
  const links = user
    ? [
        { label: "Home", href: "/" },
        { label: "All Books", href: "/books" },
        { label: "Add Book", href: "/add-book" },
        { label: "My Books", href: "/my-books" },
        { label: "My Borrows", href: "/my-borrows" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "All Books", href: "/books" },
      ];

  // Logout handler
  const handleLogout = async () => {
    await authClient.signOut();
    setOpen(false);
  };

  // User initials
  const userInitial =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink shadow-[0_8px_30px_rgba(25,40,56,0.18)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="BookNook home"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-sage text-white shadow-sm">
              <BookOpen className="size-5" strokeWidth={2} />
            </span>

            <span className="font-display text-[1.65rem] leading-none font-semibold tracking-tight text-white">
              BookNook
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isPending && (
            <nav
              className="hidden items-center gap-7 md:flex"
              aria-label="Primary"
            >
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "text-[0.95rem] font-medium transition-colors",
                      isActive
                        ? "text-sage"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-2.5 md:flex">
          {!isPending && (
            <>
              {user ? (
                <Popover>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        aria-label="Open user menu"
                        className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-sage"
                      >
                        <Avatar className="size-10 cursor-pointer">
                          <AvatarImage
                            src={user.image || ""}
                            alt={user.name || "User"}
                          />
                          <AvatarFallback className="bg-sage text-deep font-semibold">
                            {userInitial}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    }
                  />

                  <PopoverContent align="end" className="w-64">
                    <PopoverHeader>
                      <PopoverTitle>
                        {user.name || "Welcome"}
                      </PopoverTitle>

                      <PopoverDescription>
                        {user.email}
                      </PopoverDescription>
                    </PopoverHeader>

                    <Button
                      variant="outline"
                      className="mt-3 w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex h-9 items-center rounded-lg border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex h-9 items-center rounded-lg bg-sage px-4 text-sm font-semibold text-deep shadow-sm transition-colors hover:bg-terracotta hover:text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-lg text-white hover:bg-white/10 md:hidden"
        >
          {open ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-white/10 bg-deep px-4 pt-2 pb-4 md:hidden">
          {!isPending && (
            <nav className="flex flex-col" aria-label="Mobile">
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive
                        ? "text-sage"
                        : "text-white/75 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile Authentication */}
              <div className="mt-3 flex gap-2 px-1">
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full border-white/25 text-white hover:bg-white/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-white/25 bg-white/5 text-sm font-semibold text-white"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-sage text-sm font-semibold text-deep"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      )}
    </header>
  );
}

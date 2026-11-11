# BookNook Client

Next.js 16 App Router (React 19, strict TypeScript), Tailwind v4 via turbopack, shadcn `base-nova` on `@base-ui/react` (NOT Radix). No test runner or CI is configured.

## Commands

- `npm run dev` — Turbopack dev server at http://localhost:3000.
- `npm run build` — production build; includes the TypeScript check.
- `npx tsc --noEmit` — standalone type check; no npm script exists.
- `npm run lint` — ESLint CLI directly (`next lint` was removed in Next 16). Fails on two vendored files, `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts` (`react-hooks/set-state-in-effect`). Treat as baseline unless your task is to fix it.

## Next.js 16 specifics

- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler` (manual memoization is usually unnecessary).
  - With `cacheComponents`, route-segment exports `dynamic`, `revalidate`, `fetchCache`, `runtime`, `dynamicParams`, and `experimental_ppr` are invalid. Cache with `use cache` + `cacheLife`, and wrap request-time data in `<Suspense>`.
- `params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` are async-only. Prefer the generated global types `LayoutProps<'/'>`, `PageProps<'/route'>`, and `RouteContext<'/route'>`; run `npm run dev`, `npm run build`, or `npx next typegen` to generate them.
- Partial Prerendering is the default, and navigation preserves route state with React `<Activity>` instead of unmounting.
- Turbopack loads Tailwind through `turbopack.rules`. There is no `postcss.config` or `tailwind.config`; do not add one.
- No `middleware.ts` or `proxy.ts` exists in this repo; do not create one based on stale docs.

## UI conventions

- `src/components/ui/*` is shadcn `base-nova` output built on `@base-ui/react`, not Radix. Use Base UI parts and its `render` prop; Radix/`asChild` snippets will not work.
- Add primitives with `npx shadcn@latest add <name>`; `components.json` is the source of truth. Do not paste Radix-based shadcn snippets.
- Merge classes with `cn` from the `cn` package; `@/lib/utils` only re-exports it. Do not add `clsx` or `tailwind-merge`.
- `@/*` maps to `src/*`. Routes live in `src/app`, shared chrome in `src/components/shared`, generated primitives in `src/components/ui`.
- Generated primitives expect shadcn tokens (`--background`, `--primary`, `--border`, `--radius`, etc.) in `src/app/globals.css`. The committed `globals.css` has the full `@theme inline` / `:root` / `.dark` block; do not strip it.
- Fonts: `Playfair Display` (`--font-display`) for headings, `DM Sans` (`--font-sans`) for body, loaded via `next/font/google` in `layout.tsx`.
- Dark mode: `globals.css` defines a `.dark` palette via `@custom-variant dark`. Wrap dark-themed page subtrees in `className="dark"`; the layout itself is light (`bg-paper`).

## Backend / auth

- Auth is better-auth + MongoDB Atlas. Server: `src/lib/auth.ts` (exports `auth`, reads `MONGODB_URI`). Client: `src/lib/auth-client.ts` (exports `signIn`, `signUp`, `signOut`, `useSession`, baseURL `http://localhost:3000`). API route: `src/app/api/auth/[...all]/route.ts`.
- `.env*` is gitignored; browser-visible config needs a `NEXT_PUBLIC_` prefix. Local `.env` holds `NEXT_PUBLIC_API_URL`, `MONGODB_URI`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`.
- The API is a separate sibling repo at `../booknook-server` (Express 5, port 8000, MongoDB `booknoob`, open CORS; currently only `GET /`). Start it independently; it is not part of this package.

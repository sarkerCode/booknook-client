<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook Client

Next.js 16 App Router client (React 19, strict TypeScript, Tailwind v4) with shadcn's `base-nova` UI on Base UI. No test runner or CI is configured.

## Commands

- `npm run dev` - Turbopack dev server at http://localhost:3000.
- `npm run build` - production build; includes the TypeScript check.
- `npm run lint` - ESLint CLI directly (`next lint` was removed in Next 16).
- `npx tsc --noEmit` - standalone type check; no npm script exists.
- `npx eslint <paths>` - lint only the files you changed.

`npm run lint` currently fails on two vendored files, `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`, both `react-hooks/set-state-in-effect`. Treat this as baseline unless the task is to fix it.

## Next.js 16 specifics

- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler` (manual memoization is usually unnecessary).
  - With `cacheComponents`, route-segment exports `dynamic`, `revalidate`, `fetchCache`, `runtime`, `dynamicParams`, and `experimental_ppr` are invalid. Cache with `use cache` + `cacheLife`, and wrap request-time data in `<Suspense>`.
  - `params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` are async-only. Prefer the generated global types `LayoutProps<'/'>`, `PageProps<'/route'>`, and `RouteContext<'/route'>`; run `npm run dev`, `npm run build`, or `npx next typegen` to generate them.
  - Partial Prerendering is the default, and navigation preserves route state with React `<Activity>` instead of unmounting.
- Turbopack is the default bundler and loads Tailwind through the `turbopack.rules` entry. There is no `postcss.config` or `tailwind.config`; do not add one.
- Use `proxy.ts` with an exported `proxy` function, not the deprecated `middleware.ts`.

## UI conventions

- `src/components/ui/*` is shadcn `base-nova` output built on `@base-ui/react`, not Radix. Use Base UI parts and its `render` prop; Radix/`asChild` snippets will not work.
- Add primitives with `npx shadcn@latest add <name>`; `components.json` is the source of truth. Do not paste Radix-based shadcn snippets.
- Merge classes with `cn` from the `cn` npm package, as generated files do. `@/lib/utils` only re-exports it; do not add `clsx` or `tailwind-merge`.
- Generated primitives expect shadcn tokens (`--background`, `--primary`, `--border`, `--radius`, etc.) in `src/app/globals.css`. The committed version has the full `@theme inline` / `:root` / `.dark` block, but the current working tree keeps only the imports. Restore it with `git show HEAD:src/app/globals.css` if colours are missing.
- `@/*` maps to `src/*`. Routes live in `src/app`, shared chrome in `src/components/shared`, generated primitives in `src/components/ui`.

## Backend

- The API is a separate sibling repo at `../booknook-server` (Express 5, port 8000, MongoDB database `booknoob`, open CORS; currently only `GET /`). Start it independently; it is not part of this package.
- The client has no API layer or env files yet. `.env*` is gitignored; use a `NEXT_PUBLIC_` prefix for browser-visible config.

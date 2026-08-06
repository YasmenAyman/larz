# Current Frontend Audit

Audit date: 2026-08-05

## Scope

This is a read-only audit of the existing LARZ Developments frontend. No Laravel project was initialized, no source frontend file was modified, and no dependency or build configuration was removed.

Approved references are present in `docs/reference-designs/`:

- `Home.png`
- `About-Us.png`
- `projects.png`
- `Contact-Us.png`
- `Careers.png`
- `Media.png`

## 1. Current Framework And Architecture

- Framework: React 19 with TypeScript.
- Application runtime: TanStack Start with TanStack Router.
- Rendering: TanStack Start SSR, wrapped by a custom `src/server.ts` fetch entry.
- Build: Vite 8 through `@lovable.dev/vite-tanstack-config`.
- Server/build target: Nitro build configured by the Lovable Vite preset, currently producing Cloudflare-compatible output.
- Routing: File-based TanStack Router routes under `src/routes`; `src/routeTree.gen.ts` is generated.
- State/data: Mostly local arrays and imported static assets. React Query is installed and a `QueryClientProvider` is mounted, but the audited pages do not use remote queries.
- Styling: Tailwind CSS 4 through `@tailwindcss/vite`, `tw-animate-css`, and a custom `src/styles.css` theme.
- UI primitives: Radix UI and shadcn-style generated components under `src/components/ui`.
- Backend/database: None in this repository. There is no Laravel application, migration, model, controller, MySQL connection, or Inertia adapter.
- CMS/authentication: None.

## 2. Package And Build Configuration

| File | Purpose | Migration note |
| --- | --- | --- |
| `package.json` | Scripts and dependency manifest. Scripts are `dev`, `build`, `build:dev`, `preview`, `lint`, and `format`. | Keep temporarily for visual parity and staged migration; replace the application entry/build scripts only after Laravel approval. |
| `package-lock.json` | npm lockfile, lockfile version 3. | Keep until the migration package strategy is approved. |
| `bun.lock` | Bun lockfile. `bunfig.toml` also sets a 24-hour package release guard. | Keep during audit; choose npm or Bun as the final toolchain before Laravel integration. |
| `vite.config.ts` | Delegates TanStack Start, React, Tailwind, aliases, env injection, Nitro, and Cloudflare behavior to `@lovable.dev/vite-tanstack-config`; sets the server entry to `src/server.ts`. | High migration risk. Laravel/Inertia will need a Laravel Vite config and a new entry strategy. |
| `tsconfig.json` | Strict TypeScript, bundler module resolution, JSX, `@/*` -> `src/*` alias, no emit. | Alias and strictness can be retained in the Inertia frontend. |
| `components.json` | shadcn configuration, Tailwind CSS path, aliases, Lucide icon library, RTL disabled. | UI primitives can be retained or migrated incrementally. |
| `eslint.config.js` | ESLint 9, TypeScript, React hooks/refresh, Prettier integration. | Keep as frontend quality tooling. |
| `.prettierrc`, `.prettierignore` | Formatting settings and exclusions. | Low risk; keep if TypeScript frontend remains. |
| `bunfig.toml` | Bun install policy and release-age guard. | Tooling-only; not part of Laravel runtime. |
| `.gitignore` | Ignores Node build output, Nitro, TanStack, Wrangler, and local env files. | Add Laravel/PHP ignores later without removing current entries prematurely. |
| `AGENTS.md` | Lovable project history/sync guidance. | Process documentation, not application runtime. |
| `README.md` | Currently only contains the project name. | Needs a replacement deployment and migration guide later. |

### Dependency groups

- Core frontend: `react`, `react-dom`, `typescript`, `vite`.
- TanStack runtime: `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`, `@tanstack/react-query`.
- Server/build: `nitro`, `@lovable.dev/vite-tanstack-config`.
- Styling: `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css`, `tailwind-merge`, `class-variance-authority`, `clsx`.
- UI: Radix packages, shadcn-generated primitives, `lucide-react`.
- Interaction: `embla-carousel-react`, `embla-carousel-autoplay`, `react-hook-form`, `@hookform/resolvers`, `date-fns`, `recharts`, `vaul`, `sonner`.
- Icons also present: Font Awesome packages. They are not prominent in the audited route files.

## 3. Runtime And Server Audit

### Server-only or server-adjacent files

| File | Finding | Laravel destination | Risk |
| --- | --- | --- | --- |
| `src/start.ts` | TanStack Start server middleware. Adds error middleware and CSRF middleware filtered to `serverFn` handlers. No server functions are defined in the repository. | Laravel CSRF middleware and exception handler. | Medium |
| `src/server.ts` | Cloudflare/Nitro fetch entry. Lazily imports TanStack server entry, normalizes h3 swallowed 500 responses, and returns an HTML error page. | Laravel HTTP kernel, exception handler, and web server entry. | High |
| `src/lib/error-capture.ts` | Server/runtime console error interception, error cause expansion, browser error and unhandled rejection capture. | Laravel logging plus frontend error monitoring. | Medium |
| `src/lib/error-page.ts` | Error HTML rendering helper used by server wrappers. | Laravel error views or Inertia error page. | Medium |
| `src/lib/lovable-error-reporting.ts` | Browser-only Lovable telemetry bridge used by the root error boundary. | Replace with approved production monitoring or remove. | Low |

Findings:

- No `createServerFn` usage found.
- No `serverFn` implementation found; only CSRF middleware references the handler type.
- No database access, ORM, API route, session, authentication, file upload, or webhook implementation found.
- No `process.env`, `import.meta.env`, or `.env*` files were found in the repository audit.
- No standalone `wrangler.toml`, `wrangler.json`, `wrangler.jsonc`, or `nitro.config.*` file was found. Cloudflare/Nitro behavior is injected by the Lovable Vite preset.
- `src/server.ts` is the only application fetch entry and is Cloudflare-runtime-oriented.

## 4. SEO, External Services, And Integrations

- SEO is implemented with TanStack route `head` definitions in `src/routes/__root.tsx` and individual routes.
- Root SEO includes charset, viewport, title, description, Open Graph title/description/type, Twitter card, Google Fonts preconnect, stylesheet, and favicon.
- Page routes provide titles and descriptions for Home, About, Contact, Careers, Media, Projects, job details, and project details.
- SEO is not database-driven, and there is no sitemap generation, JSON-LD, canonical URL, robots strategy beyond `public/robots.txt`, or CMS metadata model.
- WhatsApp is a hardcoded external integration in `src/components/shared/WhatsAppButton.tsx`; it uses `https://wa.me/201128775744` with a hardcoded inquiry message. Project and page-local WhatsApp links are also hardcoded anchors.
- Maps: no map SDK or map API is integrated. `LocationMap` and Contact use local image placeholders. The project page labels an image as an interactive map, but it is not an embedded map.
- Video: `src/components/projects/VirtualTour.tsx` embeds a hardcoded YouTube video URL in a modal.
- External network references found: Google Fonts, YouTube iframe, WhatsApp URL, and Lovable runtime telemetry hooks. No business API is present.

## 5. Forms And User Input

| Location | Current behavior | Dynamic migration target | Risk |
| --- | --- | --- | --- |
| `src/routes/contact.tsx` | Pricing/tour form with name, phone, project select, and message. No submit handler or action; browser default submission is not connected to a backend. | Inertia form -> Laravel `ContactInquiry` endpoint/model, validation, notification, and CMS listing. | High |
| `src/components/projects/Masterplan.tsx` | Brochure form with name and phone. `onSubmit` only calls `preventDefault`; no download or persistence. | Inertia form -> brochure lead endpoint and optional signed download response. | High |
| `src/components/media/MediaSections.tsx` | Newsletter email form with no submit handler. | Inertia form -> newsletter subscription model/job/provider integration. | Medium |
| `src/components/projects/VirtualTour.tsx` | Play/close state is client-only; iframe is static. | Keep UI; make video URL content-managed. | Low/Medium |

## 6. Responsive And Animation Audit

- Tailwind breakpoints used in source: primarily `sm`, `md`, and `lg`; there is no custom Tailwind config file, so default Tailwind 4 breakpoints apply.
- Common layout widths: `max-w-[1440px]`, `max-w-5xl`, `max-w-[1180px]`, `max-w-site`, and `max-w-[1440]`.
- Responsive behavior is encoded directly in JSX classes: mobile stacks, `sm` switches to two-column or horizontal layouts, `md` adds grids, and `lg` enables desktop nav and multi-column sections.
- Animation/interaction libraries: Embla carousel, Embla autoplay, Radix animation classes via `tw-animate-css`, and CSS transitions. No Framer Motion, GSAP, or React Spring found.
- CSS animation is mainly utility-based (`animate-in`, `animate-out`, `animate-pulse`, `animate-caret-blink`) and component transition classes.
- Existing visual behavior must be preserved during Inertia conversion; replacing route components with server-rendered templates would be high risk without screenshot comparison.

## 7. Migration Risks

1. The current routes mix route definitions, page markup, copy, and asset imports. Dynamic conversion will require separating content schemas from presentation without changing rendered markup.
2. Static arrays in `src/data/site.ts` and `src/data/project.ts` are used directly by many components. Replacing them with Inertia props changes loading, types, empty states, and route contracts.
3. Current project detail and career detail loaders use TanStack Router `loader`/`notFound`; Laravel controllers and Inertia responses must reproduce these states and URL shapes.
4. Forms are visual-only. Converting them to real persistence requires validation, CSRF, mail/notification behavior, rate limiting, and admin workflows.
5. The current SSR/Cloudflare server wrapper is unrelated to a cPanel PHP runtime. Deployment behavior must be redesigned rather than copied.
6. The approved design depends on exact Tailwind classes, image imports, gradients, breakpoints, and font loading. Any component rewrite can create visual regressions.
7. There is no existing CMS permission model, so protected dashboard behavior is entirely new scope.

## 8. Proposed Laravel/Inertia Destination

- Laravel route/controller layer for public pages and protected admin routes.
- Inertia React pages preserving the existing JSX structure and class names.
- Eloquent models for projects, project facts, galleries, amenities, construction updates, careers, job applications, media posts, gallery items, partners, testimonials, contacts, newsletter subscribers, and site settings.
- Laravel Form Requests for contact, brochure, newsletter, job application, and CMS forms.
- Policies and roles for protected CMS CRUD.
- Storage-backed media library with stable URLs and responsive image variants.
- Vite Laravel entry retaining the current Tailwind theme and asset pipeline.
- MySQL as the content store; seeders should initially reproduce every current static value exactly.

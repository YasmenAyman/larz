# LARZ Laravel/Inertia Migration Plan

Status: planning only

This plan does not initialize Laravel, alter the current React source, remove TanStack Start, remove Nitro/Wrangler behavior, or change the approved visual design.

## Non-Negotiable Migration Rules

1. The current frontend remains the visual baseline.
2. No current route or component is deleted until its Laravel/Inertia replacement is deployed and accepted.
3. Every replacement page must be screenshot-compared at the approved desktop and mobile viewports before cutover.
4. Every replacement page must pass content, links, accessibility, SEO, form, and responsive acceptance checks before the old page is retired.
5. Database seeds must reproduce the current hardcoded content before editors are allowed to change it.
6. CMS forms must be typed and scoped to their content model. Regular users must never edit arbitrary raw JSON.
7. Each phase must be independently deployable or reversible.
8. Old and new route ownership must be explicit. No two applications may silently own the same production URL.

## Phase 0 - Freeze And Baseline

### Objectives

- Freeze the approved frontend design.
- Establish a reproducible baseline before Laravel work.
- Confirm which worktree changes are approved and which are unrelated.

### Work

- Tag or archive the current frontend commit.
- Preserve `docs/reference-designs/` as visual acceptance references.
- Record current route URLs, page screenshots, asset filenames, fonts, breakpoints, and interaction behavior.
- Record current Node/npm/Bun versions and the production build command.
- Create a migration branch and a rollback branch/tag.
- Decide the canonical production domain and URL policy.

### Exit gate

- Baseline screenshots exist for all public routes.
- Current frontend can still build and preview.
- No source deletion is allowed in this phase.

## Phase 1 - Laravel Shell And Inertia Proof Of Life

### Objectives

- Initialize Laravel only after approval of this plan.
- Add React/Inertia/Vite without replacing the existing frontend.

### Work

- Create the Laravel application in a separate migration directory or branch.
- Configure MySQL, sessions, cache, queues, filesystem, mail, and application URL.
- Install `inertiajs/inertia-laravel`, React Inertia client, and Laravel Vite integration.
- Add a minimal Inertia health page at a non-conflicting internal path such as `/__inertia-proof`.
- Keep the current TanStack app serving all existing public URLs.
- Add Laravel error, CSRF, and session behavior without touching current React files.

### Exit gate

- Laravel boots on the target PHP version.
- Inertia proof page renders through Laravel and Vite.
- Current public frontend remains unchanged and reachable.
- cPanel-compatible local/staging deployment is proven.

## Phase 2 - Shared Design System And Asset Parity

### Objectives

- Move the approved visual primitives without changing their output.

### Work

- Copy/adapt `src/styles.css` into `resources/css/app.css` with the same theme variables.
- Preserve Poppins/Cormorant font loading and fallback order.
- Port `Logo`, `Eyebrow`, `SectionHeading`, `PillButton`, `Header`, `Footer`, WhatsApp button, and required UI primitives.
- Move static assets to a versioned Laravel public/storage strategy while keeping dimensions, names, alt text, and object positioning.
- Replace TanStack `Link` only with Inertia `Link` or plain anchors where a full page load is intentionally required.
- Establish a screenshot diff process.

### Exit gate

- Shared shell comparison passes at desktop/mobile reference sizes.
- No changes to spacing, colors, fonts, breakpoints, or animations are accepted without design approval.

## Phase 3 - Seed Current Content Before Dynamic Cutover

### Objectives

- Create database records that exactly reproduce current static data.

### Work

- Add migrations for global settings, navigation, media, projects, careers, media posts, testimonials, partners, awards, leads, users/roles, and SEO.
- Create import/seed scripts from the audited `src/data/site.ts`, `src/data/project.ts`, route copy, and component arrays.
- Store imported assets in a media table and filesystem disk.
- Add a content version or published snapshot strategy.
- Add typed defaults for every known section.

### Exit gate

- Seeded data can render all current content without hardcoded page arrays.
- Counts, slugs, labels, ordering, image references, and metadata match the baseline inventory.
- Seeder is repeatable in a fresh database.

## Phase 4 - Admin Authentication, Roles, And CMS Foundation

### Objectives

- Build the protected CMS before exposing content editing.

### Work

- Add Laravel authentication using the chosen official starter/auth package.
- Add roles and permissions, preferably with a mature permission package or a small policy-backed implementation approved before coding.
- Add Admin layout, navigation, authorization middleware, policies, validation, flash messages, pagination, filters, and audit logging.
- Implement media upload/library foundation.
- Add draft/publish status where applicable.

### Suggested roles

- `super_admin`: unrestricted administration.
- `content_admin`: all website content and media, no user/permission administration.
- `editor`: create/edit assigned content, submit for review.
- `reviewer`: review/publish content, no system configuration.
- `sales_manager`: inquiries, brochure requests, project leads.
- `careers_manager`: jobs and applications.
- `media_manager`: media posts, galleries, newsletter subscribers.
- `analyst`: read-only dashboards/reports.

### Exit gate

- Unauthorized CMS URLs return 403 or redirect to login.
- Every admin action is policy-checked and logged.
- Password reset, session expiry, CSRF, and rate limiting are tested.

## Phase 5 - Low-Risk Public Page Cutovers

Cut over in this order:

1. `/about`
2. `/contact` read-only shell, then form actions
3. `/careers` and job details
4. `/media`
5. `/` Home
6. `/projects` index
7. `/projects/{slug}` details

For each page:

- Build an Inertia page using the existing JSX structure and classes.
- Add a Laravel controller and typed view model/DTO.
- Add route-level SEO props.
- Compare against reference screenshots.
- Test navigation from Header/Footer and direct URL access.
- Test missing records, unpublished records, empty lists, and mobile behavior.
- Run old and new page in parallel under a staging-only comparison URL if needed.
- Cut over the canonical URL only after acceptance.
- Keep the old route/component available in the migration branch until the next phase is accepted.

### Page acceptance gate

- Pixel comparison accepted.
- All content present and ordered correctly.
- No console errors or broken asset URLs.
- Forms persist valid data and show validation/errors/success states.
- SEO output matches or improves current metadata.
- Accessibility smoke test passes.
- Rollback to old page is documented and tested.

## Phase 6 - Dynamic Forms And Notifications

Implement independently from visual cutover:

- Contact inquiries.
- Project inquiries.
- Brochure requests.
- Job applications with secure CV upload.
- Internship applications.
- General CV submissions.
- Newsletter subscriptions.

Add validation, honeypot/rate limiting, duplicate handling, notification mail, admin status queues, retention rules, and privacy consent before production activation.

## Phase 7 - CMS Module Completion

- Complete CRUD and typed forms for every module in `docs/cms-modules.md`.
- Add media transformations, alt text, ordering, publish states, SEO fields, and audit history.
- Add bulk ordering/status operations only where role permissions and audit requirements are clear.

## Phase 8 - Public Route Cutover And Legacy Retirement

- Switch production web root/proxy to Laravel only after all required URLs are accepted.
- Keep a temporary rollback copy of the old frontend artifact outside the live document root.
- Remove old TanStack/Nitro/Wrangler dependencies only in a separate approved cleanup phase.
- Delete old source routes/components only after confirming no imports, route tree references, deployment scripts, or docs depend on them.
- Do not delete old frontend files as part of an individual page cutover.

## Phase 9 - cPanel Production Hardening

- Deploy the Laravel public directory as document root or use the approved public-folder rewrite.
- Configure production `.env`, database, cache, mail, queue cron, storage symlink, permissions, backups, and SSL.
- Verify `config:cache`, `route:cache`, `view:cache`, and Vite asset manifest behavior.
- Run smoke tests and rollback rehearsal.

## Phase 10 - Legacy Cleanup

Only after written approval:

- Remove TanStack Start, Nitro, Wrangler/Cloudflare-only configuration, and unused dependencies.
- Remove generated route tree and old frontend server entry.
- Remove migration-only adapters and duplicate static data.
- Update README and operational documentation.

## Rollback Strategy

- Database migrations are forward-only with explicit rollback scripts for non-production environments.
- Content imports are idempotent and keyed by stable slugs/external keys.
- Public route cutover uses a reversible web-server/proxy switch.
- Each page has an old frontend fallback until acceptance is signed off.
- Media files are immutable/versioned; do not overwrite files referenced by published content.
- Maintain a release manifest containing application version, database migration batch, asset build hash, and route ownership.

# Performance Review

## Scope

Reviewed public controllers, Inertia shared props, admin list controllers, sitemap generation, relationship loading, filtering/pagination, cache behavior, and database indexes. The public frontend layout, image presentation, and animation behavior were not changed.

## Findings And Fixes

### N+1 and eager loading

- Existing public project, media, home, and careers controllers already eager-load the primary relationship trees used by their serializers.
- Sitemap generation now eager-loads project hero images and media featured/Open Graph images.
- SEO metadata resolution supports request-local preloading so sitemap metadata records are loaded in one query instead of one query per URL.
- Shared website sections are cached by page/section key, avoiding repeated reads for the same request path.
- Admin application and lead lists retain eager-loaded owner/project/asset relationships and paginate results.

### Pagination and public query scopes

- Public project/media queries continue to filter `is_published=true` before serialization.
- Individual project/media routes return 404 for unpublished records.
- Admin lead/application/newsletter/media lists use pagination and query-string-preserving filters.
- Sitemap includes only published/indexable dynamic records.

### Database indexes

Added `2026_08_05_160000_add_public_query_indexes` for:

- Public job listing order/filtering.
- Public media listing publication/date filtering.
- Job, internship, and general CV workflow status/submission date.
- Project inquiry and brochure request status/created date.

Existing indexes remain in place for projects, page sections, contact inquiries, newsletter email uniqueness, and media MIME lookup.

### Global settings and navigation caching

- Public shared settings are cached under `website.settings.public`.
- Active navigation is cached under `website.navigation`.
- Published page sections are cached under `website.section.{page}.{section}`.
- Settings updates invalidate public settings and SEO defaults.
- Navigation updates invalidate navigation cache.
- Content updates invalidate the exact page-section cache keys they change.

### Route/cache compatibility

- Closure route actions were replaced with controller methods so route serialization works.
- `php artisan config:cache`, `php artisan route:cache`, and `php artisan view:cache` all succeed.
- Cache-heavy SEO resolution remains compatible with config and route caching because no request-time closures are stored in configuration or route definitions.

## Residual Risks / Operational Requirements

- Database cache, session, and queue tables should use the production database or Redis sizing appropriate to traffic.
- For high-volume media/sitemap catalogs, consider chunked sitemap generation or sitemap index files.
- For multi-node deployments, use a shared cache backend and shared public object storage.
- Monitor slow queries in production; current indexes target the known public/admin query shapes.

## Verification

- Full Laravel suite passes: `86 tests`, `327 assertions`.
- Production frontend build passes with `npm run build`.
- All cache compilation commands pass.

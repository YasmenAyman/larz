# Security Review

## Scope

Reviewed the Laravel foundation application, public form endpoints, admin routes, media uploads, Inertia serializers, cache configuration, and production configuration. The public frontend layout, image presentation, and animation behavior were not changed.

## Findings And Fixes

### Upload security

- Replaced permissive upload handling with `App\Services\MediaUploadService` profiles for public images, public brochures, and private CV documents.
- Generated UUID filenames and rejected absolute paths, backslashes, traversal segments, control characters, and unsafe directory names.
- Validated both MIME type and extension, with profile-specific file-size limits.
- Added optional image dimension checks and safe SVG XML/content checks.
- Private CV downloads now require the existing `applications.view` permission and are restricted to the private `local` disk by the service itself.
- Replaced files are deleted only after a successful reference update and only when no active record still references them.

### Request and route protection

- Public form routes use Laravel's web middleware, including CSRF protection, and rate limiting.
- Honeypot validation is applied to public submissions.
- Admin routes remain protected by `auth`, `verified`, `dashboard.view`, and module permissions.
- SEO editor routes require `seo.view` or `seo.update`.
- Public project/media route binding uses published-record queries; unpublished records return 404 and are excluded from the sitemap.
- Login throttling remains enabled through the existing Breeze request.

### Authorization and mass assignment

- Public FormRequests intentionally authorize public submissions.
- Admin authorization is enforced at the route boundary, rather than relying on a request being called in isolation.
- Settings updates now intersect submitted keys with existing `site_settings` keys, preventing arbitrary-key updates.
- Models use explicit `$fillable` lists.

### XSS and rich text

- Public media content is rendered as React text rather than raw HTML.
- `RichTextSanitizer` strips unsafe tags, event-handler attributes, and dangerous `javascript:`, `vbscript:`, and `data:` URLs before admin content/media content is persisted.
- JSON-LD output escapes `<`, `>`, and `&` before insertion into a script tag.
- Blade email templates use escaped interpolation.

### Sensitive data and production behavior

- Shared Inertia props expose only public settings groups and a minimal authenticated user shape (`id`, `name`, `email`).
- Admin-only settings and raw role/permission data are not globally shared.
- `.env.example` now defaults `APP_DEBUG=false`.
- Laravel's default exception handling remains active for production-safe generic responses when debug is disabled.
- Production should set `SESSION_SECURE_COOKIE=true`, use HTTPS, and run behind a trusted proxy configuration.

## Residual Risks / Operational Requirements

- Keep production `.env` out of version control and set `APP_DEBUG=false`.
- Run `php artisan storage:link` during deployment so the configured `public/storage` link points to `storage/app/public`.
- Run a queue worker for queued mail and monitor failed jobs.
- Use HTTPS and set `SESSION_SECURE_COOKIE=true` in production.
- If rich HTML editing is introduced later, replace the conservative sanitizer with a maintained HTML sanitizer and an explicit allowlist policy.

## Verification

- Full Laravel suite passes: `86 tests`, `327 assertions`.
- Production frontend build passes with `npm run build`.
- `php artisan config:cache` passes.
- `php artisan route:cache` passes.
- `php artisan view:cache` passes.

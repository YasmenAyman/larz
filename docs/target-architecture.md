# Target Laravel/Inertia Architecture

## Target Stack

- Laravel application with PHP version selected for the hosting account.
- MySQL for relational content, users, permissions, leads, and audit records.
- React with TypeScript and Inertia.js.
- Vite Laravel plugin for frontend builds.
- Existing Tailwind CSS 4 theme and custom CSS copied without visual changes.
- Laravel session authentication, CSRF, policies, and role-based permissions.
- cPanel deployment with Apache/PHP-FPM or the host-supported PHP runtime.

## Target Directory Structure

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── Website/
│   │   └── Admin/
│   ├── Requests/
│   └── Middleware/
├── Models/
├── Policies/
├── Services/
└── Support/

database/
├── migrations/
├── seeders/
└── factories/

resources/
├── css/
├── js/
│   ├── components/
│   │   ├── website/
│   │   ├── admin/
│   │   └── shared/
│   ├── layouts/
│   ├── pages/
│   │   ├── Website/
│   │   ├── Admin/
│   │   └── Auth/
│   ├── hooks/
│   ├── types/
│   └── utils/
└── views/

routes/
├── web.php
├── auth.php
└── console.php
```

## Request Flow

### Public website

1. Browser requests a Laravel route in `routes/web.php`.
2. Website controller loads published content through query services/repositories.
3. Controller maps Eloquent models to typed page props/DTOs.
4. Controller returns an Inertia response for a React page under `resources/js/Pages/Website`.
5. Shared Inertia data provides site settings, navigation, footer, SEO defaults, and authenticated user state where relevant.
6. React reuses the existing Tailwind classes, image treatment, responsive rules, and interaction code.

### CMS

1. Authentication middleware protects `/admin` routes.
2. Role/permission middleware and policies authorize every controller action.
3. Admin controller validates Form Request input.
4. Service performs transaction, media handling, ordering, publish state, and audit log write.
5. Inertia admin page receives paginated records and typed form options.
6. Flash/toast response returns success or field errors without a full visual redesign.

## Route Organization

### `routes/web.php`

- Public website pages: home, about, contact, careers, jobs, media, projects, project details, blogs/events if retained.
- POST actions: inquiries, brochure requests, applications, newsletter subscription.
- Optional preview routes guarded by signed URLs and permission checks.

### `routes/auth.php`

- Login, logout, password reset, optional email verification, optional two-factor authentication.
- Admin login should not expose CMS routes to unauthenticated users.

### Admin route prefix

Use `/admin` with named routes such as:

- `admin.dashboard`
- `admin.projects.index`
- `admin.projects.edit`
- `admin.media-posts.index`
- `admin.inquiries.index`
- `admin.settings.edit`

The prefix can be changed, but it must be stable and excluded from public SEO.

### `routes/console.php`

- Scheduled content publication.
- Newsletter processing.
- Lead notification retries.
- Cleanup/retention jobs.
- Media derivative cleanup.

## Controller Boundaries

### Website controllers

- `HomeController`
- `AboutController`
- `ProjectController`
- `ContactController`
- `CareerController`
- `MediaController`
- `SitemapController` if generated dynamically

Website controllers should be thin. Use page-specific query services and typed view models rather than passing unrestricted Eloquent models to React.

### Admin controllers

- `DashboardController`
- `SiteSettingsController`
- `NavigationController`
- `FooterController`
- `HomePageController`
- `AboutPageController`
- `ProjectController`
- `ProjectGalleryController`
- `ProjectUnitTypeController`
- `ProjectAmenityController`
- `ProjectStatisticController`
- `ProjectUpdateController`
- `LocationController`
- `MediaPostController`
- `MediaGalleryController`
- `TestimonialController`
- `PartnerController`
- `AwardController`
- `CareerPageController`
- `CareerValueController`
- `JobVacancyController`
- `ApplicationController`
- `InquiryController`
- `NewsletterSubscriberController`
- `UserController`
- `RoleController`
- `PermissionController`
- `ActivityLogController`
- `SeoMetadataController`

## Services And Support

- `ContentPublishingService`: draft/publish transitions and timestamps.
- `MediaLibraryService`: upload validation, stable paths, image metadata, responsive derivatives.
- `LeadCaptureService`: normalize contact/project/brochure leads and deduplicate safely.
- `NotificationService`: email/admin alerts with queued delivery.
- `SeoService`: canonical metadata, robots rules, sitemap input, Open Graph assets.
- `NavigationService`: published ordered navigation and footer links.
- `PageContentService`: typed section records and page composition.
- `ImportLegacyContentService`: one-time idempotent seed/import from audited frontend data.
- `Support/ContentStatus`, `Support/LeadStatus`, `Support/MediaType`: PHP enums/value objects.
- `Support/PageProps`: typed DTO factories and safe serialization.

## Hybrid Content Architecture

### Relational entities

Use dedicated tables for repeatable, queryable business content:

- Projects, facts, galleries, unit types, amenities, updates, nearby locations.
- Media posts, press/blog categories, gallery items.
- Testimonials, partners, awards.
- Jobs, responsibilities, requirements, applications.
- Inquiries, brochure requests, newsletter subscribers.
- Users, roles, permissions, activity logs.

### Structured section records

Use typed page/section records for non-repeatable editorial content:

- Home hero/about/CTA sections.
- About hero/story/promise sections.
- Careers hero/internship/CTA sections.
- Media hero/newsletter sections.
- Contact hero/map/social sections.
- Project overview/masterplan/virtual-tour/location sections.

Each section type gets an explicit admin form and a typed field schema in application code. Editors see labels, validation, image selectors, and ordering controls. They do not edit raw JSON.

### JSON policy

- Raw JSON editing is forbidden for regular CMS users.
- JSON may be used internally for immutable configuration, audit snapshots, or a versioned section payload if the corresponding typed form serializes it.
- Admin APIs should return typed props, not arbitrary JSON blobs.

## Shared Inertia Data

Share only safe, small, published values:

- `site.name`, `site.phone`, `site.email`, `site.whatsapp_url`.
- Published navigation and footer links.
- User summary and permissions only inside authenticated admin responses.
- CSRF token is handled by Laravel/Inertia infrastructure.
- Global SEO defaults.

Do not share full Eloquent models, private inquiries, unpublished content, or permission internals with public pages.

## Security Architecture

- Session-based Laravel authentication.
- CSRF middleware on all state-changing browser requests.
- Password hashing via Laravel defaults.
- Policies for every model mutation and sensitive read.
- Role/permission checks at route and policy levels.
- Rate limiting on login, contact, applications, brochure, and newsletter endpoints.
- Honeypot and/or CAPTCHA only if spam volume requires it; preserve visual form structure.
- Private CV storage outside direct public access; signed/authorized downloads.
- Private inquiry data never sent to public Inertia props.
- Activity logs record actor, action, model, model id, old/new safe values, IP, user agent, and timestamp.
- Validate and sanitize URLs, iframe/video IDs, HTML excerpts, and uploaded images.

## SEO Architecture

- `SeoMetadata` records for page key, route pattern, title, description, canonical URL, robots, OG image, and structured data fields.
- Controller/page DTO resolves record with fallback defaults.
- Generate `sitemap.xml` from published projects, media posts, careers, and static pages.
- Keep robots rules in a Laravel response or managed public file.
- Noindex admin, preview, draft, login, and internal routes.

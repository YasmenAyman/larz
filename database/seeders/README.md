# Content Seeders

These seeders are a development/content baseline extracted from the existing React frontend. They are intended to reproduce the currently approved static content before CMS editing is enabled.

## Included Seeders

- `RolePermissionSeeder`: authorization vocabulary and CMS roles.
- `SiteSettingsSeeder`: global brand, contact, WhatsApp, footer, and social settings.
- `NavigationSeeder`: current Header and Footer labels/URLs.
- `PageSectionsSeeder`: typed page section snapshots for current page copy.
- `MediaSeeder`: source asset references, Media categories/posts, and photo gallery items.
- `ProjectsSeeder`: KLOVE and catalog projects, stats, unit types, amenities, updates, locations, galleries, and project highlight section snapshots.
- `CareersSeeder`: current company values, visible jobs, known job detail records, and internship copy.
- `PartnersSeeder`: approved partner names and roles currently present in the source.
- `AwardsSeeder`: intentionally empty until real award names/content replace the source placeholders.
- `TestimonialsSeeder`: current testimonial names, roles, and quotes.
- `ArabicContentSeeder`: Arabic translations for public CMS content.
- `ArabicSeoMetadataSeeder`: Arabic SEO metadata for the static public pages.

## Development Use

Run locally with:

```bash
php artisan db:seed
```

The seeders use `updateOrCreate` or stable keys where practical and are safe to rerun against the development baseline.

## Production Rule

These are content/bootstrap seeders, not a production deployment step. Production deployments must not run `php artisan db:seed` automatically. Run only an explicitly reviewed seeder/import command during a controlled content release, after backup and approval.

The initial admin is never created by these seeders. Use the separate `php artisan admin:create` command with explicit environment or interactive credentials.

## Source Placeholder Content

Where the current rendered frontend visibly contains source placeholders such as `[Award name]`, `[Milestone]`, `[Partner]`, `[Full address]`, or generic standfirst/teaser text, the exact source value is seeded to preserve visual/textual parity. No replacement or invented content was added.

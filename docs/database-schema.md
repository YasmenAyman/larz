# Proposed Database Schema

This is a proposal only. No migrations have been created. Types use MySQL 8/Laravel conventions and should be adjusted after confirming the hosting MySQL version.

## Schema Conventions

- Primary keys: `id BIGINT UNSIGNED` auto increment unless stated otherwise.
- Timestamps: `created_at TIMESTAMP NULL`, `updated_at TIMESTAMP NULL`.
- Soft deletion: `deleted_at TIMESTAMP NULL` on editor-managed entities where historical references matter.
- Status fields: PHP-backed enums persisted as short `VARCHAR` values, not database-specific enums, for portability.
- Slugs: lowercase `VARCHAR(180)` with a unique index among active records or a global unique index where URLs must never collide.
- Text: `VARCHAR` for labels/titles, `TEXT` for editorial copy, `LONGTEXT` only for full article bodies or HTML that truly needs it.
- Media paths: `VARCHAR(500)`; binary files stay on a filesystem/object disk, not MySQL.
- JSON: only for internal snapshots/configuration; no raw JSON editor for regular CMS users.
- All user-submitted strings are validated, trimmed, normalized, and escaped by output context.

## Identity, Permissions, And Audit

### `users`

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | BIGINT UNSIGNED | No | PK |
| `name` | VARCHAR(160) | No | Required |
| `email` | VARCHAR(255) | No | Unique |
| `email_verified_at` | TIMESTAMP | Yes | Laravel verification |
| `password` | VARCHAR(255) | No | Hashed |
| `is_active` | BOOLEAN | No | Default true, indexed |
| `last_login_at` | TIMESTAMP | Yes | Operational |
| `remember_token` | VARCHAR(100) | Yes | Laravel auth |
| `created_at`, `updated_at` | TIMESTAMP | Yes | Standard |
| `deleted_at` | TIMESTAMP | Yes | Soft delete |

Indexes/relations: unique `email`; index `is_active`; many-to-many `roles` through `role_user`. Validation: email format, password policy, prevent deactivating the last active super admin.

### `roles`

Columns: `id BIGINT UNSIGNED PK`, `name VARCHAR(100) NOT NULL`, `slug VARCHAR(100) NOT NULL UNIQUE`, `description TEXT NULL`, timestamps, `deleted_at`.

Relations: many-to-many users and permissions. Validation: slug immutable after use; protected system roles cannot be deleted.

### `permissions`

Columns: `id BIGINT UNSIGNED PK`, `name VARCHAR(150) NOT NULL`, `slug VARCHAR(150) NOT NULL UNIQUE`, `group_name VARCHAR(80) NOT NULL INDEX`, `description TEXT NULL`, timestamps.

Relations: many-to-many roles. Validation: permission slugs are code-level constants and should not be silently renamed.

### `role_user`

Columns: `user_id BIGINT UNSIGNED NOT NULL FK users.id CASCADE`, `role_id BIGINT UNSIGNED NOT NULL FK roles.id CASCADE`, timestamps. Composite PK/unique `(user_id, role_id)`, indexes on both FKs.

### `permission_role`

Columns: `permission_id BIGINT UNSIGNED NOT NULL FK permissions.id CASCADE`, `role_id BIGINT UNSIGNED NOT NULL FK roles.id CASCADE`, composite PK/unique `(permission_id, role_id)`.

### `activity_logs`

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | BIGINT UNSIGNED | No | PK |
| `user_id` | BIGINT UNSIGNED | Yes | FK users.id SET NULL |
| `event` | VARCHAR(80) | No | created/updated/published/deleted/login |
| `subject_type` | VARCHAR(180) | Yes | Polymorphic model type |
| `subject_id` | BIGINT UNSIGNED | Yes | Polymorphic id |
| `description` | VARCHAR(255) | No | Human-readable summary |
| `old_values` | JSON | Yes | Internal snapshot only |
| `new_values` | JSON | Yes | Internal snapshot only |
| `ip_address` | VARCHAR(45) | Yes | IPv4/IPv6 |
| `user_agent` | VARCHAR(500) | Yes | Browser metadata |
| `created_at` | TIMESTAMP | No | Indexed |

Indexes: `(subject_type, subject_id)`, `user_id`, `event`, `created_at`. No soft delete; audit history is append-only. Restrict sensitive fields in snapshots.

## Global Site And Page Content

### `site_settings`

Columns: `id`, `key VARCHAR(120) UNIQUE`, `value_text TEXT NULL`, `value_type VARCHAR(30) NOT NULL`, `group_name VARCHAR(80) NOT NULL INDEX`, `description VARCHAR(255) NULL`, timestamps.

Use for phone, email, WhatsApp number/message, address, company name, default SEO, social handles, and feature flags. Avoid arbitrary raw JSON values. No soft deletes. Validation is type-specific through a setting registry.

### `navigation_links`

Columns: `id`, `parent_id BIGINT UNSIGNED NULL FK navigation_links.id SET NULL`, `label VARCHAR(100) NOT NULL`, `url VARCHAR(500) NOT NULL`, `location VARCHAR(30) NOT NULL INDEX` (`header`/`footer`), `display_order UNSIGNED SMALLINT NOT NULL`, `target VARCHAR(20) NOT NULL DEFAULT `_self``, `is_visible BOOLEAN NOT NULL DEFAULT true INDEX`, timestamps, `deleted_at`.

Indexes: `(location, is_visible, display_order)`, `parent_id`. Validation: internal URLs must match an allowed route policy; no cycles in parent links.

### `pages`

Columns: `id`, `key VARCHAR(80) UNIQUE`, `title VARCHAR(180) NOT NULL`, `status VARCHAR(20) NOT NULL INDEX` (`draft`/`published`), `published_at TIMESTAMP NULL`, `created_by BIGINT UNSIGNED NULL FK users.id SET NULL`, `updated_by BIGINT UNSIGNED NULL FK users.id SET NULL`, timestamps, `deleted_at`.

Relations: has many `page_sections`, has one SEO record. Validation: only one published active page per key.

### `page_sections`

Columns: `id`, `page_id BIGINT UNSIGNED NOT NULL FK pages.id CASCADE`, `section_key VARCHAR(100) NOT NULL`, `section_type VARCHAR(80) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `status VARCHAR(20) NOT NULL`, `published_at TIMESTAMP NULL`, `created_by`/`updated_by BIGINT UNSIGNED NULL FK users.id SET NULL`, `content_snapshot JSON NULL` (internal serialized typed payload only), timestamps, `deleted_at`.

Indexes: `(page_id, status, display_order)`, `(page_id, section_key)` unique among active sections. Validation: a section type maps to a registered typed Form Request and React prop type. No generic JSON editor.

### `seo_metadata`

Columns: `id`, `seoable_type VARCHAR(180) NOT NULL`, `seoable_id BIGINT UNSIGNED NOT NULL`, `title VARCHAR(180) NULL`, `description VARCHAR(320) NULL`, `canonical_url VARCHAR(500) NULL`, `robots VARCHAR(100) NULL`, `og_image_id BIGINT UNSIGNED NULL FK media_assets.id SET NULL`, `structured_data JSON NULL`, timestamps.

Unique `(seoable_type, seoable_id)`, index `canonical_url`. Validation: title/description lengths, canonical URL allowlist, structured data generated/validated by code.

## Media And Assets

### `media_assets`

Columns: `id`, `disk VARCHAR(40) NOT NULL`, `path VARCHAR(500) NOT NULL`, `original_name VARCHAR(255) NOT NULL`, `mime_type VARCHAR(100) NOT NULL`, `size_bytes BIGINT UNSIGNED NOT NULL`, `width UNSIGNED INT NULL`, `height UNSIGNED INT NULL`, `alt_text VARCHAR(255) NULL`, `caption TEXT NULL`, `focal_x DECIMAL(5,2) NULL`, `focal_y DECIMAL(5,2) NULL`, `uploaded_by BIGINT UNSIGNED NULL FK users.id SET NULL`, timestamps, `deleted_at`.

Unique `(disk, path)`, indexes `mime_type`, `uploaded_by`. Validation: allowlisted image/document MIME and size, image dimensions, safe filename, private documents stored outside public disk. No replacement deletion if referenced by published content.

### `media_categories`

Columns: `id`, `name VARCHAR(100) NOT NULL`, `slug VARCHAR(120) NOT NULL UNIQUE`, `type VARCHAR(30) NOT NULL INDEX` (`press`/`blog`/`general`), timestamps, `deleted_at`.

### `media_posts`

Columns: `id`, `category_id BIGINT UNSIGNED NULL FK media_categories.id SET NULL`, `type VARCHAR(30) NOT NULL INDEX`, `title VARCHAR(220) NOT NULL`, `slug VARCHAR(220) NOT NULL UNIQUE`, `excerpt TEXT NULL`, `body LONGTEXT NULL`, `featured_image_id BIGINT UNSIGNED NULL FK media_assets.id SET NULL`, `status VARCHAR(20) NOT NULL INDEX`, `published_at TIMESTAMP NULL INDEX`, `author_id BIGINT UNSIGNED NULL FK users.id SET NULL`, timestamps, `deleted_at`.

Relations: belongs to category/author/image; has SEO metadata. Validation: unique slug, body sanitization, publication requires title and approved image where design requires it.

### `media_gallery_items`

Columns: `id`, `media_asset_id BIGINT UNSIGNED NOT NULL FK media_assets.id RESTRICT`, `title VARCHAR(180) NULL`, `alt_text VARCHAR(255) NULL`, `caption TEXT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `status VARCHAR(20) NOT NULL INDEX`, `published_at TIMESTAMP NULL`, timestamps, `deleted_at`.

Unique `(media_asset_id, display_order)` is optional; index `(status, display_order)`.

## Projects

### `projects`

Columns: `id`, `slug VARCHAR(180) NOT NULL UNIQUE`, `title VARCHAR(180) NOT NULL`, `location VARCHAR(180) NULL`, `status_label VARCHAR(80) NULL`, `tagline VARCHAR(255) NULL`, `intro TEXT NULL`, `hero_media_id BIGINT UNSIGNED NULL FK media_assets.id SET NULL`, `status VARCHAR(20) NOT NULL INDEX`, `featured BOOLEAN NOT NULL DEFAULT false INDEX`, `display_order UNSIGNED SMALLINT NOT NULL`, `published_at TIMESTAMP NULL`, timestamps, `deleted_at`.

Validation: slug reserved-word check, title required, published records require hero image and minimum SEO fields.

### `project_facts`

Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `label VARCHAR(100) NOT NULL`, `value VARCHAR(100) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, timestamps, `deleted_at`.

Index `(project_id, display_order)`.

### `project_highlights`

Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `body VARCHAR(500) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, timestamps, `deleted_at`.

Index `(project_id, display_order)`.

### `project_gallery_items`

Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `media_asset_id BIGINT UNSIGNED NOT NULL FK media_assets.id RESTRICT`, `alt_text VARCHAR(255) NULL`, `caption VARCHAR(255) NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `is_featured BOOLEAN NOT NULL DEFAULT false`, timestamps, `deleted_at`.

Indexes `(project_id, display_order)`, `(project_id, is_featured)`. Validation: referenced image must be an image asset.

### `project_unit_types`

Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `tag VARCHAR(80) NOT NULL`, `name VARCHAR(120) NOT NULL`, `size_min DECIMAL(10,2) NULL`, `size_max DECIMAL(10,2) NULL`, `size_unit VARCHAR(10) NOT NULL DEFAULT 'm2'`, `slug VARCHAR(180) NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `status VARCHAR(20) NOT NULL`, timestamps, `deleted_at`.

Index `(project_id, display_order)`, unique `(project_id, tag)` among active records. Validation: min <= max, positive sizes.

### `project_amenity_groups`

Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `name VARCHAR(140) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, timestamps, `deleted_at`.

### `project_amenities`

Columns: `id`, `amenity_group_id BIGINT UNSIGNED NOT NULL FK project_amenity_groups.id CASCADE`, `icon_key VARCHAR(60) NOT NULL`, `title VARCHAR(140) NOT NULL`, `description TEXT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, timestamps, `deleted_at`.

Validation: `icon_key` must be an allowlisted frontend icon key, not arbitrary executable/component input.

### `project_statistics`

Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `value VARCHAR(100) NOT NULL`, `label VARCHAR(100) NOT NULL`, `note VARCHAR(255) NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, timestamps, `deleted_at`.

Index `(project_id, display_order)`.

### `project_updates`

Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `media_asset_id BIGINT UNSIGNED NULL FK media_assets.id SET NULL`, `tag VARCHAR(100) NULL`, `title VARCHAR(180) NOT NULL`, `body TEXT NULL`, `published_on DATE NULL INDEX`, `display_order UNSIGNED SMALLINT NOT NULL`, `status VARCHAR(20) NOT NULL`, timestamps, `deleted_at`.

### `project_locations`

Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `place VARCHAR(180) NOT NULL`, `time_label VARCHAR(40) NOT NULL`, `distance_km DECIMAL(8,2) NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, timestamps, `deleted_at`.

Index `(project_id, display_order)`.

### `project_sections`

Use for typed non-repeatable project editorial sections. Columns: `id`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id CASCADE`, `section_type VARCHAR(60) NOT NULL` (`overview`, `masterplan`, `virtual_tour`, `location`, `cta`), `heading VARCHAR(220) NULL`, `body TEXT NULL`, `media_asset_id BIGINT UNSIGNED NULL FK media_assets.id SET NULL`, `video_provider VARCHAR(30) NULL`, `video_id VARCHAR(120) NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `status VARCHAR(20) NOT NULL`, timestamps, `deleted_at`.

Unique `(project_id, section_type)` for singleton sections. Typed admin forms validate provider/id and never expose arbitrary iframe HTML.

## About, Home, Careers, And Social Proof

### `testimonials`

Columns: `id`, `name VARCHAR(140) NOT NULL`, `role VARCHAR(140) NULL`, `quote TEXT NOT NULL`, `media_asset_id BIGINT UNSIGNED NULL FK media_assets.id SET NULL`, `status VARCHAR(20) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `published_at TIMESTAMP NULL`, timestamps, `deleted_at`.

### `partners`

Columns: `id`, `name VARCHAR(180) NOT NULL`, `role VARCHAR(180) NULL`, `description TEXT NULL`, `logo_media_id BIGINT UNSIGNED NULL FK media_assets.id SET NULL`, `url VARCHAR(500) NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `status VARCHAR(20) NOT NULL`, timestamps, `deleted_at`.

### `awards`

Columns: `id`, `title VARCHAR(180) NOT NULL`, `year SMALLINT UNSIGNED NULL`, `description TEXT NULL`, `icon_key VARCHAR(60) NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `status VARCHAR(20) NOT NULL`, timestamps, `deleted_at`.

### `career_values`

Columns: `id`, `title VARCHAR(140) NOT NULL`, `description TEXT NULL`, `icon_key VARCHAR(60) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `status VARCHAR(20) NOT NULL`, timestamps, `deleted_at`.

### `job_positions`

Columns: `id`, `slug VARCHAR(180) NOT NULL UNIQUE`, `title VARCHAR(180) NOT NULL`, `department VARCHAR(100) NOT NULL`, `employment_type VARCHAR(60) NOT NULL`, `location VARCHAR(140) NOT NULL`, `description TEXT NOT NULL`, `intro TEXT NULL`, `status VARCHAR(20) NOT NULL INDEX`, `published_at TIMESTAMP NULL`, `closed_at TIMESTAMP NULL`, timestamps, `deleted_at`.

Validation: slug safety, title/department required, closed positions cannot accept new applications unless explicitly reopened.

### `job_responsibilities` and `job_requirements`

Both tables: `id`, `job_position_id BIGINT UNSIGNED NOT NULL FK job_positions.id CASCADE`, `body VARCHAR(500) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, timestamps, `deleted_at`; index `(job_position_id, display_order)`.

### `internship_programs`

Columns: `id`, `title VARCHAR(180) NOT NULL`, `description TEXT NOT NULL`, `cta_label VARCHAR(100) NULL`, `status VARCHAR(20) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, timestamps, `deleted_at`.

## Leads, Applications, And Subscriptions

### `contact_inquiries`

Columns: `id`, `name VARCHAR(160) NOT NULL`, `email VARCHAR(255) NULL`, `phone VARCHAR(40) NOT NULL`, `project_id BIGINT UNSIGNED NULL FK projects.id SET NULL`, `message TEXT NULL`, `source VARCHAR(40) NOT NULL INDEX`, `status VARCHAR(30) NOT NULL INDEX`, `assigned_to BIGINT UNSIGNED NULL FK users.id SET NULL`, `consent_at TIMESTAMP NULL`, `created_at`, `updated_at`, `deleted_at`.

Indexes `(status, created_at)`, `phone`, `email`. Validation: phone normalization, email if present, message length, spam/rate limit.

### `project_inquiries`

Columns same core fields as contact inquiries plus `project_id BIGINT UNSIGNED NOT NULL`, `unit_type_id BIGINT UNSIGNED NULL FK project_unit_types.id SET NULL`, `preferred_contact_method VARCHAR(30) NULL`, `source VARCHAR(40)`, status/assignment/consent/timestamps/deleted_at.

### `brochure_requests`

Columns: `id`, `name VARCHAR(160) NOT NULL`, `phone VARCHAR(40) NOT NULL`, `email VARCHAR(255) NULL`, `project_id BIGINT UNSIGNED NOT NULL FK projects.id RESTRICT`, `source VARCHAR(40) NOT NULL`, `status VARCHAR(30) NOT NULL`, `downloaded_at TIMESTAMP NULL`, `assigned_to BIGINT UNSIGNED NULL FK users.id SET NULL`, timestamps, `deleted_at`.

### `job_applications`

Columns: `id`, `job_position_id BIGINT UNSIGNED NULL FK job_positions.id SET NULL`, `name VARCHAR(160) NOT NULL`, `email VARCHAR(255) NOT NULL`, `phone VARCHAR(40) NULL`, `resume_media_id BIGINT UNSIGNED NOT NULL FK media_assets.id RESTRICT`, `cover_note TEXT NULL`, `status VARCHAR(30) NOT NULL INDEX`, `assigned_to BIGINT UNSIGNED NULL FK users.id SET NULL`, `consent_at TIMESTAMP NULL`, timestamps, `deleted_at`.

Validation: private PDF/DOC/DOCX allowlist, file size limit, virus scanning if available, no public media URL, consent required.

### `internship_applications`

Columns: `id`, `internship_program_id BIGINT UNSIGNED NULL FK internship_programs.id SET NULL`, `name VARCHAR(160) NOT NULL`, `email VARCHAR(255) NOT NULL`, `phone VARCHAR(40) NULL`, `university VARCHAR(180) NULL`, `graduation_year SMALLINT UNSIGNED NULL`, `resume_media_id BIGINT UNSIGNED NOT NULL FK media_assets.id RESTRICT`, `message TEXT NULL`, `status VARCHAR(30) NOT NULL`, `consent_at TIMESTAMP NULL`, timestamps, `deleted_at`.

### `cv_submissions`

Columns: `id`, `name VARCHAR(160) NOT NULL`, `email VARCHAR(255) NOT NULL`, `phone VARCHAR(40) NULL`, `resume_media_id BIGINT UNSIGNED NOT NULL FK media_assets.id RESTRICT`, `message TEXT NULL`, `status VARCHAR(30) NOT NULL`, `consent_at TIMESTAMP NULL`, `assigned_to BIGINT UNSIGNED NULL FK users.id SET NULL`, timestamps, `deleted_at`.

### `newsletter_subscribers`

Columns: `id`, `email VARCHAR(255) NOT NULL UNIQUE`, `status VARCHAR(30) NOT NULL INDEX`, `source VARCHAR(40) NULL`, `consent_at TIMESTAMP NULL`, `unsubscribed_at TIMESTAMP NULL`, timestamps, `deleted_at`.

Validation: lowercase normalized email, double opt-in decision, unsubscribe token if needed.

## Office And Social Content

### `offices`

Columns: `id`, `name VARCHAR(160) NOT NULL`, `address TEXT NOT NULL`, `phone VARCHAR(40) NULL`, `email VARCHAR(255) NULL`, `latitude DECIMAL(10,7) NULL`, `longitude DECIMAL(10,7) NULL`, `map_url VARCHAR(500) NULL`, `is_primary BOOLEAN NOT NULL DEFAULT false`, `status VARCHAR(20) NOT NULL`, timestamps, `deleted_at`.

### `social_links`

Columns: `id`, `platform VARCHAR(50) NOT NULL`, `label VARCHAR(100) NOT NULL`, `url VARCHAR(500) NOT NULL`, `display_order UNSIGNED SMALLINT NOT NULL`, `is_active BOOLEAN NOT NULL DEFAULT true`, timestamps, `deleted_at`.

Unique `(platform, url)`; validate HTTPS URL and allowlisted platform icon.

## Referential And Validation Rules

- Use `RESTRICT` where deleting a parent would make a published record meaningless, such as a project referenced by a brochure request.
- Use `SET NULL` for optional authors, assignees, social images, and optional media.
- Use `CASCADE` for child editorial rows that have no meaning outside the parent, such as project facts and job requirements.
- Every ordered child collection requires an index on parent/status/order.
- Every published page/entity must pass a publication validator before status changes to `published`.
- Form Requests must enforce field lengths, enum values, relationships, upload rules, and spam controls.
- Add factories for repeatable entities and seeders that reproduce current frontend values.

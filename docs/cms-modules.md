# CMS Modules And Editorial Workflows

The CMS is an authenticated Inertia React application under `/admin`. It must expose typed forms for every known section and must not expose raw JSON editing to regular users.

## Permission Naming

Use stable permission slugs such as:

- `settings.view`, `settings.update`
- `navigation.view`, `navigation.update`
- `pages.view`, `pages.update`, `pages.publish`
- `projects.view`, `projects.create`, `projects.update`, `projects.delete`, `projects.publish`
- `media.view`, `media.upload`, `media.update`, `media.delete`
- `leads.view`, `leads.update`, `leads.export`
- `careers.view`, `careers.update`, `careers.publish`, `applications.view`, `applications.update`
- `users.view`, `users.create`, `users.update`, `users.delete`
- `roles.view`, `roles.update`
- `activity-logs.view`

Every module should have view/create/update/delete/publish permissions only where those operations make sense.

## Module Matrix

| Module | Admin location | Typed forms and fields | Workflow | Roles | Related tables |
| --- | --- | --- | --- | --- | --- |
| Global site settings | `Admin/Settings/Edit` | Brand name, phone, email, address, WhatsApp number/message, default SEO, social defaults, analytics toggles. | Save immediately; sensitive settings require confirmation/audit. | super admin, content admin | `site_settings`, `offices`, `social_links` |
| Navigation | `Admin/Navigation/Index` | Label, internal/external URL, location, parent, order, visibility, target. | Draft order preview then publish. | content admin, editor, reviewer | `navigation_links` |
| Footer | `Admin/Footer/Edit` | CTA title/body, button label/url, footer menu, contact display, social links, copyright. | Preview and publish. | content admin, editor, reviewer | `page_sections`, `navigation_links`, `site_settings` |
| Home page | `Admin/Pages/Home` | Hero title/body/CTA, stats, featured project selector/order, gallery selector, testimonial selector. | Draft -> review -> published. | editor, reviewer, content admin | `pages`, `page_sections`, `project_statistics`, `media_gallery_items`, `testimonials` |
| About Us | `Admin/Pages/About` | Hero, stats, story title/body/image, award cards, partner cards, promise CTA. | Draft -> review -> published. | editor, reviewer, content admin | `pages`, `page_sections`, `awards`, `partners` |
| Projects | `Admin/Projects` | Title, slug, location, status label, tagline, intro, hero media, featured state, SEO. | Draft -> review -> publish/archive. | content admin, editor, reviewer | `projects`, `seo_metadata`, `media_assets` |
| Project galleries | `Admin/Projects/{project}/Gallery` | Image upload/select, alt text, caption, order, featured flag. | Save order, publish with parent. | content admin, media manager | `project_gallery_items`, `media_assets` |
| Project unit types | `Admin/Projects/{project}/Units` | Tag, name, min/max size, unit, order, status. | Save and publish with project. | content admin, editor | `project_unit_types` |
| Project amenities | `Admin/Projects/{project}/Amenities` | Group name/order; amenity icon key, title, description, order. | Draft/publish with project. | content admin, editor | `project_amenity_groups`, `project_amenities` |
| Project statistics | `Admin/Projects/{project}/Statistics` | Value, label, note, order. | Publish with project. | content admin, editor | `project_statistics` |
| Project updates | `Admin/Projects/{project}/Updates` | Tag, title, body, date, image, status/order. | Draft -> publish dated update. | content admin, editor, reviewer | `project_updates`, `media_assets` |
| Nearby locations | `Admin/Projects/{project}/Location` | Place, time label, distance, order; map/image settings. | Publish with project. | content admin | `project_locations`, `project_sections` |
| Media posts | `Admin/Media/Posts` | Type, category, title, slug, excerpt, body, featured image, publish date, SEO. | Draft -> review -> publish -> archive. | media manager, editor, reviewer | `media_posts`, `media_categories`, `seo_metadata` |
| Press releases | `Admin/Media/Press` | Typed media post form constrained to `press`. | Same media workflow. | media manager, reviewer | `media_posts` |
| Blog posts | `Admin/Media/Blogs` | Typed media post form constrained to `blog`. | Same media workflow. | media manager, editor, reviewer | `media_posts` |
| Photo galleries | `Admin/Media/Gallery` | Asset, title, alt text, caption, order, visibility. | Save order/publish. | media manager, editor | `media_gallery_items`, `media_assets` |
| Testimonials | `Admin/Content/Testimonials` | Name, role, quote, photo, order, status. | Draft -> approve -> publish. | content admin, editor, reviewer | `testimonials` |
| Partners | `Admin/Content/Partners` | Name, role, description, logo, URL, order, status. | Draft -> publish. | content admin, editor, reviewer | `partners` |
| Awards | `Admin/Content/Awards` | Title, year, description, icon key, order, status. | Draft -> publish. | content admin, editor, reviewer | `awards` |
| Careers page | `Admin/Careers/Page` | Hero, values intro, internship section, CTA, SEO. | Draft -> review -> publish. | careers manager, editor, reviewer | `pages`, `page_sections`, `career_values`, `internship_programs` |
| Company values | `Admin/Careers/Values` | Title, description, allowlisted icon, order, visibility. | Draft -> publish. | careers manager, editor | `career_values` |
| Job vacancies | `Admin/Careers/Jobs` | Title, slug, department, type, location, description, intro, responsibilities, requirements, dates, status. | Draft -> review -> publish -> close. | careers manager, reviewer | `job_positions`, `job_responsibilities`, `job_requirements` |
| Job applications | `Admin/Careers/Applications` | Filter/status/assignment, internal notes, secure resume preview/download. | New -> reviewing -> shortlisted/rejected/hired. | careers manager, assigned users | `job_applications`, `media_assets` |
| Internship applications | `Admin/Careers/Internships/Applications` | Filter/status/assignment, university/year, secure resume. | New -> reviewing -> accepted/rejected. | careers manager | `internship_applications`, `media_assets` |
| General CV submissions | `Admin/Careers/CVs` | Applicant identity, resume, notes, status, assignment. | New -> reviewing -> archived. | careers manager | `cv_submissions`, `media_assets` |
| Contact inquiries | `Admin/Leads/Contact` | Read-only submitted data plus status, assignee, internal note, follow-up date. | New -> contacted -> qualified/closed/spam. | sales manager, content admin | `contact_inquiries` |
| Project inquiries | `Admin/Leads/Projects` | Project/unit preference, identity, source, status, assignee. | Same lead workflow. | sales manager | `project_inquiries` |
| Brochure requests | `Admin/Leads/Brochures` | Project, identity, download state, status, assignee. | New -> delivered -> followed-up/closed. | sales manager | `brochure_requests` |
| Newsletter subscribers | `Admin/Marketing/Newsletter` | Email, source, consent/status, unsubscribe, export. | Active/unsubscribed/bounced. | media manager, analyst | `newsletter_subscribers` |
| Users | `Admin/Access/Users` | Name, email, active state, roles, password/reset actions. | Invite/activate/deactivate; no direct password display. | super admin | `users`, `roles` |
| Roles | `Admin/Access/Roles` | Name, slug, description, permission checkboxes grouped by module. | Save with audit; protected system roles. | super admin | `roles`, `permissions`, `permission_role` |
| Permissions | `Admin/Access/Permissions` | Mostly read-only registry; no arbitrary permission creation for regular admins. | Code-managed definitions. | super admin | `permissions` |
| Activity logs | `Admin/System/Activity` | Search/filter actor/event/model/date; read-only details. | Append-only. | super admin, analyst | `activity_logs` |
| SEO metadata | Embedded in each page/entity editor plus `Admin/SEO` index | Title, description, canonical, robots, OG image, validated structured fields. | Draft/publish with owning entity. | content admin, reviewer | `seo_metadata`, `media_assets` |

## Editorial State Machine

For editorial entities:

```text
draft -> in_review -> published -> archived
draft -> archived
in_review -> draft
published -> draft (creates a new revision or requires confirmation)
```

For leads/applications:

```text
new -> in_progress -> qualified/shortlisted -> closed/rejected
new -> spam
```

State transitions must be policy-authorized and logged.

## Typed Section Forms

Implement a registry in PHP/TypeScript that maps each `section_type` to:

- Human-readable admin label.
- Allowed fields and field types.
- Validation rules.
- Inertia form component.
- Public prop serializer.
- Preview renderer.

Initial section types:

- `home.hero`, `home.about`, `home.featured_projects`, `home.gallery`, `home.testimonials`.
- `about.hero`, `about.story`, `about.awards`, `about.partners`, `about.promise`.
- `contact.hero`, `contact.methods`, `contact.form`, `contact.location`, `contact.social`.
- `careers.hero`, `careers.why_larz`, `careers.internship`, `careers.cta`.
- `media.hero`, `media.newsletter`.
- `project.overview`, `project.masterplan`, `project.virtual_tour`, `project.location`, `project.cta`.

Regular editors see fields such as `heading`, `body`, `button_label`, `button_url`, image selectors, and ordering controls, not serialized objects.

## Media Workflow

1. Upload to a private temporary path.
2. Validate MIME, size, dimensions, and filename.
3. Generate safe stored filename and derivatives.
4. Create `media_assets` record.
5. Allow alt/caption/focal point editing.
6. Reference media by ID from content records.
7. Prevent deletion while referenced by published content, or replace references in a transaction.

## Lead Workflow And Privacy

- Show only the minimum public fields to the website.
- Store consent timestamp and source URL where legally required.
- Mask phone/email in list views based on role.
- Keep CVs private and access-logged.
- Add retention/anonymization policy for closed leads and applicants.
- Do not export lead data without permission and audit logging.

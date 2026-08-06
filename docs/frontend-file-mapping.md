# Frontend File Mapping

This map describes where the current React/TanStack files should live in the Laravel/Inertia application. It is a migration target, not an instruction to move files now.

## Page And Route Mapping

| Current file | Current responsibility | Future location | Data/API contract | Notes |
| --- | --- | --- | --- | --- |
| `src/routes/index.tsx` | Home route and composition. | `resources/js/Pages/Website/Home.tsx` | `hero`, `stats`, `featuredProjects`, `gallery`, `testimonials`, `seo`. | Preserve composition and section order. |
| `src/routes/about.tsx` | About page and all editorial markup. | `resources/js/Pages/Website/About.tsx` | `hero`, `stats`, `story`, `awards`, `partners`, `promise`, `seo`. | Move arrays to controller props. |
| `src/routes/projects.tsx` | Projects parent outlet. | `routes/web.php` project route group; no direct React equivalent required. | None. | Use explicit Laravel index route. |
| Former `src/routes/projects.index.tsx` | Project landing page in prior frontend state. | `resources/js/Pages/Website/Projects/Index.tsx`. | Project landing sections and KLOVE project record. | Confirm current source baseline before migration. |
| `src/routes/projects.$slug.tsx` | Project detail route, loader, 404, inline sections. | `resources/js/Pages/Website/Projects/Show.tsx`. | `project`, `facts`, `highlights`, `gallery`, `others`, `seo`. | Preserve `/projects/{slug}`. |
| `src/routes/contact.tsx` | Contact page and visual forms. | `resources/js/Pages/Website/Contact.tsx`. | Contact settings, offices, project options, social links, form errors/flash. | Add Inertia form actions without changing markup. |
| `src/routes/careers.tsx` | Careers page composition. | `resources/js/Pages/Website/Careers/Index.tsx`. | Page sections, values, published jobs, internship program, SEO. | Preserve existing component order. |
| `src/routes/careers.$slug.tsx` | Job detail loader/page. | `resources/js/Pages/Website/Careers/Show.tsx`. | Job, responsibilities, requirements, related jobs, SEO. | Replace local lookup with controller query. |
| `src/routes/media.tsx` | Media page composition. | `resources/js/Pages/Website/Media/Index.tsx`. | Hero section, press posts, blog posts, gallery, newsletter state, SEO. | Keep media cards and gallery classes. |
| `src/routes/blogs.tsx` | Placeholder blogs route. | `resources/js/Pages/Website/Blogs/Index.tsx` or redirect to Media. | Blog posts if retained. | Product decision required. |
| `src/routes/events.tsx` | Placeholder events route. | `resources/js/Pages/Website/Events/Index.tsx` or remove later. | Events if retained. | Product decision required. |
| `src/routes/__root.tsx` | Root shell, global SEO, scripts, CSS, React Query provider, WhatsApp button, error boundary. | `resources/views/app.blade.php`, `resources/js/app.tsx`, `resources/js/Layouts/WebsiteLayout.tsx`. | Shared settings, navigation, footer, auth user, SEO defaults. | Split shell responsibilities without visual change. |
| `src/router.tsx` | TanStack router creation/query context. | Removed only in final cleanup; Inertia bootstrap replaces it. | None. | Keep current file until all routes are cut over. |
| `src/routeTree.gen.ts` | Generated route tree. | None after final cutover. | None. | Never port manually. |

## Layout And Shared Component Mapping

| Current file | Future location | Migration action | Risk |
| --- | --- | --- | --- |
| `src/components/layout/Header.tsx` | `resources/js/components/website/Header.tsx` | Preserve JSX/classes; use Inertia Link and shared navigation props. | High |
| `src/components/layout/Footer.tsx` | `resources/js/components/website/Footer.tsx` | Preserve JSX/classes; use shared settings/footer links. | High |
| `src/components/layout/PageStub.tsx` | `resources/js/components/shared/PageStub.tsx` temporarily | Keep only for unresolved Blogs/Events. | Low |
| `src/components/shared/Logo.tsx` | `resources/js/components/shared/Logo.tsx` | Preserve. | Low |
| `src/components/shared/PillButton.tsx` | `resources/js/components/shared/PillButton.tsx` | Replace TanStack Link with Inertia Link. | Medium |
| `src/components/shared/SectionHeading.tsx` | `resources/js/components/shared/SectionHeading.tsx` | Preserve. | Low |
| `src/components/shared/WhatsAppButton.tsx` | `resources/js/components/shared/WhatsAppButton.tsx` | Preserve visual output; receive URL from shared settings. | Medium |
| `src/components/projects/Eyebrow.tsx` | `resources/js/components/shared/Eyebrow.tsx` | Move to shared because About/Contact/Careers/Media use the same pattern. | Low |

## Home Section Mapping

| Current file | Future destination |
| --- | --- |
| `src/components/sections/Hero.tsx` | `resources/js/components/website/home/Hero.tsx` |
| `src/components/sections/About.tsx` | `resources/js/components/website/home/AboutStats.tsx` |
| `src/components/sections/FeaturedProjects.tsx` | `resources/js/components/website/home/FeaturedProjects.tsx` |
| `src/components/sections/Gallery.tsx` | `resources/js/components/website/home/Gallery.tsx` |
| `src/components/sections/Testimonials.tsx` | `resources/js/components/website/home/Testimonials.tsx` |

All receive typed props from `Home.tsx`; none should query the database directly.

## Project Section Mapping

| Current file | Future destination |
| --- | --- |
| `src/components/projects/ProjectHero.tsx` | `resources/js/components/website/projects/ProjectHero.tsx` |
| `src/components/projects/ProjectStats.tsx` | `resources/js/components/website/projects/ProjectStats.tsx` |
| `src/components/projects/ProjectOverview.tsx` | `resources/js/components/website/projects/ProjectOverview.tsx` |
| `src/components/projects/Masterplan.tsx` | `resources/js/components/website/projects/Masterplan.tsx` |
| `src/components/projects/VirtualTour.tsx` | `resources/js/components/website/projects/VirtualTour.tsx` |
| `src/components/projects/ConstructionUpdates.tsx` | `resources/js/components/website/projects/ConstructionUpdates.tsx` |
| `src/components/projects/Amenities.tsx` | `resources/js/components/website/projects/Amenities.tsx` |
| `src/components/projects/LocationMap.tsx` | `resources/js/components/website/projects/LocationMap.tsx` |

The project page assembles these components with a typed `ProjectShowProps` object. Forms use Inertia `useForm` but retain current labels, field order, and classes.

## Careers And Media Mapping

| Current file | Future destination |
| --- | --- |
| `src/components/careers/CareersSections.tsx` | Split into `resources/js/components/website/careers/CareersHero.tsx`, `WhyLarz.tsx`, `OpenRoles.tsx`, `InternshipPrograms.tsx`, `CareersCta.tsx`, `CareersChatButton.tsx`. |
| `src/components/media/MediaSections.tsx` | Split into `resources/js/components/website/media/MediaHero.tsx`, `MediaPress.tsx`, `MediaStories.tsx`, `MediaGallery.tsx`, `MediaNewsletter.tsx`, `MediaChatButton.tsx`. |

## UI Primitive Mapping

Current `src/components/ui/*.tsx` files map one-to-one to `resources/js/components/shared/ui/*.tsx` until actual usage is reviewed. The following groups are candidates for future CMS use:

- Forms: `form`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`.
- CMS data: `table`, `pagination`, `badge`, `tabs`, `dialog`, `alert-dialog`, `sheet`, `sidebar`.
- Public interactions: `carousel`, `accordion`, `drawer`, `popover`, `tooltip`, `scroll-area`.
- Utility/display: `avatar`, `card`, `separator`, `skeleton`, `progress`, `aspect-ratio`.
- Less-used/generated: `calendar`, `chart`, `command`, `context-menu`, `dropdown-menu`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `resizable`, `slider`, `sonner`, `toggle`, `toggle-group`.

Do not rewrite unused primitives during page migration. Port only when a current or CMS page needs them.

## CSS, Assets, And Utility Mapping

| Current file/location | Future location | Rule |
| --- | --- | --- |
| `src/styles.css` | `resources/css/app.css` | Preserve theme variables, Tailwind imports, font declarations, custom classes, and body base styles. |
| `src/assets/*` | `storage/app/public/media` plus `public/build` references | Import into `media_assets`; preserve rendered dimensions/focal points and alt text. |
| `src/lib/utils.ts` | `resources/js/utils/cn.ts` | Keep `cn` semantics if still used. |
| `src/hooks/use-mobile.tsx` | `resources/js/hooks/use-mobile.tsx` | Keep only if used after port. |
| `src/lib/error-page.ts` | Laravel exception/Inertia error handling | Do not copy server-specific HTML renderer. |
| `src/lib/error-capture.ts` | Laravel logs plus frontend monitoring | Replace after observability decision. |
| `src/lib/lovable-error-reporting.ts` | Remove or replace | Lovable-specific runtime bridge has no production CMS role. |

## Data Mapping

| Current source | Future source |
| --- | --- |
| `src/data/site.ts` | Eloquent query services and shared Inertia props. |
| `src/data/project.ts` | Project-related models and project page DTOs. |
| Route-local arrays in About/Contact | Page sections, settings, offices, partners, awards, and typed DTOs. |
| Route-local career positions | `job_positions`, responsibilities, requirements. |
| Route-local media arrays | `media_posts`, `media_gallery_items`, media assets. |

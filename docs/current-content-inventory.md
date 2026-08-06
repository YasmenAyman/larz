# Current Content Inventory

Audit date: 2026-08-05

The current site has no CMS or database content source. The following inventory identifies what must become dynamic in Laravel while preserving the existing rendered design.

## Content Sources

| Source | Current role | Dynamic status | Proposed model / storage |
| --- | --- | --- | --- |
| `src/data/site.ts` | Navigation, generic placeholder helper, projects, gallery, testimonials, contact data, footer menu. | Hardcoded static module. | `SiteSetting`, `NavigationLink`, `Project`, `ProjectGalleryItem`, `Testimonial`, `ContactSetting`. |
| `src/data/project.ts` | KLOVE facts, overview/masterplan/map assets, home types, construction updates, amenity groups, drive times. | Hardcoded static module. | `Project`, `ProjectFact`, `ProjectMedia`, `HomeType`, `ConstructionUpdate`, `AmenityGroup`, `Amenity`, `LocationDrive`. |
| `src/routes/about.tsx` | Awards, partners, stats, about copy, hero/story assets. | Hardcoded in route. | `AboutPage`, `AboutStat`, `Award`, `Partner`, `PageSection`, media records. |
| `src/components/careers/CareersSections.tsx` | Values, four open role display rows, internship copy, hero/CTA copy. | Hardcoded in component. | `CareerPageSetting`, `CareerValue`, `JobPosition`, `InternshipProgram`, `JobApplication`. |
| `src/components/media/MediaSections.tsx` | Press releases, blog cards, photo gallery, newsletter text. | Hardcoded in component. | `MediaPost`, `MediaCategory`, `MediaGalleryItem`, `NewsletterSubscriber`. |
| `src/routes/contact.tsx` | Contact cards, project select options, form labels, map placeholder, social labels. | Hardcoded in route. | `ContactSetting`, project relation, `ContactInquiry`, `SocialLink`, `OfficeLocation`. |
| `src/routes/careers.$slug.tsx` | Four detailed job records, responsibilities, requirements. | Hardcoded local array. | `JobPosition` and `JobApplication`. |
| `src/components/projects/*.tsx` | KLOVE section copy and labels plus data imports. | Mixed: copy in components, collections in `data/project.ts`. | Project/page section records related to `Project`. |
| `src/components/sections/*.tsx` | Home section copy plus imported collection data. | Mixed static/dynamic. | Home page sections and related collections. |

## Navigation And Global Settings

Current navigation from `src/data/site.ts`:

| Label | URL | Future source |
| --- | --- | --- |
| Home | `/` | `NavigationLink` / route config |
| About US | `/about` | `NavigationLink` |
| Projects | `/projects` | `NavigationLink` |
| Media | `/media` | `NavigationLink` |
| Careers | `/careers` | `NavigationLink` |
| Contact Us | `/contact` | `NavigationLink` |

Footer menu currently includes Home, About Us, Projects, and Media. Contact data is:

- Address: `Kov mall, Beside Mivida gate 6, New Cairo 1, End of Road 90 Next to AUC N...`
- Email: `info@larzdevelopments.com`
- Phone: `15813`

These values should become editable CMS settings, with a fallback seed matching the current display.

## Home Content

### Hero

- Heading: `Designed for the Way You Live`
- Description: `Discover thoughtfully designed communities that combine architectural excellence, lasting value, and a lifestyle built around comfort and elegance.`
- CTA: `Our Project's` -> `/projects`
- Assets: `herobg.png`, `tower_img.png`

### Stats

- `40+` Experience
- `60+` Projects
- `15k` Clients
- `2` Countries

### Featured projects

- KOV New Cairo
- LARZ Business Hub
- LARZ Medical Park
- LARZ Riverside

Each record includes slug, title, location, image, status, tagline, intro, facts, highlights, and three gallery images.

### Gallery and testimonials

- Gallery source: `Gallery_1.png` through `Gallery_5.png`.
- Testimonials: two repeated testimonial records for Ahmed K. and Muhammed Y., with `user_1.png` and `user_2.png`.

## Project Content

The KLOVE page uses:

- Hero slides: `Come home to quiet`, `Live among the green`, `Light, air, and view`.
- Facts: 24 feddans, 20% built, G+5 floors, 50-196 m2 homes.
- Overview copy about 24 feddans and low-rise living.
- Masterplan and brochure form.
- Virtual tour with hardcoded YouTube video ID `MLpWrANjFbI`.
- Home types: Studio, 1 Bedroom, 2 Bedroom, Grand 2 Bed, 3 Bedroom, Grand 3 Bed, Signature 3 Bed, Duplex.
- Construction updates: three dated/labelled update cards.
- Amenity groups: Wellness & movement, Water & leisure, Family & everyday; 12 individual amenities.
- Drive times: North Teseen Road, Rehab City, General Prosecutor's Office, AUC, New Administrative Capital.
- Location/map image: `Gallery_5.png`, currently a local image rather than a map integration.

Recommended database relationships:

```text
projects
  hasMany project_facts
  hasMany project_highlights
  hasMany project_gallery_items
  hasMany home_types
  hasMany construction_updates
  hasMany amenity_groups
  hasMany location_drives
```

## About Content

- Hero title: `You're not choosing a building. You're choosing how you'll live.`
- Founding copy: more than 40 years across New Cairo and the New Administrative Capital.
- Stats: 60+ projects, 2 countries, 15k+ clients, 40+ years.
- Story heading: `Why it matters who builds it.`
- Story body: two paragraphs about belonging, space, long-term quality, light, neighbourhoods, and running costs.
- Awards placeholders: three `[Award name]` cards and one `[Milestone]` card.
- Partners: Hany Saad Innovations, GRID Architects, DMA, Ahmed Husseini Designs, Green Modeling Contracting, and a `[Partner]` placeholder.
- Promise: `We build places that are still worth it long after the keys change hands.`
- Assets: `TYPE-B-IMAGE-01.png` hero and `IMAGE 01-RENDERED (1).png` story image.

## Contact Content And Leads

- Hero: `Let's talk.`
- Contact methods: hotline, WhatsApp, email, sales office.
- Pricing/tour form fields: name, phone, project, message.
- Project options are currently KLOVE, KOV New Cairo, and LARZ Riverside.
- Map section uses a placeholder local asset and a placeholder address label.
- Social links are currently `#` anchors.
- WhatsApp button uses hardcoded number `201128775744`; contact data uses hotline `15813`, so these are not currently normalized.

Proposed tables:

- `contact_inquiries`: name, phone, email, project_id, message, source, status, assigned_to, timestamps.
- `newsletter_subscribers`: email, status, consent_at, unsubscribed_at, timestamps.
- `offices`: name, address, latitude, longitude, map_url, phone, email.
- `social_links`: platform, label, url, display_order, is_active.

## Careers Content

Current careers page sections:

- Hero: `Build your future while we build communities.`
- Values: Purposeful work, Growth & mentorship, Wellbeing, Ownership.
- Displayed roles: Sales Consultant, Architect, Digital Marketing Specialist, Site Engineer.
- Internship program copy and CTA.
- Open application CTA: `Don't see your role? Send us your CV.`

Job detail route currently retains four local detail records: Senior Architect, Project Engineer, Interior Designer, and Sales Consultant. The index display roles and detail slugs are not a single normalized collection today; this should be resolved in `job_positions`.

Proposed tables:

- `job_positions`: title, slug, department, employment_type, location, description, intro, status, published_at, closed_at.
- `job_responsibilities`: job_position_id, body, display_order.
- `job_requirements`: job_position_id, body, display_order.
- `job_applications`: job_position_id nullable, name, email, phone, resume_path, cover_note, status, timestamps.
- `career_values`: title, body, icon_key, display_order.

## Media Content

Current media sections:

- Hero: `The latest from LARZ.`
- Press releases: three cards with dates, titles, standfirst text, and placeholder images.
- Stories: three cards with category, title, teaser, and placeholder images.
- Photo gallery: eight local assets, some repeated across Gallery and project assets.
- Newsletter: email-only subscription form with no submit action.

Proposed tables:

- `media_posts`: title, slug, type (`press`, `story`), category, excerpt, body, published_at, status, featured_image_id, seo_title, seo_description.
- `media_gallery_items`: title, image_path, alt_text, display_order, is_published.
- `media_categories`: name, slug.
- `newsletter_subscribers`: shared with Contact inventory.

## Asset Inventory

All assets are currently imported from `src/assets` and bundled by Vite. They are not stored in a CMS or Laravel storage disk.

### Brand, global, and backgrounds

- `Footer_bg.png`
- `herobg.png`
- `review_bg.png`
- `related_bg.png`
- `new_mask.png`
- `carrers_bg.png`
- `OpenPositions-bg.png`

### Hero and project imagery

- `hero-image-1.png`
- `hero-image-2.png`
- `hero-image-3.png`
- `tower_img.png`
- `project_img_1.png`
- `project_img_2.png`
- `project_img_3.png`
- `project_img_4.png`
- `IMAGE 01-RENDERED (1).png`
- `IMAGE 02-RENDERED (1).png`
- `IMAGE 03-RENDERED.png`
- `TYPE-B-IMAGE-01.png`
- `TYPE B-IMAGE 02 (1).png`
- `TOWN HOUSE 01-RENDERED.png`
- `TOWN HOUSE 02-RENDERED.png`
- `TYPE-B-IMAGE-01.png` (verify duplicate/near-duplicate naming before migration)

### Gallery, photography, and people

- `Gallery_1.png` through `Gallery_5.png`
- `DSC04142-HDR.jpg`
- `DSC04295-HDR.jpg`
- `user_1.png`
- `user_2.png`

### Proposed Laravel media metadata

Every migrated image should have a media record containing original filename, storage path, alt text, caption, media type, page/section relation, focal point if needed, and responsive derivatives. Do not rely on source import names as stable database identifiers.

## Hardcoded Content Risk Summary

- Highest risk: projects, job records, contact forms, media posts, awards/partners, and all route-level copy.
- Medium risk: navigation labels, footer contact data, testimonials, stats, amenities, home types, and map drive times.
- Low risk: UI labels that are purely presentational, icon names, and CSS-only decorative text.
- Placeholder content is visible in production-like pages: `[Award name]`, `[Partner]`, `[Full address]`, and short placeholder standfirst/teaser text. These should be flagged for content approval before CMS seeding.

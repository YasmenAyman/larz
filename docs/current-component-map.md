# Current Component Map

Audit date: 2026-08-05

Every frontend component file is listed below. Generated UI primitives are grouped in one table, but each file path is explicitly named.

## Layout Components

| File path | Purpose / usage | Keep unchanged | Routing changes | Hardcoded content | Server-only | Risk | Laravel/Inertia destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/components/layout/Header.tsx` | Global desktop/mobile nav, logo treatment, active route state, mobile menu. Uses `navLinks` from `src/data/site.ts`. | Yes for visual migration. | Nav URLs must point to Laravel/Inertia routes. | Navigation labels are data-driven but static. | No. | High | `resources/js/Components/Layout/Header.tsx`. |
| `src/components/layout/Footer.tsx` | Global CTA, logo, footer menu, contact details, social links, Footer background. | Yes for visual migration. | Footer links need Laravel route names/URLs. | CTA, social href `#`, contact data, copyright, menu. | No. | High | `resources/js/Components/Layout/Footer.tsx`. |
| `src/components/layout/PageStub.tsx` | Generic placeholder for Blogs and Events. | Temporary only. | Replace with real route pages. | Page title. | No. | Low | Remove after those pages are defined. |

## Shared Components

| File path | Purpose / usage | Keep unchanged | Routing changes | Hardcoded content | Server-only | Risk | Laravel/Inertia destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/components/shared/Logo.tsx` | Linked LARZ logo and optional Developments tagline. | Yes. | Link target becomes Laravel home URL if needed. | Brand text. | No. | Low | `resources/js/Components/Shared/Logo.tsx`. |
| `src/components/shared/PillButton.tsx` | Shared router-linked pill/split CTA. Used on Home sections. | Yes visually. | Replace TanStack `Link` with Inertia `Link` or standard route helper. | Button labels passed by callers. | No. | Medium | `resources/js/Components/Shared/PillButton.tsx`. |
| `src/components/shared/SectionHeading.tsx` | Home section heading/description pattern. | Yes. | None beyond link callers. | Props supplied by callers. | No. | Low | `resources/js/Components/Shared/SectionHeading.tsx`. |
| `src/components/shared/WhatsAppButton.tsx` | Global floating WhatsApp link with fixed number/message and SVG icon. Mounted in root shell. | Yes for exact UI. | URL/number should become settings-driven. | Phone number and message hardcoded. | No. | Medium | `resources/js/Components/Shared/WhatsAppButton.tsx`; settings prop from Inertia shared data. |

## Home Sections

| File path | Purpose / usage | Keep unchanged | Routing changes | Hardcoded content | Server-only | Risk | Laravel/Inertia destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/components/sections/Hero.tsx` | Home hero, LARZ background text, tower image, CTA. | Yes. | CTA target `/projects` becomes Laravel route. | Hero title, description, asset import. | No. | High | `Pages/Home` section or `Components/Sections/Hero.tsx`. |
| `src/components/sections/About.tsx` | Home stats strip using `stats`. | Yes. | None. | Stats are static data. | No. | Medium | Home section with `aboutStats` prop. |
| `src/components/sections/FeaturedProjects.tsx` | Hover/active accordion project gallery using `projects`. | Yes. | TanStack `Link` paths become Inertia links. | Project collection currently static. | No. | High | Home section with `projects` prop. |
| `src/components/sections/Gallery.tsx` | Embla continuous gallery slider, autoplay interval, masked image strip. | Yes. | None. | Gallery list/static asset mask. | No. | High | Home section with gallery props; preserve Embla behavior. |
| `src/components/sections/Testimonials.tsx` | Embla autoplay testimonials slider. | Yes. | None. | Testimonials static. | No. | High | Home section with testimonials props. |

## Project Components

| File path | Purpose / usage | Keep unchanged | Routing changes | Hardcoded content | Server-only | Risk | Laravel/Inertia destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/components/projects/Eyebrow.tsx` | Reusable gold rule/uppercase section label. Used throughout project and page sections. | Yes. | None. | No meaningful content. | No. | Low | Shared `Components/Projects/Eyebrow.tsx`. |
| `src/components/projects/ProjectHero.tsx` | KLOVE project hero content slider with Embla, autoplay, indicators, background asset. | Yes. | CTA anchors should become route/action links. | Slide copy and stats data. | No. | High | Project landing section. |
| `src/components/projects/ProjectStats.tsx` | Project stat grid using `projectStats`. | Yes. | None. | Data static. | No. | Medium | Project section with stats prop. |
| `src/components/projects/ProjectOverview.tsx` | Overview text and image for KLOVE. | Yes. | None. | Copy static. | No. | Medium | Project section with overview props. |
| `src/components/projects/Masterplan.tsx` | Masterplan image and brochure lead form. | Yes visually. | Form action becomes Inertia/Laravel endpoint. | Copy and labels static. | No. | High | Project section plus `BrochureLeadController`. |
| `src/components/projects/VirtualTour.tsx` | Virtual tour CTA/modal, hardcoded YouTube iframe, home-type cards. | Yes visually. | TanStack links become Inertia links; video URL dynamic later. | Video URL, copy, home types. | No. | High | Project section with video/home-type props. |
| `src/components/projects/ConstructionUpdates.tsx` | Construction update cards using project data. | Yes. | None. | Update data static. | No. | Medium | Project section with updates prop. |
| `src/components/projects/Amenities.tsx` | Icon-mapped amenity groups and descriptions. | Yes. | None. | Amenity groups static. | No. | Medium | Project section with amenity groups prop. |
| `src/components/projects/LocationMap.tsx` | Location copy, drive times, map image, project CTA. | Yes visually. | CTA links and future map URL. | Location copy/drive times static; image is placeholder. | No. | Medium | Project section with location props. |

## Careers And Media Components

| File path | Purpose / usage | Keep unchanged | Routing changes | Hardcoded content | Server-only | Risk | Laravel/Inertia destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/components/careers/CareersSections.tsx` | Careers hero, values, roles, internship, CV CTA, chat button. Used by `/careers`. | Yes visually. | Role links/forms become Laravel routes/actions. | Very high: roles and copy are local arrays. | No. | High | Split into `Pages/Careers/Sections/*` or keep as shared React components receiving props. |
| `src/components/media/MediaSections.tsx` | Media hero, press cards, stories, gallery, newsletter, chat button. Used by `/media`. | Yes visually. | Article/story links and newsletter action become Inertia/Laravel. | Very high: press, stories, image arrays, labels. | No. | High | `Pages/Media/Sections/*` with CMS props. |

## UI Primitive Files

All files below are shadcn/Radix-style reusable primitives. Most are not imported by the audited public pages, but they are frontend files and should be preserved until usage is confirmed.

| File path | Purpose / page usage | Keep | Routing | Hardcoded | Server-only | Risk | Destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/components/ui/accordion.tsx` | Accordion primitive; no current public-page usage found. | Yes | None | No | No | Low | `resources/js/Components/UI/Accordion.tsx` |
| `src/components/ui/alert-dialog.tsx` | Modal confirmation primitive. | Yes | None | No | No | Low | `Components/UI/AlertDialog.tsx` |
| `src/components/ui/alert.tsx` | Alert display primitive. | Yes | None | No | No | Low | `Components/UI/Alert.tsx` |
| `src/components/ui/aspect-ratio.tsx` | Radix aspect ratio wrapper. | Yes | None | No | No | Low | `Components/UI/AspectRatio.tsx` |
| `src/components/ui/avatar.tsx` | Avatar primitive. | Yes | None | No | No | Low | `Components/UI/Avatar.tsx` |
| `src/components/ui/badge.tsx` | Badge primitive. | Yes | None | No | No | Low | `Components/UI/Badge.tsx` |
| `src/components/ui/breadcrumb.tsx` | Breadcrumb primitive; potentially useful for project/job detail. | Yes | Detail route URLs later. | No | No | Low | `Components/UI/Breadcrumb.tsx` |
| `src/components/ui/button.tsx` | CVA button primitive used by carousel. | Yes | None | No | No | Low | `Components/UI/Button.tsx` |
| `src/components/ui/calendar.tsx` | Calendar/date picker primitive. | Yes | None | No | No | Low | `Components/UI/Calendar.tsx` |
| `src/components/ui/card.tsx` | Card primitive. | Yes | None | No | No | Low | `Components/UI/Card.tsx` |
| `src/components/ui/carousel.tsx` | Embla context and previous/next controls. | Yes | None | No | No | Medium | `Components/UI/Carousel.tsx` |
| `src/components/ui/chart.tsx` | Recharts wrapper/config components. | Yes | None | No | No | Low | `Components/UI/Chart.tsx` |
| `src/components/ui/checkbox.tsx` | Radix checkbox. | Yes | None | No | No | Low | `Components/UI/Checkbox.tsx` |
| `src/components/ui/collapsible.tsx` | Radix collapsible. | Yes | None | No | No | Low | `Components/UI/Collapsible.tsx` |
| `src/components/ui/command.tsx` | Command menu primitive. | Yes | None | No | No | Low | `Components/UI/Command.tsx` |
| `src/components/ui/context-menu.tsx` | Context menu primitive. | Yes | None | No | No | Low | `Components/UI/ContextMenu.tsx` |
| `src/components/ui/dialog.tsx` | Dialog primitive. | Yes | None | No | No | Low | `Components/UI/Dialog.tsx` |
| `src/components/ui/drawer.tsx` | Drawer primitive. | Yes | None | No | No | Low | `Components/UI/Drawer.tsx` |
| `src/components/ui/dropdown-menu.tsx` | Dropdown primitive. | Yes | None | No | No | Low | `Components/UI/DropdownMenu.tsx` |
| `src/components/ui/form.tsx` | React Hook Form/Radix form helpers; public forms currently use native controls instead. | Yes | Form actions later. | No | No | Medium | `Components/UI/Form.tsx` |
| `src/components/ui/hover-card.tsx` | Hover card primitive. | Yes | None | No | No | Low | `Components/UI/HoverCard.tsx` |
| `src/components/ui/input-otp.tsx` | OTP input primitive. | Yes | None | No | No | Low | `Components/UI/InputOtp.tsx` |
| `src/components/ui/input.tsx` | Input primitive. | Yes | None | No | No | Low | `Components/UI/Input.tsx` |
| `src/components/ui/label.tsx` | Label primitive. | Yes | None | No | No | Low | `Components/UI/Label.tsx` |
| `src/components/ui/menubar.tsx` | Menubar primitive. | Yes | None | No | No | Low | `Components/UI/Menubar.tsx` |
| `src/components/ui/navigation-menu.tsx` | Navigation menu primitive; distinct from current Header. | Yes | Future only. | No | No | Low | `Components/UI/NavigationMenu.tsx` |
| `src/components/ui/pagination.tsx` | Pagination primitive for future CMS/public lists. | Yes | Future dynamic list. | No | No | Low | `Components/UI/Pagination.tsx` |
| `src/components/ui/popover.tsx` | Popover primitive. | Yes | None | No | No | Low | `Components/UI/Popover.tsx` |
| `src/components/ui/progress.tsx` | Progress primitive. | Yes | None | No | No | Low | `Components/UI/Progress.tsx` |
| `src/components/ui/radio-group.tsx` | Radio group primitive. | Yes | None | No | No | Low | `Components/UI/RadioGroup.tsx` |
| `src/components/ui/resizable.tsx` | Resizable panel primitive. | Yes | None | No | No | Low | `Components/UI/Resizable.tsx` |
| `src/components/ui/scroll-area.tsx` | Scroll area primitive. | Yes | None | No | No | Low | `Components/UI/ScrollArea.tsx` |
| `src/components/ui/select.tsx` | Select primitive. | Yes | None | No | No | Low | `Components/UI/Select.tsx` |
| `src/components/ui/separator.tsx` | Separator primitive. | Yes | None | No | No | Low | `Components/UI/Separator.tsx` |
| `src/components/ui/sheet.tsx` | Sheet/drawer primitive. | Yes | None | No | No | Low | `Components/UI/Sheet.tsx` |
| `src/components/ui/sidebar.tsx` | Sidebar primitive, candidate for future CMS shell. | Yes | Admin routing later. | No | No | Medium | `Components/UI/Sidebar.tsx` |
| `src/components/ui/skeleton.tsx` | Loading skeleton primitive. | Yes | Inertia loading states later. | No | No | Low | `Components/UI/Skeleton.tsx` |
| `src/components/ui/slider.tsx` | Range slider primitive. | Yes | None | No | No | Low | `Components/UI/Slider.tsx` |
| `src/components/ui/sonner.tsx` | Toast wrapper. | Yes | Form feedback later. | No | No | Medium | `Components/UI/Sonner.tsx` |
| `src/components/ui/switch.tsx` | Switch primitive. | Yes | CMS settings later. | No | No | Low | `Components/UI/Switch.tsx` |
| `src/components/ui/table.tsx` | Table primitive, candidate for CMS CRUD. | Yes | Admin data routes later. | No | No | Medium | `Components/UI/Table.tsx` |
| `src/components/ui/tabs.tsx` | Tabs primitive. | Yes | None | No | No | Low | `Components/UI/Tabs.tsx` |
| `src/components/ui/textarea.tsx` | Textarea primitive. | Yes | Form actions later. | No | No | Low | `Components/UI/Textarea.tsx` |
| `src/components/ui/toggle-group.tsx` | Toggle group primitive. | Yes | None | No | No | Low | `Components/UI/ToggleGroup.tsx` |
| `src/components/ui/toggle.tsx` | Toggle primitive. | Yes | None | No | No | Low | `Components/UI/Toggle.tsx` |
| `src/components/ui/tooltip.tsx` | Tooltip primitive. | Yes | None | No | No | Low | `Components/UI/Tooltip.tsx` |

## Supporting Frontend Files

| File path | Purpose | Keep / destination |
| --- | --- | --- |
| `src/router.tsx` | Creates TanStack router and React Query context. | Replace with Inertia bootstrap; preserve query client only if still needed. |
| `src/routeTree.gen.ts` | Generated TanStack route tree. | Remove only after route migration is approved and complete. |
| `src/hooks/use-mobile.tsx` | Media-query hook. | Keep if used by retained UI; otherwise low-priority cleanup. |
| `src/lib/utils.ts` | `cn` class merge helper. | Keep or replace with same helper in Laravel frontend. |
| `src/lib/lovable-error-reporting.ts` | Lovable browser telemetry bridge. | Remove/replace after monitoring decision. |
| `src/lib/error-page.ts` | SSR error HTML renderer. | Replace with Laravel/Inertia error handling. |
| `src/lib/error-capture.ts` | Runtime/server error capture. | Replace with Laravel logs and frontend monitoring. |
| `src/styles.css` | Tailwind v4 imports, theme tokens, global fonts, body styles, `bg_pattern`. | Keep nearly unchanged to protect approved design. |

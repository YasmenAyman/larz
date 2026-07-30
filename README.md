# larz

You are a senior React frontend engineer and pixel-perfect UI implementation specialist.

I will attach multiple screenshots representing different pages and sections of one informational website. Your task is to recreate the complete website in React with the highest possible visual accuracy.

Primary Objective

Build a fully responsive React website that matches the attached screenshots pixel by pixel.

The screenshots are the single source of truth.

Do not redesign, reinterpret, simplify, modernize, improve, or replace any visual element unless it is technically necessary. Do not introduce your own design decisions.

Reference Images

Carefully analyze every attached screenshot before writing the implementation.

Treat all screenshots as parts of the same website and preserve complete visual consistency across:

Header and navigation

Logo placement and dimensions

Page width and container alignment

Typography

Font sizes and weights

Text line heights

Text colors

Background colors and gradients

Borders and border radii

Shadows

Icons

Buttons

Images and illustrations

Cards and content blocks

Horizontal and vertical spacing

Section heights

Footer design

Responsive behavior

Create a clear page-to-screenshot mapping before implementation.

Technical Requirements

Use:

React

TypeScript

Vite

Tailwind CSS

React Router for navigation between pages

Lucide React only when a matching icon is not provided in the screenshots

Reusable React components

Semantic HTML

Clean and maintainable code

Do not use Next.js unless it is already required by the existing project.

Do not create a backend, database, authentication system, dashboard, CMS, or API integration. This is an informational website only.

Pixel-Perfect Implementation Rules

Reproduce the screenshots as accurately as possible.

Match the exact proportions, alignment, visual hierarchy, spacing, and dimensions shown in the references.

Do not use approximate generic layouts when the screenshot provides enough information to reproduce the original layout.

Avoid unnecessary empty space.

Do not change the order of sections or elements.

Do not add content, decorative elements, animations, badges, icons, gradients, or sections that are not visible in the reference images.

Do not remove visible elements from the screenshots.

Do not replace the design with a standard landing-page template.

Do not use random stock images.

Do not use placeholder images when a corresponding image has been attached.

Do not replace the visible logo with plain text.

Preserve repeated components exactly across all pages.

Do not redesign mobile layouts. Derive them carefully from the desktop structure while preserving the same design language.

If any text is unreadable, use a clearly marked placeholder with approximately the same length so the layout remains visually accurate.

Images and Assets

Use the attached visual assets whenever possible.

Create a structured assets directory such as:

/src/assets/images

/src/assets/icons

/src/assets/logos

Do not embed external image URLs that may expire.

Maintain the correct aspect ratio for every image.

Use:

object-cover only when the screenshot clearly shows image cropping.

object-contain when the full image or logo must remain visible.

If an exact decorative icon is not available, use the closest Lucide icon with matching size and stroke width. Do not use emoji or text characters as substitutes for icons.

Typography

Inspect the screenshots carefully and identify the closest matching font.

If the exact font cannot be identified, choose the closest available Google Font based on:

Letter shape

Character width

Font weight

Line height

Overall visual appearance

Define typography consistently rather than assigning unrelated font values to individual elements.

Match heading and body text sizes separately for desktop, tablet, and mobile.

If the website contains Arabic content:

Set the appropriate sections to dir="rtl".

Preserve Arabic text alignment.

Use a professional Arabic-compatible font.

Do not reverse icons, logos, numbers, or elements that should remain in their original direction.

Responsive Design

The website must work correctly at:

1440px desktop

1280px laptop

1024px tablet landscape

768px tablet

390px mobile

375px mobile

The desktop layout must first match the screenshots exactly.

Then create responsive adaptations without changing the visual identity.

Responsive behavior should include:

A functional mobile navigation menu when necessary

Properly stacked content sections

Correct image scaling

No horizontal overflow

Readable text without breaking the original hierarchy

Consistent spacing

Proper card resizing

No overlapping elements

Do not simply shrink the desktop page. Create intentional responsive behavior based on the original design.

Page Structure

Create a separate React route for every page represented by the screenshots.

Suggested structure:

src/
├── assets/
├── components/
│   ├── layout/
│   ├── shared/
│   └── sections/
├── pages/
├── routes/
├── data/
├── styles/
├── App.tsx
└── main.tsx


Create reusable shared components for repeated elements, including:

Header

Navigation

Mobile menu

Footer

Buttons

Section headings

Cards

Image blocks

Breadcrumbs

Contact information

Any repeated content sections

Do not duplicate large blocks of identical JSX across pages.

Navigation

Make all visible navigation elements functional.

Each navigation link must open the correct page using React Router without reloading the browser.

Highlight the active navigation item when the reference design shows an active state.

Make logo clicks return to the homepage.

Buttons should link to the appropriate page or section based on their visible labels.

Do not create fake buttons that have no behavior unless the screenshot clearly shows them as decorative elements.

Content

Use the exact text shown in the screenshots whenever it is readable.

Do not summarize or rewrite the provided content.

Do not use generic Lorem Ipsum.

Keep the same:

Titles

Paragraph structure

Button labels

Numbers

Contact information

Labels

Lists

Capitalization

Line breaks when visually important

Store repeated or structured content in local TypeScript data objects when appropriate.

Styling Standards

Use a consistent design token system for:

Colors

Typography

Container widths

Spacing

Border radii

Shadows

Breakpoints

Place shared design values in Tailwind configuration or CSS variables.

Avoid excessive arbitrary Tailwind values unless they are required for pixel-perfect matching.

Do not use inline styles unless a value is highly dynamic and cannot be represented cleanly with Tailwind.

Visual Validation Process

After implementing each page:

Compare the page against its corresponding screenshot.

Check the result at the same viewport dimensions as the reference image.

Correct mismatches in:

Container width

Alignment

Margins

Padding

Section height

Font size

Font weight

Line height

Border radius

Shadow

Image dimensions

Image crop

Icon size

Background color

Repeat this process until the page closely matches the screenshot.

Review all pages together to ensure that shared components remain consistent.

Do not stop after producing a visually similar first draft. Refine the implementation.

Quality Requirements

The final project must have:

No TypeScript errors

No broken imports

No missing components

No missing routes

No console errors

No unused placeholder sections

No horizontal page overflow

No distorted images

No overlapping text

No inaccessible buttons

No non-functional navigation

No duplicated headers or footers

No unnecessary packages

Important Restrictions

Do not:

Redesign the website

Change the color palette

Change the visual hierarchy

Invent sections

Add animations without visual evidence

Use a prebuilt website template

use excessive gradients

Add glassmorphism

Add unnecessary rounded cards

Add decorative blobs

Replace precise spacing with generic spacing

Insert generic AI-generated marketing copy

Make assumptions that visibly alter the design

When information is unclear, preserve the visual structure and use the most conservative interpretation.

Required Workflow

Follow this order:

Inspect all screenshots.

Identify all pages.

Identify repeated components.

Define routes.

Define design tokens.

Implement the global layout.

Build shared components.

Implement each page individually.

Add responsive behavior.

Test all navigation.

Visually compare each page with its screenshot.

Correct all visible inconsistencies.

Run a final quality check.

Start by analyzing the attached screenshots and then implement the complete website. Do not replace the requested design with a generic generated landing page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a11d4342-1aac-4fe7-ae4f-42fdca3ebfc8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

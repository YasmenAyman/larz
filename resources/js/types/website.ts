export type WebsiteProject = {
    id: number;
    title: string;
    slug: string;
    location: string | null;
    status: string | null;
    projectType: string | null;
    description: string | null;
    shortDescription: string | null;
    tagline?: string | null;
    intro?: string | null;
    highlights?: string[];
    heroHeading: string | null;
    heroDescription: string | null;
    heroImage: string | null;
    brochure: string | null;
    virtualTourUrl: string | null;
    mapImage: string | null;
    overviewImage: string | null;
    masterplanImage: string | null;
    facts: Array<{ value: string; label: string; note: string | null }>;
    gallery: string[];
    unitTypes: Array<{ tag: string; name: string; size: string }>;
    amenities: Array<{ group: string; icon: string; title: string; note: string | null }>;
    updates: Array<{ tag: string | null; title: string; image: string | null }>;
    nearbyLocations: Array<{ place: string; time: string }>;
};

export type ProjectHeroSlide = { eyebrow: string; titleLine1: string; titleLine2: string; description: string; cta1Label: string; cta1Url: string; cta2Label: string; cta2Url: string };
export type ProjectSections = {
    heroSlides: ProjectHeroSlide[];
    overview: { heading: string; body: string };
    gallery: { eyebrow: string; heading: string };
    masterplan: { heading: string; description: string; brochureHeading: string; brochureDescription: string };
    virtualTour: { heading: string; description: string; videoUrl: string };
    cta: { eyebrow: string; heading: string; whatsappNumber: string; primaryCtaLabel: string; secondaryCtaLabel: string };
    homes3d: { heading: string; description: string; note: string; items: Array<{ tag: string; name: string; size: string; url: string }> };
    construction: { heading: string; description: string; items: Array<{ tag: string; title: string; image: string | null }> };
    amenities: { heading: string; categories: Array<{ title: string; items: Array<{ icon: string | null; title: string; description: string }> }> };
    location: { heading: string; description: string; gateNote: string; driveNote: string; image: string | null; nearbyLocations: Array<{ place: string; time: string }> };
};

export type WebsiteSharedProps = PageProps<{
    site: {
        settings: Record<string, string | null>;
        navigation: Array<{ label: string; url: string; location: string }>;
        projects: Array<{ id: number; title: string; slug: string }>;
    };
}>;
import type { PageProps } from '@/types';

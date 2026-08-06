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
    facts: Array<{ value: string; label: string; note: string | null }>;
    gallery: string[];
    unitTypes: Array<{ tag: string; name: string; size: string }>;
    amenities: Array<{ group: string; icon: string; title: string; note: string | null }>;
    updates: Array<{ tag: string | null; title: string; image: string | null }>;
    nearbyLocations: Array<{ place: string; time: string }>;
};

export type ProjectHeroSlide = { eyebrow: string; titleLine1: string; titleLine2: string; description: string };
export type ProjectSections = {
    heroSlides: ProjectHeroSlide[];
    overview: { heading: string; body: string };
    masterplan: { heading: string; description: string; brochureHeading: string; brochureDescription: string };
    virtualTour: { heading: string; description: string; videoUrl: string };
    cta: { eyebrow: string; heading: string };
    homes3d: { heading: string; description: string; note: string };
    construction: { heading: string; description: string };
    amenities: { heading: string };
    location: { heading: string; description: string; gateNote: string; driveNote: string };
};

export type WebsiteSharedProps = PageProps<{
    site: {
        settings: Record<string, string | null>;
        navigation: Array<{ label: string; url: string; location: string }>;
    };
}>;
import type { PageProps } from '@/types';

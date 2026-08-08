import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';
import WebsiteLayout from '@/layouts/WebsiteLayout';
import { About } from '@/components/website/home/About';
import { FeaturedProjects } from '@/components/website/home/FeaturedProjects';
import { Gallery } from '@/components/website/home/Gallery';
import { Hero } from '@/components/website/home/Hero';
import { Testimonials } from '@/components/website/home/Testimonials';
import type { WebsiteProject } from '@/types/website';

export default function Index({ hero, stats, projects, featuredProjectsSettings, gallery, gallerySettings, testimonials, testimonialSettings, seo }: { hero: { heading: string; description: string; cta_label: string; cta_url: string; heroImage: string }; stats: Array<{ value: string; label: string }>; projects: Array<Pick<WebsiteProject, 'slug' | 'title' | 'location' | 'heroImage'> & { image?: string | null }>; featuredProjectsSettings: { eyebrow: string; heading: string; description: string; cta_label: string; cta_url: string }; gallery: string[]; gallerySettings: { eyebrow: string; heading: string; description: string; cta_label: string; cta_url: string }; testimonials: Array<{ quote: string; name: string; role: string | null; image: string | null }>; testimonialSettings: { eyebrow: string; heading: string; description: string }; seo: SeoMetadata }) {
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <Hero hero={hero} />
            <About stats={stats} />
            <FeaturedProjects projects={projects} settings={featuredProjectsSettings} />
            <Gallery gallery={gallery} settings={gallerySettings} />
            <Testimonials testimonials={testimonials} settings={testimonialSettings} />
        </WebsiteLayout>
    );
}

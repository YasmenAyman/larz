import WebsiteLayout from '@/layouts/WebsiteLayout';
import { MediaGallery, MediaHero, MediaNewsletter, MediaPress, MediaStories } from '@/components/website/media/MediaSections';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';

export default function Index({ hero, posts, newsSettings, storiesSettings, gallerySettings, gallery, newsletterSettings, seo }: {
    hero: { eyebrow: string; heading: string; description: string };
    posts: Array<{ slug: string; type: string; category: string | null; date: string | null; title: string; excerpt: string | null; image: string | null }>;
    newsSettings: { eyebrow: string; heading: string; description: string | null };
    storiesSettings: { eyebrow: string; heading: string; description: string | null };
    gallerySettings: { eyebrow: string; heading: string; description: string | null };
    gallery: string[];
    newsletterSettings: { eyebrow: string; heading: string; description: string | null };
    seo: SeoMetadata;
}) {
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <MediaHero hero={hero} />
            <MediaPress posts={posts} settings={newsSettings} />
            <MediaStories posts={posts} settings={storiesSettings} />
            <MediaGallery gallery={gallery} settings={gallerySettings} />
            <MediaNewsletter settings={newsletterSettings} />
        </WebsiteLayout>
    );
}

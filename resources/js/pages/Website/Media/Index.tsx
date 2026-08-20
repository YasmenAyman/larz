import WebsiteLayout from '@/layouts/WebsiteLayout';
import { MediaGallery, MediaHero, MediaPress, MediaStories } from '@/components/website/media/MediaSections';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';

export default function Index({ hero, posts, newsSettings, storiesSettings, gallerySettings, gallery, seo }: {
    hero: { eyebrow: string; heading: string; description: string };
    posts: Array<{ slug: string; type: string; category: string | null; date: string | null; title: string; excerpt: string | null; image: string | null }>;
    newsSettings: { eyebrow: string; heading: string; description: string | null };
    storiesSettings: { eyebrow: string; heading: string; description: string | null };
    gallerySettings: { eyebrow: string; heading: string; description: string | null };
    gallery: string[];
    seo: SeoMetadata;
}) {
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <MediaHero hero={hero} />
            <MediaPress posts={posts} settings={newsSettings} />
            <MediaStories posts={posts} settings={storiesSettings} />
            <MediaGallery gallery={gallery} settings={gallerySettings} />
        </WebsiteLayout>
    );
}

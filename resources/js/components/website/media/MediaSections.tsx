import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { ImageLightbox } from '@/components/shared/ImageLightbox';
import { useI18n } from '@/i18n';

type MediaPost = { slug: string; type: string; category: string | null; date: string | null; title: string; excerpt: string | null; image: string | null };
type SectionSettings = { eyebrow: string; heading: string; description: string | null };
export function MediaHero({ hero }: { hero: { eyebrow: string; heading: string; description: string } }) {
    const { t } = useI18n();
    return (
        <section className="relative overflow-hidden border-b border-hairline/30 bg-night" style={{ backgroundImage: `radial-gradient(ellipse 60% 70% at 82% 20%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 35%, transparent 72%), linear-gradient(110deg, rgba(6, 4, 4, 0.98) 28%, rgba(2, 2, 4, 0.73) 100%)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="relative mx-auto flex min-h-[700px] max-w-[1440px] flex-col justify-center px-6 pt-36 pb-16 sm:px-10 lg:px-24">
                <Eyebrow className="text-ink">{t(hero.eyebrow ?? 'Media')}</Eyebrow>
                <h1 className="mt-7 max-w-xl text-5xl font-light leading-[1.08] tracking-[-0.03em] sm:text-6xl lg:text-[5rem]">{(hero.heading ?? 'The latest from LARZ.').replace(/\\n/g, ' ')}</h1>
                <p className="mt-6 text-sm text-ink-muted">{hero.description}</p>
            </div>
        </section>
    );
}

export function MediaPress({ posts, settings }: { posts: MediaPost[]; settings: SectionSettings }) {
    const { t } = useI18n();
    return (
        <section id="news" className="bg-[#EFEFF1] py-20 text-paper-ink sm:py-24">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24">
                <Eyebrow tone="light">{t(settings.eyebrow ?? 'News & press releases')}</Eyebrow>
                <h2 className="mt-5 text-4xl font-light sm:text-[2.5rem]">{t(settings.heading ?? "What's happening at LARZ.")}</h2>
                {settings.description && <p className="mt-4 max-w-2xl text-sm text-paper-muted">{settings.description}</p>}
                <div className="mt-10 grid gap-3 lg:grid-cols-3">
                    {posts.filter((post) => post.type === 'press').map((post) => (
                        <article key={post.slug} className="flex flex-col border border-paper-muted/25 bg-[#f7f7f8]">
                            <a href={`/media/${post.slug}`} aria-label={`Read ${post.title}`} className="relative block h-50 overflow-hidden bg-[#dedee2] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                                <img src={post.image ?? ''} alt={post.title} className="size-full object-cover transition-transform duration-300 hover:scale-105" />
                            </a>
                            <div className="flex flex-1 flex-col p-4">
                                <p className="text-[0.9rem] tracking-[0.16em] text-ink-muted/60">{post.date}</p>
                                <h3 className="mt-3 text-md leading-tight text-paper-ink">{post.title}</h3>
                                <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-relaxed text-paper-muted">{post.excerpt}</p>
                                <a href={`/media/${post.slug}`} className="mt-4 inline-flex items-center gap-1 text-[0.8rem] font-bold tracking-[0.18em] text-[#A4792B] uppercase transition-colors hover:text-[#734F1B] focus:outline-none focus-visible:text-[#734F1B]">{t('Read more')} <ArrowRight className="size-3 rtl:rotate-180" strokeWidth={1.5} /></a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function MediaStories({ posts, settings }: { posts: MediaPost[]; settings: SectionSettings }) {
    const { t } = useI18n();
    return (
        <section id="blogs" className="bg-night py-20 sm:py-24">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24">
                <Eyebrow className="text-ink">{t(settings.eyebrow ?? 'Blogs')}</Eyebrow>
                <h2 className="mt-5 text-4xl font-light text-ink sm:text-[2.5rem]">{t(settings.heading ?? 'Stories & insight.')}</h2>
                {settings.description && <p className="mt-4 max-w-2xl text-sm text-ink-muted">{settings.description}</p>}
                <div className="mt-10 grid gap-3 lg:grid-cols-3">
                    {posts.filter((post) => post.type === 'blog').map((post) => (
                        <article key={post.slug} className="border border-hairline/50 bg-surface-deep">
                            <a href={`/media/${post.slug}`} aria-label={`Read ${post.title}`} className="relative block h-50 overflow-hidden border-b border-hairline/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                                <img src={post.image ?? ''} alt={post.title} className="size-full object-cover transition-transform duration-300 hover:scale-105" />
                                <div className="absolute left-0 top-0 h-full w-full" style={{ backgroundImage: 'radial-gradient(ellipse 60% 70% at 82% 20%, rgba(255, 255, 255, 0.3) 0%, rgba(190, 190, 190, 0.2) 35%, transparent 72%), linear-gradient(110deg, rgba(6, 4, 4, 0.40) 28%, rgba(2, 2, 4, 0.10) 100%)' }} />
                            </a>
                            <div className="p-4">
                                <p className="text-[0.9rem] tracking-[0.16em] text-ink-muted/60 uppercase">{post.category ? t(post.category) : null}</p>
                                <h3 className="mt-3 text-lg leading-tight text-ink">{post.title}</h3>
                                <p className="mt-2 text-xs text-ink-muted">{post.excerpt}</p>
                                <a href={`/media/${post.slug}`} className="mt-4 inline-flex items-center gap-1 text-[0.9rem] tracking-[0.18em] text-ink-muted uppercase">{t('Read article')} <ArrowRight className="size-3 rtl:rotate-180" strokeWidth={1.5} /></a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function MediaGallery({ gallery, settings }: { gallery: string[]; settings: SectionSettings }) {
    const { t } = useI18n();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const featuredSlots = [
        { col: 1, row: 1, rowSpan: 1 },
        { col: 2, row: 1, rowSpan: 2 },
        { col: 3, row: 1, rowSpan: 1 },
        { col: 4, row: 1, rowSpan: 1 },
        { col: 1, row: 2, rowSpan: 1 },
        { col: 3, row: 2, rowSpan: 2 },
        { col: 4, row: 2, rowSpan: 1 },
        { col: 2, row: 3, rowSpan: 1 },
    ];

    return (
        <section id="gallery" className="bg-[#EFEFF1] py-20 text-paper-ink sm:py-24">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24">
                <Eyebrow tone="light">{t(settings.eyebrow ?? 'Photo gallery')}</Eyebrow>
                <h2 className="mt-5 text-4xl font-light sm:text-[2.5rem]">{t(settings.heading ?? 'Inside our communities.')}</h2>
                {settings.description && <p className="mt-4 max-w-2xl text-sm text-paper-muted">{settings.description}</p>}
                <div className="mt-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridTemplateRows: 'repeat(3, 200px)', gridAutoRows: '200px', gap: '10px' }}>
                    {gallery.map((src, index) => {
                        const slot = featuredSlots[index];
                        const placement = slot ? { gridColumnStart: slot.col, gridColumnEnd: slot.col + 1, gridRowStart: slot.row, gridRowEnd: slot.row + slot.rowSpan } : undefined;

                        return (
                            <button type="button" key={`${src}-${index}`} onClick={() => setSelectedImageIndex(index)} aria-label={`Open gallery image ${index + 1}`} className="relative cursor-zoom-in overflow-hidden bg-[#d8d8dc] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-paper-ink" style={placement}>
                                <img src={src} alt={`LARZ gallery ${index + 1}`} className="size-full object-cover" />
                                <div className="absolute left-0 top-0 h-full w-full" style={{ backgroundImage: 'radial-gradient(ellipse 60% 70% at 82% 20%, rgba(255, 255, 255, 0.3) 0%, rgba(190, 190, 190, 0.2) 35%, transparent 72%), linear-gradient(110deg, rgba(6, 4, 4, 0.40) 28%, rgba(2, 2, 4, 0.10) 100%)' }} />
                            </button>
                        );
                    })}
                </div>
            </div>
            {selectedImageIndex !== null && <ImageLightbox images={gallery} initialIndex={selectedImageIndex} alt="Selected LARZ gallery image" onClose={() => setSelectedImageIndex(null)} />}
        </section>
    );
}

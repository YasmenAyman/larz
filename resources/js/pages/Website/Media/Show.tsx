import { ArrowLeft, ArrowRight } from 'lucide-react';
import WebsiteLayout from '@/layouts/WebsiteLayout';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';
import { useI18n } from '@/i18n';

export default function Show({ post, seo }: { post: { slug: string; type: string; category: string | null; date: string | null; title: string; excerpt: string | null; content: string | null; image: string | null }; seo: SeoMetadata }) {
    const { t } = useI18n();

    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <article className="bg-night text-ink">
                <header className="relative overflow-hidden border-b border-hairline/30 bg-night px-6 pt-40 pb-20 sm:px-10 lg:px-24">
                    <div className="mx-auto max-w-[1000px]">
                        <a href="/media" className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.2em] text-ink-muted uppercase hover:text-ink"><ArrowLeft className="size-3.5" /> Back to media</a>
                        <p className="mt-12 text-[0.6rem] tracking-[0.22em] text-gold uppercase">{post.category} · {post.date}</p>
                        <h1 className="mt-6 max-w-4xl text-4xl font-light leading-[1.08] sm:text-6xl lg:text-[4.25rem]">{post.title}</h1>
                        <p className="mt-7 max-w-xl text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                    </div>
                </header>
                <section className="bg-paper py-20 text-paper-ink sm:py-24">
                    <div className="mx-auto grid max-w-[1000px] gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-start">
                        <div className="text-sm leading-[1.9] text-paper-muted">
                            <p>{post.excerpt}</p>
                            {post.content && <div className="mt-6 whitespace-pre-line">{post.content}</div>}
                            <a href="/contact" className="mt-10 inline-flex items-center gap-3 border border-gold px-5 py-3 text-[0.62rem] tracking-[0.2em] text-paper-ink uppercase hover:bg-gold/10">{t('Talk to us')} <ArrowRight className="size-3.5 rtl:rotate-180" /></a>
                        </div>
                        <figure className="relative overflow-hidden border border-paper-muted/30 bg-[#dedee2]"><img src={post.image ?? ''} alt={post.title} className="h-[420px] w-full object-cover" /><figcaption className="absolute bottom-4 left-4 text-[0.52rem] tracking-[0.2em] text-paper uppercase">Media image</figcaption></figure>
                    </div>
                </section>
            </article>
        </WebsiteLayout>
    );
}

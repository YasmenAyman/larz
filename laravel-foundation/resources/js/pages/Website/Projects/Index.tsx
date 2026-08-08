import { ArrowUpRight } from 'lucide-react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import WebsiteLayout from '@/layouts/WebsiteLayout';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';
import { useI18n } from '@/i18n';

type ProjectItem = { id: number; title: string; slug: string; location: string | null; shortDescription: string | null; heroImage: string | null; category: string | null };

export default function Index({ projects, seo }: { projects: ProjectItem[]; seo: SeoMetadata }) {
    const { t } = useI18n();
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <section className="relative overflow-hidden bg-night" style={{ backgroundImage: 'radial-gradient(ellipse 60% 70% at 82% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 35%, transparent 72%), linear-gradient(110deg, rgba(6, 4, 4, 0.98) 28%, rgba(2, 2, 4, 0.73) 100%)' }}>
                <div className="relative mx-auto flex min-h-[50vh] max-w-[1440px] flex-col justify-center px-6 pt-40 pb-16 sm:px-10 lg:px-24">
                    <Eyebrow className="text-ink">{t('Projects')}</Eyebrow>
                    <h1 className="mt-7 max-w-2xl text-4xl font-light leading-[1.08] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">{t('Our Signature Developments')}</h1>
                    <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted">{t('Discover thoughtfully designed communities that combine architectural excellence, lasting value, and a lifestyle built around comfort and elegance.')}</p>
                </div>
            </section>

            <section className="bg-surface-deep py-20 sm:py-24">
                <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-24">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <a key={project.slug} href={`/projects/${project.slug}`} className="group relative block h-[400px] overflow-hidden rounded-lg">
                                <img src={project.heroImage ?? ''} alt={project.title} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                                    <div>
                                        {project.category && <p className="mb-2 text-[0.6rem] tracking-[0.22em] text-gold uppercase">{project.category}</p>}
                                        <h3 className="text-xl text-ink">{project.title}</h3>
                                        {project.location && <p className="mt-1 text-xs text-ink-muted">{project.location}</p>}
                                        {project.shortDescription && <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink-muted/70 line-clamp-2">{project.shortDescription}</p>}
                                    </div>
                                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-card text-ink transition-colors group-hover:bg-gold/20">
                                        <ArrowUpRight className="size-4" strokeWidth={1.5} />
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </WebsiteLayout>
    );
}

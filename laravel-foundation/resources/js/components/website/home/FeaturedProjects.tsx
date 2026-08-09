import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { PillButton } from '@/components/shared/PillButton';
import { SectionHeading } from '@/components/shared/SectionHeading';
import type { WebsiteProject } from '@/types/website';
import { useI18n } from '@/i18n';

export function FeaturedProjects({ projects, settings }: { projects: Array<Pick<WebsiteProject, 'slug' | 'title' | 'location' | 'heroImage'> & { image?: string | null }>; settings: { eyebrow: string; heading: string; description: string; cta_label: string; cta_url: string } }) {
    const [active, setActive] = useState(0);
    const { t } = useI18n();

    return (
        <section className="relative overflow-hidden bg-surface-deep pt-20 lg:pt-28">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 select-none text-[35vw] font-light leading-none tracking-[0.12em] text-ink/[0.05]"
            >
                LARZ
            </span>

            <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
                <SectionHeading
                    eyebrow={t(settings.eyebrow)}
                    title={t(settings.heading)}
                    description={<>{t(settings.description)}</>}
                />
                <div className="mt-8 flex justify-center">
                    <PillButton label={t(settings.cta_label)} to={settings.cta_url} />
                </div>
            </div>

            {/* Accordion grid — desktop: flex row; mobile/tablet: stacked */}
            <div className="relative mt-14 flex flex-col sm:flex-row">
                {projects.map((project, i) => {
                    const isActive = active === i;
                    return (
                        <article
                            key={i}
                            onMouseEnter={() => setActive(i)}
                            className={[
                                'group relative h-[320px] w-full border border-black overflow-hidden transition-all duration-500 ease-in-out sm:h-[420px] sm:min-w-0 lg:h-[480px]',
                                isActive ? 'sm:flex-[524px]' : 'sm:flex-[0.6]',
                            ].join(' ')}
                        >
                            {/* Background image */}
                            <img
                                src={project.heroImage ?? project.image ?? ''}
                                alt={project.title}
                                className={[
                                    'absolute inset-0 size-full object-cover transition-transform duration-500 ease-in-out',
                                    isActive ? 'scale-105' : 'scale-100',
                                ].join(' ')}
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/85 via-surface-deep/20 to-transparent" />

                            {/* Expanded info panel (active state) */}
                            <div
                                className={[
                                    'absolute inset-x-0 bottom-0 p-6 transition-all duration-500',
                                    isActive ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
                                ].join(' ')}
                            >
                                <h3 className="text-lg font-light text-ink">{project.title}</h3>
                                <p className="mt-2 flex items-center gap-2 text-sm text-ink/80">
                                    <MapPin className="size-4 shrink-0" strokeWidth={1.5} />
                                    {project.location}
                                </p>
                                <div className="mt-8 flex items-center justify-between">
                                    <Link href={`/projects/${project.slug}`} className="text-sm text-ink transition-colors hover:text-gold">
                                        {t('Explore Project')}
                                    </Link>
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        aria-label={`Explore ${project.title}`}
                                        className="grid size-9 place-items-center rounded-full bg-[#7C6C65] text-ink transition-colors hover:bg-gold/80"
                                    >
                                        <ArrowUpRight className="size-4 rtl:rotate-180" strokeWidth={1.5} />
                                    </Link>
                                </div>
                            </div>

                            {/* Collapsed vertical title (inactive state) */}
                            <div
                                className={[
                                    'absolute inset-0 flex items-end justify-start pb-6 pl-6 transition-all duration-500 sm:p-5',
                                    isActive ? 'pointer-events-none opacity-0' : 'opacity-100',
                                ].join(' ')}
                            >
                                <h3 className="whitespace-nowrap text-xl font-light text-ink sm:[writing-mode:sideways-lr]">
                                    {project.title}
                                </h3>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

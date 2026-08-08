import WebsiteLayout from '@/layouts/WebsiteLayout';
import { Amenities, ConstructionUpdates, LocationMap, Masterplan, ProjectFacilities, ProjectGallery, ProjectHero, ProjectOverview, ProjectStats, Homes3D, VirtualTour } from '@/components/website/projects/ProjectSections';
import type { ProjectSections, WebsiteProject } from '@/types/website';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';

export default function Show({ project, sections, others, seo }: { project: WebsiteProject; sections: ProjectSections; others: Array<{ slug: string; title: string; location: string | null; image: string | null }>; seo: SeoMetadata }) {
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <ProjectHero project={project} sections={sections} />
            <ProjectStats project={project} />
            <ProjectOverview project={project} sections={sections} />
            <Masterplan project={project} sections={sections} />
            <VirtualTour project={project} sections={sections} />
            <Homes3D project={project} sections={sections} />
            <ProjectGallery project={project} />
            <ConstructionUpdates project={project} sections={sections} />
            <Amenities project={project} sections={sections} />
            <ProjectFacilities project={project} />
            <LocationMap project={project} sections={sections} />

            {/* More developments */}
            {others.length > 0 && (
                <section className="border-t border-hairline/30 bg-surface-deep py-24">
                    <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
                        <h2 className="text-3xl font-light text-ink sm:text-[2.25rem]">More developments</h2>
                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            {others.map((other) => (
                                <a key={other.slug} href={`/projects/${other.slug}`} className="group relative block h-[300px] overflow-hidden">
                                    <img src={other.image ?? ''} alt={other.title} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-night/90 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                                        <div>
                                            <h3 className="text-base text-ink">{other.title}</h3>
                                            <p className="mt-1 text-xs text-ink-muted">{other.location}</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </WebsiteLayout>
    );
}

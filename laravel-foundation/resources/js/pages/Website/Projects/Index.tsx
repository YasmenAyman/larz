import WebsiteLayout from '@/layouts/WebsiteLayout';
import { Amenities, ConstructionUpdates, LocationMap, Masterplan, ProjectHero, ProjectOverview, ProjectStats, VirtualTour } from '@/components/website/projects/ProjectSections';
import type { ProjectSections, WebsiteProject } from '@/types/website';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';

export default function Index({ project, sections, seo }: { project: WebsiteProject; sections: ProjectSections; seo: SeoMetadata }) {
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <ProjectHero project={project} sections={sections} />
            <ProjectStats project={project} />
            <ProjectOverview project={project} sections={sections} />
            <Masterplan project={project} sections={sections} />
            <VirtualTour project={project} sections={sections} />
            <ConstructionUpdates project={project} sections={sections} />
            <Amenities project={project} sections={sections} />
            <LocationMap project={project} sections={sections} />
        </WebsiteLayout>
    );
}

import WebsiteLayout from '@/layouts/WebsiteLayout';
import { Amenities, ConstructionUpdates, LocationMap, Masterplan, ProjectFacilities, ProjectGallery, ProjectHero, ProjectOverview, ProjectStats, Homes3D, VirtualTour } from '@/components/website/projects/ProjectSections';
import type { ProjectSections, WebsiteProject } from '@/types/website';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';

export default function Show({ project, sections, seo }: { project: WebsiteProject; sections: ProjectSections; seo: SeoMetadata }) {
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <ProjectHero project={project} sections={sections} />
            <ProjectStats project={project} />
            <ProjectOverview project={project} sections={sections} />
            <Masterplan project={project} sections={sections} />
            <VirtualTour project={project} sections={sections} />
            <Homes3D project={project} sections={sections} />
            <ProjectGallery project={project} sections={sections} />
            <ConstructionUpdates project={project} sections={sections} />
            <Amenities project={project} sections={sections} />
            <LocationMap project={project} sections={sections} />

        </WebsiteLayout>
    );
}

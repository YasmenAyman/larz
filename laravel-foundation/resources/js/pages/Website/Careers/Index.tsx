import WebsiteLayout from '@/layouts/WebsiteLayout';
import { CareersCta, CareersHero, InternshipPrograms, OpenRoles, WhyLarz } from '@/components/website/careers/CareerSections';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';

export default function Index({ hero, values, jobs, internship, cta, seo }: { hero: { heading: string; description: string }; values: Array<{ title: string; description: string; icon: string }>; jobs: Array<{ id: number; title: string; department: string; location: string; employmentType: string }>; internship: { id: number; title: string; description: string; cta_label: string }; cta: { heading: string }; seo: SeoMetadata }) {
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <CareersHero hero={hero} />
            <WhyLarz values={values} />
            <OpenRoles jobs={jobs} />
            <InternshipPrograms internship={internship} />
            <CareersCta cta={cta} />
        </WebsiteLayout>
    );
}

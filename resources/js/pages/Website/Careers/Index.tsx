import WebsiteLayout from '@/layouts/WebsiteLayout';
import { CareersCta, CareersHero, InternshipPrograms, OpenRoles, WhyLarz } from '@/components/website/careers/CareerSections';
import { SeoHead, type SeoMetadata } from '@/components/shared/SeoHead';

export default function Index({ hero, values, valuesSettings, vacanciesSettings, jobs, internship, internshipSettings, cta, seo }: { hero: { eyebrow?: string; heading: string; description: string; backgroundImage: string }; values: Array<{ title: string; description: string; icon: string }>; valuesSettings: { eyebrow: string; heading: string; description: string | null }; vacanciesSettings: { eyebrow: string; heading: string; description: string | null }; jobs: Array<{ id: number; title: string; department: string; location: string; employmentType: string }>; internship: { id: number; title: string; description: string; cta_label: string }; internshipSettings: { eyebrow: string; heading: string; description: string; cta_label: string; image: string }; cta: { eyebrow: string; heading: string; cta_label: string }; seo: SeoMetadata }) {
    return (
        <WebsiteLayout>
            <SeoHead seo={seo} />
            <CareersHero hero={hero} />
            <WhyLarz values={values} settings={valuesSettings} />
            <OpenRoles jobs={jobs} settings={vacanciesSettings} />
            <InternshipPrograms internship={internship} settings={internshipSettings} />
            <CareersCta cta={cta} />
        </WebsiteLayout>
    );
}

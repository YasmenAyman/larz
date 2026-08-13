import { Head, usePage } from '@inertiajs/react';
import { useI18n } from '@/i18n';

export type SeoMetadata = {
    title: string;
    description: string | null;
    canonical: string;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    robots: string;
    structured_data: Array<Record<string, unknown>>;
};

export function SeoHead({ seo, tabTitle }: { seo: SeoMetadata; tabTitle?: string }) {
    const { locale } = useI18n();
    const { url } = usePage();
    const path = url.split('?')[0];
    const pageTitles: Record<string, { en: string; ar: string }> = {
        '/': { en: 'Home', ar: '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629' },
        '/about-us': { en: 'About Us', ar: '\u0645\u0646 \u0646\u062d\u0646' },
        '/projects': { en: 'Projects', ar: '\u0627\u0644\u0645\u0634\u0631\u0648\u0639\u0627\u062a' },
        '/media': { en: 'Media', ar: '\u0627\u0644\u0625\u0639\u0644\u0627\u0645' },
        '/careers': { en: 'Careers', ar: '\u0627\u0644\u0648\u0638\u0627\u0626\u0641' },
        '/contact-us': { en: 'Contact Us', ar: '\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627' },
    };
    const localizedTabTitle = pageTitles[path]?.[locale];

    return (
        <Head title={tabTitle ?? localizedTabTitle ?? seo.title}>
            <meta head-key="seo-title" name="title" content={seo.title} />
            {seo.description && <meta name="description" content={seo.description} />}
            <link rel="canonical" href={seo.canonical} />
            <meta name="robots" content={seo.robots} />
            <meta property="og:title" content={seo.og_title ?? seo.title} />
            {seo.og_description && <meta property="og:description" content={seo.og_description} />}
            <meta property="og:url" content={seo.canonical} />
            <meta property="og:type" content="website" />
            {seo.og_image && <meta property="og:image" content={seo.og_image} />}
            <meta name="twitter:card" content={seo.og_image ? 'summary_large_image' : 'summary'} />
            {seo.structured_data.map((data, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }} />)}
        </Head>
    );
}

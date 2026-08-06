import { Head } from '@inertiajs/react';

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

export function SeoHead({ seo }: { seo: SeoMetadata }) {
    return (
        <Head title={seo.title}>
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

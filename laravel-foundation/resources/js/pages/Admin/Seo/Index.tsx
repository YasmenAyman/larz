import { Head, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type Entry = {
    target: string;
    label: string;
    path: string;
    seo_title: string | null;
    meta_description: string | null;
    canonical_url: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    indexable: boolean;
    followable: boolean;
};

type SeoForm = {
    seo_title: string;
    meta_description: string;
    canonical_url: string;
    og_title: string;
    og_description: string;
    og_image: File | null;
    indexable: boolean;
    followable: boolean;
};

export default function Index({ entries }: { entries: Entry[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;

    return (
        <AdminLayout>
            <Head title="SEO Metadata" />
            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div><Breadcrumbs items={['Admin', 'SEO']} /><h1 className="mt-3 text-3xl font-semibold">SEO metadata</h1><p className="mt-2 text-sm text-slate-400">Edit page titles, descriptions, sharing data, canonical URLs and crawl directives.</p></div>
                <Notification message={flash?.success} />
                <div className="space-y-5">{entries.map((entry) => <SeoEntry key={entry.target} entry={entry} />)}</div>
            </div>
        </AdminLayout>
    );
}

function SeoEntry({ entry }: { entry: Entry }) {
    const { data, setData, put, processing, errors } = useForm<SeoForm>({
        seo_title: entry.seo_title ?? '',
        meta_description: entry.meta_description ?? '',
        canonical_url: entry.canonical_url ?? '',
        og_title: entry.og_title ?? '',
        og_description: entry.og_description ?? '',
        og_image: null,
        indexable: entry.indexable,
        followable: entry.followable,
    });

    const submit = (event: React.FormEvent) => { event.preventDefault(); put(`/admin/seo/${entry.target}`, { forceFormData: true, preserveScroll: true }); };

    return (
        <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2"><div><h2 className="text-lg font-semibold">{entry.label}</h2><p className="mt-1 text-xs text-slate-500">{entry.path}</p></div><span className="text-xs text-slate-600">{entry.target}</span></div>
            <div className="grid gap-5 md:grid-cols-2">
                <FormField label="SEO title" error={errors.seo_title}><input value={data.seo_title} onChange={(event) => setData('seo_title', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                <FormField label="Canonical URL" error={errors.canonical_url}><input type="url" value={data.canonical_url} onChange={(event) => setData('canonical_url', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                <FormField label="Meta description" error={errors.meta_description}><textarea rows={3} value={data.meta_description} onChange={(event) => setData('meta_description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                <FormField label="Open Graph title" error={errors.og_title}><input value={data.og_title} onChange={(event) => setData('og_title', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                <FormField label="Open Graph description" error={errors.og_description}><textarea rows={3} value={data.og_description} onChange={(event) => setData('og_description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                <FormField label="Open Graph image" error={errors.og_image}><input type="file" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={(event) => setData('og_image', event.target.files?.[0] ?? null)} className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-400 file:mr-3 file:border-0 file:bg-transparent file:text-slate-200" />{entry.og_image && <img src={entry.og_image} alt="Current Open Graph image" className="mt-3 h-20 w-32 object-cover" />}</FormField>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-300"><label className="flex items-center gap-2"><input type="checkbox" checked={data.indexable} onChange={(event) => setData('indexable', event.target.checked)} /> Allow indexing</label><label className="flex items-center gap-2"><input type="checkbox" checked={data.followable} onChange={(event) => setData('followable', event.target.checked)} /> Allow link following</label></div>
            <button disabled={processing} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">Save SEO metadata</button>
        </form>
    );
}

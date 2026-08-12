import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ChartNoAxesCombined, Heart, Leaf, Medal } from 'lucide-react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Copy = { eyebrow: string; heading: string; description: string };
type Value = { id: number; title: string; description: string | null; icon_key: string; sort_order: number; is_published: boolean; translations?: { en?: { title?: string; description?: string }; ar?: { title?: string; description?: string } } };
const iconMap = { heart: Heart, growth: ChartNoAxesCombined, leaf: Leaf, medal: Medal };
const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none focus:border-[#C5A880]';

export default function CareersValues({ settings, values }: { settings: { translations: { en: Copy; ar: Copy } }; values: Value[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const [language, setLanguage] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');
    const form = useForm<{ sections: { values: { translations: { en: Copy; ar: Copy } } } }>({ sections: { values: { translations: settings.translations } } });
    const copy = form.data.sections.values.translations[language];
    const update = (key: keyof Copy, value: string) => form.setData('sections', { values: { translations: { ...form.data.sections.values.translations, [language]: { ...copy, [key]: value } } } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.put('/admin/pages/careers/values', { preserveScroll: true }); };

    return (
        <AdminLayout>
            <Head title="Careers / Why LARZ" />
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4"><div><Breadcrumbs items={['Dashboard', 'Website Pages', 'Careers Page', 'Why LARZ']} /><h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Why LARZ</h1><p className="mt-1 text-sm text-white/50">Manage the section copy and four value cards shown on the careers page.</p></div><Link href="/admin/pages/careers/values/create" className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black">Add value</Link></div>
                <Notification message={flash?.success} />
                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl"><div className="flex gap-2 border-b border-white/10 pb-4"><button type="button" onClick={() => setLanguage('en')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase ${language === 'en' ? 'bg-[#C5A880] text-black' : 'border border-white/15 text-white/60'}`}>English</button><button type="button" onClick={() => setLanguage('ar')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'border border-white/15 text-white/60'}`}>Arabic</button></div><div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 md:grid-cols-2"><FormField label="Eyebrow"><input value={copy.eyebrow} onChange={(event) => update('eyebrow', event.target.value)} className={inputClass} /></FormField><FormField label="Heading"><textarea rows={3} value={copy.heading} onChange={(event) => update('heading', event.target.value)} className={inputClass} /></FormField><div className="md:col-span-2"><FormField label="Description"><textarea rows={3} value={copy.description} onChange={(event) => update('description', event.target.value)} className={inputClass} /></FormField></div></div><button disabled={form.processing} className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Save section settings</button></form>
                <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl"><div className="flex items-center justify-between border-b border-white/10 pb-4"><div><h2 className="text-lg font-bold text-white">Value cards</h2><p className="mt-1 text-xs text-white/45">These cards appear in the public Why LARZ section.</p></div><span className="text-xs text-white/45">{values.length} records</span></div>{values.length === 0 ? <EmptyState title="No values yet" message="Add the first Why LARZ value card." /> : <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{values.map((value) => { const Icon = iconMap[value.icon_key as keyof typeof iconMap] ?? Heart; return <article key={value.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5"><div className="grid size-12 place-items-center rounded-full border border-white/30 text-white/70"><Icon className="size-5" /></div><h3 className="mt-5 text-lg text-white">{value.title}</h3><p className="mt-3 line-clamp-3 text-sm text-white/55">{value.description}</p><div className="mt-5 flex flex-wrap items-center gap-2"><StatusBadge status={value.is_published ? 'Published' : 'Draft'} /><Link href={`/admin/pages/careers/values/${value.id}/edit`} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75">Edit</Link><button type="button" onClick={() => router.post(`/admin/pages/careers/values/${value.id}/publish`)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75">{value.is_published ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => { if (window.confirm('Delete this value?')) router.delete(`/admin/pages/careers/values/${value.id}`); }} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs text-rose-300">Delete</button></div></article>; })}</div>}</section>
            </div>
        </AdminLayout>
    );
}

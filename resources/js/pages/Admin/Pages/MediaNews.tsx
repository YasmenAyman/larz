import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Copy = { eyebrow: string; heading: string; description: string };
type Post = { id: number; title: string; slug: string; excerpt: string | null; published: boolean; date: string | null; image: string | null };

export default function MediaNews({ settings, posts }: { settings: Copy & { translations?: { en?: Copy; ar?: Copy } }; posts: { data: Post[]; current_page: number; last_page: number } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const isArabic = locale === 'ar';
    const [language, setLanguage] = useState<'en' | 'ar'>(isArabic ? 'ar' : 'en');
    const defaults: Copy = { eyebrow: '', heading: '', description: '' };
    const savedEn = settings.translations?.en ?? settings;
    const savedAr = settings.translations?.ar ?? defaults;
    const form = useForm<{ sections: { news: { translations: { en: Copy; ar: Copy } } } }>({
        sections: { news: { translations: { en: { eyebrow: savedEn.eyebrow ?? '', heading: savedEn.heading ?? '', description: savedEn.description ?? '' }, ar: { eyebrow: savedAr.eyebrow ?? '', heading: savedAr.heading ?? '', description: savedAr.description ?? '' } } } },
    });
    const copy = form.data.sections.news.translations[language];
    const update = (key: keyof Copy, value: string) => form.setData('sections', { news: { translations: { ...form.data.sections.news.translations, [language]: { ...copy, [key]: value } } } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.put('/admin/pages/media/news', { preserveScroll: true }); };
    const remove = (post: Post) => { if (window.confirm(`Delete "${post.title}"?`)) router.delete(`/admin/pages/media/news/${post.id}`, { preserveScroll: true }); };
    const toggle = (post: Post) => router.post(`/admin/pages/media/news/${post.id}/publish`, {}, { preserveScroll: true });
    const text = (en: string, ar: string) => isArabic ? ar : en;

    return (
        <AdminLayout>
            <Head title={text('Media News', '\u0623\u062e\u0628\u0627\u0631 \u0627\u0644\u0625\u0639\u0644\u0627\u0645')} />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Breadcrumbs items={['Dashboard', 'Website Pages', 'Media Page', 'News']} />
                        <h1 className="mt-3 text-3xl font-semibold">{text('News & press', '\u0627\u0644\u0623\u062e\u0628\u0627\u0631 \u0648\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0635\u062d\u0641\u064a\u0629')}</h1>
                        <p className="mt-2 text-sm text-slate-400">{text('Manage the news section and all press posts from one place.', '\u0625\u062f\u0627\u0631\u0629 \u0642\u0633\u0645 \u0627\u0644\u0623\u062e\u0628\u0627\u0631 \u0648\u062c\u0645\u064a\u0639 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0635\u062d\u0641\u064a\u0629 \u0645\u0646 \u0645\u0643\u0627\u0646 \u0648\u0627\u062d\u062f.')}</p>
                    </div>
                    <Link href="/admin/pages/media/news/create" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">{text('Add news', '\u0625\u0636\u0627\u0641\u0629 \u062e\u0628\u0631')}</Link>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6">
                    <div className="flex gap-2 border-b border-slate-800 pb-3">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 md:grid-cols-2">
                        <FormField label="Eyebrow"><input value={copy.eyebrow} onChange={(event) => update('eyebrow', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Heading"><input value={copy.heading} onChange={(event) => update('heading', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Description"><textarea rows={3} value={copy.description} onChange={(event) => update('description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                    </div>
                    <button disabled={form.processing} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{form.processing ? text('Saving...', '\u062c\u0627\u0631\u064d \u0627\u0644\u062d\u0641\u0638...') : text('Save section', '\u062d\u0641\u0638 \u0627\u0644\u0642\u0633\u0645')}</button>
                </form>

                <section className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    {posts.data.length === 0 ? <EmptyState title={text('No news posts', '\u0644\u0627 \u062a\u0648\u062c\u062f \u0623\u062e\u0628\u0627\u0631 \u0628\u0639\u062f')} message={text('Add the first press post.', '\u0623\u0636\u0641 \u0623\u0648\u0644 \u062e\u0628\u0631 \u0622\u0646.')} /> : (
                        <table dir={isArabic ? 'rtl' : 'ltr'} className="min-w-[720px] w-full table-fixed text-sm">
                            <colgroup><col className="w-[46%]" /><col className="w-[16%]" /><col className="w-[16%]" /><col className="w-[22%]" /></colgroup>
                            <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-start">{text('News', '\u0627\u0644\u062e\u0628\u0631')}</th>
                                    <th scope="col" className="px-4 py-3 text-center">{text('Date', '\u0627\u0644\u062a\u0627\u0631\u064a\u062e')}</th>
                                    <th scope="col" className="px-4 py-3 text-center">{text('Status', '\u0627\u0644\u062d\u0627\u0644\u0629')}</th>
                                    <th scope="col" className="px-4 py-3 text-center">{text('Actions', '\u0627\u0644\u0625\u062c\u0631\u0627\u0621\u0627\u062a')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.data.map((post) => (
                                    <tr key={post.id} className="border-b border-slate-800/70">
                                        <td className="px-4 py-4 align-middle"><div className="flex items-center gap-3">{post.image && <img src={post.image} alt={post.title} className="h-12 w-16 shrink-0 rounded object-cover" />}<div className="min-w-0"><p className="truncate font-medium text-white">{post.title}</p><p className="truncate text-xs text-slate-500">{post.excerpt}</p></div></div></td>
                                        <td className="px-4 py-4 text-center align-middle text-slate-400">{post.date ?? '—'}</td>
                                        <td className="px-4 py-4 text-center align-middle"><button type="button" onClick={() => toggle(post)}><StatusBadge status={post.published ? text('Published', '\u0645\u0646\u0634\u0648\u0631') : text('Draft', '\u0645\u0633\u0648\u062f\u0629')} /></button></td>
                                        <td className="px-4 py-4 text-center align-middle"><div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1"><Link href={`/admin/pages/media/news/${post.id}/edit`} className="text-emerald-400">{text('Edit', '\u062a\u0639\u062f\u064a\u0644')}</Link><a href={`/media/${post.slug}`} target="_blank" rel="noreferrer" className="text-slate-300">{text('View', '\u0639\u0631\u0636')}</a><button type="button" onClick={() => remove(post)} className="text-rose-400">{text('Delete', '\u062d\u0630\u0641')}</button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}

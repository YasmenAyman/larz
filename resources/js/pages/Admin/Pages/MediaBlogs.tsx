import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Copy = { eyebrow: string; heading: string; description: string };
type Post = { id: number; title: string; slug: string; excerpt: string | null; published: boolean; date: string | null; image: string | null };

export default function MediaBlogs({ settings, posts }: { settings: Copy & { translations?: { en?: Copy; ar?: Copy } }; posts: { data: Post[]; current_page: number; last_page: number } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const isArabic = locale === 'ar';
    const [language, setLanguage] = useState<'en' | 'ar'>(isArabic ? 'ar' : 'en');
    const defaults: Copy = { eyebrow: '', heading: '', description: '' };
    const savedEn = settings.translations?.en ?? settings;
    const savedAr = settings.translations?.ar ?? defaults;
    const form = useForm<{ sections: { stories: { translations: { en: Copy; ar: Copy } } } }>({
        sections: { stories: { translations: { en: { eyebrow: savedEn.eyebrow ?? '', heading: savedEn.heading ?? '', description: savedEn.description ?? '' }, ar: { eyebrow: savedAr.eyebrow ?? '', heading: savedAr.heading ?? '', description: savedAr.description ?? '' } } } },
    });
    const copy = form.data.sections.stories.translations[language];
    const update = (key: keyof Copy, value: string) => form.setData('sections', { stories: { translations: { ...form.data.sections.stories.translations, [language]: { ...copy, [key]: value } } } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.put('/admin/pages/media/stories', { preserveScroll: true }); };
    const remove = (post: Post) => { if (window.confirm(`Delete "${post.title}"?`)) router.delete(`/admin/pages/media/stories/${post.id}`, { preserveScroll: true }); };
    const toggle = (post: Post) => router.post(`/admin/pages/media/stories/${post.id}/publish`, {}, { preserveScroll: true });

    return (
        <AdminLayout>
            <Head title="Blogs" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div><Breadcrumbs items={['Dashboard', 'Website Pages', 'Media Page', 'Blogs']} /><h1 className="mt-3 text-3xl font-semibold">Blogs</h1><p className="mt-2 text-sm text-slate-400">Manage the blog section and all blog posts from one place.</p></div>
                    <Link href="/admin/pages/media/stories/create" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Add blog</Link>
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
                    <button disabled={form.processing} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{form.processing ? 'Saving...' : 'Save section'}</button>
                </form>
                <section className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    {posts.data.length === 0 ? <EmptyState title="No blog posts" message="Add the first blog post." /> : (
                        <table dir={isArabic ? 'rtl' : 'ltr'} className="min-w-[720px] w-full table-fixed text-sm">
                            <colgroup><col className="w-[46%]" /><col className="w-[16%]" /><col className="w-[16%]" /><col className="w-[22%]" /></colgroup>
                            <thead className="border-b border-slate-800 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3 text-start">Blog</th><th className="px-4 py-3 text-center">Date</th><th className="px-4 py-3 text-center">{isArabic ? '\u0627\u0644\u062d\u0627\u0644\u0629' : 'Status'}</th><th className="px-4 py-3 text-center">Actions</th></tr></thead>
                            <tbody>{posts.data.map((post) => <tr key={post.id} className="border-b border-slate-800/70"><td className="px-4 py-4 align-middle"><div className="flex items-center gap-3">{post.image && <img src={post.image} alt={post.title} className="h-12 w-16 shrink-0 rounded object-cover" />}<div className="min-w-0"><p className="truncate font-medium text-white">{post.title}</p><p className="truncate text-xs text-slate-500">{post.excerpt}</p></div></div></td><td className="px-4 py-4 text-center align-middle text-slate-400">{post.date ?? '—'}</td><td className="px-4 py-4 text-center align-middle"><button type="button" onClick={() => toggle(post)}><StatusBadge status={post.published ? 'Published' : 'Draft'} /></button></td><td className="px-4 py-4 text-center align-middle"><div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1"><Link href={`/admin/pages/media/stories/${post.id}/edit`} className="text-emerald-400">Edit</Link><a href={`/media/${post.slug}`} target="_blank" rel="noreferrer" className="text-slate-300">View</a><button type="button" onClick={() => remove(post)} className="text-rose-400">Delete</button></div></td></tr>)}</tbody>
                        </table>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}

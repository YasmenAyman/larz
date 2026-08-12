import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Copy = { title: string; excerpt: string; content: string };
type Post = { id?: number; type?: string; title: string; slug: string; excerpt: string; content: string; event_date: string; published_at: string; is_featured: boolean; is_published: boolean; sort_order: number; seo_title: string; seo_description: string; featured_image?: string | null; open_graph_image?: string | null; translations?: { en?: Partial<Copy>; ar?: Partial<Copy> } };

export default function MediaNewsForm({ post, kind = 'news' }: { post: Post | null; kind?: 'news' | 'blog' }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const isArabic = locale === 'ar';
    const [language, setLanguage] = useState<'en' | 'ar'>(isArabic ? 'ar' : 'en');
    const path = kind === 'blog' ? 'stories' : 'news';
    const type = kind === 'blog' ? 'blog' : 'press';
    const form = useForm<Post>({ type, title: post?.title ?? '', slug: post?.slug ?? '', excerpt: post?.excerpt ?? '', content: post?.content ?? '', event_date: post?.event_date ?? '', published_at: post?.published_at ?? '', is_featured: post?.is_featured ?? false, is_published: post?.is_published ?? true, sort_order: post?.sort_order ?? 0, seo_title: post?.seo_title ?? '', seo_description: post?.seo_description ?? '', featured_image: null, open_graph_image: null, translations: { en: post?.translations?.en ?? {}, ar: post?.translations?.ar ?? {} } });
    const copy = form.data.translations?.[language] ?? {};
    const update = (key: keyof Copy, value: string) => form.setData('translations', { ...form.data.translations, [language]: { ...copy, [key]: value } });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.transform((payload) => {
            const english = payload.translations?.en ?? {};
            const arabic = payload.translations?.ar ?? {};
            const primary = english.title?.trim() ? english : arabic;

            return {
                ...payload,
                type,
                title: primary.title ?? payload.title,
                excerpt: primary.excerpt ?? payload.excerpt,
                content: primary.content ?? payload.content,
                _method: post?.id ? 'put' : undefined,
            };
        });
        post?.id ? form.post(`/admin/pages/media/${path}/${post.id}`, { forceFormData: true }) : form.post(`/admin/pages/media/${path}`, { forceFormData: true });
    };
    const imageChange = (event: React.ChangeEvent<HTMLInputElement>, key: 'featured_image' | 'open_graph_image') => form.setData(key, event.target.files?.[0] as never);
    const text = (en: string, ar: string) => isArabic ? ar : en;
    const pageTitle = post ? text('Edit news', '\u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u062e\u0628\u0631') : text('Add news', '\u0625\u0636\u0627\u0641\u0629 \u062e\u0628\u0631');

    return (
        <AdminLayout>
            <Head title={pageTitle} />
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <Breadcrumbs items={isArabic ? ['\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645', '\u0635\u0641\u062d\u0627\u062a \u0627\u0644\u0645\u0648\u0642\u0639', '\u0635\u0641\u062d\u0629 \u0627\u0644\u0625\u0639\u0644\u0627\u0645', '\u0627\u0644\u0623\u062e\u0628\u0627\u0631', post ? '\u062a\u0639\u062f\u064a\u0644' : '\u0625\u0636\u0627\u0641\u0629'] : ['Dashboard', 'Website Pages', 'Media Page', 'News', post ? 'Edit' : 'Add']} />
                <h1 className="text-3xl font-semibold">{pageTitle}</h1>
                <Notification message={flash?.success} />
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-6 rounded-xl border border-slate-800 bg-slate-950 p-6">
                    <div className="flex gap-2 border-b border-slate-800 pb-3">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="space-y-5">
                        <FormField label={text('Title', '\u0627\u0644\u0639\u0646\u0648\u0627\u0646')}><input value={copy.title ?? ''} onChange={(event) => update('title', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label={text('Excerpt', '\u0645\u0644\u062e\u0635')}><textarea rows={3} value={copy.excerpt ?? ''} onChange={(event) => update('excerpt', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label={text('Content', '\u0627\u0644\u0645\u062d\u062a\u0648\u0649')}><textarea rows={10} value={copy.content ?? ''} onChange={(event) => update('content', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                    </div>
                    <FormField label={text('Slug', '\u0627\u0644\u0645\u0639\u0631\u0641')}><input value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField label={text('Event date', '\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u062d\u062f\u062b')}><input type="date" value={form.data.event_date} onChange={(event) => form.setData('event_date', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label={text('Sort order', '\u062a\u0631\u062a\u064a\u0628 \u0627\u0644\u0639\u0631\u0636')}><input type="number" value={form.data.sort_order} onChange={(event) => form.setData('sort_order', Number(event.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField label={text('Featured image', '\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629')}><input type="file" accept="image/*" onChange={(event) => imageChange(event, 'featured_image')} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" />{post?.featured_image && <img src={post.featured_image} alt={text('Current featured image', '\u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 \u0627\u0644\u062d\u0627\u0644\u064a\u0629')} className="mt-3 h-24 w-full rounded object-cover" />}</FormField>
                        <FormField label={text('Open graph image', '\u0635\u0648\u0631\u0629 \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0631\u0648\u0627\u0628\u0637')}><input type="file" accept="image/*" onChange={(event) => imageChange(event, 'open_graph_image')} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                    </div>
                    <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_published} onChange={(event) => form.setData('is_published', event.target.checked)} /> {text('Published', '\u0645\u0646\u0634\u0648\u0631')}</label>
                    <div className="flex justify-end gap-3">
                        <Link href={`/admin/pages/media/${path}`} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">{text('Cancel', '\u0625\u0644\u063a\u0627\u0621')}</Link>
                        <button disabled={form.processing} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50">{form.processing ? text('Saving...', '\u062c\u0627\u0631\u064d \u0627\u0644\u062d\u0641\u0638...') : post ? text('Save changes', '\u062d\u0641\u0638 \u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a') : text('Save news', '\u062d\u0641\u0638 \u0627\u0644\u062e\u0628\u0631')}</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

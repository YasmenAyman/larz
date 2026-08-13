import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

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
    translations?: { en?: Partial<SeoCopy>; ar?: Partial<SeoCopy> };
};

type SeoCopy = {
    seo_title: string;
    meta_description: string;
    og_title: string;
    og_description: string;
};

type SeoForm = {
    translations: { en: SeoCopy; ar: SeoCopy };
    canonical_url: string;
    og_image: File | null;
    indexable: boolean;
    followable: boolean;
};

export default function Index({ entries }: { entries: Entry[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale, t } = useI18n();
    const tr = (value: string) => locale === 'ar' ? ({
        'SEO Metadata': 'بيانات تحسين محركات البحث', 'SEO metadata': 'بيانات تحسين محركات البحث', SEO: 'تحسين محركات البحث',
        'Projects listing': 'قائمة المشروعات', 'Media page': 'صفحة الإعلام', Project: 'المشروع', Media: 'الإعلام',
        'Edit page titles, descriptions, sharing data, canonical URLs and crawl directives.': 'تحرير عناوين الصفحات والأوصاف وبيانات المشاركة والروابط الأساسية وتوجيهات الزحف.', Dashboard: 'لوحة التحكم',
    } as Record<string, string>)[value] ?? t(value) : value;

    return (
        <AdminLayout>
            <Head title={tr('SEO Metadata')} />
            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div><Breadcrumbs items={['Dashboard', 'SEO'].map(tr)} /><h1 className="mt-3 text-3xl font-semibold">{tr('SEO metadata')}</h1><p className="mt-2 text-sm text-slate-400">{tr('Edit page titles, descriptions, sharing data, canonical URLs and crawl directives.')}</p></div>
                <Notification message={flash?.success} />
                <div className="space-y-5">{entries.map((entry) => <SeoEntry key={entry.target} entry={entry} />)}</div>
            </div>
        </AdminLayout>
    );
}

function SeoEntry({ entry }: { entry: Entry }) {
    const { locale, t } = useI18n();
    const [language, setLanguage] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');
    const tr = (value: string) => locale === 'ar' ? ({
        'SEO title': 'عنوان SEO', 'Canonical URL': 'الرابط الأساسي', 'Meta description': 'وصف SEO', 'Open Graph title': 'عنوان Open Graph',
        'Open Graph description': 'وصف Open Graph', 'Open Graph image': 'صورة Open Graph', 'Current Open Graph image': 'صورة Open Graph الحالية',
        'Allow indexing': 'السماح بالفهرسة', 'Allow link following': 'السماح بتتبع الروابط', 'Save SEO metadata': 'حفظ بيانات SEO',
        English: 'الإنجليزية', Arabic: 'العربية', 'Shared technical settings': 'إعدادات تقنية مشتركة',
    } as Record<string, string>)[value] ?? t(value) : value;
    const labelAr: Record<string, string> = { Home: 'الرئيسية', 'About Us': 'من نحن', 'Projects listing': 'قائمة المشروعات', 'Media page': 'صفحة الإعلام', Careers: 'الوظائف', 'Contact Us': 'تواصل معنا' };
    const label = entry.label;
    const dynamicLabel = label.startsWith('Project: ') ? `المشروع: ${label.slice(9)}` : label.startsWith('Media: ') ? `الإعلام: ${label.slice(7)}` : label;
    const translatedEntry = locale === 'ar' ? labelAr[label] ?? dynamicLabel : label;
    const emptyCopy: SeoCopy = { seo_title: '', meta_description: '', og_title: '', og_description: '' };
    const { data, setData, post, transform, processing, errors } = useForm<SeoForm>({
        translations: {
            en: { ...emptyCopy, seo_title: entry.translations?.en?.seo_title ?? entry.seo_title ?? '', meta_description: entry.translations?.en?.meta_description ?? entry.meta_description ?? '', og_title: entry.translations?.en?.og_title ?? entry.og_title ?? '', og_description: entry.translations?.en?.og_description ?? entry.og_description ?? '' },
            ar: { ...emptyCopy, ...entry.translations?.ar },
        },
        canonical_url: entry.canonical_url ?? '',
        og_image: null,
        indexable: entry.indexable,
        followable: entry.followable,
    });

    const copy = data.translations[language];
    const updateCopy = (field: keyof SeoCopy, value: string) => setData('translations', { ...data.translations, [language]: { ...copy, [field]: value } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); transform((payload) => ({ ...payload, ...payload.translations.en, _method: 'put' })); post(`/admin/seo/${entry.target}`, { forceFormData: true, preserveScroll: true }); };

    return (
        <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2"><div><h2 className="text-lg font-semibold">{translatedEntry}</h2><p className="mt-1 text-xs text-slate-500">{entry.path}</p></div><span className="text-xs text-slate-600">{entry.target}</span></div>
            <div className="flex gap-2 border-b border-slate-800 pb-3">
                <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>{tr('English')}</button>
                <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>{tr('Arabic')}</button>
            </div>
            <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 md:grid-cols-2">
                <FormField label={tr('SEO title')} error={errors[`translations.${language}.seo_title`]}><input value={copy.seo_title} onChange={(event) => updateCopy('seo_title', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                <FormField label={tr('Meta description')} error={errors[`translations.${language}.meta_description`]}><textarea rows={3} value={copy.meta_description} onChange={(event) => updateCopy('meta_description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                <FormField label={tr('Open Graph title')} error={errors[`translations.${language}.og_title`]}><input value={copy.og_title} onChange={(event) => updateCopy('og_title', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                <FormField label={tr('Open Graph description')} error={errors[`translations.${language}.og_description`]}><textarea rows={3} value={copy.og_description} onChange={(event) => updateCopy('og_description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
            </div>
            <div className="space-y-5 border-t border-slate-800 pt-5">
                <h3 className="text-sm font-medium text-slate-300">{tr('Shared technical settings')}</h3>
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField label={tr('Canonical URL')} error={errors.canonical_url}><input type="url" value={data.canonical_url} onChange={(event) => setData('canonical_url', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /></FormField>
                    <FormField label={tr('Open Graph image')} error={errors.og_image}><input type="file" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={(event) => setData('og_image', event.target.files?.[0] ?? null)} className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-400 file:mr-3 file:border-0 file:bg-transparent file:text-slate-200" />{entry.og_image && <img src={entry.og_image} alt={tr('Current Open Graph image')} className="mt-3 h-20 w-32 object-cover" />}</FormField>
                </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-300"><label className="flex items-center gap-2"><input type="checkbox" checked={data.indexable} onChange={(event) => setData('indexable', event.target.checked)} /> {tr('Allow indexing')}</label><label className="flex items-center gap-2"><input type="checkbox" checked={data.followable} onChange={(event) => setData('followable', event.target.checked)} /> {tr('Allow link following')}</label></div>
            <button disabled={processing} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{tr('Save SEO metadata')}</button>
        </form>
    );
}

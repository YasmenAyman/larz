import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Copy = { eyebrow: string; heading: string; primary_cta_label: string; primary_cta_url: string; secondary_cta_label: string; secondary_cta_url: string };

export default function PromiseCta({ settings, status, updated_at }: { settings: Copy & { translations?: { en?: Copy; ar?: Copy } }; status: string; updated_at: string | null }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const isArabic = locale === 'ar';
    const label = (english: string, arabic: string) => isArabic ? arabic : english;
    const [language, setLanguage] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');
    const defaults: Copy = { eyebrow: '', heading: '', primary_cta_label: '', primary_cta_url: '', secondary_cta_label: '', secondary_cta_url: '' };
    const savedEn = settings.translations?.en ?? settings;
    const savedAr = settings.translations?.ar ?? defaults;
    const form = useForm<{ sections: { promise: { translations: { en: Copy; ar: Copy } } } }>({ sections: { promise: { translations: { en: { eyebrow: savedEn.eyebrow ?? '', heading: savedEn.heading ?? '', primary_cta_label: savedEn.primary_cta_label ?? '', primary_cta_url: savedEn.primary_cta_url ?? '', secondary_cta_label: savedEn.secondary_cta_label ?? '', secondary_cta_url: savedEn.secondary_cta_url ?? '' }, ar: { eyebrow: savedAr.eyebrow ?? '', heading: savedAr.heading ?? '', primary_cta_label: savedAr.primary_cta_label ?? '', primary_cta_url: savedAr.primary_cta_url ?? '', secondary_cta_label: savedAr.secondary_cta_label ?? '', secondary_cta_url: savedAr.secondary_cta_url ?? '' } } } } });
    const copy = form.data.sections.promise.translations[language];
    const update = (key: keyof Copy, value: string) => form.setData('sections', { promise: { translations: { ...form.data.sections.promise.translations, [language]: { ...copy, [key]: value } } } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.put('/admin/pages/about/promise-cta', { preserveScroll: true }); };

    return (
        <AdminLayout>
            <Head title={label('About Page / Promise CTA', 'صفحة من نحن / الدعوة الختامية')} />
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={isArabic ? ['لوحة التحكم', 'صفحات الموقع', 'من نحن', 'الدعوة الختامية'] : ['Dashboard', 'Website Pages', 'About Us', 'Promise CTA']} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{label('Promise CTA', 'الدعوة الختامية')}</h1>
                    <p className="mt-1 text-sm text-white/50">{label('Edit both language versions of the closing About page CTA.', 'تعديل نسختَي العربية والإنجليزية للدعوة الختامية في صفحة من نحن.')}</p>
                </div>
                <Notification message={flash?.success} />
                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">{label('Section copy', 'محتوى القسم')}</h2>
                            <p className="mt-1 text-xs text-white/45">{label('Last update:', 'آخر تحديث:')} {updated_at ?? label('never', 'لم يتم التحديث')}</p>
                        </div>
                        <StatusBadge status={status === 'published' ? label('Dynamic', 'ديناميكي') : status} />
                    </div>
                    <div className="flex gap-2 border-b border-white/10 pb-3">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>{label('English', 'الإنجليزية')}</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>{label('Arabic', 'العربية')}</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 md:grid-cols-2">
                        <FormField label={label('Eyebrow', 'العنوان التمهيدي')}><input value={copy.eyebrow} onChange={(event) => update('eyebrow', event.target.value)} className={inputClass} /></FormField>
                        <div className="md:col-span-2"><FormField label={label('Heading', 'العنوان')}><textarea rows={3} value={copy.heading} onChange={(event) => update('heading', event.target.value)} className={inputClass} /></FormField></div>
                        <FormField label={label('Primary CTA label', 'نص الزر الأساسي')}><input value={copy.primary_cta_label} onChange={(event) => update('primary_cta_label', event.target.value)} className={inputClass} /></FormField>
                        <FormField label={label('Primary CTA URL', 'رابط الزر الأساسي')}><input value={copy.primary_cta_url} onChange={(event) => update('primary_cta_url', event.target.value)} className={inputClass} /></FormField>
                        <FormField label={label('Secondary CTA label', 'نص الزر الثانوي')}><input value={copy.secondary_cta_label} onChange={(event) => update('secondary_cta_label', event.target.value)} className={inputClass} /></FormField>
                        <FormField label={label('Secondary CTA URL', 'رابط الزر الثانوي')}><input value={copy.secondary_cta_url} onChange={(event) => update('secondary_cta_url', event.target.value)} className={inputClass} /></FormField>
                    </div>
                    <div className="flex items-center justify-end border-t border-white/10 pt-5"><button disabled={form.processing} className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-6 py-3 text-sm font-semibold text-black disabled:opacity-50">{form.processing ? label('Saving...', 'جارٍ الحفظ...') : label('Save promise CTA', 'حفظ الدعوة الختامية')}</button></div>
                </form>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 placeholder:text-white/30';

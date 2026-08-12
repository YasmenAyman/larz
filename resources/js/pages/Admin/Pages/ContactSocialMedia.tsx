import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Copy = { eyebrow: string; heading: string };

export default function ContactSocialMedia({ settings, status, updated_at }: { settings: Copy & { translations?: { en?: Copy; ar?: Copy } }; status: string; updated_at: string | null }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const [language, setLanguage] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');
    const defaults: Copy = { eyebrow: '', heading: '' };
    const savedEn = settings.translations?.en ?? settings;
    const savedAr = settings.translations?.ar ?? defaults;
    const form = useForm<{ sections: { social_media: { translations: { en: Copy; ar: Copy } } } }>({ sections: { social_media: { translations: { en: { eyebrow: savedEn.eyebrow ?? '', heading: savedEn.heading ?? '' }, ar: { eyebrow: savedAr.eyebrow ?? '', heading: savedAr.heading ?? '' } } } } });
    const copy = form.data.sections.social_media.translations[language];
    const update = (key: keyof Copy, value: string) => form.setData('sections', { social_media: { translations: { ...form.data.sections.social_media.translations, [language]: { ...copy, [key]: value } } } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.put('/admin/pages/contact/social-media', { preserveScroll: true }); };

    return (
        <AdminLayout>
            <Head title="Contact Page / Social Media" />
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'Contact Page', 'Social Media']} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Social media section</h1>
                    <p className="mt-1 text-sm text-white/50">Edit both language versions of the social media section headings.</p>
                    <p className="mt-1 text-xs text-white/35">{locale === 'ar' ? '\u064a\u062a\u0645 \u0625\u062f\u0627\u0631\u0629 \u0631\u0648\u0627\u0628\u0637 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0648\u0627\u0644\u0647\u0627\u062a\u0641 \u0648\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0641\u064a \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a.' : 'Social links, phone, and email are managed in admin/settings.'}</p>
                </div>
                <Notification message={flash?.success} />
                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Section copy</h2>
                            <p className="mt-1 text-xs text-white/45">{locale === 'ar' ? '\u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b: ' : 'Last update: '}{updated_at ?? (locale === 'ar' ? '\u0644\u0645 \u064a\u062a\u0645 \u0627\u0644\u062a\u062d\u062f\u064a\u062b' : 'never')}</p>
                        </div>
                        <StatusBadge status={status === 'published' ? 'Dynamic' : status} />
                    </div>
                    <div className="flex gap-2 border-b border-white/10 pb-3">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 md:grid-cols-2">
                        <FormField label="Eyebrow">
                            <input value={copy.eyebrow} onChange={(event) => update('eyebrow', event.target.value)} className={inputClass} />
                        </FormField>
                        <FormField label="Heading">
                            <input value={copy.heading} onChange={(event) => update('heading', event.target.value)} className={inputClass} />
                        </FormField>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={form.processing} className="rounded-xl bg-[#C5A880] px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#b09570] disabled:opacity-50">Save changes</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 placeholder:text-white/30';

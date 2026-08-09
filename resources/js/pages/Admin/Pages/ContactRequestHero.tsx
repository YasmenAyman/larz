import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';

type Copy = { eyebrow: string; heading: string; description: string };

export default function ContactRequestHero({ settings, status, updated_at }: { settings: Copy & { translations?: { en?: Copy; ar?: Copy } }; status: string; updated_at: string | null }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const [language, setLanguage] = useState<'en' | 'ar'>('en');
    const defaults: Copy = { eyebrow: '', heading: '', description: '' };
    const savedEn = settings.translations?.en ?? settings;
    const savedAr = settings.translations?.ar ?? defaults;
    const form = useForm<{ sections: { request_form: { translations: { en: Copy; ar: Copy } } } }>({ sections: { request_form: { translations: { en: { eyebrow: savedEn.eyebrow ?? '', heading: savedEn.heading ?? '', description: savedEn.description ?? '' }, ar: { eyebrow: savedAr.eyebrow ?? '', heading: savedAr.heading ?? '', description: savedAr.description ?? '' } } } } });
    const copy = form.data.sections.request_form.translations[language];
    const update = (key: keyof Copy, value: string) => form.setData('sections', { request_form: { translations: { ...form.data.sections.request_form.translations, [language]: { ...copy, [key]: value } } } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); form.put('/admin/pages/contact/request-form', { preserveScroll: true }); };

    return (
        <AdminLayout>
            <Head title="Contact Page / Request Form" />
            <div className="mx-auto max-w-5xl space-y-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'Contact Page', 'Request Form']} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Request form hero</h1>
                    <p className="mt-1 text-sm text-white/50">Edit both language versions of the request form introductory section.</p>
                </div>
                <Notification message={flash?.success} />
                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Section copy</h2>
                            <p className="mt-1 text-xs text-white/45">Last update: {updated_at ?? 'never'}</p>
                        </div>
                        <StatusBadge status={status === 'published' ? 'Dynamic' : status} />
                    </div>
                    <div className="flex gap-2 border-b border-white/10 pb-3">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5">
                        <FormField label="Eyebrow">
                            <input value={copy.eyebrow} onChange={(event) => update('eyebrow', event.target.value)} className={inputClass} />
                        </FormField>
                        <FormField label="Heading">
                            <textarea rows={2} value={copy.heading} onChange={(event) => update('heading', event.target.value)} className={inputClass} />
                        </FormField>
                        <FormField label="Description">
                            <textarea rows={4} value={copy.description} onChange={(event) => update('description', event.target.value)} className={inputClass} />
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

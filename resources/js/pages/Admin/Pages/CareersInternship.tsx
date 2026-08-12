import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification, ImageUploadField } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Copy = { eyebrow?: string; heading?: string; description?: string; cta_label?: string };

export default function CareersInternship({ translations, image }: { translations: { en?: Copy; ar?: Copy }; image: string | null }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const [language, setLanguage] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');
    const form = useForm<{ translations: { en: Copy; ar: Copy }; image: File | null }>({
        translations: { en: translations.en ?? {}, ar: translations.ar ?? {} },
        image: null,
    });
    const copy = form.data.translations[language];
    const update = (key: keyof Copy, value: string) => form.setData('translations', { ...form.data.translations, [language]: { ...copy, [key]: value } });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.transform((payload) => ({ ...payload, _method: 'put' }));
        form.post('/admin/pages/careers/internship', { forceFormData: true, preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Careers Internship" />
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'Careers Page', 'Internship Section']} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Internship section</h1>
                    <p className="mt-1 text-sm text-white/50">Manage the bilingual copy and image for the internship programs section.</p>
                </div>
                <Notification message={flash?.success} />
                {Object.keys(form.errors).length > 0 && (
                    <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                        Please correct the highlighted fields and try again.
                    </div>
                )}
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                    <div className="flex gap-2 border-b border-white/10 pb-3">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                    </div>
                    <section dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl md:grid-cols-2">
                        <FormField label="Eyebrow" error={form.errors[`translations.${language}.eyebrow`]}><input value={copy.eyebrow ?? ''} onChange={(event) => update('eyebrow', event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white" /></FormField>
                        <FormField label="CTA label" error={form.errors[`translations.${language}.cta_label`]}><input value={copy.cta_label ?? ''} onChange={(event) => update('cta_label', event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white" /></FormField>
                        <div className="md:col-span-2">
                            <FormField label="Heading" error={form.errors[`translations.${language}.heading`]}><textarea rows={3} value={copy.heading ?? ''} onChange={(event) => update('heading', event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white" /></FormField>
                        </div>
                        <div className="md:col-span-2">
                            <FormField label="Description" error={form.errors[`translations.${language}.description`]}><textarea rows={5} value={copy.description ?? ''} onChange={(event) => update('description', event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white" /></FormField>
                        </div>
                    </section>
                    <section className="space-y-4 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white">Section image</h2>
                                <p className="mt-1 text-xs text-white/45">Upload an image to display alongside the internship section.</p>
                            </div>
                        </div>
                        {image && <img src={image} alt="Current internship section image" className="h-48 w-full rounded-xl border border-white/10 object-cover" />}
                        <ImageUploadField label="Upload new image" onChange={(file) => form.setData('image', Array.isArray(file) ? file[0] ?? null : file)} />
                    </section>
                    <div className="flex justify-end">
                        <button disabled={form.processing} className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">Save internship section</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

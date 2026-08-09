import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type Copy = { eyebrow?: string; heading?: string; description?: string; cta_label?: string; cta_url?: string };

export default function ContactLocationMap({ translations, image, address }: { translations: { en?: Copy; ar?: Copy }; image: string | null; address: string }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const [language, setLanguage] = useState<'en' | 'ar'>('en');
    const form = useForm<{ translations: { en: Copy; ar: Copy }; image: File | null; address: string }>({
        translations: { en: translations.en ?? {}, ar: translations.ar ?? {} },
        image: null,
        address,
    });
    const copy = form.data.translations[language];
    const update = (key: keyof Copy, value: string) => form.setData('translations', { ...form.data.translations, [language]: { ...copy, [key]: value } });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.transform((payload) => ({ ...payload, _method: 'put' }));
        form.post('/admin/pages/contact/location-map', { forceFormData: true, preserveScroll: true });
    };

    const [preview, setPreview] = useState<string | null>(image);
    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        form.setData('image', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout>
            <Head title="Contact Page / Location & Map" />
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'Contact Page', 'Location & Map']} />
                    <h1 className="mt-3 text-3xl font-semibold">Location & map</h1>
                    <p className="mt-2 text-sm text-slate-400">Manage the location section copy, image, and address.</p>
                </div>
                <Notification message={flash?.success} />
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                    <div className="flex gap-2 border-b border-slate-800 pb-3">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-gold text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-gold text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                    </div>

                    <section dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 rounded-xl border border-slate-800 bg-slate-950 p-6 md:grid-cols-2">
                        <FormField label="Eyebrow">
                            <input value={copy.eyebrow ?? ''} onChange={(event) => update('eyebrow', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
                        </FormField>
                        <FormField label="Heading">
                            <input value={copy.heading ?? ''} onChange={(event) => update('heading', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
                        </FormField>
                        <div className="md:col-span-2">
                            <FormField label="Description">
                                <textarea rows={3} value={copy.description ?? ''} onChange={(event) => update('description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
                            </FormField>
                        </div>
                        <FormField label="CTA label">
                            <input value={copy.cta_label ?? ''} onChange={(event) => update('cta_label', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
                        </FormField>
                        <FormField label="CTA URL">
                            <input value={copy.cta_url ?? ''} onChange={(event) => update('cta_url', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
                        </FormField>
                    </section>

                    <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Address</h2>
                        <FormField label="Address (from admin/settings)">
                            <input value={form.data.address} onChange={(event) => form.setData('address', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" placeholder="e.g. Kov mall, Beside Mivida gate 6, New Cairo" />
                        </FormField>
                    </section>

                    <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Image</h2>
                        <FormField label="Location image">
                            <input type="file" accept="image/*" onChange={onFileChange} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-black" />
                        </FormField>
                        {preview && (
                            <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
                                <img src={preview} alt="Location preview" className="h-64 w-full object-cover" />
                            </div>
                        )}
                    </section>

                    <div className="flex justify-end">
                        <button type="submit" disabled={form.processing} className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold/90 disabled:opacity-50">Save changes</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

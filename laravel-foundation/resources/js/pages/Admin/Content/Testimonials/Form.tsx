import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type Testimonial = { id?: number; name: string; role: string; quote: string; sort_order: number; is_published: boolean; image?: string | null; translations?: { en?: { name?: string; role?: string; quote?: string }; ar?: { name?: string; role?: string; quote?: string } } };
type Locale = 'en' | 'ar';

const emptyTranslation = { name: '', role: '', quote: '' };

export default function Form({ testimonial }: { testimonial: Testimonial | null }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const [language, setLanguage] = useState<Locale>('en');
    const { data, setData, post, transform, processing, errors } = useForm({
        name: testimonial?.name ?? '',
        role: testimonial?.role ?? '',
        quote: testimonial?.quote ?? '',
        sort_order: testimonial?.sort_order ?? 0,
        is_published: testimonial?.is_published ?? true,
        image: null as File | null,
        translations: {
            en: {
                name: testimonial?.translations?.en?.name ?? testimonial?.name ?? '',
                role: testimonial?.translations?.en?.role ?? testimonial?.role ?? '',
                quote: testimonial?.translations?.en?.quote ?? testimonial?.quote ?? '',
            },
            ar: { ...emptyTranslation, ...(testimonial?.translations?.ar ?? {}) },
        },
    });
    const copy = data.translations[language] ?? emptyTranslation;
    const updateCopy = (key: keyof typeof emptyTranslation, value: string) => setData('translations', { ...data.translations, [language]: { ...copy, [key]: value } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); transform((payload) => ({ ...payload, _method: testimonial?.id ? 'put' : undefined })); const options = { forceFormData: true }; testimonial?.id ? post(`/admin/pages/home/testimonials/${testimonial.id}`, options) : post('/admin/pages/home/testimonials', options); };

    return (
        <AdminLayout>
            <Head title={testimonial ? 'Edit Testimonial' : 'Add Testimonial'} />
            <div className="mx-auto max-w-3xl space-y-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'Home Page', 'Testimonials', testimonial ? 'Edit' : 'Add']} />
                    <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{testimonial ? 'Edit testimonial' : 'Add testimonial'}</h1>
                </div>
                <Notification message={flash?.success} />
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex gap-2 border-b border-white/10 pb-4">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'en' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'ar' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>العربية / Arabic</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 sm:grid-cols-2">
                        <FormField label="Name" error={errors[`translations.${language}.name`]}>
                            <input value={copy.name ?? ''} onChange={(event) => updateCopy('name', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'الاسم بالعربية' : 'English name'} />
                        </FormField>
                        <FormField label="Role" error={errors[`translations.${language}.role`]}>
                            <input value={copy.role ?? ''} onChange={(event) => updateCopy('role', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'الدور بالعربية' : 'English role'} />
                        </FormField>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <FormField label="Quote" error={errors[`translations.${language}.quote`]}>
                            <textarea rows={7} value={copy.quote ?? ''} onChange={(event) => updateCopy('quote', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'الاقتباس بالعربية' : 'English quote'} />
                        </FormField>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField label="Sort order" error={errors.sort_order}>
                            <input type="number" min="0" value={data.sort_order} onChange={(event) => setData('sort_order', Number(event.target.value))} className={inputClass} />
                        </FormField>
                        <FormField label="Profile image" error={errors.image}>
                            <input type="file" accept="image/*" onChange={(event) => setData('image', event.target.files?.[0] ?? null)} className={fileClass} />
                            {testimonial?.image && <img src={testimonial.image} alt="Current testimonial" className="mt-3 h-24 w-24 rounded-lg object-cover grayscale" />}
                        </FormField>
                    </div>
                    <label className="flex items-center gap-3 text-sm text-white/75">
                        <input type="checkbox" checked={data.is_published} onChange={(event) => setData('is_published', event.target.checked)} className="size-4 rounded border-white/20 bg-white/10 text-[#C5A880] focus:ring-[#C5A880]" />
                        Published (visible on the public home page)
                    </label>
                    <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                        <Link href="/admin/pages/home/testimonials" className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/75 hover:border-white/30 hover:text-white">Cancel</Link>
                        <button disabled={processing} className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">{testimonial ? 'Save changes' : 'Create testimonial'}</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30';
const fileClass = 'block w-full rounded-xl border border-white/15 bg-[#1e1e22] px-3 py-3 text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C5A880]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#C5A880]';

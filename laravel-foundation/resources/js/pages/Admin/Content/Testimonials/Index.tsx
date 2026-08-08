import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';

type Copy = { eyebrow: string; heading: string; description: string };
type TestimonialTranslation = { name: string; role: string; quote: string };
type Testimonial = { id: number; name: string; role: string | null; quote: string; sort_order: number; is_published: boolean; image: string | null; translations?: { en?: TestimonialTranslation; ar?: TestimonialTranslation } };

const emptyCopy: Copy = { eyebrow: '', heading: '', description: '' };

export default function Index({ settings, testimonials }: { settings: { eyebrow: string; heading: string; description: string; translations: { en: Copy; ar: Copy } }; testimonials: Testimonial[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const [language, setLanguage] = useState<'en' | 'ar'>('en');
    const { data, setData, put, processing, errors } = useForm<{ sections: { testimonials: Copy }; translations: { en: Copy; ar: Copy } }>({
        sections: {
            testimonials: {
                eyebrow: settings.eyebrow,
                heading: settings.heading,
                description: settings.description,
            },
        },
        translations: {
            en: settings.translations.en ?? { eyebrow: settings.eyebrow, heading: settings.heading, description: settings.description },
            ar: settings.translations.ar ?? emptyCopy,
        },
    });
    const copy = data.translations[language];
    const updateCopy = (key: keyof Copy, value: string) => setData('translations', { ...data.translations, [language]: { ...copy, [key]: value } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); put('/admin/pages/home/testimonials'); };

    return (
        <AdminLayout>
            <Head title="Home Page / Testimonials" />
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Breadcrumbs items={['Dashboard', 'Website Pages', 'Home Page', 'Testimonials']} />
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Testimonials</h1>
                        <p className="mt-1 text-sm text-white/50">Manage the section copy and every testimonial shown on the home page.</p>
                    </div>
                    <Link href="/admin/pages/home/testimonials/create" className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black">Add testimonial</Link>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div><h2 className="text-lg font-bold text-white">Section settings</h2><p className="mt-1 text-xs text-white/45">Edit the heading and description shown on the public home page. Switch languages to translate.</p></div>
                        <StatusBadge status="Dynamic" />
                    </div>
                    <div className="flex gap-2 border-b border-white/10 pb-4">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'en' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'ar' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>العربية / Arabic</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 md:grid-cols-2">
                        <FormField label="Eyebrow" error={errors[`translations.${language}.eyebrow`]}>
                            <input value={copy.eyebrow} onChange={(event) => updateCopy('eyebrow', event.target.value)} className={inputClass} />
                        </FormField>
                        <div className="md:col-span-2">
                            <FormField label="Heading" error={errors[`translations.${language}.heading`]}>
                                <textarea rows={2} value={copy.heading} onChange={(event) => updateCopy('heading', event.target.value)} className={inputClass} />
                            </FormField>
                        </div>
                        <div className="md:col-span-2">
                            <FormField label="Description" error={errors[`translations.${language}.description`]}>
                                <textarea rows={3} value={copy.description} onChange={(event) => updateCopy('description', event.target.value)} className={inputClass} />
                            </FormField>
                        </div>
                    </div>
                    <button disabled={processing} className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50">Save section settings</button>
                </form>

                <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><h2 className="text-lg font-bold text-white">Testimonials</h2><p className="mt-1 text-xs text-white/45">Create, edit, publish, or delete the reviews displayed publicly.</p></div><span className="text-xs text-white/45">{testimonials.length} records</span></div>
                    <div className="mt-5 space-y-3">
                        {testimonials.map((testimonial) => {
                            const arabic = testimonial.translations?.ar;
                            return (
                            <article key={testimonial.id} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center">
                                {testimonial.image ? <img src={testimonial.image} alt="" className="size-16 rounded-lg object-cover grayscale" /> : <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-white/10 text-xs text-white/40">No image</div>}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold text-white">{testimonial.name}</h3>
                                        <span className="text-xs text-white/45">{testimonial.role}</span>
                                        <StatusBadge status={testimonial.is_published ? 'Published' : 'Draft'} />
                                        {arabic?.name && <StatusBadge status="AR" />}
                                    </div>
                                    <p className="mt-2 line-clamp-2 text-sm text-white/55">{testimonial.quote}</p>
                                </div>
                                <div className="flex shrink-0 flex-wrap gap-2"><Link href={`/admin/pages/home/testimonials/${testimonial.id}/edit`} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">Edit</Link><button type="button" onClick={() => router.post(`/admin/pages/home/testimonials/${testimonial.id}/publish`)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">{testimonial.is_published ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => { if (window.confirm('Delete this testimonial?')) router.delete(`/admin/pages/home/testimonials/${testimonial.id}`); }} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10">Delete</button></div>
                            </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30';

import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Award, Crown, Medal, Star } from 'lucide-react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type AwardTranslation = { title: string; description: string };
type AwardRecord = {
    id: number;
    title: string;
    year: number | null;
    description: string | null;
    icon_key: string | null;
    sort_order: number;
    is_published: boolean;
    translations?: { en?: AwardTranslation; ar?: AwardTranslation };
};
type Settings = { eyebrow: string; heading: string; translations: { en: { eyebrow: string; heading: string }; ar: { eyebrow: string; heading: string } } };

const iconMap = { award: Award, star: Star, medal: Medal, crown: Crown } as const;
type IconKey = keyof typeof iconMap;

export default function Index({ settings, awards }: { settings: Settings; awards: AwardRecord[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const [language, setLanguage] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');
    const { data, setData, put, processing, errors } = useForm<{ sections: { awards: { eyebrow: string; heading: string } }; translations: { en: { eyebrow: string; heading: string }; ar: { eyebrow: string; heading: string } } }>({
        sections: {
            awards: {
                eyebrow: settings.eyebrow,
                heading: settings.heading,
            },
        },
        translations: {
            en: settings.translations.en,
            ar: settings.translations.ar,
        },
    });
    const copy = data.translations[language];
    const updateCopy = (key: 'eyebrow' | 'heading', value: string) => setData('translations', { ...data.translations, [language]: { ...copy, [key]: value } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); put('/admin/pages/about/awards'); };

    return (
        <AdminLayout>
            <Head title="About Us / Awards" />
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Breadcrumbs items={['Dashboard', 'Website Pages', 'About Us', 'Awards']} />
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Awards</h1>
                        <p className="mt-1 text-sm text-white/50">Manage the section copy and every award card shown on the About Us page.</p>
                    </div>
                    <Link href="/admin/pages/about/awards/create" className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black">Add award</Link>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Section settings</h2>
                            <p className="mt-1 text-xs text-white/45">Edit the eyebrow and heading shown above the awards on the public About Us page. Switch languages to translate.</p>
                        </div>
                        <StatusBadge status="Dynamic" />
                    </div>
                    <div className="flex gap-2 border-b border-white/10 pb-4">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'en' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'ar' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>العربية</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 md:grid-cols-2">
                        <FormField label="Eyebrow" error={errors[`translations.${language}.eyebrow`]}>
                            <input value={copy.eyebrow} onChange={(event) => updateCopy('eyebrow', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'الـ eyebrow بالعربية' : 'English eyebrow'} />
                        </FormField>
                        <div className="md:col-span-2">
                            <FormField label="Heading" error={errors[`translations.${language}.heading`]}>
                                <textarea rows={2} value={copy.heading} onChange={(event) => updateCopy('heading', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'العنوان بالعربية' : 'English heading'} />
                            </FormField>
                        </div>
                    </div>
                    <button disabled={processing} className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50">Save section settings</button>
                </form>

                <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Awards list</h2>
                            <p className="mt-1 text-xs text-white/45">Create, edit, publish, or delete the award cards displayed publicly on the About Us page.</p>
                        </div>
                        <span className="text-xs text-white/45">{awards.length} records</span>
                    </div>

                    {awards.length === 0 ? (
                        <EmptyState title="No awards yet" message="Click Add award to create your first award card." />
                    ) : (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {awards.map((award) => {
                                const arabic = award.translations?.ar;
                                const Icon = (award.icon_key && iconMap[award.icon_key as IconKey]) || Award;
                                return (
                                    <article key={award.id} className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5">
                                        <div>
                                            <div className="grid size-12 place-items-center rounded-full border border-white/30 text-white/70">
                                                <Icon className="size-5" strokeWidth={1.25} />
                                            </div>
                                            <h3 className="mt-5 text-lg font-normal text-white">{award.title}</h3>
                                            <p className="mt-1 text-[0.7rem] tracking-[0.2em] text-white/45 uppercase">{award.year ?? '—'}</p>
                                            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/55">{award.description ?? ''}</p>
                                        </div>
                                        <div className="mt-5 flex items-center justify-between gap-2">
                                            <div className="flex flex-wrap gap-2">
                                                <StatusBadge status={award.is_published ? 'Published' : 'Draft'} />
                                                {arabic?.title && <StatusBadge status="AR" />}
                                            </div>
                                            <div className="flex flex-wrap justify-end gap-2">
                                                <Link href={`/admin/pages/about/awards/${award.id}/edit`} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">Edit</Link>
                                                <button type="button" onClick={() => router.post(`/admin/pages/about/awards/${award.id}/publish`)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">{award.is_published ? 'Unpublish' : 'Publish'}</button>
                                                <button type="button" onClick={() => { if (window.confirm('Delete this award?')) router.delete(`/admin/pages/about/awards/${award.id}`); }} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10">Delete</button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30';

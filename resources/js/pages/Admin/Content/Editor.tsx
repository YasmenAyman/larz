import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type StatItem = { value: string; label: string };
type SectionData = { [key: string]: string | StatItem[] | undefined };
type LocalizedSection = { translations: { en: SectionData; ar: SectionData } };
type Section = { section_key: string; section_type: string; content_snapshot: Record<string, unknown> | null; status: string };
type Field = { key: string; label: string; type?: 'input' | 'textarea' };

const fields: Record<string, Field[]> = {
    hero: [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'heading', label: 'Heading', type: 'textarea' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'primary_cta_label', label: 'Primary CTA label' }, { key: 'primary_cta_url', label: 'Primary CTA URL' }, { key: 'secondary_cta_label', label: 'Secondary CTA label' }, { key: 'secondary_cta_url', label: 'Secondary CTA URL' }],
    about: [{ key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    stats: [],
    featured_projects: [{ key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    gallery: [{ key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    testimonials: [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'heading', label: 'Section heading', type: 'textarea' }, { key: 'description', label: 'Description', type: 'textarea' }],
    final_cta: [],
    story: [{ key: 'heading', label: 'Heading' }, { key: 'body', label: 'Body', type: 'textarea' }],
    promise: [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'heading', label: 'Promise heading', type: 'textarea' }, { key: 'primary_cta_label', label: 'Primary CTA label' }, { key: 'primary_cta_url', label: 'Primary CTA URL' }, { key: 'secondary_cta_label', label: 'Secondary CTA label' }, { key: 'secondary_cta_url', label: 'Secondary CTA URL' }],
    internship: [{ key: 'heading', label: 'Internship heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    cta: [{ key: 'heading', label: 'CTA heading', type: 'textarea' }],
    location: [{ key: 'heading', label: 'Location heading' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'gateNote', label: 'Access note' }, { key: 'driveNote', label: 'Drive-time note' }],
    contact_methods: [{ key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'working_hours', label: 'Working hours' }],
    request_form: [{ key: 'heading', label: 'Form heading' }, { key: 'description', label: 'Form description', type: 'textarea' }, { key: 'submit_label', label: 'Submit label' }],
    location_map: [{ key: 'heading', label: 'Location heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    social_media: [{ key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    news: [{ key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    stories: [{ key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    newsletter: [{ key: 'heading', label: 'CTA heading', type: 'textarea' }, { key: 'description', label: 'Description', type: 'textarea' }],
    values: [{ key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    vacancies_settings: [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'heading', label: 'Section heading' }, { key: 'description', label: 'Description', type: 'textarea' }],
    general_cv_cta: [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'heading', label: 'CTA heading', type: 'textarea' }, { key: 'cta_label', label: 'CTA label' }],
    masterplan: [{ key: 'heading', label: 'Masterplan heading' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'brochureHeading', label: 'Brochure heading' }, { key: 'brochureDescription', label: 'Brochure description' }],
    virtual_tour: [{ key: 'heading', label: 'Virtual tour heading' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'videoUrl', label: 'Video URL' }],
};

export default function Editor({ page, label, section, sections }: { page: string; label?: string; section?: string; sections: Section[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const [language, setLanguage] = useState<'en' | 'ar'>('en');
    const sectionValues = Object.fromEntries(sections.map((record) => {
        const snapshot = record.content_snapshot ?? {};
        const translations = (snapshot as { translations?: { en?: SectionData; ar?: SectionData } }).translations;
        return [record.section_key, { translations: { en: translations?.en ?? snapshot, ar: translations?.ar ?? {} } }];
    })) as Record<string, LocalizedSection>;
    const { data, setData, put, processing, errors } = useForm<{ sections: Record<string, LocalizedSection> }>({ sections: sectionValues });
    const current = (sectionKey: string) => data.sections[sectionKey]?.translations[language] ?? {};
    const update = (sectionKey: string, key: string, value: unknown) => setData('sections', { ...data.sections, [sectionKey]: { translations: { ...data.sections[sectionKey].translations, [language]: { ...current(sectionKey), [key]: value } } } });
    const updateStats = (items: StatItem[]) => update('stats', 'items', items);
    const submit = (event: React.FormEvent) => { event.preventDefault(); section ? put(`/admin/pages/${page}/${section}`) : put(`/admin/content/${page}`); };

    return (
        <AdminLayout>
            <Head title={`${label ?? page} ${section ? ` / ${section.replaceAll('-', ' ')}` : 'Overview'}`} />
            <div className="mx-auto max-w-5xl space-y-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', label ?? page, ...(section ? [section.replaceAll('-', ' ')] : [])]} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white capitalize sm:text-3xl">
                        {section ? section.replaceAll('-', ' ') : `${label ?? page} overview`}
                    </h1>
                    <p className="mt-1 text-xs text-white/50 sm:text-sm">
                         Edit the public content in separate English and Arabic tabs.
                    </p>
                </div>

                <Notification message={flash?.success} />

                 <div className="flex gap-2 border-b border-white/10 pb-3">
                     <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                     <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                 </div>
                 <form onSubmit={submit} className="space-y-6">
                    {sections.map((record) => (
                        <section key={record.section_key} className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h2 className="text-lg font-bold text-white capitalize">
                                    {record.section_key.replaceAll('_', ' ')}
                                </h2>
                                <span className="rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-3 py-1 text-xs font-medium text-[#C5A880]">
                                    {record.status}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                {(fields[record.section_key] ?? fields.hero).map((field) => (
                                    <FormField key={field.key} label={field.label} error={errors[`sections.${record.section_key}.${field.key}`]}>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                rows={4}
                                                 value={String(current(record.section_key)[field.key] ?? '')}
                                                onChange={(event) => update(record.section_key, field.key, event.target.value)}
                                                className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30"
                                            />
                                        ) : (
                                            <input
                                                 value={String(current(record.section_key)[field.key] ?? '')}
                                                onChange={(event) => update(record.section_key, field.key, event.target.value)}
                                                className="h-[50px] w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30"
                                            />
                                        )}
                                    </FormField>
                                ))}
                            </div>

                            {record.section_key === 'stats' && (
                                <StatsEditor items={(current('stats').items as StatItem[] | undefined) ?? []} errors={errors} onChange={updateStats} />
                            )}
                        </section>
                    ))}

                    <button
                        disabled={processing}
                        className="inline-flex h-[50px] items-center justify-center rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#C5A880] bg-[length:200%_auto] px-8 text-sm font-semibold uppercase tracking-wider text-black shadow-[0_4px_20px_rgba(197,168,128,0.25)] transition-all hover:shadow-[0_6px_25px_rgba(197,168,128,0.4)] active:scale-[0.99] disabled:opacity-50"
                    >
                         Save {language === 'ar' ? 'Arabic' : 'English'} {section ? section.replaceAll('-', ' ') : page} content
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

function StatsEditor({ items, errors, onChange }: { items: StatItem[]; errors: Record<string, string>; onChange: (items: StatItem[]) => void }) {
    const normalized = Array.from({ length: 4 }, (_, index) => ({ value: items[index]?.value ?? '', label: items[index]?.label ?? '' }));
    const update = (index: number, key: keyof StatItem, value: string) => onChange(normalized.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
    return (
        <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="text-base font-bold text-white">Statistics section (four statistics)</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {normalized.map((item, index) => (
                    <div key={index} className="rounded-xl border border-white/10 bg-[#1e1e22]/60 p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#C5A880]">Statistic {index + 1}</p>
                        <FormField label="Value" error={errors[`sections.stats.items.${index}.value`]}>
                            <input
                                required
                                value={item.value}
                                onChange={(event) => update(index, 'value', event.target.value)}
                                className="h-[44px] w-full rounded-xl border border-white/15 bg-[#19191c] px-3.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#C5A880]"
                                placeholder="40+"
                            />
                        </FormField>
                        <div className="mt-3">
                            <FormField label="Label" error={errors[`sections.stats.items.${index}.label`]}>
                                <input
                                    required
                                    value={item.label}
                                    onChange={(event) => update(index, 'label', event.target.value)}
                                    className="h-[44px] w-full rounded-xl border border-white/15 bg-[#19191c] px-3.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#C5A880]"
                                    placeholder="Experience"
                                />
                            </FormField>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

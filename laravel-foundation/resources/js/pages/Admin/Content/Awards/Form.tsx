import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type AwardTranslation = { title: string; description: string };
type AwardRecord = {
    id?: number;
    title: string;
    year: number | null;
    description: string | null;
    icon_key: string | null;
    sort_order: number;
    is_published: boolean;
    translations?: { en?: AwardTranslation; ar?: AwardTranslation };
};
type Locale = 'en' | 'ar';

const iconOptions = [
    { value: 'award', label: 'Award' },
    { value: 'star', label: 'Star' },
    { value: 'medal', label: 'Medal' },
    { value: 'crown', label: 'Crown' },
];

const emptyTranslation: AwardTranslation = { title: '', description: '' };

export default function Form({ award }: { award: AwardRecord | null }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const [language, setLanguage] = useState<Locale>('en');
    const { data, setData, post, put, processing, errors } = useForm({
        title: award?.title ?? '',
        year: award?.year ?? (new Date().getFullYear() as number),
        description: award?.description ?? '',
        icon_key: award?.icon_key ?? 'award',
        sort_order: award?.sort_order ?? 0,
        is_published: award?.is_published ?? true,
        translations: {
            en: { ...emptyTranslation, ...(award?.translations?.en ?? {}) },
            ar: { ...emptyTranslation, ...(award?.translations?.ar ?? {}) },
        },
    });
    const copy = data.translations[language] ?? emptyTranslation;
    const updateCopy = (key: keyof AwardTranslation, value: string) => setData('translations', { ...data.translations, [language]: { ...copy, [key]: value } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); award?.id ? put(`/admin/pages/about/awards/${award.id}`) : post('/admin/pages/about/awards'); };

    return (
        <AdminLayout>
            <Head title={award ? 'Edit Award' : 'Add Award'} />
            <div className="mx-auto max-w-3xl space-y-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'About Us', 'Awards', award ? 'Edit' : 'Add']} />
                    <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{award ? 'Edit award' : 'Add award'}</h1>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex gap-2 border-b border-white/10 pb-4">
                        <button type="button" onClick={() => setLanguage('en')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'en' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>English</button>
                        <button type="button" onClick={() => setLanguage('ar')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'ar' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>العربية / Arabic</button>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="grid gap-5 sm:grid-cols-2">
                        <FormField label="Title" error={errors[`translations.${language}.title`]}>
                            <input value={copy.title} onChange={(event) => updateCopy('title', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'العنوان بالعربية' : 'English title'} />
                        </FormField>
                        <FormField label="Year" error={errors.year}>
                            <input type="number" min="1900" max="2100" value={data.year ?? ''} onChange={(event) => setData('year', event.target.value === '' ? null as unknown as number : Number(event.target.value))} className={inputClass} placeholder="Leave empty for milestones" />
                        </FormField>
                    </div>
                    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <FormField label="Description" error={errors[`translations.${language}.description`]}>
                            <textarea rows={4} value={copy.description} onChange={(event) => updateCopy('description', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'الوصف بالعربية' : 'English description'} />
                        </FormField>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField label="Icon" error={errors.icon_key}>
                            <select value={data.icon_key ?? 'award'} onChange={(event) => setData('icon_key', event.target.value)} className={inputClass}>
                                {iconOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-[#19191c] text-white">{option.label}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Sort order" error={errors.sort_order}>
                            <input type="number" min="0" value={data.sort_order} onChange={(event) => setData('sort_order', Number(event.target.value))} className={inputClass} />
                        </FormField>
                    </div>
                    <label className="flex items-center gap-3 text-sm text-white/75">
                        <input type="checkbox" checked={data.is_published} onChange={(event) => setData('is_published', event.target.checked)} className="size-4 rounded border-white/20 bg-white/10 text-[#C5A880] focus:ring-[#C5A880]" />
                        Published (visible on the public About Us page)
                    </label>
                    <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                        <Link href="/admin/pages/about/awards" className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/75 hover:border-white/30 hover:text-white">Cancel</Link>
                        <button disabled={processing} className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">{award ? 'Save changes' : 'Create award'}</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30';
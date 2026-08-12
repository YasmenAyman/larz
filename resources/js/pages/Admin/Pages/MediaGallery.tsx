import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, ImageUploadField, Notification } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Copy = { eyebrow: string; heading: string; description: string };
type GalleryItem = {
    id: number;
    title: string | null;
    alt_text: string | null;
    caption: string | null;
    location: string | null;
    event_date: string | null;
    sort_order: number;
    is_published: boolean;
    is_active: boolean;
    image: string | null;
};
type Settings = Copy & { translations?: { en?: Copy; ar?: Copy } };

const emptyCopy: Copy = { eyebrow: '', heading: '', description: '' };

export default function MediaGallery({ settings, items }: { settings: Settings; items: GalleryItem[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { locale } = useI18n();
    const [language, setLanguage] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');
    const [uploadError, setUploadError] = useState('');
    const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
    const initial = settings.translations ?? { en: { eyebrow: settings.eyebrow, heading: settings.heading, description: settings.description }, ar: emptyCopy };

    const form = useForm({
        eyebrow: settings.eyebrow,
        heading: settings.heading,
        description: settings.description,
        images: [] as File[],
        remove_ids: [] as number[],
        gallery_ids: items.map((item) => item.id),
        translations: {
            en: initial.en ?? emptyCopy,
            ar: initial.ar ?? emptyCopy,
        },
    });
    const { data, setData, processing, errors } = form;
    const copy = data.translations[language];
    const updateCopy = (key: keyof Copy, value: string) => setData('translations', { ...data.translations, [language]: { ...copy, [key]: value } });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.transform((payload) => ({ ...payload, _method: 'put' }));
        form.post('/admin/pages/media/gallery', { forceFormData: true, preserveScroll: true });
    };

    const move = (index: number, direction: -1 | 1) => {
        const next = [...data.gallery_ids];
        const target = index + direction;
        if (target < 0 || target >= next.length) return;
        [next[index], next[target]] = [next[target], next[index]];
        setData('gallery_ids', next);
    };

    const toggleRemove = (id: number) => {
        setData('remove_ids', data.remove_ids.includes(id) ? data.remove_ids.filter((value) => value !== id) : [...data.remove_ids, id]);
    };

    const visibleItems = data.gallery_ids
        .map((id) => items.find((item) => item.id === id))
        .filter((item): item is GalleryItem => Boolean(item));

    const handleImages = (files: File[]) => {
        const totalBytes = files.reduce((total, file) => total + file.size, 0);
        if (totalBytes > 250 * 1024 * 1024) {
            setUploadError('The selected images exceed the 250 MB total upload limit.');
            setSelectedPreviews([]);
            setData('images', []);
            return;
        }
        setUploadError('');
        setSelectedPreviews(files.map((file) => URL.createObjectURL(file)));
        setData('images', files);
    };

    useEffect(() => () => selectedPreviews.forEach((preview) => URL.revokeObjectURL(preview)), [selectedPreviews]);

    return (
        <AdminLayout>
            <Head title="Media Gallery" />
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'Media Page', 'Gallery']} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Photo gallery</h1>
                    <p className="mt-1 text-sm text-white/50">Manage English and Arabic section copy and the photos displayed on the Media page.</p>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                    <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white">Section copy</h2>
                                <p className="mt-1 text-xs text-white/45">Edit the eyebrow, heading, and description that introduce the photo gallery.</p>
                            </div>
                        </div>
                        <div className="mt-5 flex gap-2 border-b border-white/10 pb-4">
                            <button type="button" onClick={() => setLanguage('en')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'en' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>English</button>
                            <button type="button" onClick={() => setLanguage('ar')} className={`rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${language === 'ar' ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-black' : 'border border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>العربية / Arabic</button>
                        </div>
                        <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="mt-5 grid gap-5 md:grid-cols-2">
                            <FormField label="Eyebrow" error={errors[`translations.${language}.eyebrow`]}>
                                <input value={copy.eyebrow} onChange={(event) => updateCopy('eyebrow', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'الـ eyebrow بالعربية' : 'English eyebrow'} />
                            </FormField>
                            <FormField label="Heading" error={errors[`translations.${language}.heading`]}>
                                <input value={copy.heading} onChange={(event) => updateCopy('heading', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'العنوان بالعربية' : 'English heading'} />
                            </FormField>
                            <div className="md:col-span-2">
                                <FormField label="Description" error={errors[`translations.${language}.description`]}>
                                    <textarea rows={4} value={copy.description} onChange={(event) => updateCopy('description', event.target.value)} className={inputClass} placeholder={language === 'ar' ? 'الوصف بالعربية' : 'English description'} />
                                </FormField>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white">Gallery photos</h2>
                                <p className="mt-1 text-xs text-white/45">Reorder, remove, or upload new photos. Changes save together with the section copy.</p>
                            </div>
                            <span className="text-xs text-white/45">{visibleItems.length} photos</span>
                        </div>
                        <div className="mt-5 space-y-3">
                            <ImageUploadField label="Upload new photos" multiple onChange={(files) => handleImages(Array.isArray(files) ? files : files ? [files] : [])} />
                            {uploadError && <p className="text-xs text-rose-400">{uploadError}</p>}
                            {selectedPreviews.length > 0 && (
                                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                    {selectedPreviews.map((preview) => (
                                        <img key={preview} src={preview} alt="New upload preview" className="h-32 w-full rounded-lg object-cover" />
                                    ))}
                                </div>
                            )}
                        </div>
                        {visibleItems.length === 0 ? (
                            <EmptyState title="No photos yet" message="Upload images using the field above to populate the gallery." />
                        ) : (
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {visibleItems.map((item, index) => (
                                    <article key={item.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                                        {item.image ? <img src={item.image} alt={item.alt_text ?? ''} className="h-40 w-full object-cover" /> : <div className="grid h-40 w-full place-items-center bg-white/10 text-xs text-white/40">No image</div>}
                                        <div className="p-3">
                                            <p className="line-clamp-1 text-sm font-medium text-white">{item.title ?? item.alt_text ?? 'Untitled'}</p>
                                            {item.location && <p className="mt-1 text-xs text-white/45">{item.location}</p>}
                                            <div className="mt-3 flex items-center justify-between gap-2">
                                                <div className="flex gap-1">
                                                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up" className="grid size-8 place-items-center rounded-lg border border-white/15 text-white/70 hover:border-[#C5A880] hover:text-white disabled:opacity-30">
                                                        <ArrowLeft className="size-3.5" />
                                                    </button>
                                                    <button type="button" onClick={() => move(index, 1)} disabled={index === visibleItems.length - 1} aria-label="Move down" className="grid size-8 place-items-center rounded-lg border border-white/15 text-white/70 hover:border-[#C5A880] hover:text-white disabled:opacity-30">
                                                        <ArrowRight className="size-3.5" />
                                                    </button>
                                                </div>
                                                <button type="button" onClick={() => toggleRemove(item.id)} aria-label="Mark for removal" className={`grid size-8 place-items-center rounded-lg border ${data.remove_ids.includes(item.id) ? 'border-rose-500 bg-rose-500/15 text-rose-300' : 'border-white/15 text-white/70 hover:border-rose-400 hover:text-rose-300'}`}>
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <div className="flex justify-end">
                        <button disabled={processing} className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">Save gallery</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30';

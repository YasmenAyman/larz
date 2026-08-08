import { Head, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FileUploadField, FormField, ImageUploadField, Notification } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type Project = {
    id?: number;
    project_category_id?: number | null;
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    location: string | null;
    address: string | null;
    status: string | null;
    project_type: string | null;
    completion_date: string | null;
    price_from: string | number | null;
    price_to: string | number | null;
    currency: string;
    installment_information: string | null;
    area_min: string | number | null;
    area_max: string | number | null;
    area_unit: string;
    hero_heading: string | null;
    hero_description: string | null;
    hero_image: string | null;
    logo: string | null;
    brochure: string | null;
    video_url: string | null;
    virtual_tour_url: string | null;
    map_image: string | null;
    latitude: string | number | null;
    longitude: string | number | null;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    seo_title: string | null;
    seo_description: string | null;
    canonical_url: string | null;
    robots: string | null;
    translations?: { en?: Record<string, string>; ar?: Record<string, string> };
    sections?: { en?: Record<string, any>; ar?: Record<string, any> };
};

type Category = { id: number; name: string };

type HeroSlide = { eyebrow: string; titleLine1: string; titleLine2: string; description: string };
type SectionData = {
    heroSlides: HeroSlide[];
    overview: { heading: string; body: string };
    masterplan: { heading: string; description: string; brochureHeading: string; brochureDescription: string };
    virtualTour: { heading: string; description: string; videoUrl: string };
    homes3d: { heading: string; description: string; note: string };
    construction: { heading: string; description: string };
    amenities: { heading: string };
    location: { heading: string; description: string; gateNote: string; driveNote: string };
    cta: { eyebrow: string; heading: string };
};

const emptySections: SectionData = {
    heroSlides: [{ eyebrow: '', titleLine1: '', titleLine2: '', description: '' }],
    overview: { heading: '', body: '' },
    masterplan: { heading: '', description: '', brochureHeading: '', brochureDescription: '' },
    virtualTour: { heading: '', description: '', videoUrl: '' },
    homes3d: { heading: '', description: '', note: '' },
    construction: { heading: '', description: '' },
    amenities: { heading: '' },
    location: { heading: '', description: '', gateNote: '', driveNote: '' },
    cta: { eyebrow: '', heading: '' },
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="mb-4 text-lg font-semibold">{title}</h2>
            {children}
        </section>
    );
}

export default function Form({ project, categories }: { project: Project | null; categories: Category[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } | null }>>().props;
    const [language, setLanguage] = useState<'en' | 'ar'>('en');

    const form = useForm<Project & { translations: { en: Record<string, string>; ar: Record<string, string> }; sections: { en: SectionData; ar: SectionData } }>({
        project_category_id: project?.project_category_id ?? null,
        title: project?.title ?? '',
        slug: project?.slug ?? '',
        description: project?.description ?? '',
        short_description: project?.short_description ?? '',
        location: project?.location ?? '',
        address: project?.address ?? '',
        status: project?.status ?? 'available',
        project_type: project?.project_type ?? 'residential',
        completion_date: project?.completion_date ?? '',
        price_from: project?.price_from ?? '',
        price_to: project?.price_to ?? '',
        currency: project?.currency ?? 'EGP',
        installment_information: project?.installment_information ?? '',
        area_min: project?.area_min ?? '',
        area_max: project?.area_max ?? '',
        area_unit: project?.area_unit ?? 'm2',
        hero_heading: project?.hero_heading ?? '',
        hero_description: project?.hero_description ?? '',
        hero_image: project?.hero_image ?? null,
        logo: project?.logo ?? null,
        brochure: project?.brochure ?? null,
        video_url: project?.video_url ?? '',
        virtual_tour_url: project?.virtual_tour_url ?? '',
        map_image: project?.map_image ?? null,
        latitude: project?.latitude ?? '',
        longitude: project?.longitude ?? '',
        is_featured: project?.is_featured ?? false,
        is_published: project?.is_published ?? false,
        sort_order: project?.sort_order ?? 0,
        seo_title: project?.seo_title ?? '',
        seo_description: project?.seo_description ?? '',
        canonical_url: project?.canonical_url ?? '',
        robots: project?.robots ?? '',
        translations: { en: project?.translations?.en ?? {}, ar: project?.translations?.ar ?? {} },
        sections: {
            en: { ...emptySections, ...(project?.sections?.en ?? {}) },
            ar: { ...emptySections, ...(project?.sections?.ar ?? {}) },
        },
    });

    const lang = language;
    const sections = form.data.sections[lang];
    const setSection = <K extends keyof SectionData>(key: K, value: SectionData[K]) => {
        form.setData('sections', { ...form.data.sections, [lang]: { ...form.data.sections[lang], [key]: value } });
    };

    const isArabic = lang === 'ar';
    const textFieldClass = "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm";

    return (
        <AdminLayout>
            <Head title={project ? 'Edit Project' : 'Create Project'} />
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Admin', 'Projects', project ? 'Edit' : 'Create']} />
                    <h1 className="mt-3 text-3xl font-semibold">{project ? 'Edit project' : 'Create project'}</h1>
                </div>
                <Notification message={flash?.success ?? null} />

                {/* Language tabs */}
                <div className="flex gap-2 border-b border-slate-800 pb-3">
                    <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-gold text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                    <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-gold text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); project?.id ? form.put(`/admin/projects/${project.id}`, { forceFormData: true, preserveScroll: true }) : form.post('/admin/projects', { forceFormData: true, preserveScroll: true }); }} encType="multipart/form-data" className="space-y-6">

                    {/* ===== BASICS (shared fields, not per-language) ===== */}
                    {!isArabic && (
                        <SectionCard title="Basics">
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField label="Title" error={form.errors.title}><input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Slug" error={form.errors.slug}><input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Category"><select value={form.data.project_category_id ?? ''} onChange={(e) => form.setData('project_category_id', e.target.value ? Number(e.target.value) : null)} className={textFieldClass}><option value="">No category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField>
                                <FormField label="Project type"><select value={form.data.project_type ?? ''} onChange={(e) => form.setData('project_type', e.target.value)} className={textFieldClass}><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="mixed-use">Mixed-use</option><option value="medical">Medical</option><option value="office">Office</option></select></FormField>
                                <FormField label="Status"><select value={form.data.status ?? ''} onChange={(e) => form.setData('status', e.target.value)} className={textFieldClass}><option value="available">Available</option><option value="selling">Selling</option><option value="sold">Sold out</option><option value="upcoming">Upcoming</option></select></FormField>
                                <FormField label="Sort order"><input type="number" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value))} className={textFieldClass} /></FormField>
                                <FormField label="Location"><input value={form.data.location ?? ''} onChange={(e) => form.setData('location', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Address"><input value={form.data.address ?? ''} onChange={(e) => form.setData('address', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Completion date"><input type="date" value={form.data.completion_date ?? ''} onChange={(e) => form.setData('completion_date', e.target.value)} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-5"><FormField label="Short description"><textarea rows={3} value={form.data.short_description ?? ''} onChange={(e) => form.setData('short_description', e.target.value)} className={textFieldClass} /></FormField></div>
                            <div className="mt-5"><FormField label="Long description"><textarea rows={6} value={form.data.description ?? ''} onChange={(e) => form.setData('description', e.target.value)} className={textFieldClass} /></FormField></div>
                        </SectionCard>
                    )}

                    {/* ===== PRICING (shared) ===== */}
                    {!isArabic && (
                        <SectionCard title="Pricing">
                            <div className="grid gap-5 md:grid-cols-4">
                                <FormField label="Price from"><input type="number" step="0.01" value={form.data.price_from ?? ''} onChange={(e) => form.setData('price_from', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Price to"><input type="number" step="0.01" value={form.data.price_to ?? ''} onChange={(e) => form.setData('price_to', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Currency"><input value={form.data.currency} onChange={(e) => form.setData('currency', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Area unit"><input value={form.data.area_unit} onChange={(e) => form.setData('area_unit', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Area min"><input type="number" step="0.01" value={form.data.area_min ?? ''} onChange={(e) => form.setData('area_min', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Area max"><input type="number" step="0.01" value={form.data.area_max ?? ''} onChange={(e) => form.setData('area_max', e.target.value)} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-5"><FormField label="Installment information"><textarea rows={3} value={form.data.installment_information ?? ''} onChange={(e) => form.setData('installment_information', e.target.value)} className={textFieldClass} /></FormField></div>
                        </SectionCard>
                    )}

                    {/* ===== TRANSLATIONS (per-language basic fields) ===== */}
                    <SectionCard title={isArabic ? 'Arabic Content' : 'English Content'}>
                        <div className="grid gap-5" dir={isArabic ? 'rtl' : 'ltr'}>
                            <FormField label="Title (translated)"><input value={form.data.translations[lang].title ?? ''} onChange={(e) => form.setData('translations', { ...form.data.translations, [lang]: { ...form.data.translations[lang], title: e.target.value } })} className={textFieldClass} /></FormField>
                            <FormField label="Short description (translated)"><textarea rows={3} value={form.data.translations[lang].short_description ?? ''} onChange={(e) => form.setData('translations', { ...form.data.translations, [lang]: { ...form.data.translations[lang], short_description: e.target.value } })} className={textFieldClass} /></FormField>
                            <FormField label="Description (translated)"><textarea rows={5} value={form.data.translations[lang].description ?? ''} onChange={(e) => form.setData('translations', { ...form.data.translations, [lang]: { ...form.data.translations[lang], description: e.target.value } })} className={textFieldClass} /></FormField>
                            <FormField label="Hero heading (translated)"><input value={form.data.translations[lang].hero_heading ?? ''} onChange={(e) => form.setData('translations', { ...form.data.translations, [lang]: { ...form.data.translations[lang], hero_heading: e.target.value } })} className={textFieldClass} /></FormField>
                            <FormField label="Hero description (translated)"><textarea rows={3} value={form.data.translations[lang].hero_description ?? ''} onChange={(e) => form.setData('translations', { ...form.data.translations, [lang]: { ...form.data.translations[lang], hero_description: e.target.value } })} className={textFieldClass} /></FormField>
                            <FormField label="Installment information (translated)"><textarea rows={3} value={form.data.translations[lang].installment_information ?? ''} onChange={(e) => form.setData('translations', { ...form.data.translations, [lang]: { ...form.data.translations[lang], installment_information: e.target.value } })} className={textFieldClass} /></FormField>
                        </div>
                    </SectionCard>

                    {/* ===== HERO SLIDES (per-language) ===== */}
                    <SectionCard title="Hero Slides">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            {sections.heroSlides.map((slide, i) => (
                                <div key={i} className="mb-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs text-white/40">Slide {i + 1}</span>
                                        {sections.heroSlides.length > 1 && <button type="button" onClick={() => setSection('heroSlides', sections.heroSlides.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>}
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <FormField label="Eyebrow"><input value={slide.eyebrow} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], eyebrow: e.target.value }; setSection('heroSlides', updated); }} className={textFieldClass} /></FormField>
                                        <FormField label="Title Line 1"><input value={slide.titleLine1} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], titleLine1: e.target.value }; setSection('heroSlides', updated); }} className={textFieldClass} /></FormField>
                                        <FormField label="Title Line 2"><input value={slide.titleLine2} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], titleLine2: e.target.value }; setSection('heroSlides', updated); }} className={textFieldClass} /></FormField>
                                        <FormField label="Description"><textarea rows={2} value={slide.description} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], description: e.target.value }; setSection('heroSlides', updated); }} className={textFieldClass} /></FormField>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => setSection('heroSlides', [...sections.heroSlides, { eyebrow: '', titleLine1: '', titleLine2: '', description: '' }])} className="mt-2 flex items-center gap-2 text-xs text-gold hover:text-gold/80"><Plus className="size-3" /> Add slide</button>
                        </div>
                    </SectionCard>

                    {/* ===== OVERVIEW (per-language) ===== */}
                    <SectionCard title="Overview">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <FormField label="Heading"><input value={sections.overview.heading} onChange={(e) => setSection('overview', { ...sections.overview, heading: e.target.value })} className={textFieldClass} /></FormField>
                            <div className="mt-4"><FormField label="Body"><textarea rows={5} value={sections.overview.body} onChange={(e) => setSection('overview', { ...sections.overview, body: e.target.value })} className={textFieldClass} /></FormField></div>
                        </div>
                    </SectionCard>

                    {/* ===== MASTERPLAN & BROCHURE (per-language) ===== */}
                    <SectionCard title="Masterplan & Brochure">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Heading"><input value={sections.masterplan.heading} onChange={(e) => setSection('masterplan', { ...sections.masterplan, heading: e.target.value })} className={textFieldClass} /></FormField>
                                <FormField label="Brochure heading"><input value={sections.masterplan.brochureHeading} onChange={(e) => setSection('masterplan', { ...sections.masterplan, brochureHeading: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-4"><FormField label="Description"><textarea rows={3} value={sections.masterplan.description} onChange={(e) => setSection('masterplan', { ...sections.masterplan, description: e.target.value })} className={textFieldClass} /></FormField></div>
                            <div className="mt-4"><FormField label="Brochure description"><textarea rows={2} value={sections.masterplan.brochureDescription} onChange={(e) => setSection('masterplan', { ...sections.masterplan, brochureDescription: e.target.value })} className={textFieldClass} /></FormField></div>
                        </div>
                    </SectionCard>

                    {/* ===== VIRTUAL TOUR (per-language) ===== */}
                    <SectionCard title="Virtual Tour">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Heading"><input value={sections.virtualTour.heading} onChange={(e) => setSection('virtualTour', { ...sections.virtualTour, heading: e.target.value })} className={textFieldClass} /></FormField>
                                <FormField label="Video URL (YouTube embed)"><input value={sections.virtualTour.videoUrl} onChange={(e) => setSection('virtualTour', { ...sections.virtualTour, videoUrl: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-4"><FormField label="Description"><textarea rows={3} value={sections.virtualTour.description} onChange={(e) => setSection('virtualTour', { ...sections.virtualTour, description: e.target.value })} className={textFieldClass} /></FormField></div>
                        </div>
                    </SectionCard>

                    {/* ===== 3D GALLERY / HOMES3D (per-language) ===== */}
                    <SectionCard title="3D Gallery">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Heading"><input value={sections.homes3d.heading} onChange={(e) => setSection('homes3d', { ...sections.homes3d, heading: e.target.value })} className={textFieldClass} /></FormField>
                                <FormField label="Note"><input value={sections.homes3d.note} onChange={(e) => setSection('homes3d', { ...sections.homes3d, note: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-4"><FormField label="Description"><textarea rows={3} value={sections.homes3d.description} onChange={(e) => setSection('homes3d', { ...sections.homes3d, description: e.target.value })} className={textFieldClass} /></FormField></div>
                        </div>
                    </SectionCard>

                    {/* ===== CONSTRUCTION UPDATES (per-language) ===== */}
                    <SectionCard title="Construction Updates">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Heading"><input value={sections.construction.heading} onChange={(e) => setSection('construction', { ...sections.construction, heading: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-4"><FormField label="Description"><textarea rows={3} value={sections.construction.description} onChange={(e) => setSection('construction', { ...sections.construction, description: e.target.value })} className={textFieldClass} /></FormField></div>
                        </div>
                    </SectionCard>

                    {/* ===== AMENITIES (per-language) ===== */}
                    <SectionCard title="Amenities & Services">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <FormField label="Heading"><input value={sections.amenities.heading} onChange={(e) => setSection('amenities', { ...sections.amenities, heading: e.target.value })} className={textFieldClass} /></FormField>
                        </div>
                    </SectionCard>

                    {/* ===== LOCATION & MAP (per-language) ===== */}
                    <SectionCard title="Location & Map">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Heading"><input value={sections.location.heading} onChange={(e) => setSection('location', { ...sections.location, heading: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-4"><FormField label="Description"><textarea rows={3} value={sections.location.description} onChange={(e) => setSection('location', { ...sections.location, description: e.target.value })} className={textFieldClass} /></FormField></div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <FormField label="Gate note"><input value={sections.location.gateNote} onChange={(e) => setSection('location', { ...sections.location, gateNote: e.target.value })} className={textFieldClass} /></FormField>
                                <FormField label="Drive note"><input value={sections.location.driveNote} onChange={(e) => setSection('location', { ...sections.location, driveNote: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ===== CTA (per-language) ===== */}
                    <SectionCard title="Call to Action">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Eyebrow"><input value={sections.cta.eyebrow} onChange={(e) => setSection('cta', { ...sections.cta, eyebrow: e.target.value })} className={textFieldClass} /></FormField>
                                <FormField label="Heading"><input value={sections.cta.heading} onChange={(e) => setSection('cta', { ...sections.cta, heading: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ===== MEDIA (shared) ===== */}
                    {!isArabic && (
                        <SectionCard title="Hero & Media">
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField label="Hero heading"><input value={form.data.hero_heading ?? ''} onChange={(e) => form.setData('hero_heading', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Video URL"><input value={form.data.video_url ?? ''} onChange={(e) => form.setData('video_url', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Virtual tour URL"><input value={form.data.virtual_tour_url ?? ''} onChange={(e) => form.setData('virtual_tour_url', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Latitude"><input value={form.data.latitude ?? ''} onChange={(e) => form.setData('latitude', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Longitude"><input value={form.data.longitude ?? ''} onChange={(e) => form.setData('longitude', e.target.value)} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-5"><FormField label="Hero description"><textarea rows={3} value={form.data.hero_description ?? ''} onChange={(e) => form.setData('hero_description', e.target.value)} className={textFieldClass} /></FormField></div>
                            <div className="mt-5 grid gap-5 md:grid-cols-3">
                                <ImageUploadField label="Hero image" onChange={(file) => form.setData('hero_image' as keyof Project, file as never)} />
                                <ImageUploadField label="Logo" onChange={(file) => form.setData('logo' as keyof Project, file as never)} />
                                <ImageUploadField label="Map image" onChange={(file) => form.setData('map_image' as keyof Project, file as never)} />
                            </div>
                            <div className="mt-5"><FileUploadField label="Brochure (PDF)" onChange={(file) => form.setData('brochure' as keyof Project, file as never)} /></div>
                        </SectionCard>
                    )}

                    {/* ===== SEO (shared) ===== */}
                    {!isArabic && (
                        <SectionCard title="SEO">
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField label="SEO title"><input value={form.data.seo_title ?? ''} onChange={(e) => form.setData('seo_title', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Canonical URL"><input value={form.data.canonical_url ?? ''} onChange={(e) => form.setData('canonical_url', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="SEO description"><textarea rows={3} value={form.data.seo_description ?? ''} onChange={(e) => form.setData('seo_description', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Robots"><input value={form.data.robots ?? ''} onChange={(e) => form.setData('robots', e.target.value)} className={textFieldClass} /></FormField>
                            </div>
                        </SectionCard>
                    )}

                    {/* ===== VISIBILITY (shared) ===== */}
                    {!isArabic && (
                        <SectionCard title="Visibility">
                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_published} onChange={(e) => form.setData('is_published', e.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> Published</label>
                                <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_featured} onChange={(e) => form.setData('is_featured', e.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> Featured</label>
                            </div>
                        </SectionCard>
                    )}

                    <div className="flex justify-end gap-3">
                        <button type="submit" disabled={form.processing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold bg-gold/10 px-6 py-2 text-xs font-semibold tracking-wider text-gold uppercase hover:bg-gold/20 disabled:opacity-50">
                            {form.processing ? 'Saving...' : (project ? 'Update project' : 'Create project')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FileUploadField, FormField, ImageUploadField, Notification } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useI18n } from '@/i18n';

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
    overview_image: string | null;
    masterplan_image: string | null;
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

type HeroSlide = { eyebrow: string; titleLine1: string; titleLine2: string; description: string; cta1Label: string; cta1Url: string; cta2Label: string; cta2Url: string };
type SectionData = {
    heroSlides: HeroSlide[];
    stats: Array<{ value: string; label: string; note: string }>;
    overview: { heading: string; body: string };
    gallery: { eyebrow: string; heading: string };
    masterplan: { heading: string; description: string; brochureHeading: string; brochureDescription: string };
    virtualTour: { heading: string; description: string; videoUrl: string };
    homes3d: { heading: string; description: string; note: string; items: Array<{ tag: string; name: string; size: string; url: string }> };
    construction: { heading: string; description: string; items: Array<{ tag: string; title: string; image: string | null }> };
    amenities: { heading: string; categories: Array<{ title: string; items: Array<{ icon: string | null; title: string; description: string }> }> };
    location: { heading: string; description: string; gateNote: string; driveNote: string; image: string | null; nearbyLocations: Array<{ place: string; time: string }> };
    cta: { eyebrow: string; heading: string; whatsappNumber: string; primaryCtaLabel: string; secondaryCtaLabel: string };
};

const emptySections: SectionData = {
    heroSlides: [{ eyebrow: '', titleLine1: '', titleLine2: '', description: '', cta1Label: '', cta1Url: '#brochure', cta2Label: '', cta2Url: '#brochure' }],
    stats: [],
    overview: { heading: '', body: '' },
    gallery: { eyebrow: 'Gallery', heading: 'A closer look.' },
    masterplan: { heading: '', description: '', brochureHeading: '', brochureDescription: '' },
    virtualTour: { heading: '', description: '', videoUrl: '' },
    homes3d: { heading: '', description: '', note: '', items: [] },
    construction: { heading: '', description: '', items: [] },
    amenities: { heading: '', categories: [] },
    location: { heading: '', description: '', gateNote: '', driveNote: '', image: null, nearbyLocations: [] },
    cta: { eyebrow: '', heading: '', whatsappNumber: '', primaryCtaLabel: '', secondaryCtaLabel: '' },
};

function normaliseSections(saved?: Partial<SectionData>): SectionData {
    const savedSections = saved ?? {};
    const heroSlides = Array.isArray(savedSections.heroSlides) ? savedSections.heroSlides : emptySections.heroSlides;
    const stats = Array.isArray(savedSections.stats) ? savedSections.stats : emptySections.stats;
    const savedHomes3d = savedSections.homes3d ?? emptySections.homes3d;
    const savedConstruction = savedSections.construction ?? emptySections.construction;
    const savedAmenities = savedSections.amenities ?? emptySections.amenities;
    const savedLocation = savedSections.location ?? emptySections.location;

    return {
        ...emptySections,
        ...savedSections,
        heroSlides: heroSlides.map((slide) => Object.assign({}, emptySections.heroSlides[0], slide)),
        stats: stats.map((stat) => Object.assign({ value: '', label: '', note: '' }, stat)),
        overview: { ...emptySections.overview, ...(savedSections.overview ?? {}) },
        gallery: { ...emptySections.gallery, ...(savedSections.gallery ?? {}) },
        masterplan: { ...emptySections.masterplan, ...(savedSections.masterplan ?? {}) },
        virtualTour: { ...emptySections.virtualTour, ...(savedSections.virtualTour ?? {}) },
        homes3d: {
            ...emptySections.homes3d,
            ...(savedHomes3d ?? {}),
            items: Array.isArray(savedHomes3d.items)
                ? savedHomes3d.items.map((item) => Object.assign({ tag: '', name: '', size: '', url: '' }, item))
                : emptySections.homes3d.items,
        },
        construction: {
            ...emptySections.construction,
            ...(savedConstruction ?? {}),
            items: Array.isArray(savedConstruction.items)
                ? savedConstruction.items.map((item) => Object.assign({ tag: '', title: '', image: null }, item))
                : emptySections.construction.items,
        },
        amenities: {
            ...emptySections.amenities,
            ...(savedAmenities ?? {}),
            categories: Array.isArray(savedAmenities.categories)
                ? savedAmenities.categories.map((category) => Object.assign(
                    { title: '', items: [] as Array<{ icon: string | null; title: string; description: string }> },
                    category,
                    {
                        items: Array.isArray(category.items)
                            ? category.items.map((item) => Object.assign({ icon: null, title: '', description: '' }, item))
                            : [],
                    },
                ))
                : emptySections.amenities.categories,
        },
        location: {
            ...emptySections.location,
            ...(savedLocation ?? {}),
            nearbyLocations: Array.isArray(savedLocation.nearbyLocations)
                ? savedLocation.nearbyLocations.map((location) => Object.assign({ place: '', time: '' }, location))
                : emptySections.location.nearbyLocations,
        },
        cta: { ...emptySections.cta, ...(savedSections.cta ?? {}) },
    };
}

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
    const { locale } = useI18n();
    const [language, setLanguage] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');
    const [submitting, setSubmitting] = useState(false);

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
        overview_image: project?.overview_image ?? null,
        masterplan_image: project?.masterplan_image ?? null,
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
            en: normaliseSections(project?.sections?.en),
            ar: normaliseSections(project?.sections?.ar),
        },
    });

    const lang = language;
    const sections = form.data.sections[lang];
    const setSection = <K extends keyof SectionData>(key: K, value: SectionData[K]) => {
        form.setData('sections', { ...form.data.sections, [lang]: { ...form.data.sections[lang], [key]: value } });
    };

    const isArabic = lang === 'ar';
    const ui = (english: string, arabic: string) => locale === 'ar' ? arabic : english;
    const textFieldClass = "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm";

    return (
        <AdminLayout>
            <Head title={project ? 'Edit Project' : 'Create Project'} />
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Projects', project ? 'Edit' : 'Create']} />
                    <h1 className="mt-3 text-3xl font-semibold">{project ? 'Edit project' : 'Create project'}</h1>
                </div>
                <Notification message={flash?.success ?? null} />

                {/* Language tabs */}
                <div className="flex gap-2 border-b border-slate-800 pb-3">
                    <button type="button" onClick={() => setLanguage('en')} className={`rounded-lg px-4 py-2 text-sm ${language === 'en' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>English</button>
                    <button type="button" onClick={() => setLanguage('ar')} className={`rounded-lg px-4 py-2 text-sm ${language === 'ar' ? 'bg-[#C5A880] text-black' : 'bg-white/5 text-white/60'}`}>Arabic</button>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData();
                    const d = form.data;
                    const flat: Record<string, any> = {
                        project_category_id: d.project_category_id ?? '', title: d.title, slug: d.slug, description: d.description ?? '',
                        short_description: d.short_description ?? '', location: d.location ?? '', address: d.address ?? '', status: d.status ?? '',
                        project_type: d.project_type ?? '', completion_date: d.completion_date ?? '', price_from: d.price_from ?? '',
                        price_to: d.price_to ?? '', currency: d.currency ?? 'EGP', installment_information: d.installment_information ?? '',
                        area_min: d.area_min ?? '', area_max: d.area_max ?? '', area_unit: d.area_unit ?? 'm2',
                        hero_heading: d.hero_heading ?? '', hero_description: d.hero_description ?? '',
                        video_url: d.video_url ?? '', virtual_tour_url: d.virtual_tour_url ?? '',
                        latitude: d.latitude ?? '', longitude: d.longitude ?? '',
                        is_published: d.is_published ? '1' : '0', is_featured: d.is_featured ? '1' : '0',
                        sort_order: d.sort_order ?? 0, seo_title: d.seo_title ?? '', seo_description: d.seo_description ?? '',
                        canonical_url: d.canonical_url ?? '', robots: d.robots ?? '',
                    };
                    Object.entries(flat).forEach(([k, v]) => fd.append(k, String(v)));
                    fd.append('translations', JSON.stringify(d.translations));
                    fd.append('sections', JSON.stringify(d.sections));
                    const heroImage = d.hero_image as unknown;
                    const logo = d.logo as unknown;
                    const brochure = d.brochure as unknown;
                    const mapImage = d.map_image as unknown;
                    if (heroImage instanceof File) fd.append('hero_image', heroImage);
                    if (logo instanceof File) fd.append('logo', logo);
                    if (brochure instanceof File) fd.append('brochure', brochure);
                    if (mapImage instanceof File) fd.append('map_image', mapImage);
                    const overviewImage = d.overview_image as unknown;
                    if (overviewImage instanceof File) fd.append('overview_image', overviewImage);
                    const masterplanImage = d.masterplan_image as unknown;
                    if (masterplanImage instanceof File) fd.append('masterplan_image', masterplanImage);
                    const constructionItems = d.sections[lang]?.construction?.items ?? [];
                    constructionItems.forEach((item: { tag: string; title: string; image: unknown }, idx: number) => {
                        if (item.image instanceof File) fd.append(`construction_image_${idx}`, item.image);
                    });
                    const amenityCategories = d.sections[lang]?.amenities?.categories ?? [];
                    amenityCategories.forEach((cat: { title: string; items: Array<{ icon: unknown; title: string; description: string }> }, ci: number) => {
                        cat.items.forEach((item: { icon: unknown; title: string; description: string }, ii: number) => {
                            if (item.icon instanceof File) fd.append(`amenity_icon_${ci}_${ii}`, item.icon);
                        });
                    });
                    const locationImage = d.sections[lang]?.location?.image as unknown;
                    if (locationImage instanceof File) fd.append('location_image', locationImage);
                    if (project?.id) {
                        fd.append('_method', 'PUT');
                        setSubmitting(true);
                        router.post(`/admin/projects/${project.id}`, fd, {
                            forceFormData: true,
                            preserveScroll: true,
                            onSuccess: () => router.visit('/admin/projects'),
                            onFinish: () => setSubmitting(false),
                            onError: (errors) => console.error('Project update validation errors', errors),
                        });
                    } else {
                        setSubmitting(true);
                        router.post('/admin/projects', fd, {
                            forceFormData: true,
                            preserveScroll: true,
                            onFinish: () => setSubmitting(false),
                            onError: (errors) => console.error('Project create validation errors', errors),
                        });
                    }
                }} encType="multipart/form-data" className="space-y-6">

                    {/* ===== BASICS (shared fields, not per-language) ===== */}
                    {!isArabic && (
                        <SectionCard title="Basics">
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField label="Title" error={form.errors.title}><input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Slug" error={form.errors.slug}><input value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label={ui('Category', 'التصنيف')}><select value={form.data.project_category_id ?? ''} onChange={(e) => form.setData('project_category_id', e.target.value ? Number(e.target.value) : null)} className={textFieldClass}><option value="">{ui('No category', 'بدون تصنيف')}</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField>
                                <FormField label="Project type"><select value={form.data.project_type ?? ''} onChange={(e) => form.setData('project_type', e.target.value)} className={textFieldClass}><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="mixed-use">Mixed-use</option><option value="medical">Medical</option><option value="office">Office</option></select></FormField>
                                <FormField label={ui('Status', 'الحالة')}><select value={form.data.status ?? ''} onChange={(e) => form.setData('status', e.target.value)} className={textFieldClass}><option value="available">{ui('Available', 'متاح')}</option><option value="selling">{ui('Selling', 'قيد البيع')}</option><option value="sold">{ui('Sold out', 'تم البيع')}</option><option value="upcoming">{ui('Upcoming', 'قريباً')}</option></select></FormField>
                                <FormField label="Sort order"><input type="number" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value))} className={textFieldClass} /></FormField>
                                <FormField label={ui('Location', 'الموقع')}><input value={form.data.location ?? ''} onChange={(e) => form.setData('location', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label={ui('Address', 'العنوان')}><input value={form.data.address ?? ''} onChange={(e) => form.setData('address', e.target.value)} className={textFieldClass} /></FormField>
                                <FormField label="Completion date"><input type="date" value={form.data.completion_date ?? ''} onChange={(e) => form.setData('completion_date', e.target.value)} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-5"><ImageUploadField label="Feature image" current={(form.data.hero_image as unknown instanceof File) ? (form.data.hero_image as unknown as File) : (typeof form.data.hero_image === 'string' ? form.data.hero_image : project?.hero_image)} onChange={(file) => form.setData('hero_image' as keyof Project, file as never)} /></div>
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

                    {/* ===== HERO SLIDES (per-language) ===== */}
                    <SectionCard title="Hero Slides">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            {sections.heroSlides.map((slide, i) => (
                                <div key={i} className="mb-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs text-white/40">{ui(`Slide ${i + 1}`, `شريحة ${i + 1}`)}</span>
                                        {sections.heroSlides.length > 1 && <button type="button" onClick={() => setSection('heroSlides', sections.heroSlides.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>}
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <FormField label="Eyebrow"><input value={slide.eyebrow} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], eyebrow: e.target.value }; setSection('heroSlides', updated); }} className={textFieldClass} /></FormField>
                                        <FormField label="Title Line 1"><input value={slide.titleLine1} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], titleLine1: e.target.value }; setSection('heroSlides', updated); }} className={textFieldClass} /></FormField>
                                        <FormField label="Title Line 2"><input value={slide.titleLine2} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], titleLine2: e.target.value }; setSection('heroSlides', updated); }} className={textFieldClass} /></FormField>
                                        <FormField label="Description"><textarea rows={2} value={slide.description} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], description: e.target.value }; setSection('heroSlides', updated); }} className={textFieldClass} /></FormField>
                                    </div>
                                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                                        <div className="rounded-lg border border-slate-800/50 bg-slate-950/50 p-3">
                                            <p className="mb-2 text-[0.65rem] tracking-wider text-white/40 uppercase">CTA 1 (Primary)</p>
                                            <div className="grid gap-2 md:grid-cols-2">
                                                <FormField label="Label"><input value={slide.cta1Label} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], cta1Label: e.target.value }; setSection('heroSlides', updated); }} placeholder="Request pricing & payment plan" className={textFieldClass} /></FormField>
                                                <FormField label="URL"><input value={slide.cta1Url} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], cta1Url: e.target.value }; setSection('heroSlides', updated); }} placeholder="#brochure or /contact" className={textFieldClass} /></FormField>
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-slate-800/50 bg-slate-950/50 p-3">
                                            <p className="mb-2 text-[0.65rem] tracking-wider text-white/40 uppercase">CTA 2 (Secondary)</p>
                                            <div className="grid gap-2 md:grid-cols-2">
                                                <FormField label="Label"><input value={slide.cta2Label} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], cta2Label: e.target.value }; setSection('heroSlides', updated); }} placeholder="Download brochure" className={textFieldClass} /></FormField>
                                                <FormField label="URL"><input value={slide.cta2Url} onChange={(e) => { const updated = [...sections.heroSlides]; updated[i] = { ...updated[i], cta2Url: e.target.value }; setSection('heroSlides', updated); }} placeholder="#brochure or /contact" className={textFieldClass} /></FormField>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => setSection('heroSlides', [...sections.heroSlides, { eyebrow: '', titleLine1: '', titleLine2: '', description: '', cta1Label: '', cta1Url: '#brochure', cta2Label: '', cta2Url: '#brochure' }])} className="mt-2 flex items-center gap-2 text-xs text-gold hover:text-gold/80"><Plus className="size-3" /> Add slide</button>
                        </div>
                    </SectionCard>

                    {/* ===== STATS (per-language) ===== */}
                    <SectionCard title="Stats">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            {sections.stats.map((stat, i) => (
                                <div key={i} className="mb-3 grid gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                                    <FormField label="Value"><input value={stat.value} onChange={(e) => { const updated = [...sections.stats]; updated[i] = { ...updated[i], value: e.target.value }; setSection('stats', updated); }} className={textFieldClass} /></FormField>
                                    <FormField label="Label"><input value={stat.label} onChange={(e) => { const updated = [...sections.stats]; updated[i] = { ...updated[i], label: e.target.value }; setSection('stats', updated); }} className={textFieldClass} /></FormField>
                                    <FormField label="Note"><input value={stat.note} onChange={(e) => { const updated = [...sections.stats]; updated[i] = { ...updated[i], note: e.target.value }; setSection('stats', updated); }} className={textFieldClass} /></FormField>
                                    <button type="button" onClick={() => setSection('stats', sections.stats.filter((_, index) => index !== i))} className="self-end p-2 text-red-400"><Trash2 className="size-4" /></button>
                                </div>
                            ))}
                            <button type="button" onClick={() => setSection('stats', [...sections.stats, { value: '', label: '', note: '' }])} className="mt-2 flex items-center gap-2 text-xs text-gold"><Plus className="size-3" /> Add stat</button>
                        </div>
                    </SectionCard>

                    {/* ===== OVERVIEW (per-language) ===== */}
                    <SectionCard title="Overview">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <FormField label="Heading"><input value={sections.overview.heading} onChange={(e) => setSection('overview', { ...sections.overview, heading: e.target.value })} className={textFieldClass} /></FormField>
                            <div className="mt-4"><FormField label="Body"><textarea rows={5} value={sections.overview.body} onChange={(e) => setSection('overview', { ...sections.overview, body: e.target.value })} className={textFieldClass} /></FormField></div>
                            {!isArabic && <div className="mt-4"><ImageUploadField label="Overview image" current={(form.data.overview_image as unknown instanceof File) ? (form.data.overview_image as unknown as File) : (typeof form.data.overview_image === 'string' ? form.data.overview_image : project?.overview_image)} onChange={(file) => form.setData('overview_image' as keyof Project, file as never)} /></div>}
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
                            {!isArabic && <div className="mt-4"><ImageUploadField label="Masterplan image" current={(form.data.masterplan_image as unknown instanceof File) ? (form.data.masterplan_image as unknown as File) : (typeof form.data.masterplan_image === 'string' ? form.data.masterplan_image : project?.masterplan_image)} onChange={(file) => form.setData('masterplan_image' as keyof Project, file as never)} /></div>}
                            {!isArabic && <div className="mt-4"><FileUploadField label="Brochure (PDF)" onChange={(file) => form.setData('brochure' as keyof Project, file as never)} /></div>}
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

                            <div className="mt-6">
                                <p className="mb-3 text-xs font-semibold tracking-wider text-white/50 uppercase">Homes</p>
                                {sections.homes3d.items.map((item, i) => (
                                    <div key={i} className="mb-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs text-white/40">{ui(`Home ${i + 1}`, `وحدة ${i + 1}`)}</span>
                                            {sections.homes3d.items.length > 0 && <button type="button" onClick={() => setSection('homes3d', { ...sections.homes3d, items: sections.homes3d.items.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>}
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-4">
                                            <FormField label="Tag"><input value={item.tag} onChange={(e) => { const updated = [...sections.homes3d.items]; updated[i] = { ...updated[i], tag: e.target.value }; setSection('homes3d', { ...sections.homes3d, items: updated }); }} placeholder="Studio" className={textFieldClass} /></FormField>
                                            <FormField label="Name"><input value={item.name} onChange={(e) => { const updated = [...sections.homes3d.items]; updated[i] = { ...updated[i], name: e.target.value }; setSection('homes3d', { ...sections.homes3d, items: updated }); }} placeholder="The Studio" className={textFieldClass} /></FormField>
                                            <FormField label="Size (e.g. 50-54)"><input value={item.size} onChange={(e) => { const updated = [...sections.homes3d.items]; updated[i] = { ...updated[i], size: e.target.value }; setSection('homes3d', { ...sections.homes3d, items: updated }); }} placeholder="50-54" className={textFieldClass} /></FormField>
                                            <FormField label="3D URL"><input value={item.url} onChange={(e) => { const updated = [...sections.homes3d.items]; updated[i] = { ...updated[i], url: e.target.value }; setSection('homes3d', { ...sections.homes3d, items: updated }); }} placeholder="https://..." className={textFieldClass} /></FormField>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => setSection('homes3d', { ...sections.homes3d, items: [...sections.homes3d.items, { tag: '', name: '', size: '', url: '' }] })} className="mt-2 flex items-center gap-2 text-xs text-gold hover:text-gold/80"><Plus className="size-3" /> Add home</button>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ===== GALLERY (per-language) ===== */}
                    <SectionCard title={ui('Gallery', 'المعرض')}>
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Eyebrow"><input value={sections.gallery.eyebrow} onChange={(e) => setSection('gallery', { ...sections.gallery, eyebrow: e.target.value })} className={textFieldClass} /></FormField>
                                <FormField label="Heading"><input value={sections.gallery.heading} onChange={(e) => setSection('gallery', { ...sections.gallery, heading: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ===== CONSTRUCTION UPDATES (per-language) ===== */}
                    <SectionCard title="Construction Updates">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Heading"><input value={sections.construction.heading} onChange={(e) => setSection('construction', { ...sections.construction, heading: e.target.value })} className={textFieldClass} /></FormField>
                            </div>
                            <div className="mt-4"><FormField label="Description"><textarea rows={3} value={sections.construction.description} onChange={(e) => setSection('construction', { ...sections.construction, description: e.target.value })} className={textFieldClass} /></FormField></div>

                            <div className="mt-6">
                                <p className="mb-3 text-xs font-semibold tracking-wider text-white/50 uppercase">Updates</p>
                                {sections.construction.items.map((item, i) => (
                                    <div key={i} className="mb-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs text-white/40">{ui(`Update ${i + 1}`, `تحديث ${i + 1}`)}</span>
                                            <button type="button" onClick={() => setSection('construction', { ...sections.construction, items: sections.construction.items.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <FormField label="Tag"><input value={item.tag} onChange={(e) => { const updated = [...sections.construction.items]; updated[i] = { ...updated[i], tag: e.target.value }; setSection('construction', { ...sections.construction, items: updated }); }} placeholder="Latest update" className={textFieldClass} /></FormField>
                                            <FormField label="Title"><input value={item.title} onChange={(e) => { const updated = [...sections.construction.items]; updated[i] = { ...updated[i], title: e.target.value }; setSection('construction', { ...sections.construction, items: updated }); }} placeholder="Structure & landscaping progress" className={textFieldClass} /></FormField>
                                        </div>
                                        {!isArabic && <div className="mt-3"><ImageUploadField label="Image" current={(item.image as unknown instanceof File) ? (item.image as unknown as File) : (typeof item.image === 'string' ? item.image : null)} onChange={(file) => { const updated = [...sections.construction.items]; updated[i] = { ...updated[i], image: file as unknown as string }; setSection('construction', { ...sections.construction, items: updated }); }} /></div>}
                                    </div>
                                ))}
                                <button type="button" onClick={() => setSection('construction', { ...sections.construction, items: [...sections.construction.items, { tag: '', title: '', image: null }] })} className="mt-2 flex items-center gap-2 text-xs text-gold hover:text-gold/80"><Plus className="size-3" /> Add update</button>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ===== AMENITIES (per-language) ===== */}
                    <SectionCard title="Amenities & Services">
                        <div dir={isArabic ? 'rtl' : 'ltr'}>
                            <FormField label="Heading"><input value={sections.amenities.heading} onChange={(e) => setSection('amenities', { ...sections.amenities, heading: e.target.value })} className={textFieldClass} /></FormField>

                            <div className="mt-6 space-y-6">
                                {(sections.amenities.categories ?? []).map((cat, ci) => (
                                    <div key={ci} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-xs text-white/40">{ui(`Category ${ci + 1}`, `تصنيف ${ci + 1}`)}</span>
                                            <button type="button" onClick={() => setSection('amenities', { ...sections.amenities, categories: sections.amenities.categories.filter((_, idx) => idx !== ci) })} className="text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>
                                        </div>
                                        <FormField label="Category title">
                                            <input value={cat.title} onChange={(e) => { const updated = [...sections.amenities.categories]; updated[ci] = { ...updated[ci], title: e.target.value }; setSection('amenities', { ...sections.amenities, categories: updated }); }} placeholder="WELLNESS & MOVEMENT" className={textFieldClass} />
                                        </FormField>

                                        <div className="mt-4 space-y-3">
                                            {cat.items.map((item, ii) => (
                                                <div key={ii} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-[0.65rem] text-white/30">Item {ii + 1}</span>
                                                        <button type="button" onClick={() => { const updated = [...sections.amenities.categories]; updated[ci] = { ...updated[ci], items: updated[ci].items.filter((_, idx) => idx !== ii) }; setSection('amenities', { ...sections.amenities, categories: updated }); }} className="text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
                                                    </div>
                                                    <div className="grid gap-3 md:grid-cols-3">
                                                        <FormField label="Title">
                                                            <input value={item.title} onChange={(e) => { const updated = [...sections.amenities.categories]; updated[ci] = { ...updated[ci], items: updated[ci].items.map((it, idx) => idx === ii ? { ...it, title: e.target.value } : it) }; setSection('amenities', { ...sections.amenities, categories: updated }); }} placeholder="Yoga deck" className={textFieldClass} />
                                                        </FormField>
                                                        <FormField label="Description">
                                                            <input value={item.description} onChange={(e) => { const updated = [...sections.amenities.categories]; updated[ci] = { ...updated[ci], items: updated[ci].items.map((it, idx) => idx === ii ? { ...it, description: e.target.value } : it) }; setSection('amenities', { ...sections.amenities, categories: updated }); }} placeholder="Mornings that start calm" className={textFieldClass} />
                                                        </FormField>
                                                        <FormField label="Icon (PNG/SVG)">
                                                            <ImageUploadField label="Icon" current={(item.icon as unknown instanceof File) ? (item.icon as unknown as File) : (typeof item.icon === 'string' ? item.icon : null)} onChange={(file) => { const updated = [...sections.amenities.categories]; updated[ci] = { ...updated[ci], items: updated[ci].items.map((it, idx) => idx === ii ? { ...it, icon: file as unknown as string } : it) }; setSection('amenities', { ...sections.amenities, categories: updated }); }} />
                                                        </FormField>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => { const updated = [...sections.amenities.categories]; updated[ci] = { ...updated[ci], items: [...updated[ci].items, { icon: null, title: '', description: '' }] }; setSection('amenities', { ...sections.amenities, categories: updated }); }} className="flex items-center gap-2 text-xs text-gold hover:text-gold/80"><Plus className="size-3" /> Add item</button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => setSection('amenities', { ...sections.amenities, categories: [...sections.amenities.categories, { title: '', items: [] }] })} className="flex items-center gap-2 text-xs text-gold hover:text-gold/80"><Plus className="size-3" /> Add category</button>
                            </div>
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
                            {!isArabic && <div className="mt-4"><ImageUploadField label="Section image" current={(sections.location.image as unknown instanceof File) ? (sections.location.image as unknown as File) : (typeof sections.location.image === 'string' ? sections.location.image : null)} onChange={(file) => setSection('location', { ...sections.location, image: file as unknown as string })} /></div>}

                            <div className="mt-6">
                                <p className="mb-3 text-xs font-semibold tracking-wider text-white/50 uppercase">Nearby locations</p>
                                {(sections.location.nearbyLocations ?? []).map((item, i) => (
                                    <div key={i} className="mb-3 grid gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 md:grid-cols-[1fr_1fr_auto]">
                                        <FormField label="Place"><input value={item.place} onChange={(e) => { const updated = [...(sections.location.nearbyLocations ?? [])]; updated[i] = { ...updated[i], place: e.target.value }; setSection('location', { ...sections.location, nearbyLocations: updated }); }} placeholder="North Teseen Road" className={textFieldClass} /></FormField>
                                        <FormField label="Time"><input value={item.time} onChange={(e) => { const updated = [...(sections.location.nearbyLocations ?? [])]; updated[i] = { ...updated[i], time: e.target.value }; setSection('location', { ...sections.location, nearbyLocations: updated }); }} placeholder="1 min" className={textFieldClass} /></FormField>
                                        <button type="button" onClick={() => setSection('location', { ...sections.location, nearbyLocations: (sections.location.nearbyLocations ?? []).filter((_, idx) => idx !== i) })} className="self-end p-2 text-red-400"><Trash2 className="size-4" /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => setSection('location', { ...sections.location, nearbyLocations: [...(sections.location.nearbyLocations ?? []), { place: '', time: '' }] })} className="mt-2 flex items-center gap-2 text-xs text-gold"><Plus className="size-3" /> Add location</button>
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
                                <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_featured} onChange={(e) => form.setData('is_featured', e.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> {ui('Featured', 'مميز')}</label>
                            </div>
                        </SectionCard>
                    )}

                    <div className="flex justify-end gap-3">
                        <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C5A880] px-6 py-2 text-xs font-semibold tracking-wider text-black uppercase transition hover:bg-[#D4AF37] disabled:opacity-50">
                            {submitting ? ui('Saving...', 'جارٍ الحفظ...') : project ? ui('Update project', 'تحديث المشروع') : ui('Create project', 'إنشاء المشروع')}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

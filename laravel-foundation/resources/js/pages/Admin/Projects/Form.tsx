import { Head, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FileUploadField, FormField, ImageUploadField, Notification } from '@/components/admin/AdminLayoutParts';

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
};

type Category = { id: number; name: string };

export default function Form({ project, categories }: { project: Project | null; categories: Category[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } | null }>>().props;
    const form = useForm<Project>({
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
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (project?.id) {
            form.put(`/admin/projects/${project.id}`, { forceFormData: true, preserveScroll: true });
        } else {
            form.post('/admin/projects', { forceFormData: true, preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title={project ? 'Edit Project' : 'Create Project'} />
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Admin', 'Projects', project ? 'Edit' : 'Create']} />
                    <h1 className="mt-3 text-3xl font-semibold">{project ? 'Edit project' : 'Create project'}</h1>
                </div>
                <Notification message={flash?.success ?? null} />
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                    <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Basics</h2>
                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField label="Title" error={form.errors.title}><input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Slug" error={form.errors.slug}><input value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Category">
                                <select value={form.data.project_category_id ?? ''} onChange={(event) => form.setData('project_category_id', event.target.value ? Number(event.target.value) : null)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                                    <option value="">No category</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Project type">
                                <select value={form.data.project_type ?? ''} onChange={(event) => form.setData('project_type', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="mixed-use">Mixed-use</option>
                                    <option value="medical">Medical</option>
                                    <option value="office">Office</option>
                                </select>
                            </FormField>
                            <FormField label="Status">
                                <select value={form.data.status ?? ''} onChange={(event) => form.setData('status', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                                    <option value="available">Available</option>
                                    <option value="selling">Selling</option>
                                    <option value="sold">Sold out</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                            </FormField>
                            <FormField label="Sort order" error={form.errors.sort_order}><input type="number" value={form.data.sort_order} onChange={(event) => form.setData('sort_order', Number(event.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Location"><input value={form.data.location ?? ''} onChange={(event) => form.setData('location', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Address"><input value={form.data.address ?? ''} onChange={(event) => form.setData('address', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Completion date" error={form.errors.completion_date}><input type="date" value={form.data.completion_date ?? ''} onChange={(event) => form.setData('completion_date', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        </div>
                        <div className="mt-5">
                            <FormField label="Short description" error={form.errors.short_description}><textarea rows={3} value={form.data.short_description ?? ''} onChange={(event) => form.setData('short_description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        </div>
                        <div className="mt-5">
                            <FormField label="Long description" error={form.errors.description}><textarea rows={6} value={form.data.description ?? ''} onChange={(event) => form.setData('description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Pricing</h2>
                        <div className="grid gap-5 md:grid-cols-4">
                            <FormField label="Price from" error={form.errors.price_from}><input type="number" step="0.01" value={form.data.price_from ?? ''} onChange={(event) => form.setData('price_from', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Price to" error={form.errors.price_to}><input type="number" step="0.01" value={form.data.price_to ?? ''} onChange={(event) => form.setData('price_to', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Currency"><input value={form.data.currency} onChange={(event) => form.setData('currency', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Area unit"><input value={form.data.area_unit} onChange={(event) => form.setData('area_unit', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Area min" error={form.errors.area_min}><input type="number" step="0.01" value={form.data.area_min ?? ''} onChange={(event) => form.setData('area_min', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Area max" error={form.errors.area_max}><input type="number" step="0.01" value={form.data.area_max ?? ''} onChange={(event) => form.setData('area_max', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        </div>
                        <div className="mt-5">
                            <FormField label="Installment information" error={form.errors.installment_information}><textarea rows={3} value={form.data.installment_information ?? ''} onChange={(event) => form.setData('installment_information', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Hero and media</h2>
                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField label="Hero heading" error={form.errors.hero_heading}><input value={form.data.hero_heading ?? ''} onChange={(event) => form.setData('hero_heading', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Video URL" error={form.errors.video_url}><input value={form.data.video_url ?? ''} onChange={(event) => form.setData('video_url', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Virtual tour URL" error={form.errors.virtual_tour_url}><input value={form.data.virtual_tour_url ?? ''} onChange={(event) => form.setData('virtual_tour_url', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Latitude" error={form.errors.latitude}><input value={form.data.latitude ?? ''} onChange={(event) => form.setData('latitude', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Longitude" error={form.errors.longitude}><input value={form.data.longitude ?? ''} onChange={(event) => form.setData('longitude', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        </div>
                        <div className="mt-5">
                            <FormField label="Hero description" error={form.errors.hero_description}><textarea rows={3} value={form.data.hero_description ?? ''} onChange={(event) => form.setData('hero_description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        </div>
                        <div className="mt-5 grid gap-5 md:grid-cols-3">
                            <ImageUploadField label="Hero image" onChange={(file) => form.setData('hero_image' as keyof Project, file as never)} />
                            <ImageUploadField label="Logo" onChange={(file) => form.setData('logo' as keyof Project, file as never)} />
                            <ImageUploadField label="Map image" onChange={(file) => form.setData('map_image' as keyof Project, file as never)} />
                        </div>
                        <div className="mt-5">
                            <FileUploadField label="Brochure (PDF)" onChange={(file) => form.setData('brochure' as keyof Project, file as never)} />
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                        <h2 className="mb-4 text-lg font-semibold">SEO</h2>
                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField label="SEO title" error={form.errors.seo_title}><input value={form.data.seo_title ?? ''} onChange={(event) => form.setData('seo_title', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Canonical URL" error={form.errors.canonical_url}><input value={form.data.canonical_url ?? ''} onChange={(event) => form.setData('canonical_url', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="SEO description" error={form.errors.seo_description}><textarea rows={3} value={form.data.seo_description ?? ''} onChange={(event) => form.setData('seo_description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                            <FormField label="Robots" error={form.errors.robots}><input value={form.data.robots ?? ''} onChange={(event) => form.setData('robots', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Visibility</h2>
                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_published} onChange={(event) => form.setData('is_published', event.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> Published</label>
                            <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_featured} onChange={(event) => form.setData('is_featured', event.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> Featured</label>
                        </div>
                    </section>

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

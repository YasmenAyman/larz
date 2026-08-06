import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';

type Settings = { eyebrow?: string; heading?: string; description?: string };
type Testimonial = { id: number; name: string; role: string | null; quote: string; sort_order: number; is_published: boolean; image: string | null };

export default function Index({ settings, testimonials }: { settings: Settings; testimonials: Testimonial[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { data, setData, put, processing, errors } = useForm({ sections: { testimonials: {
        eyebrow: settings.eyebrow ?? 'Testimonials',
        heading: settings.heading ?? 'Built on Trust. Proven by Experience.',
        description: settings.description ?? '',
    } } });
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
                        <div><h2 className="text-lg font-bold text-white">Section settings</h2><p className="mt-1 text-xs text-white/45">These fields control the heading and description on the public home page.</p></div>
                        <StatusBadge status="Dynamic" />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField label="Eyebrow" error={errors['sections.testimonials.eyebrow']}><input value={data.sections.testimonials.eyebrow} onChange={(event) => setData('sections', { testimonials: { ...data.sections.testimonials, eyebrow: event.target.value } })} className={inputClass} /></FormField>
                        <div className="md:col-span-2"><FormField label="Heading" error={errors['sections.testimonials.heading']}><textarea rows={2} value={data.sections.testimonials.heading} onChange={(event) => setData('sections', { testimonials: { ...data.sections.testimonials, heading: event.target.value } })} className={inputClass} /></FormField></div>
                        <div className="md:col-span-2"><FormField label="Description" error={errors['sections.testimonials.description']}><textarea rows={3} value={data.sections.testimonials.description} onChange={(event) => setData('sections', { testimonials: { ...data.sections.testimonials, description: event.target.value } })} className={inputClass} /></FormField></div>
                    </div>
                    <button disabled={processing} className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50">Save section settings</button>
                </form>

                <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><h2 className="text-lg font-bold text-white">Testimonials</h2><p className="mt-1 text-xs text-white/45">Create, edit, publish, or delete the reviews displayed publicly.</p></div><span className="text-xs text-white/45">{testimonials.length} records</span></div>
                    <div className="mt-5 space-y-3">
                        {testimonials.map((testimonial) => (
                            <article key={testimonial.id} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center">
                                {testimonial.image ? <img src={testimonial.image} alt="" className="size-16 rounded-lg object-cover grayscale" /> : <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-white/10 text-xs text-white/40">No image</div>}
                                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{testimonial.name}</h3><span className="text-xs text-white/45">{testimonial.role}</span><StatusBadge status={testimonial.is_published ? 'Published' : 'Draft'} /></div><p className="mt-2 line-clamp-2 text-sm text-white/55">{testimonial.quote}</p></div>
                                <div className="flex shrink-0 flex-wrap gap-2"><Link href={`/admin/pages/home/testimonials/${testimonial.id}/edit`} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">Edit</Link><button type="button" onClick={() => router.post(`/admin/pages/home/testimonials/${testimonial.id}/publish`)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">{testimonial.is_published ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => { if (window.confirm('Delete this testimonial?')) router.delete(`/admin/pages/home/testimonials/${testimonial.id}`); }} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10">Delete</button></div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30';

import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';

type Settings = { eyebrow?: string; heading?: string; description?: string };
type Partner = { id: number; name: string; role: string | null; description: string | null; url: string | null; sort_order: number; is_published: boolean; logo: string | null };

export default function Index({ settings, partners }: { settings: Settings; partners: Partner[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { data, setData, put, processing, errors } = useForm({ sections: { partners: {
        eyebrow: settings.eyebrow ?? 'Partnerships & affiliations',
        heading: settings.heading ?? 'The names behind our work.',
        description: settings.description ?? 'We build with partners who share our standards - in design, engineering and delivery.',
    } } });
    const submit = (event: React.FormEvent) => { event.preventDefault(); put('/admin/pages/about/partners'); };

    return (
        <AdminLayout>
            <Head title="About Page / Partners" />
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Breadcrumbs items={['Dashboard', 'Website Pages', 'About Page', 'Partners']} />
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Partners &amp; Affiliations</h1>
                        <p className="mt-1 text-sm text-white/50">Manage the section copy and every partner logo displayed on the about page.</p>
                    </div>
                    <Link href="/admin/pages/about/partners/create" className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black">Add partner</Link>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div><h2 className="text-lg font-bold text-white">Section settings</h2><p className="mt-1 text-xs text-white/45">These fields control the eyebrow, heading, and description on the public about page.</p></div>
                        <StatusBadge status="Dynamic" />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField label="Eyebrow" error={errors['sections.partners.eyebrow']}><input value={data.sections.partners.eyebrow} onChange={(event) => setData('sections', { partners: { ...data.sections.partners, eyebrow: event.target.value } })} className={inputClass} /></FormField>
                        <div className="md:col-span-2"><FormField label="Heading" error={errors['sections.partners.heading']}><textarea rows={2} value={data.sections.partners.heading} onChange={(event) => setData('sections', { partners: { ...data.sections.partners, heading: event.target.value } })} className={inputClass} /></FormField></div>
                        <div className="md:col-span-2"><FormField label="Description" error={errors['sections.partners.description']}><textarea rows={3} value={data.sections.partners.description} onChange={(event) => setData('sections', { partners: { ...data.sections.partners, description: event.target.value } })} className={inputClass} /></FormField></div>
                    </div>
                    <button disabled={processing} className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50">Save section settings</button>
                </form>

                <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><h2 className="text-lg font-bold text-white">Partners</h2><p className="mt-1 text-xs text-white/45">Create, edit, publish, or delete the partners displayed publicly.</p></div><span className="text-xs text-white/45">{partners.length} records</span></div>
                    <div className="mt-5 space-y-3">
                        {partners.length === 0 && <EmptyState title="No partners yet" message="Click 'Add partner' to create the first record." />}
                        {partners.map((partner) => (
                            <article key={partner.id} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center">
                                {partner.logo ? <img src={partner.logo} alt="" className="size-16 rounded-lg object-contain bg-white/5 p-1" /> : <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-white/10 text-[0.5rem] tracking-[0.2em] text-white/40">[ LOGO ]</div>}
                                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{partner.name}</h3><span className="text-xs text-white/45">{partner.role}</span><StatusBadge status={partner.is_published ? 'Published' : 'Draft'} /></div>{partner.description && <p className="mt-2 line-clamp-2 text-sm text-white/55">{partner.description}</p>}</div>
                                <div className="flex shrink-0 flex-wrap gap-2"><Link href={`/admin/pages/about/partners/${partner.id}/edit`} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">Edit</Link><button type="button" onClick={() => router.post(`/admin/pages/about/partners/${partner.id}/publish`)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">{partner.is_published ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => { if (window.confirm('Delete this partner?')) router.delete(`/admin/pages/about/partners/${partner.id}`); }} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10">Delete</button></div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30';
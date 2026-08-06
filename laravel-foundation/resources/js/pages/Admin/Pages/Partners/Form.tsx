import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type Partner = { id?: number; name: string; role: string | null; description: string | null; url: string | null; sort_order: number; is_published: boolean; logo?: string | null };

export default function Form({ partner }: { partner: Partner | null }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { data, setData, post, put, processing, errors } = useForm({
        name: partner?.name ?? '',
        role: partner?.role ?? '',
        description: partner?.description ?? '',
        url: partner?.url ?? '',
        sort_order: partner?.sort_order ?? 0,
        is_published: partner?.is_published ?? true,
        logo: null as File | null,
    });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const options = { forceFormData: true, preserveScroll: true };
        partner?.id ? put(`/admin/pages/about/partners/${partner.id}`, options) : post('/admin/pages/about/partners', options);
    };

    return (
        <AdminLayout>
            <Head title={partner ? 'Edit Partner' : 'Add Partner'} />
            <div className="mx-auto max-w-3xl space-y-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'About Page', 'Partners', partner ? 'Edit' : 'Add']} />
                    <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{partner ? 'Edit partner' : 'Add partner'}</h1>
                    <p className="mt-1 text-sm text-white/50">{partner ? 'Update the partner record displayed on the about page.' : 'Create a new partner record with logo, name, role, and link.'}</p>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={submit} encType="multipart/form-data" className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField label="Name" error={errors.name}><input required value={data.name} onChange={(event) => setData('name', event.target.value)} className={inputClass} placeholder="e.g. Hany Saad Innovations" /></FormField>
                        <FormField label="Role / affiliation" error={errors.role}><input value={data.role ?? ''} onChange={(event) => setData('role', event.target.value)} className={inputClass} placeholder="e.g. Architecture & design - KOV" /></FormField>
                    </div>
                    <FormField label="Description" error={errors.description}><textarea rows={4} value={data.description ?? ''} onChange={(event) => setData('description', event.target.value)} className={inputClass} placeholder="Optional supporting copy shown beneath the partner card." /></FormField>
                    <FormField label="Website URL" error={errors.url}><input type="url" value={data.url ?? ''} onChange={(event) => setData('url', event.target.value)} className={inputClass} placeholder="https://example.com" /></FormField>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField label="Sort order" error={errors.sort_order}><input type="number" min="0" value={data.sort_order} onChange={(event) => setData('sort_order', Number(event.target.value))} className={inputClass} /></FormField>
                        <FormField label="Logo" error={errors.logo}>
                            <input type="file" accept="image/*" onChange={(event) => setData('logo', event.target.files?.[0] ?? null)} className={fileClass} />
                            {partner?.logo && <img src={partner.logo} alt="Current partner logo" className="mt-3 h-20 w-32 rounded-lg border border-white/10 bg-white/5 object-contain p-2" />}
                        </FormField>
                    </div>
                    <label className="flex items-center gap-3 text-sm text-white/75">
                        <input type="checkbox" checked={data.is_published} onChange={(event) => setData('is_published', event.target.checked)} className="size-4 rounded border-white/20 bg-white/10 text-[#C5A880] focus:ring-[#C5A880]" />
                        <span>Published on public about page</span>
                    </label>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                        <Link href="/admin/pages/about/partners" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">Back to partners</Link>
                        <button disabled={processing} className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-6 py-3 text-sm font-semibold text-black disabled:opacity-50">{partner ? 'Save changes' : 'Create partner'}</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 placeholder:text-white/30';
const fileClass = 'block w-full rounded-xl border border-white/15 bg-[#1e1e22] px-3 py-3 text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C5A880]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#C5A880]';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type Partner = {
    id?: number;
    name: string;
    role: string;
    description: string;
    url: string;
    sort_order: number;
    is_published: boolean;
    logo?: string | null;
};

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
        const options = { forceFormData: true };
        partner?.id ? put(`/admin/pages/about/partners/${partner.id}`, options) : post('/admin/pages/about/partners', options);
    };

    return (
        <AdminLayout>
            <Head title={partner ? 'Edit Partner' : 'Add Partner'} />
            <div className="mx-auto max-w-3xl space-y-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', 'About Us', 'Partners', partner ? 'Edit' : 'Add']} />
                    <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{partner ? 'Edit partner' : 'Add partner'}</h1>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={submit} encType="multipart/form-data" className="space-y-5 rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField label="Name" error={errors.name}>
                            <input required value={data.name} onChange={(event) => setData('name', event.target.value)} className={inputClass} placeholder="Partner name" />
                        </FormField>
                        <FormField label="Role / affiliation" error={errors.role}>
                            <input value={data.role} onChange={(event) => setData('role', event.target.value)} className={inputClass} placeholder="Architecture & design — KOV" />
                        </FormField>
                    </div>

                    <FormField label="Description" error={errors.description}>
                        <textarea rows={3} value={data.description} onChange={(event) => setData('description', event.target.value)} className={inputClass} placeholder="Short description shown on hover or below the partner name." />
                    </FormField>

                    <FormField label="Website URL" error={errors.url}>
                        <input type="url" value={data.url} onChange={(event) => setData('url', event.target.value)} className={inputClass} placeholder="https://example.com" />
                    </FormField>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField label="Sort order" error={errors.sort_order}>
                            <input type="number" min="0" value={data.sort_order} onChange={(event) => setData('sort_order', Number(event.target.value))} className={inputClass} />
                        </FormField>
                        <FormField label="Logo image" error={errors.logo}>
                            <input type="file" accept="image/*" onChange={(event) => setData('logo', event.target.files?.[0] ?? null)} className={fileClass} />
                            {partner?.logo && <img src={partner.logo} alt="Current logo" className="mt-3 h-20 w-auto rounded-lg border border-white/10 bg-white/5 object-contain p-2" />}
                        </FormField>
                    </div>

                    <label className="flex items-center gap-3 text-sm text-white/75">
                        <input type="checkbox" checked={data.is_published} onChange={(event) => setData('is_published', event.target.checked)} className="size-4 rounded border-white/20 bg-white/10 text-[#C5A880] focus:ring-[#C5A880]" />
                        Published (visible on the public About Us page)
                    </label>

                    <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                        <Link href="/admin/pages/about/partners" className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/75 hover:border-white/30 hover:text-white">Cancel</Link>
                        <button disabled={processing} className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">{partner ? 'Save changes' : 'Create partner'}</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

const inputClass = 'w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30';
const fileClass = 'block w-full rounded-xl border border-white/15 bg-[#1e1e22] px-3 py-3 text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C5A880]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#C5A880]';
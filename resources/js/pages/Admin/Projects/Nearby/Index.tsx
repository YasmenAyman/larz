import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, ConfirmationModal, EmptyState, FormField, Notification, Pagination } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';

type Item = {
    id: number;
    project_id: number;
    project: string | null;
    place: string;
    time_label: string | null;
    distance_km: string | null;
    sort_order: number;
    is_active: boolean;
};

type Project = { id: number; title: string };

export default function Index({ items, projects, filters }: { items: { data: Item[]; current_page: number; last_page: number; links: { url: string | null; label: string }[] }; projects: Project[]; filters: { project?: string } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } | null }>>().props;
    const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);
    const form = useForm<{ project_id: number | ''; place: string; time_label: string; distance_km: string; sort_order: number; is_active: boolean }>({
        project_id: '', place: '', time_label: '', distance_km: '', sort_order: 0, is_active: true,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/admin/nearby-locations', { preserveScroll: true, onSuccess: () => form.reset() });
    };

    const remove = (item: Item) => {
        router.delete(`/admin/nearby-locations/${item.id}`, { preserveScroll: true });
        setConfirmDelete(null);
    };

    const filterProject = (value: string) => router.get('/admin/nearby-locations', { project: value || undefined }, { preserveState: true });

    return (
        <AdminLayout>
            <Head title="Nearby Locations" />
            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Admin', 'Projects', 'Nearby Locations']} />
                    <h1 className="mt-3 text-3xl font-semibold">Nearby locations</h1>
                    <p className="mt-2 text-sm text-slate-400">Manage nearby places shown on each project detail page.</p>
                </div>
                <Notification message={flash?.success ?? null} />
                <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                    <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
                        <label className="text-sm text-white/80">
                            <span className="mb-2 block text-xs font-medium text-white/70 uppercase tracking-wider">Project</span>
                            <select value={form.data.project_id} onChange={(event) => form.setData('project_id', event.target.value ? Number(event.target.value) : '')} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                                <option value="">Select project</option>
                                {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                        </label>
                        <FormField label="Place" error={form.errors.place}><input value={form.data.place} onChange={(event) => form.setData('place', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Time label"><input value={form.data.time_label} onChange={(event) => form.setData('time_label', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Distance (km)"><input type="number" step="0.01" value={form.data.distance_km} onChange={(event) => form.setData('distance_km', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Sort order"><input type="number" value={form.data.sort_order} onChange={(event) => form.setData('sort_order', Number(event.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> Active</label>
                        <div className="flex justify-end md:col-span-2"><button type="submit" disabled={form.processing} className="rounded-lg border border-gold bg-gold/10 px-6 py-2 text-xs font-semibold tracking-wider text-gold uppercase hover:bg-gold/20 disabled:opacity-50">{form.processing ? 'Saving...' : 'Add location'}</button></div>
                    </form>
                </section>
                <section className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <label className="flex items-center gap-3 text-sm text-white/80">
                        <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Filter by project</span>
                        <select value={filters.project ?? ''} onChange={(event) => filterProject(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                            <option value="">All projects</option>
                            {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                    </label>
                </section>
                <section className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    {items?.data?.length === 0 ? (
                        <EmptyState title="No nearby locations" message="Add a nearby location to a project." />
                    ) : (
                        <table className="w-full text-sm text-slate-200">
                            <thead className="text-xs tracking-wider text-slate-400 uppercase">
                                <tr className="border-b border-slate-800">
                                    <th className="px-4 py-3 text-left">Project</th>
                                    <th className="px-4 py-3 text-left">Place</th>
                                    <th className="px-4 py-3 text-left">Time</th>
                                    <th className="px-4 py-3 text-left">Distance</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-900">
                                        <td className="px-4 py-3 text-slate-300">{item.project}</td>
                                        <td className="px-4 py-3 text-white">{item.place}</td>
                                        <td className="px-4 py-3 text-slate-300">{item.time_label ?? '—'}</td>
                                        <td className="px-4 py-3 text-slate-300">{item.distance_km ?? '—'}</td>
                                        <td className="px-4 py-3 text-right"><button type="button" onClick={() => setConfirmDelete(item)} className="rounded-lg border border-rose-700/50 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-500 hover:bg-rose-500/10">Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
                <Pagination current={items?.current_page ?? 1} total={items?.last_page ?? 1} />
            </div>
            <ConfirmationModal open={Boolean(confirmDelete)} title="Delete location?" message="Remove this nearby location?" onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && remove(confirmDelete)} />
        </AdminLayout>
    );
}

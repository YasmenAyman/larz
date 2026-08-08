import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, ConfirmationModal, EmptyState, ImageUploadField, Notification, Pagination } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';

type Item = {
    id: number;
    project_id: number;
    project: string | null;
    alt_text: string | null;
    caption: string | null;
    sort_order: number;
    is_published: boolean;
    image: string | null;
};

type Project = { id: number; title: string };
type MediaAsset = { id: number; path: string; original_name: string };

export default function Index({ items, projects, media, filters }: { items: { data: Item[]; current_page: number; last_page: number; links: { url: string | null; label: string }[] }; projects: Project[]; media: MediaAsset[]; filters: { project?: string } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } | null }>>().props;
    const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);
    const form = useForm<{ project_id: number | ''; media_asset_id: number | ''; image: File | null; alt_text: string; caption: string; sort_order: number; is_published: boolean }>({
        project_id: '', media_asset_id: '', image: null, alt_text: '', caption: '', sort_order: 0, is_published: true,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/admin/project-galleries', { forceFormData: true, preserveScroll: true, onSuccess: () => form.reset() });
    };

    const remove = (item: Item) => {
        router.delete(`/admin/project-galleries/${item.id}`, { preserveScroll: true });
        setConfirmDelete(null);
    };

    const filterProject = (value: string) => router.get('/admin/project-galleries', { project: value || undefined }, { preserveState: true });

    return (
        <AdminLayout>
            <Head title="Project Galleries" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Admin', 'Projects', 'Galleries']} />
                    <h1 className="mt-3 text-3xl font-semibold">Project galleries</h1>
                    <p className="mt-2 text-sm text-slate-400">Upload and curate images for each project detail page.</p>
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
                        <label className="text-sm text-white/80">
                            <span className="mb-2 block text-xs font-medium text-white/70 uppercase tracking-wider">Existing asset (optional)</span>
                            <select value={form.data.media_asset_id} onChange={(event) => form.setData('media_asset_id', event.target.value ? Number(event.target.value) : '')} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                                <option value="">Upload new image</option>
                                {media?.map((m) => <option key={m.id} value={m.id}>{m.original_name}</option>)}
                            </select>
                        </label>
                        <ImageUploadField label="Image" onChange={(file) => form.setData('image', Array.isArray(file) ? file[0] ?? null : file)} />
                        <input value={form.data.alt_text} onChange={(event) => form.setData('alt_text', event.target.value)} placeholder="Alt text" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                        <input value={form.data.caption} onChange={(event) => form.setData('caption', event.target.value)} placeholder="Caption" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                        <input type="number" value={form.data.sort_order} onChange={(event) => form.setData('sort_order', Number(event.target.value))} placeholder="Sort order" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" />
                        <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_published} onChange={(event) => form.setData('is_published', event.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> Published</label>
                        <div className="flex justify-end md:col-span-2">
                            <button type="submit" disabled={form.processing} className="rounded-lg border border-gold bg-gold/10 px-6 py-2 text-xs font-semibold tracking-wider text-gold uppercase hover:bg-gold/20 disabled:opacity-50">{form.processing ? 'Saving...' : 'Add image'}</button>
                        </div>
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
                        <EmptyState title="No gallery images" message="Add an image to a project gallery." />
                    ) : (
                        <table className="w-full text-sm text-slate-200">
                            <thead className="text-xs tracking-wider text-slate-400 uppercase">
                                <tr className="border-b border-slate-800">
                                    <th className="px-4 py-3 text-left">Image</th>
                                    <th className="px-4 py-3 text-left">Project</th>
                                    <th className="px-4 py-3 text-left">Alt / Caption</th>
                                    <th className="px-4 py-3 text-left">Sort</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-900">
                                        <td className="px-4 py-3"><div className="h-12 w-16 overflow-hidden rounded bg-slate-800">{item.image && <img src={item.image} className="size-full object-cover" alt={item.alt_text ?? ''} />}</div></td>
                                        <td className="px-4 py-3 text-slate-300">{item.project}</td>
                                        <td className="px-4 py-3 text-slate-300"><p>{item.alt_text ?? '—'}</p><p className="text-xs text-slate-500">{item.caption ?? ''}</p></td>
                                        <td className="px-4 py-3 text-slate-300">{item.sort_order}</td>
                                        <td className="px-4 py-3">{item.is_published ? <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">Published</span> : <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-400">Draft</span>}</td>
                                        <td className="px-4 py-3 text-right"><button type="button" onClick={() => setConfirmDelete(item)} className="rounded-lg border border-rose-700/50 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-500 hover:bg-rose-500/10">Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
                <Pagination current={items?.current_page ?? 1} total={items?.last_page ?? 1} />
            </div>
            <ConfirmationModal open={Boolean(confirmDelete)} title="Delete image?" message="Remove this image from the gallery?" onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && remove(confirmDelete)} />
        </AdminLayout>
    );
}

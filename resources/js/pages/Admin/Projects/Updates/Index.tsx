import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, ConfirmationModal, EmptyState, FormField, ImageUploadField, Notification, Pagination } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';

type Item = {
    id: number;
    project_id: number;
    project: string | null;
    tag: string | null;
    title: string;
    body: string | null;
    published_on: string | null;
    sort_order: number;
    is_published: boolean;
    image: string | null;
};

type Project = { id: number; title: string };

export default function Index({ items, projects, filters }: { items: { data: Item[]; current_page: number; last_page: number; links: { url: string | null; label: string }[] }; projects: Project[]; filters: { project?: string } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } | null }>>().props;
    const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);
    const form = useForm<{ project_id: number | ''; tag: string; title: string; body: string; image: File | null; published_on: string; sort_order: number; is_published: boolean }>({
        project_id: '', tag: '', title: '', body: '', image: null, published_on: '', sort_order: 0, is_published: true,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/admin/project-updates', { forceFormData: true, preserveScroll: true, onSuccess: () => form.reset() });
    };

    const remove = (item: Item) => {
        router.delete(`/admin/project-updates/${item.id}`, { preserveScroll: true });
        setConfirmDelete(null);
    };

    const filterProject = (value: string) => router.get('/admin/project-updates', { project: value || undefined }, { preserveState: true });

    return (
        <AdminLayout>
            <Head title="Construction Updates" />
            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Admin', 'Projects', 'Construction Updates']} />
                    <h1 className="mt-3 text-3xl font-semibold">Construction updates</h1>
                    <p className="mt-2 text-sm text-slate-400">Publish dated construction updates for each project.</p>
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
                        <FormField label="Tag"><input value={form.data.tag} onChange={(event) => form.setData('tag', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Title" error={form.errors.title}><input value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Published on"><input type="date" value={form.data.published_on} onChange={(event) => form.setData('published_on', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Sort order"><input type="number" value={form.data.sort_order} onChange={(event) => form.setData('sort_order', Number(event.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <ImageUploadField label="Image" onChange={(file) => form.setData('image', Array.isArray(file) ? file[0] ?? null : file)} />
                        <FormField label="Body"><textarea rows={4} value={form.data.body} onChange={(event) => form.setData('body', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_published} onChange={(event) => form.setData('is_published', event.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> Published</label>
                        <div className="flex justify-end md:col-span-2"><button type="submit" disabled={form.processing} className="rounded-lg border border-gold bg-gold/10 px-6 py-2 text-xs font-semibold tracking-wider text-gold uppercase hover:bg-gold/20 disabled:opacity-50">{form.processing ? 'Saving...' : 'Add update'}</button></div>
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
                        <EmptyState title="No updates" message="Add a construction update to get started." />
                    ) : (
                        <table className="w-full text-sm text-slate-200">
                            <thead className="text-xs tracking-wider text-slate-400 uppercase">
                                <tr className="border-b border-slate-800">
                                    <th className="px-4 py-3 text-left">Project</th>
                                    <th className="px-4 py-3 text-left">Image</th>
                                    <th className="px-4 py-3 text-left">Tag</th>
                                    <th className="px-4 py-3 text-left">Title</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-900">
                                        <td className="px-4 py-3 text-slate-300">{item.project}</td>
                                        <td className="px-4 py-3"><div className="h-12 w-16 overflow-hidden rounded bg-slate-800">{item.image && <img src={item.image} className="size-full object-cover" alt={item.title} />}</div></td>
                                        <td className="px-4 py-3 text-slate-300">{item.tag ?? '—'}</td>
                                        <td className="px-4 py-3 text-white">{item.title}</td>
                                        <td className="px-4 py-3 text-slate-300">{item.published_on ?? '—'}</td>
                                        <td className="px-4 py-3 text-right"><button type="button" onClick={() => setConfirmDelete(item)} className="rounded-lg border border-rose-700/50 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-500 hover:bg-rose-500/10">Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
                <Pagination current={items?.current_page ?? 1} total={items?.last_page ?? 1} />
            </div>
            <ConfirmationModal open={Boolean(confirmDelete)} title="Delete update?" message="Remove this construction update?" onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && remove(confirmDelete)} />
        </AdminLayout>
    );
}

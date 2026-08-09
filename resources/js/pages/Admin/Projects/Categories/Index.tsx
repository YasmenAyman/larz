import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, ConfirmationModal, EmptyState, FormField, Notification } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    projects_count?: number;
};

type Form = { id?: number; name: string; slug: string; description: string; is_active: boolean };

export default function Index({ categories }: { categories: Category[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } | null }>>().props;
    const [editing, setEditing] = useState<Category | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
    const form = useForm<Form>({ name: '', slug: '', description: '', is_active: true });

    const reset = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
    };

    const onEdit = (category: Category) => {
        setEditing(category);
        form.setData({ id: category.id, name: category.name, slug: category.slug, description: category.description ?? '', is_active: category.is_active });
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editing) {
            form.put(`/admin/project-categories/${editing.id}`, { preserveScroll: true, onSuccess: reset });
        } else {
            form.post('/admin/project-categories', { preserveScroll: true, onSuccess: reset });
        }
    };

    const remove = (category: Category) => {
        router.delete(`/admin/project-categories/${category.id}`, { preserveScroll: true });
        setConfirmDelete(null);
    };

    return (
        <AdminLayout>
            <Head title="Project Categories" />
            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Admin', 'Projects', 'Categories']} />
                    <h1 className="mt-3 text-3xl font-semibold">Project categories</h1>
                    <p className="mt-2 text-sm text-slate-400">Group projects by their type, region, or status.</p>
                </div>
                <Notification message={flash?.success ?? null} />
                <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                        <FormField label="Name" error={form.errors.name}><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Slug" error={form.errors.slug}><input value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <FormField label="Description" error={form.errors.description}><textarea rows={3} value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                        <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="size-4 rounded border-slate-700 bg-slate-900" /> Active</label>
                        <div className="flex justify-end gap-2 md:col-span-2">
                            {editing && <button type="button" onClick={reset} className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:border-slate-500">Cancel</button>}
                            <button type="submit" disabled={form.processing} className="rounded-lg border border-gold bg-gold/10 px-4 py-2 text-xs font-semibold tracking-wider text-gold uppercase hover:bg-gold/20 disabled:opacity-50">{form.processing ? 'Saving...' : (editing ? 'Update category' : 'Create category')}</button>
                        </div>
                    </form>
                </section>
                <section className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    {categories.length === 0 ? (
                        <EmptyState title="No categories" message="Add categories to organise projects." />
                    ) : (
                        <table className="w-full text-sm text-slate-200">
                            <thead className="text-xs tracking-wider text-slate-400 uppercase">
                                <tr className="border-b border-slate-800">
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Slug</th>
                                    <th className="px-4 py-3 text-left">Projects</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-b border-slate-900">
                                        <td className="px-4 py-3 text-white">{category.name}</td>
                                        <td className="px-4 py-3 text-slate-400">{category.slug}</td>
                                        <td className="px-4 py-3 text-slate-200">{category.projects_count ?? 0}</td>
                                        <td className="px-4 py-3">{category.is_active ? <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">Active</span> : <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-400">Inactive</span>}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button type="button" onClick={() => onEdit(category)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-gold hover:text-gold">Edit</button>
                                                <button type="button" onClick={() => setConfirmDelete(category)} className="rounded-lg border border-rose-700/50 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-500 hover:bg-rose-500/10">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
            <ConfirmationModal open={Boolean(confirmDelete)} title="Delete category?" message={`Delete "${confirmDelete?.name ?? ''}"? Projects in this category will not be deleted.`} onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && remove(confirmDelete)} />
        </AdminLayout>
    );
}

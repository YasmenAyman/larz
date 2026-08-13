import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, ConfirmationModal, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type Category = { id: number; name: string; slug: string; type: string; posts_count: number };

export default function Index({ categories }: { categories: Category[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const [editing, setEditing] = useState<Category | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
    const form = useForm({ name: '', slug: '', type: 'blog' });

    const reset = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
    };

    const onEdit = (category: Category) => {
        setEditing(category);
        form.setData({ name: category.name, slug: category.slug, type: category.type });
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editing) {
            form.put(`/admin/media/categories/${editing.id}`, { preserveScroll: true, onSuccess: reset });
        } else {
            form.post('/admin/media/categories', { preserveScroll: true, onSuccess: reset });
        }
    };

    const remove = (category: Category) => {
        router.delete(`/admin/media/categories/${category.id}`, { preserveScroll: true });
        setConfirmDelete(null);
    };

    return (
        <AdminLayout>
            <Head title="Media Categories" />
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <Breadcrumbs items={['Admin', 'Media', 'Categories']} />
                <h1 className="text-3xl font-semibold">Media categories</h1>
                <Notification message={flash?.success} />
                <form onSubmit={submit} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950 p-5 sm:grid-cols-4">
                    <FormField label="Name" error={form.errors.name}><input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                    <FormField label="Slug" error={form.errors.slug}><input value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></FormField>
                    <FormField label="Type" error={form.errors.type}><select value={form.data.type} onChange={(event) => form.setData('type', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"><option value="press">Press</option><option value="blog">Blog</option><option value="general">General</option></select></FormField>
                    <div className="flex items-end gap-2">
                        {editing && <button type="button" onClick={reset} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">Cancel</button>}
                        <button disabled={form.processing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm disabled:opacity-50">{editing ? 'Update' : 'Add category'}</button>
                    </div>
                </form>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Posts</th><th className="px-4 py-3 text-right">Actions</th></tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b border-slate-800/70">
                                    <td className="px-4 py-4">{category.name}</td>
                                    <td className="px-4 py-4 text-slate-400">{category.slug}</td>
                                    <td className="px-4 py-4 text-slate-400">{category.type}</td>
                                    <td className="px-4 py-4 text-slate-400">{category.posts_count}</td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => onEdit(category)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-gold hover:text-gold">Edit</button>
                                            <button type="button" onClick={() => setConfirmDelete(category)} className="rounded-lg border border-rose-700/50 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-500">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmationModal open={Boolean(confirmDelete)} title="Delete category?" message={`Delete "${confirmDelete?.name ?? ''}"? Posts in this category will not be deleted.`} onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && remove(confirmDelete)} />
        </AdminLayout>
    );
}

import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, ConfirmationModal, EmptyState, FilterSelect, Notification, Pagination, SearchInput } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';
import { useI18n } from '@/i18n';

type ProjectRow = {
    id: number;
    title: string;
    slug: string;
    location: string | null;
    project_type: string | null;
    status: string | null;
    is_published: boolean;
    is_featured: boolean;
    sort_order: number;
    category: string | null;
    image: string | null;
};

type Category = { id: number; name: string };

export default function Index({ projects, categories, filters }: { projects: { data: ProjectRow[]; links: { url: string | null; label: string }[]; current_page: number; last_page: number }; categories: Category[]; filters: { search?: string; status?: string; category?: string } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } | null }>>().props;
    const { t } = useI18n();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const [confirmDelete, setConfirmDelete] = useState<ProjectRow | null>(null);

    const applyFilters = (next: { search?: string; status?: string; category?: string }) => {
        router.get('/admin/projects', { ...filters, ...next }, { preserveState: true, replace: true });
    };

    const publish = (project: ProjectRow) => router.post(`/admin/projects/${project.id}/publish`, {}, { preserveScroll: true });
    const feature = (project: ProjectRow) => router.post(`/admin/projects/${project.id}/feature`, {}, { preserveScroll: true });
    const remove = (project: ProjectRow) => {
        router.delete(`/admin/projects/${project.id}`, { preserveScroll: true });
        setConfirmDelete(null);
    };

    return (
        <AdminLayout>
            <Head title="Projects" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Breadcrumbs items={['Dashboard', 'Projects']} />
                        <h1 className="mt-3 text-3xl font-semibold">{t('Projects')}</h1>
                        <p className="mt-2 text-sm text-slate-400">{t('Manage all real estate projects, listings, and rich details.')}</p>
                    </div>
                    <Link href="/admin/projects/create" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-emerald-500">
                        + {t('New Project')}
                    </Link>
                </div>
                <Notification message={flash?.success ?? null} />
                <section className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <SearchInput value={search} onChange={(value) => { setSearch(value); applyFilters({ search: value }); }} placeholder={t('Search by title...')} />
                        <FilterSelect value={status} onChange={(value) => { setStatus(value); applyFilters({ status: value }); }} options={[t('All'), t('Published'), t('Draft')]} />
                        <select
                            value={category}
                            onChange={(event) => { setCategory(event.target.value); applyFilters({ category: event.target.value }); }}
                            className="h-[42px] rounded-xl border border-white/15 bg-[#1e1e22] px-3.5 text-sm text-white/90 outline-none focus:border-[#C5A880]"
                        >
                            <option value="">{t('All categories')}</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{t(c.name)}</option>)}
                        </select>
                    </div>
                </section>
                <section className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    {projects?.data?.length === 0 ? (
                        <EmptyState title="No projects yet" message="Create your first project to populate the public site." />
                    ) : (
                        <table className="w-full text-sm text-slate-200">
                            <thead className="text-xs tracking-wider text-slate-400 uppercase">
                                <tr className="border-b border-slate-800">
                                    <th className="px-4 py-3 text-start">{t('Project')}</th>
                                    <th className="px-4 py-3 text-start">{t('Category')}</th>
                                    <th className="px-4 py-3 text-start">{t('Location')}</th>
                                    <th className="px-4 py-3 text-start">{t('Status')}</th>
                                    <th className="px-4 py-3 text-start">{t('Featured')}</th>
                                    <th className="px-4 py-3 text-center">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects?.data?.map((project) => (
                                    <tr key={project.id} className="border-b border-slate-900">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                                                    {project.image && <img src={project.image} alt={project.title} className="size-full object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{project.title}</p>
                                                    <p className="text-xs text-slate-400">/{project.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">{project.category ? t(project.category) : '—'}</td>
                                        <td className="px-4 py-3 text-slate-300">{project.location ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <button type="button" onClick={() => publish(project)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${project.is_published ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                                                {project.is_published ? t('Published') : t('Draft')}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button type="button" onClick={() => feature(project)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${project.is_featured ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                                                {project.is_featured ? t('Featured') : t('Normal')}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link href={`/admin/projects/${project.id}/edit`} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-gold hover:text-gold">{t('Edit')}</Link>
                                                <button type="button" onClick={() => setConfirmDelete(project)} className="rounded-lg border border-rose-700/50 px-3 py-1.5 text-xs text-rose-300 hover:border-rose-500 hover:bg-rose-500/10">{t('Delete')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
                <Pagination current={projects?.current_page ?? 1} total={projects?.last_page ?? 1} />
            </div>
            <ConfirmationModal
                open={Boolean(confirmDelete)}
                title={t('Delete project?')}
                message={`${t('Are you sure you want to delete')} "${confirmDelete?.title ?? ''}"? ${t('The project will be moved to trash and can be restored.')}`}
                onCancel={() => setConfirmDelete(null)}
                onConfirm={() => confirmDelete && remove(confirmDelete)}
            />
        </AdminLayout>
    );
}

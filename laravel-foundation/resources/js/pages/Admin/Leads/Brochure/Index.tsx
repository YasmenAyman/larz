import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, Notification, Pagination, SearchInput, StatusBadge } from '@/components/admin/AdminLayoutParts';

type Request = {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    project: string | null;
    status: string;
    assigned_to: string | null;
    source: string | null;
    source_url: string | null;
    downloaded_at: string | null;
    created_at: string | null;
};

const statuses = ['new', 'in_progress', 'delivered', 'closed', 'spam'];

export default function Index({ requests, filters }: { requests: { data: Request[]; current_page: number; last_page: number }; filters: { search?: string; status?: string } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;

    return (
        <AdminLayout>
            <Head title="Brochure Requests" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div><Breadcrumbs items={['Admin', 'Leads', 'Brochure requests']} /><h1 className="mt-3 text-3xl font-semibold">Brochure requests</h1></div>
                <Notification message={flash?.success} />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SearchInput value={filters.search ?? ''} onChange={(value) => router.get('/admin/brochure-requests', { search: value }, { preserveState: true })} placeholder="Search by name, email, phone" />
                    <select value={filters.status ?? ''} onChange={(event) => router.get('/admin/brochure-requests', { ...filters, status: event.target.value || undefined }, { preserveState: true })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                        <option value="">All statuses</option>
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                {requests.data.length === 0
                    ? <EmptyState title="No brochure requests yet" message="When a visitor requests a brochure it will appear here." />
                    : <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                                <tr><th className="px-4 py-3">Lead</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Assigned</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Delivered</th><th className="px-4 py-3" /></tr>
                            </thead>
                            <tbody>
                                {requests.data.map((request) => <RequestRow key={request.id} request={request} />)}
                            </tbody>
                        </table>
                    </div>}
                <Pagination current={requests.current_page} total={requests.last_page} />
            </div>
        </AdminLayout>
    );
}

function RequestRow({ request }: { request: Request }) {
    const { data, setData, put, processing } = useForm<{ status: string; admin_notes: string }>({ status: request.status, admin_notes: '' });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/admin/brochure-requests/${request.id}`, { preserveScroll: true });
    };

    return (
        <tr className="border-b border-slate-800/70 align-top">
            <td className="px-4 py-4"><p>{request.name}</p><p className="text-xs text-slate-500">{request.email}</p><p className="text-xs text-slate-500">{request.phone}</p></td>
            <td className="px-4 py-4 text-slate-400">{request.project ?? '—'}</td>
            <td className="px-4 py-4"><StatusBadge status={request.status} /></td>
            <td className="px-4 py-4 text-slate-400">{request.assigned_to ?? 'Unassigned'}</td>
            <td className="px-4 py-4 text-slate-400">{request.source}{request.source_url && <a href={request.source_url} target="_blank" rel="noreferrer" className="block text-xs text-emerald-400 truncate max-w-[180px]">{request.source_url}</a>}</td>
            <td className="px-4 py-4 text-xs text-slate-500">{request.downloaded_at ?? '—'}</td>
            <td className="px-4 py-4">
                <form className="space-y-2" onSubmit={submit}>
                    <select value={data.status} onChange={(event) => setData('status', event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs">
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <FormField label="Internal notes"><textarea rows={2} value={data.admin_notes} onChange={(event) => setData('admin_notes', event.target.value)} className="w-44 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs" /></FormField>
                    <button type="submit" disabled={processing} className="rounded bg-emerald-600 px-3 py-1.5 text-xs">Save</button>
                </form>
            </td>
        </tr>
    );
}
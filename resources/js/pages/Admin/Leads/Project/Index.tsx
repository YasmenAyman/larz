import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, Notification, Pagination, SearchInput, StatusBadge } from '@/components/admin/AdminLayoutParts';

type Inquiry = {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    project: string | null;
    unit_type: string | null;
    preferred_contact_method: string | null;
    status: string;
    assigned_to: string | null;
    source: string | null;
    source_url: string | null;
    created_at: string | null;
};

const statuses = ['new', 'in_progress', 'contacted', 'qualified', 'closed', 'spam'];

export default function Index({ inquiries, filters }: { inquiries: { data: Inquiry[]; current_page: number; last_page: number }; filters: { search?: string; status?: string } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;

    return (
        <AdminLayout>
            <Head title="Project Inquiries" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div><Breadcrumbs items={['Admin', 'Leads', 'Project inquiries']} /><h1 className="mt-3 text-3xl font-semibold">Project inquiries</h1></div>
                <Notification message={flash?.success} />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SearchInput value={filters.search ?? ''} onChange={(value) => router.get('/admin/project-inquiries', { search: value }, { preserveState: true })} placeholder="Search by name, email, phone" />
                    <select value={filters.status ?? ''} onChange={(event) => router.get('/admin/project-inquiries', { ...filters, status: event.target.value || undefined }, { preserveState: true })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                        <option value="">All statuses</option>
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                {inquiries.data.length === 0
                    ? <EmptyState title="No inquiries yet" message="Project inquiry submissions will appear here." />
                    : <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                                <tr><th className="px-4 py-3">Lead</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Assigned</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3" /></tr>
                            </thead>
                            <tbody>
                                {inquiries.data.map((inquiry) => <InquiryRow key={inquiry.id} inquiry={inquiry} />)}
                            </tbody>
                        </table>
                    </div>}
                <Pagination current={inquiries.current_page} total={inquiries.last_page} />
            </div>
        </AdminLayout>
    );
}

function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
    const { data, setData, put, processing } = useForm<{ status: string; admin_notes: string }>({ status: inquiry.status, admin_notes: '' });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/admin/project-inquiries/${inquiry.id}`, { preserveScroll: true });
    };

    return (
        <tr className="border-b border-slate-800/70 align-top">
            <td className="px-4 py-4"><p>{inquiry.name}</p><p className="text-xs text-slate-500">{inquiry.email}</p><p className="text-xs text-slate-500">{inquiry.phone} · {inquiry.preferred_contact_method}</p></td>
            <td className="px-4 py-4 text-slate-400">{inquiry.project ?? '—'}</td>
            <td className="px-4 py-4 text-slate-400">{inquiry.unit_type ?? '—'}</td>
            <td className="px-4 py-4"><StatusBadge status={inquiry.status} /></td>
            <td className="px-4 py-4 text-slate-400">{inquiry.assigned_to ?? 'Unassigned'}</td>
            <td className="px-4 py-4 text-slate-400">{inquiry.source}{inquiry.source_url && <a href={inquiry.source_url} target="_blank" rel="noreferrer" className="block text-xs text-emerald-400 truncate max-w-[180px]">{inquiry.source_url}</a>}</td>
            <td className="px-4 py-4 text-xs text-slate-500">{inquiry.created_at}</td>
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
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FormField, Notification, Pagination, SearchInput, StatusBadge } from '@/components/admin/AdminLayoutParts';

type Inquiry = {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    project: string | null;
    status: string;
    message: string | null;
    assigned_to: string | null;
    source: string | null;
    source_url: string | null;
    consent_at: string | null;
    created_at: string | null;
};

const statuses = ['new', 'in_progress', 'contacted', 'qualified', 'closed', 'spam'];

export default function Index({ inquiries, filters }: { inquiries: { data: Inquiry[]; current_page: number; last_page: number }; filters: { search?: string; status?: string } }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const [selected, setSelected] = useState<Inquiry | null>(null);

    return (
        <AdminLayout>
            <Head title="Contact Inquiries" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div><Breadcrumbs items={['Admin', 'Leads', 'Contact inquiries']} /><h1 className="mt-3 text-3xl font-semibold">Contact inquiries</h1></div>
                <Notification message={flash?.success} />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SearchInput value={filters.search ?? ''} onChange={(value) => router.get('/admin/contact-inquiries', { search: value }, { preserveState: true })} placeholder="Search by name, email, phone" />
                    <select value={filters.status ?? ''} onChange={(event) => router.get('/admin/contact-inquiries', { ...filters, status: event.target.value || undefined }, { preserveState: true })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                        <option value="">All statuses</option>
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                {inquiries.data.length === 0
                    ? <EmptyState title="No inquiries yet" message="Submissions from the public contact form will appear here." />
                    : <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                                <tr><th className="px-4 py-3">Lead</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Assigned</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3" /></tr>
                            </thead>
                            <tbody>
                                {inquiries.data.map((inquiry) => <InquiryRow key={inquiry.id} inquiry={inquiry} onView={setSelected} />)}
                            </tbody>
                        </table>
                    </div>}
                <Pagination current={inquiries.current_page} total={inquiries.last_page} />
            </div>

            {selected && <DetailPanel inquiry={selected} onClose={() => setSelected(null)} />}
        </AdminLayout>
    );
}

function InquiryRow({ inquiry, onView }: { inquiry: Inquiry; onView: (i: Inquiry) => void }) {
    const { data, setData, put } = useForm<{ status: string }>({ status: inquiry.status });

    const onStatusChange = (value: string) => {
        setData('status', value);
        put(`/admin/contact-inquiries/${inquiry.id}`, { preserveScroll: true });
    };

    return (
        <tr className="border-b border-slate-800/70 align-top">
            <td className="px-4 py-4">
                <button type="button" onClick={() => onView(inquiry)} className="text-left hover:underline">
                    <p className="font-medium text-emerald-400">{inquiry.name}</p>
                </button>
                <p className="text-xs text-slate-500">{inquiry.email}</p>
                <p className="text-xs text-slate-500">{inquiry.phone}</p>
            </td>
            <td className="px-4 py-4 text-slate-400">{inquiry.project ?? '—'}</td>
            <td className="px-4 py-4"><StatusBadge status={inquiry.status} /></td>
            <td className="px-4 py-4 text-slate-400">{inquiry.assigned_to ?? 'Unassigned'}</td>
            <td className="px-4 py-4 text-slate-400">{inquiry.source}{inquiry.source_url && <a href={inquiry.source_url} target="_blank" rel="noreferrer" className="block text-xs text-emerald-400 truncate max-w-[180px]">{inquiry.source_url}</a>}</td>
            <td className="px-4 py-4 text-xs text-slate-500">{inquiry.created_at}</td>
            <td className="px-4 py-4">
                <select value={data.status} onChange={(event) => onStatusChange(event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs">
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
            </td>
        </tr>
    );
}

function DetailPanel({ inquiry, onClose }: { inquiry: Inquiry; onClose: () => void }) {
    const { data, setData, put, processing } = useForm<{ status: string }>({ status: inquiry.status });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/admin/contact-inquiries/${inquiry.id}`, { preserveScroll: true, onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative ml-auto flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-slate-800 bg-slate-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                    <h2 className="text-lg font-semibold">Inquiry details</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                </div>

                <div className="flex-1 space-y-6 px-6 py-5">
                    <section>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-medium text-white">{inquiry.name}</p>
                            {inquiry.email && <p className="text-slate-300">{inquiry.email}</p>}
                            <p className="text-slate-300">{inquiry.phone}</p>
                        </div>
                    </section>

                    {inquiry.message && (
                        <section>
                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Message</h3>
                            <p className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">{inquiry.message}</p>
                        </section>
                    )}

                    <section className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Project</h3>
                            <p className="text-slate-300">{inquiry.project ?? '—'}</p>
                        </div>
                        <div>
                            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</h3>
                            <StatusBadge status={inquiry.status} />
                        </div>
                        <div>
                            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Source</h3>
                            <p className="text-slate-300">{inquiry.source ?? '—'}</p>
                            {inquiry.source_url && <a href={inquiry.source_url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-emerald-400 hover:underline">{inquiry.source_url}</a>}
                        </div>
                        <div>
                            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned</h3>
                            <p className="text-slate-300">{inquiry.assigned_to ?? 'Unassigned'}</p>
                        </div>
                        <div>
                            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted</h3>
                            <p className="text-slate-300">{inquiry.created_at ?? '—'}</p>
                        </div>
                        {inquiry.consent_at && (
                            <div>
                                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Consent</h3>
                                <p className="text-slate-300">{inquiry.consent_at}</p>
                            </div>
                        )}
                    </section>

                    <section className="border-t border-slate-800 pt-5">
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Update</h3>
                        <form className="space-y-3" onSubmit={submit}>
                            <FormField label="Status">
                                <select value={data.status} onChange={(event) => setData('status', event.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
                                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </FormField>
                            <button type="submit" disabled={processing} className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50">Save changes</button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, StatusBadge } from '@/components/admin/AdminLayoutParts';

type ApplicationType = 'job' | 'internship' | 'cv';
type StaffUser = { id: number; name: string };
type ApplicationItem = {
    id: number;
    name: string;
    email: string;
    status: string;
    job: string | null;
    assigned_to: string | null;
    assigned_to_id: number | null;
    admin_notes: string | null;
    submission_date: string | null;
    has_resume: boolean;
};

const statuses = ['new', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'archived'];

export default function Index({ type, applications, users }: { type: ApplicationType; applications: { data: ApplicationItem[] }; users: StaffUser[] }) {
    const base = type === 'job' ? 'job-applications' : type === 'internship' ? 'internship-applications' : 'general-cv-submissions';

    return (
        <AdminLayout>
            <Head title="Applications" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <Breadcrumbs items={['Admin', type === 'cv' ? 'General CV Submissions' : `${type} Applications`]} />
                <h1 className="text-3xl font-semibold">{type === 'cv' ? 'General CV submissions' : `${type} applications`}</h1>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                            <tr><th className="px-4 py-3">Applicant</th><th className="px-4 py-3">Job/program</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Assigned</th><th className="px-4 py-3">Notes</th><th className="px-4 py-3">CV</th><th className="px-4 py-3" /></tr>
                        </thead>
                        <tbody>
                            {applications.data.map((item) => <ApplicationRow key={item.id} item={item} users={users} base={base} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

function ApplicationRow({ item, users, base }: { item: ApplicationItem; users: StaffUser[]; base: string }) {
    const { data, setData, put, processing } = useForm({
        status: item.status,
        assigned_to: item.assigned_to_id ? String(item.assigned_to_id) : '',
        admin_notes: item.admin_notes ?? '',
    });

    const save = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/admin/${base}/${item.id}`, { preserveScroll: true });
    };

    return (
        <tr className="border-b border-slate-800/70 align-top">
            <td className="px-4 py-4"><p>{item.name}</p><p className="text-xs text-slate-500">{item.email}</p><p className="mt-1 text-xs text-slate-600">{item.submission_date ?? ''}</p></td>
            <td className="px-4 py-4 text-slate-400">{item.job ?? 'General CV'}</td>
            <td className="px-4 py-4"><StatusBadge status={item.status} /><select value={data.status} onChange={(event) => setData('status', event.target.value)} className="mt-2 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs"><option value="">Select status</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
            <td className="px-4 py-4"><select value={data.assigned_to} onChange={(event) => setData('assigned_to', event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs"><option value="">Unassigned</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></td>
            <td className="px-4 py-4"><textarea rows={2} value={data.admin_notes} onChange={(event) => setData('admin_notes', event.target.value)} className="w-48 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs" placeholder="Internal notes" /></td>
            <td className="px-4 py-4">{item.has_resume ? <a href={`/admin/${base}/${item.id}/cv`} className="text-emerald-400">Download</a> : 'None'}</td>
            <td className="px-4 py-4"><button type="button" disabled={processing} onClick={save} className="rounded bg-emerald-600 px-3 py-2 text-xs">Save</button></td>
        </tr>
    );
}

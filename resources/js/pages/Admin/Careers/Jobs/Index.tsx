import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, SearchInput, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

export default function Index({ jobs, filters }: { jobs: { data: Array<{ id: number; title: string; department: string; location: string; published: boolean; featured: boolean }> }; filters: { search?: string } }) {
  const destroyForm = useForm({});
  const { locale } = useI18n();
  const ar = locale === 'ar';
  const tr = (value: string) => ar ? ({ Dashboard: 'لوحة التحكم', Jobs: 'الوظائف', 'Job vacancies': 'الوظائف الشاغرة', 'Create job': 'إنشاء وظيفة', Search: 'ابحث...', Title: 'العنوان', Department: 'القسم', Location: 'الموقع', Status: 'الحالة', Edit: 'تعديل', Delete: 'حذف', Published: 'منشور', Draft: 'مسودة' } as Record<string, string>)[value] ?? value : value;
  const handleDelete = (id: number) => {
    if (!confirm('Delete this job?')) return;
    destroyForm.delete(`/admin/jobs/${id}`);
  };

  return (
    <AdminLayout>
      <Head title={tr('Jobs')} />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <Breadcrumbs items={['Dashboard', 'Jobs'].map(tr)} />
            <h1 className="mt-3 text-3xl font-semibold">{tr('Job vacancies')}</h1>
          </div>
          <Link href="/admin/jobs/create" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm">{tr('Create job')}</Link>
        </div>
        <SearchInput value={filters.search ?? ''} placeholder={tr('Search')} onChange={(value) => router.get('/admin/jobs', { search: value }, { preserveState: true })} />
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table dir={ar ? 'rtl' : 'ltr'} className="w-full text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start">{tr('Title')}</th>
                <th className="px-4 py-3 text-center">{tr('Department')}</th>
                <th className="px-4 py-3 text-center">{tr('Location')}</th>
                <th className="px-4 py-3 text-center">{tr('Status')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {jobs.data.map((job) => (
                <tr key={job.id} className="border-b border-slate-800/70">
                  <td className="px-4 py-4 text-start">{job.title}</td>
                  <td className="px-4 py-4 text-center text-slate-400">{job.department}</td>
                  <td className="px-4 py-4 text-center text-slate-400">{job.location}</td>
                  <td className="px-4 py-4 text-center"><StatusBadge status={job.published ? tr('Published') : tr('Draft')} /></td>
                  <td className="flex items-center gap-3 px-4 py-4">
                    <Link href={`/admin/jobs/${job.id}/edit`} className="text-emerald-400">{tr('Edit')}</Link>
                    <button type="button" onClick={() => handleDelete(job.id)} className="text-red-400 hover:text-red-300">{tr('Delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

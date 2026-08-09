import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';

type TranslationFields = { title: string; department: string; location: string; employment_type: string; experience_level: string; summary: string; description: string; requirements: string; responsibilities: string; benefits: string };
type JobForm = { slug: string; deadline: string; is_published: boolean; is_featured: boolean; sort_order: number; translations: { en: TranslationFields; ar: TranslationFields } };
type JobRecord = Partial<JobForm> & { id?: number; translations?: { en?: Partial<TranslationFields>; ar?: Partial<TranslationFields> } } & Partial<TranslationFields>;

const tabs = ['English', 'العربية'] as const;
type Tab = typeof tabs[number];

export default function Form({ job }: { job: JobRecord | null }) {
  const [activeTab, setActiveTab] = useState<Tab>('English');
  const { data, setData, post, put, processing } = useForm<JobForm>({
    slug: job?.slug ?? '',
    deadline: job?.deadline ?? '',
    is_published: job?.is_published ?? false,
    is_featured: job?.is_featured ?? false,
    sort_order: job?.sort_order ?? 0,
    translations: {
      en: {
        title: job?.translations?.en?.title ?? job?.title ?? '',
        department: job?.translations?.en?.department ?? job?.department ?? '',
        location: job?.translations?.en?.location ?? job?.location ?? '',
        employment_type: job?.translations?.en?.employment_type ?? job?.employment_type ?? 'Full-time',
        experience_level: job?.translations?.en?.experience_level ?? job?.experience_level ?? '',
        summary: job?.translations?.en?.summary ?? job?.summary ?? '',
        description: job?.translations?.en?.description ?? job?.description ?? '',
        requirements: job?.translations?.en?.requirements ?? job?.requirements ?? '',
        responsibilities: job?.translations?.en?.responsibilities ?? job?.responsibilities ?? '',
        benefits: job?.translations?.en?.benefits ?? job?.benefits ?? '',
      },
      ar: {
        title: job?.translations?.ar?.title ?? '',
        department: job?.translations?.ar?.department ?? '',
        location: job?.translations?.ar?.location ?? '',
        employment_type: job?.translations?.ar?.employment_type ?? '',
        experience_level: job?.translations?.ar?.experience_level ?? '',
        summary: job?.translations?.ar?.summary ?? '',
        description: job?.translations?.ar?.description ?? '',
        requirements: job?.translations?.ar?.requirements ?? '',
        responsibilities: job?.translations?.ar?.responsibilities ?? '',
        benefits: job?.translations?.ar?.benefits ?? '',
      },
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    job?.id ? put(`/admin/jobs/${job.id}`) : post('/admin/jobs');
  };

  const setTranslation = (locale: 'en' | 'ar', field: keyof TranslationFields, value: string) => {
    setData('translations', { ...data.translations, [locale]: { ...data.translations[locale], [field]: value } });
  };

  const activeLocale = activeTab === 'English' ? 'en' : 'ar';

  const tabInputFields: Array<[keyof TranslationFields, string]> = [['title', 'Title'], ['department', 'Department'], ['location', 'Location'], ['employment_type', 'Employment type'], ['experience_level', 'Experience level']];
  const tabTextareaFields: Array<[keyof TranslationFields, string, number]> = [['summary', 'Summary', 3], ['description', 'Description', 5], ['requirements', 'Requirements', 4], ['responsibilities', 'Responsibilities', 4], ['benefits', 'Benefits', 3]];

  return (
    <AdminLayout>
      <Head title={job ? 'Edit Job' : 'Create Job'} />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={['Admin', 'Jobs', job ? 'Edit' : 'Create']} />
        <h1 className="text-3xl font-semibold">{job ? 'Edit job' : 'Create job'}</h1>

        <form onSubmit={submit} className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Slug">
                <input value={data.slug} onChange={(e) => setData('slug', e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
              </FormField>
              <FormField label="Deadline">
                <input type="date" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
              </FormField>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
            <div className="mb-4 flex gap-2 border-b border-slate-800 pb-3">
              {tabs.map((tab) => {
                const locale = tab === 'English' ? 'en' : 'ar';
                const allFields = [...tabInputFields, ...tabTextareaFields.map(([k, l]) => [k, l] as const)];
                const filled = allFields.filter(([key]) => data.translations[locale][key]?.trim()).length;
                return (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                    {tab} {filled > 0 && <span className="ml-1 text-xs text-emerald-400">{filled}/{allFields.length}</span>}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="grid gap-5 sm:grid-cols-2">
                {tabInputFields.map(([key, label]) => (
                  <FormField key={`${activeLocale}-${key}`} label={label}>
                    <input
                      value={data.translations[activeLocale][key]}
                      onChange={(e) => setTranslation(activeLocale, key, e.target.value)}
                      dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                    />
                  </FormField>
                ))}
              </div>

              {tabTextareaFields.map(([key, label, rows]) => (
                <FormField key={`${activeLocale}-${key}`} label={label}>
                  <textarea
                    value={data.translations[activeLocale][key]}
                    onChange={(e) => setTranslation(activeLocale, key, e.target.value)}
                    rows={rows}
                    dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                  />
                </FormField>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <FormField label="Sort order">
                <input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
              </FormField>
              <FormField label="Published">
                <button type="button" onClick={() => setData('is_published', !data.is_published)} className={`mt-1 rounded-lg px-4 py-2 text-sm font-medium transition ${data.is_published ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {data.is_published ? 'Published' : 'Draft'}
                </button>
              </FormField>
              <FormField label="Featured">
                <button type="button" onClick={() => setData('is_featured', !data.is_featured)} className={`mt-1 rounded-lg px-4 py-2 text-sm font-medium transition ${data.is_featured ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {data.is_featured ? 'Featured' : 'Not featured'}
                </button>
              </FormField>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={processing} className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50">
              {job?.id ? 'Update job' : 'Create job'}
            </button>
            <a href="/admin/jobs" className="rounded-lg bg-slate-800 px-6 py-2 text-sm text-slate-300 hover:bg-slate-700">Cancel</a>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

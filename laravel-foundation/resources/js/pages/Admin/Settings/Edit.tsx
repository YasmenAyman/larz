import { Head, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';

type Setting = { key: string; value: string | null; group_name: string; description: string | null };

export default function Edit({ settings }: { settings: Setting[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { data, setData, put, processing } = useForm<{ settings: Record<string, string> }>({ settings: Object.fromEntries(settings.map((setting) => [setting.key, setting.value ?? ''])) });
    return <AdminLayout><Head title="Global Settings" /><div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"><div><Breadcrumbs items={['Admin', 'Global Settings']} /><h1 className="mt-3 text-3xl font-semibold">Global settings</h1></div><Notification message={flash?.success} /><form onSubmit={(event) => { event.preventDefault(); put('/admin/settings'); }} className="space-y-6">{settings.map((setting) => <FormField key={setting.key} label={`${setting.group_name} / ${setting.key}`}><input value={data.settings[setting.key] ?? ''} onChange={(event) => setData('settings', { ...data.settings, [setting.key]: event.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-400" /></FormField>)}<button disabled={processing} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">Save settings</button></form></div></AdminLayout>;
}

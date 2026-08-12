import { Head, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, Notification } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Item = { id: number; label: string; url: string; location: string; sort_order: number; is_active: boolean };

export default function Index({ items }: { items: Item[] }) {
    const { t } = useI18n();
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const { data, setData, put, processing } = useForm<{ items: Item[] }>({ items });
    const update = (index: number, key: keyof Item, value: string | number | boolean) => setData('items', data.items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
    return <AdminLayout><Head title={t('Navigation')} /><div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"><div><Breadcrumbs items={['Dashboard', 'Navigation']} /><h1 className="mt-3 text-3xl font-semibold">{t('Navigation')}</h1></div><Notification message={flash?.success} /><form onSubmit={(event) => { event.preventDefault(); put('/admin/navigation'); }} className="space-y-4">{data.items.map((item, index) => <div key={item.id} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 md:grid-cols-[1fr_1fr_120px_80px]"><input value={item.label} onChange={(event) => update(index, 'label', event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /><input value={item.url} onChange={(event) => update(index, 'url', event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /><input type="number" value={item.sort_order} onChange={(event) => update(index, 'sort_order', Number(event.target.value))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" /><label className="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" checked={item.is_active} onChange={(event) => update(index, 'is_active', event.target.checked)} /> {t('Active')}</label></div>)}<button disabled={processing} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{t('Save navigation')}</button></form></div></AdminLayout>;
}

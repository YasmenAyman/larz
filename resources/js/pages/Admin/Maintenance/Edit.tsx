import { Head, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Settings = {
    enabled: boolean;
    title_en: string;
    message_en: string;
    title_ar: string;
    message_ar: string;
};

export default function Edit({ settings }: { settings: Settings }) {
    const { locale } = useI18n();
    const isArabic = locale === 'ar';
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const form = useForm<Settings>({ ...settings });

    return (
        <AdminLayout>
            <Head title={isArabic ? 'وضع الصيانة' : 'Maintenance Mode'} />
            <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Global Website', 'Maintenance Mode']} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{isArabic ? 'وضع الصيانة' : 'Maintenance mode'}</h1>
                    <p className="mt-1 text-sm text-white/50">{isArabic ? 'أوقفي الموقع مؤقتًا للزوار مع إبقاء لوحة التحكم متاحة.' : 'Temporarily pause the public website while keeping the dashboard available.'}</p>
                </div>

                <Notification message={flash?.success} />

                <form onSubmit={(event) => { event.preventDefault(); form.put('/admin/maintenance', { preserveScroll: true }); }} className="space-y-6">
                    <section className={`rounded-2xl border p-6 ${form.data.enabled ? 'border-amber-400/40 bg-amber-400/10' : 'border-white/10 bg-[#161619]/90'}`}>
                        <label className="flex cursor-pointer items-center justify-between gap-5">
                            <div>
                                <h2 className="text-lg font-semibold text-white">{isArabic ? 'تفعيل وضع الصيانة' : 'Enable maintenance mode'}</h2>
                                <p className="mt-1 text-sm text-white/55">{isArabic ? 'عند التفعيل، يرى زوار الموقع صفحة الصيانة بدلًا من الموقع.' : 'When enabled, visitors see the maintenance page instead of the website.'}</p>
                            </div>
                            <input type="checkbox" checked={form.data.enabled} onChange={(event) => form.setData('enabled', event.target.checked)} className="size-5 rounded border-white/30 bg-black text-[#C5A880] focus:ring-[#C5A880]" />
                        </label>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-white">{isArabic ? 'محتوى صفحة الصيانة' : 'Maintenance page content'}</h2>
                            <p className="mt-1 text-sm text-white/50">{isArabic ? 'أدخلي الرسالة باللغتين.' : 'Provide the message in both languages.'}</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <p className="text-xs font-semibold tracking-[0.18em] text-[#C5A880] uppercase">English</p>
                                <FormField label="Title" error={form.errors.title_en}><input value={form.data.title_en} onChange={(event) => form.setData('title_en', event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white" /></FormField>
                                <FormField label="Message" error={form.errors.message_en}><textarea rows={5} value={form.data.message_en} onChange={(event) => form.setData('message_en', event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white" /></FormField>
                            </div>
                            <div dir="rtl" className="space-y-4">
                                <p className="text-xs font-semibold tracking-[0.18em] text-[#C5A880] uppercase">العربية</p>
                                <FormField label="العنوان" error={form.errors.title_ar}><input value={form.data.title_ar} onChange={(event) => form.setData('title_ar', event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white" /></FormField>
                                <FormField label="الرسالة" error={form.errors.message_ar}><textarea rows={5} value={form.data.message_ar} onChange={(event) => form.setData('message_ar', event.target.value)} className="w-full rounded-xl border border-white/15 bg-[#1e1e22] px-4 py-3 text-sm text-white" /></FormField>
                            </div>
                        </div>
                    </section>

                    <button disabled={form.processing} className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">
                        {form.processing ? (isArabic ? 'جارٍ الحفظ...' : 'Saving...') : (isArabic ? 'حفظ الإعدادات' : 'Save settings')}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

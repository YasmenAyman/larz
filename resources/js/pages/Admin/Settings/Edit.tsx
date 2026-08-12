import { Head, useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField, Notification } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';

type Setting = { key: string; value: string | null; group_name: string; description: string | null };

const BILINGUAL_KEYS = ['contact.address', 'footer.cta_title', 'footer.cta_button'];
const BILINGUAL_AR_SUFFIX: Record<string, string> = {
    'contact.address': 'contact.address_ar',
    'footer.cta_title': 'footer.cta_title_ar',
    'footer.cta_button': 'footer.cta_button_ar',
};

const SETTING_LABELS: Record<string, string> = {
    'contact.address': 'Address', 'contact.phone': 'Phone', 'contact.email': 'Email', 'contact.number': 'Number',
    'footer.cta_button': 'CTA button', 'footer.cta_title': 'CTA title',
    'social.instagram': 'Instagram', 'social.facebook': 'Facebook', 'social.linkedin': 'LinkedIn', 'social.youtube': 'YouTube',
    'seo.default_title': 'Default SEO title', 'seo.default_description': 'Default SEO description',
    'seo.default_og_title': 'Default social sharing title', 'seo.default_og_description': 'Default social sharing description',
    'seo.default_og_image': 'Default social sharing image', 'seo.default_robots': 'Search engine robots',
};
const SETTING_GROUPS: Record<string, string> = { brand: 'Brand', contact: 'Contact', social: 'Social media', seo: 'SEO', footer: 'Footer' };

export default function Edit({ settings, brand }: { settings: Setting[]; brand: Record<string, string | null> }) {
    const { locale, t } = useI18n();
    const isArabic = locale === 'ar';
    const translateLabel = (value: string) => isArabic ? ({
        Address: 'العنوان', Phone: 'الهاتف', Email: 'البريد الإلكتروني', Number: 'الرقم', Instagram: 'إنستغرام', Facebook: 'فيسبوك', LinkedIn: 'لينكدإن', YouTube: 'يوتيوب',
        'CTA button': 'زر الدعوة لاتخاذ إجراء', 'CTA title': 'عنوان الدعوة لاتخاذ إجراء',
        'Default SEO title': 'عنوان SEO الافتراضي', 'Default SEO description': 'وصف SEO الافتراضي', 'Default social sharing title': 'عنوان المشاركة الافتراضي',
        'Default social sharing description': 'وصف المشاركة الافتراضي', 'Default social sharing image': 'صورة المشاركة الافتراضية', 'Search engine robots': 'إعدادات محركات البحث',
        Brand: 'الهوية والعلامة التجارية', Contact: 'التواصل', Footer: 'التذييل', 'Social media': 'وسائل التواصل الاجتماعي', SEO: 'تحسين محركات البحث',
    } as Record<string, string>)[value] ?? t(value) : value;
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const form = useForm<{ settings: Record<string, string>; logo: File | null; favicon: File | null }>({
        settings: Object.fromEntries(settings.map((setting) => [setting.key, setting.value ?? ''])),
        logo: null,
        favicon: null,
    });
    const setSetting = (key: string, value: string) => form.setData('settings', { ...form.data.settings, [key]: value });
    const arSuffixKeys = Object.values(BILINGUAL_AR_SUFFIX);
    const standaloneSettings = settings.filter((setting) => !arSuffixKeys.includes(setting.key));

    const preview = (url: string | null) => {
        if (!url) return null;
        return <img src={url} alt="current" className="mt-3 h-24 rounded-lg border border-slate-800 object-cover" />;
    };

    const input = (key: string) => (
        <input
            value={form.data.settings[key] ?? ''}
            onChange={(event) => setSetting(key, event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-400"
        />
    );

    const textarea = (key: string, rows = 3) => (
        <textarea
            rows={rows}
            value={form.data.settings[key] ?? ''}
            onChange={(event) => setSetting(key, event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-400 resize-y"
        />
    );

    const renderRow = (setting: Setting) => {
        const label = SETTING_LABELS[setting.key] ?? setting.key.split('.').slice(-1)[0].replace(/[_-]/g, ' ');
        const group = SETTING_GROUPS[setting.group_name] ?? setting.group_name;
        if (BILINGUAL_KEYS.includes(setting.key)) {
            const arKey = BILINGUAL_AR_SUFFIX[setting.key];
            const isTextarea = setting.key === 'footer.cta_title';
            return (
                <div key={setting.key} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                            {translateLabel(group)} / {translateLabel(label)}
                        </span>
                        <span className="text-xs text-emerald-400">EN + AR</span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs text-white/50">{isArabic ? 'الإنجليزية' : 'English'}</label>
                            {isTextarea ? textarea(setting.key) : input(setting.key)}
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-white/50">{isArabic ? 'العربية' : 'Arabic'}</label>
                            {isTextarea ? textarea(arKey) : input(arKey)}
                        </div>
                    </div>
                    {setting.description && <p className="mt-2 text-xs text-white/40">{translateLabel(setting.description)}</p>}
                </div>
            );
        }
        return (
            <div key={setting.key} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="mb-2 block text-xs font-semibold text-white/70 uppercase tracking-wider">
                    {translateLabel(group)} / {translateLabel(label)}
                </span>
                {input(setting.key)}
                {setting.description && <p className="mt-2 text-xs text-white/40">{translateLabel(setting.description)}</p>}
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title={t('Global Settings')} />
            <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Global Settings'].map(t)} />
                    <h1 className="mt-3 text-3xl font-semibold">{t('Global Settings')}</h1>
                </div>
                <Notification message={flash?.success} />
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.transform((payload) => ({ ...payload, _method: 'put' }));
                        form.post('/admin/settings', { forceFormData: true });
                    }}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    <section className="grid gap-6 rounded-xl border border-slate-800 bg-slate-950 p-6 md:grid-cols-2">
                        <FormField label={isArabic ? 'الشعار (الرأس والتذييل)' : 'Logo (header & footer)'}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => form.setData('logo', event.target.files?.[0] ?? null)}
                                className="block w-full rounded-xl border border-white/15 bg-[#1e1e22] px-3 py-2 text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C5A880]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#C5A880]"
                            />
                            {preview(brand['brand.logo'] ?? null)}
                        </FormField>
                        <FormField label={isArabic ? 'الأيقونة (علامة تبويب المتصفح)' : 'Favicon (browser tab)'}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => form.setData('favicon', event.target.files?.[0] ?? null)}
                                className="block w-full rounded-xl border border-white/15 bg-[#1e1e22] px-3 py-2 text-sm text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C5A880]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#C5A880]"
                            />
                            {preview(brand['brand.favicon'] ?? null)}
                        </FormField>
                    </section>

                    <section className="space-y-4">
                        {standaloneSettings.map((setting) => renderRow(setting))}
                    </section>

                    <button disabled={form.processing} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
                        {isArabic ? 'حفظ الإعدادات' : 'Save settings'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

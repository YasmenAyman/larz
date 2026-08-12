import { Head, Link } from '@inertiajs/react';
import { translateAdmin } from '@/admin-translations';
import { Breadcrumbs, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';
import AdminLayout from '@/layouts/AdminLayout';

type SectionCard = { key: string; label: string; description: string; status: string; updated_at: string | null; edit_url: string };

const arabicStatuses: Record<string, string> = {
    published: 'منشور',
    draft: 'مسودة',
    inactive: 'غير نشط',
};

const arabicHomeSections: Record<string, string> = {
    'Hero Section': 'القسم الرئيسي',
    Statistics: 'الإحصائيات',
    'Featured Projects': 'المشروعات المميزة',
    Gallery: 'المعرض',
    Testimonials: 'آراء العملاء',
    'Final CTA': 'الدعوة الختامية',
    'News & Press Section': '\u0642\u0633\u0645 \u0627\u0644\u0623\u062e\u0628\u0627\u0631 \u0648\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0635\u062d\u0641\u064a\u0629',
    'Stories & Insights Section': '\u0642\u0633\u0645 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a \u0648\u0627\u0644\u0631\u0624\u0649',
    'Photo Gallery Section': '\u0642\u0633\u0645 \u0645\u0639\u0631\u0636 \u0627\u0644\u0635\u0648\u0631',
    'Newsletter CTA': '\u0627\u0644\u062f\u0639\u0648\u0629 \u0644\u0644\u0627\u0634\u062a\u0631\u0627\u0643 \u0628\u0627\u0644\u0646\u0634\u0631\u0629 \u0627\u0644\u0628\u0631\u064a\u062f\u064a\u0629',
    'Why LARZ / Company Values': '\u0644\u0645\u0627\u0630\u0627 \u0644\u0627\u0631\u0632 / \u0642\u064a\u0645 \u0627\u0644\u0634\u0631\u0643\u0629',
    'Vacancies Section Settings': '\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0642\u0633\u0645 \u0627\u0644\u0648\u0638\u0627\u0626\u0641 \u0627\u0644\u0634\u0627\u063a\u0631\u0629',
    'General CV CTA': '\u0627\u0644\u062f\u0639\u0648\u0629 \u0644\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0633\u064a\u0631\u0629 \u0627\u0644\u0630\u0627\u062a\u064a\u0629',
    'Contact Methods': '\u0648\u0633\u0627\u0626\u0644 \u0627\u0644\u062a\u0648\u0627\u0635\u0644',
    'Request Form Settings': '\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0637\u0644\u0628',
    'Social Media Section': '\u0642\u0633\u0645 \u0648\u0633\u0627\u0626\u0644 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a',
};

export default function Overview({ label, sections }: { page: string; label: string; sections: SectionCard[] }) {
    const { locale } = useI18n();
    const t = (value: string) => translateAdmin(value, locale);
    const isArabic = locale === 'ar';
    const pageLabel = isArabic && label === 'Media Page' ? '\u0635\u0641\u062d\u0629 \u0627\u0644\u0625\u0639\u0644\u0627\u0645' : t(label);

    return (
        <AdminLayout>
            <Head title={isArabic ? `${pageLabel} - نظرة عامة` : `${pageLabel} Overview`} />
            <div className="mx-auto max-w-6xl space-y-8">
                <div>
                    <Breadcrumbs items={[t('Dashboard'), t('Website Pages'), pageLabel]} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{pageLabel}</h1>
                    <p className="mt-1 text-xs text-white/50 sm:text-sm">
                        {isArabic ? 'إدارة الأقسام القابلة للتعديل الخاصة بهذه الصفحة.' : 'Manage the editable sections for this page.'}
                    </p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                    {sections.map((section) => {
                        const sectionLabel = isArabic ? arabicHomeSections[section.label] ?? t(section.label) : section.label;
                        const status = isArabic ? arabicStatuses[section.status] ?? section.status : section.status;

                        return (
                            <article key={section.key} className="group rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:border-[#C5A880]/40">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{sectionLabel}</h2>
                                        <p className="mt-2 text-xs leading-relaxed text-white/60">
                                            {isArabic ? `إدارة إعدادات قسم ${sectionLabel} لهذه الصفحة.` : section.description}
                                        </p>
                                    </div>
                                    <StatusBadge status={status} />
                                </div>
                                <p className="mt-5 text-xs text-white/30">
                                    {isArabic ? 'آخر تحديث: ' : 'Last updated: '}{section.updated_at ?? (isArabic ? 'غير مُهيأ' : 'Not configured')}
                                </p>
                                <Link href={section.edit_url} className="mt-5 inline-flex h-[42px] items-center justify-center rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 text-xs font-semibold uppercase tracking-wider text-black shadow-md transition-all hover:scale-[1.02]">
                                    {isArabic ? 'تعديل القسم' : 'Edit Section'}
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}

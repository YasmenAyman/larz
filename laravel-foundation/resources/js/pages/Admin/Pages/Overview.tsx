import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, StatusBadge } from '@/components/admin/AdminLayoutParts';

type SectionCard = { key: string; label: string; description: string; status: string; updated_at: string | null; edit_url: string };

export default function Overview({ label, sections }: { page: string; label: string; sections: SectionCard[] }) {
    return (
        <AdminLayout>
            <Head title={`${label} Overview`} />
            <div className="mx-auto max-w-6xl space-y-8">
                <div>
                    <Breadcrumbs items={['Dashboard', 'Website Pages', label]} />
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{label}</h1>
                    <p className="mt-1 text-xs text-white/50 sm:text-sm">إدارة الأقسام القابلة للتعديل الخاصة بهذه الصفحة.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                    {sections.map((section) => (
                        <article key={section.key} className="group rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:border-[#C5A880]/40">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-white">{section.label}</h2>
                                    <p className="mt-2 text-xs text-white/60 leading-relaxed">{section.description}</p>
                                </div>
                                <StatusBadge status={section.status} />
                            </div>
                            <p className="mt-5 text-xs text-white/30">آخر تحديث: {section.updated_at ?? 'غير مهيأ'}</p>
                            <Link href={section.edit_url} className="mt-5 inline-flex h-[42px] items-center justify-center rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 text-xs font-semibold uppercase tracking-wider text-black shadow-md transition-all hover:scale-[1.02]">
                                تعديل القسم / Edit section
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

import { Head } from '@inertiajs/react';
import { FolderKanban, BriefcaseBusiness, FileText, Inbox, Mail, Newspaper, Users, UserRoundCheck } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, FilterSelect, Notification, Pagination, SearchInput, StatusBadge } from '@/components/admin/AdminLayoutParts';

const icons = [FolderKanban, FolderKanban, Newspaper, BriefcaseBusiness, Inbox, Inbox, UserRoundCheck, Mail];

export default function Dashboard({ cards }: { cards: Array<{ label: string; value: number }> }) {
    return (
        <AdminLayout>
            <Head title="لوحة التحكم - Dashboard" />

            <div className="mx-auto max-w-7xl space-y-8">
                {/* Top Header Row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Breadcrumbs items={['Admin', 'Dashboard']} />
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            لوحة التحكم والإدارة
                        </h1>
                        <p className="mt-1 text-xs text-white/50 sm:text-sm">
                            نظرة عامة على المحتوى وإحصائيات النشاط الخاص بموقع LARZ Developments.
                        </p>
                    </div>
                    <StatusBadge status="لوحة النظام جاهزة" />
                </div>

                {/* Notification */}
                <Notification message="تم ربط لوحة التحكم بالنظام بنجاح. جميع نماذج المحتوى تعمل بجاهزية تامة." />

                {/* Stat Cards Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => {
                        const Icon = icons[index] ?? FileText;
                        return (
                            <article
                                key={card.label}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A880]/40 hover:shadow-[0_12px_40px_rgba(197,168,128,0.15)]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex size-11 items-center justify-center rounded-xl border border-[#C5A880]/20 bg-[#C5A880]/10 text-[#C5A880] transition-colors group-hover:bg-[#C5A880] group-hover:text-black">
                                        <Icon className="size-5" />
                                    </div>
                                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/30">
                                        Metric
                                    </span>
                                </div>
                                <div className="mt-6">
                                    <p className="text-3xl font-bold tracking-tight text-white">
                                        {card.value}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-white/60">
                                        {card.label}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Table Section Card */}
                <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">سجل النشاطات والأحداث</h2>
                            <p className="mt-1 text-xs text-white/50">
                                أدوات تصفية وبحث المحتوى لجميع الوحدات البرمجية.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="w-full sm:w-64">
                                <SearchInput value="" onChange={() => undefined} placeholder="بحث في النشاطات..." />
                            </div>
                            <FilterSelect
                                value="جميع الحالات"
                                onChange={() => undefined}
                                options={['جميع الحالات', 'منشور', 'مسودة']}
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <EmptyState
                            title="لا توجد نشاطات مسجلة حالياً"
                            message="سيتم عرض جميع التغييرات والتحديثات التي تجريها على البيانات هنا فور حدوثها."
                        />
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4">
                        <Pagination />
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

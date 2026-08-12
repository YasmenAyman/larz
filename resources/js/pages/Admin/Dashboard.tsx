import { Head } from '@inertiajs/react';
import { BriefcaseBusiness, FileText, FolderKanban, Inbox, Mail, Newspaper, UserRoundCheck } from 'lucide-react';
import { translateAdmin } from '@/admin-translations';
import { Breadcrumbs, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';
import { useI18n } from '@/i18n';
import AdminLayout from '@/layouts/AdminLayout';

const icons = [FolderKanban, FolderKanban, Newspaper, BriefcaseBusiness, Inbox, Inbox, UserRoundCheck, Mail];

export default function Dashboard({ cards }: { cards: Array<{ label: string; value: number }> }) {
    const { locale } = useI18n();
    const t = (value: string) => translateAdmin(value, locale);

    return (
        <AdminLayout>
            <Head title={t('Dashboard')} />

            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Breadcrumbs items={[t('Admin'), t('Dashboard')]} />
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{t('Management Dashboard')}</h1>
                        <p className="mt-1 text-xs text-white/50 sm:text-sm">{t('An overview of LARZ Developments content and activity statistics.')}</p>
                    </div>
                    <StatusBadge status={t('System dashboard ready')} />
                </div>

                <Notification message={t('The dashboard is connected successfully. All content modules are ready to use.')} />

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => {
                        const Icon = icons[index] ?? FileText;
                        return (
                            <article key={card.label} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A880]/40 hover:shadow-[0_12px_40px_rgba(197,168,128,0.15)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex size-11 items-center justify-center rounded-xl border border-[#C5A880]/20 bg-[#C5A880]/10 text-[#C5A880] transition-colors group-hover:bg-[#C5A880] group-hover:text-black">
                                        <Icon className="size-5" />
                                    </div>
                                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/30">{t('Metric')}</span>
                                </div>
                                <div className="mt-6">
                                    <p className="text-3xl font-bold tracking-tight text-white">{card.value}</p>
                                    <p className="mt-1 text-xs font-medium text-white/60">{t(card.label)}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}

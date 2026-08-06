import { Head, Link, router, usePage } from '@inertiajs/react';
import { Award, Crown, Medal, Star } from 'lucide-react';
import type { PageProps } from '@/types';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, EmptyState, Notification, StatusBadge } from '@/components/admin/AdminLayoutParts';

type AwardRecord = {
    id: number;
    title: string;
    year: number | null;
    description: string | null;
    icon_key: string | null;
    sort_order: number;
    is_published: boolean;
};

const iconMap = { award: Award, star: Star, medal: Medal, crown: Crown } as const;
type IconKey = keyof typeof iconMap;

export default function Index({ awards }: { awards: AwardRecord[] }) {
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;

    return (
        <AdminLayout>
            <Head title="About Us / Awards" />
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Breadcrumbs items={['Dashboard', 'Website Pages', 'About Us', 'Awards']} />
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Awards</h1>
                        <p className="mt-1 text-sm text-white/50">Manage the awards and achievements displayed on the About Us page.</p>
                    </div>
                    <Link href="/admin/pages/about/awards/create" className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] px-5 py-3 text-sm font-semibold text-black">Add award</Link>
                </div>

                <Notification message={flash?.success} />

                <section className="rounded-2xl border border-white/10 bg-[#161619]/90 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Awards list</h2>
                            <p className="mt-1 text-xs text-white/45">Create, edit, publish, or delete the awards displayed publicly on the About Us page.</p>
                        </div>
                        <span className="text-xs text-white/45">{awards.length} records</span>
                    </div>

                    {awards.length === 0 ? (
                        <EmptyState title="No awards yet" message="Click Add award to create your first award card." />
                    ) : (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {awards.map((award) => {
                                const Icon = (award.icon_key && iconMap[award.icon_key as IconKey]) || Award;
                                return (
                                    <article key={award.id} className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5">
                                        <div>
                                            <div className="grid size-12 place-items-center rounded-full border border-white/30 text-white/70">
                                                <Icon className="size-5" strokeWidth={1.25} />
                                            </div>
                                            <h3 className="mt-5 text-lg font-normal text-white">{award.title}</h3>
                                            <p className="mt-1 text-[0.7rem] tracking-[0.2em] text-white/45 uppercase">{award.year ?? '—'}</p>
                                            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/55">{award.description ?? ''}</p>
                                        </div>
                                        <div className="mt-5 flex items-center justify-between gap-2">
                                            <StatusBadge status={award.is_published ? 'Published' : 'Draft'} />
                                            <div className="flex flex-wrap justify-end gap-2">
                                                <Link href={`/admin/pages/about/awards/${award.id}/edit`} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">Edit</Link>
                                                <button type="button" onClick={() => router.post(`/admin/pages/about/awards/${award.id}/publish`)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 hover:border-[#C5A880] hover:text-white">{award.is_published ? 'Unpublish' : 'Publish'}</button>
                                                <button type="button" onClick={() => { if (window.confirm('Delete this award?')) router.delete(`/admin/pages/about/awards/${award.id}`); }} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10">Delete</button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}
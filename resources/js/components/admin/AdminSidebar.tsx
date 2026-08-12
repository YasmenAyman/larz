import { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { adminNavigation, type AdminNavigationGroup, type AdminNavigationItem } from './navigation';
import { useI18n } from '@/i18n';
import { translateAdmin } from '@/admin-translations';

type AdminPageProps = PageProps<{ auth: { user: { permissions?: string[] } | null } }>;

function canView(item: AdminNavigationItem, permissions: string[]) {
    return !item.permission || permissions.includes(item.permission);
}

function visibleItems(group: AdminNavigationGroup, permissions: string[]) {
    return group.items.map((item) => ({ ...item, children: item.children?.filter((child) => canView(child, permissions)) })).filter((item) => canView(item, permissions) && (!item.children || item.children.length > 0));
}

function itemIsActive(url: string, item: AdminNavigationItem): boolean {
    return url === item.href.split('?')[0] || (item.href !== '/admin/dashboard' && url.startsWith(item.href.split('?')[0] + '/')) || item.children?.some((child) => itemIsActive(url, child)) === true;
}

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { url, props } = usePage<AdminPageProps>();
    const { locale, dir } = useI18n();
    const t = (value: string) => translateAdmin(value, locale);
    const isRtl = dir === 'rtl';
    const permissions = props.auth.user?.permissions ?? [];
    const groups = adminNavigation.map((group) => ({ ...group, items: visibleItems(group, permissions) })).filter((group) => group.items.length > 0);
    const activeMenuHref = groups.flatMap((group) => group.items).find((item) => item.children && itemIsActive(url, item))?.href ?? null;
    const [openMenuHref, setOpenMenuHref] = useState<string | null>(activeMenuHref);

    useEffect(() => {
        setOpenMenuHref(activeMenuHref);
    }, [activeMenuHref, url]);

    return (
        <>
            {open && <button type="button" aria-label={t('Close menu')} onClick={onClose} className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden" />}
            <aside className={`fixed inset-y-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} z-40 h-screen w-72 overflow-y-auto overscroll-contain border-white/10 bg-[#141417] p-4 transition-transform lg:sticky lg:top-0 lg:z-auto lg:block lg:translate-x-0 ${open ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full'}`}>
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 lg:hidden">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#C5A880]">{t('Admin navigation')}</span>
                    <button type="button" onClick={onClose} aria-label={t('Close menu')} className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white">
                        <X className="size-5" />
                    </button>
                </div>
                <nav className="space-y-6" aria-label={t('Admin navigation')}>
                    {groups.map((group) => (
                        <div key={group.heading ?? 'primary'}>
                            {group.heading && (
                                <p className="mb-2 px-3 text-[0.65rem] font-semibold tracking-[0.25em] text-[#C5A880]/70 uppercase">
                                    {t(group.heading)}
                                </p>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <NavigationItem
                                        key={item.href + item.label}
                                        item={item}
                                        url={url}
                                        open={openMenuHref === item.href}
                                        onToggle={() => setOpenMenuHref(openMenuHref === item.href ? null : item.href)}
                                        onClose={onClose}
                                        t={t}
                                        isRtl={isRtl}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}

function NavigationItem({ item, url, open, onToggle, onClose, t, isRtl }: { item: AdminNavigationItem; url: string; open: boolean; onToggle: () => void; onClose: () => void; t: (value: string) => string; isRtl: boolean }) {
    const active = itemIsActive(url, item);
    const controlId = `admin-nav-${item.href.replace(/[^a-z0-9]+/g, '-')}`;

    if (!item.children) {
        return (
            <Link
                href={item.href}
                onClick={onClose}
                className={`block rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
                    active
                        ? `${isRtl ? 'border-r-2' : 'border-l-2'} border-[#C5A880] bg-[#C5A880]/15 font-medium text-[#C5A880] shadow-[0_0_15px_rgba(197,168,128,0.1)]`
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
                {t(item.label)}
            </Link>
        );
    }

    return (
        <div>
            <div
                className={`flex items-center rounded-xl text-sm transition-all duration-200 ${
                    active
                        ? 'bg-[#C5A880]/15 font-medium text-[#C5A880]'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
                <Link href={item.href} onClick={onClose} className="min-w-0 flex-1 px-3.5 py-2.5">
                    {t(item.label)}
                </Link>
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={open}
                    aria-controls={controlId}
                    aria-label={`${t(open ? 'Collapse' : 'Expand')} ${t(item.label)}`}
                    className="px-3 py-2.5 text-white/50 hover:text-white"
                >
                    <ChevronDown className={`size-4 transition-transform duration-200 ${open ? 'rotate-180 text-[#C5A880]' : ''}`} />
                </button>
            </div>
            {open && (
                <div id={controlId} className={`mt-1 space-y-1 border-white/10 ${isRtl ? 'mr-3.5 border-r pr-3' : 'ml-3.5 border-l pl-3'}`}>
                    {item.children.map((child) => (
                        <Link
                            key={child.href + child.label}
                            href={child.href}
                            onClick={onClose}
                            className={`block rounded-lg px-3 py-2 text-xs transition-colors ${
                                url === child.href || url.startsWith(child.href.split('?')[0] + '/')
                                    ? 'bg-[#C5A880]/20 font-medium text-[#C5A880]'
                                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {t(child.label)}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

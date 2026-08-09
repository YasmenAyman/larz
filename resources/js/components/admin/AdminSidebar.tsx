import { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { adminNavigation, type AdminNavigationGroup, type AdminNavigationItem } from './navigation';

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
    const permissions = props.auth.user?.permissions ?? [];
    const groups = adminNavigation.map((group) => ({ ...group, items: visibleItems(group, permissions) })).filter((group) => group.items.length > 0);
    const activeGroupIndex = groups.findIndex((group) => group.items.some((item) => itemIsActive(url, item)));
    const [openGroup, setOpenGroup] = useState<number | null>(activeGroupIndex >= 0 ? activeGroupIndex : null);

    useEffect(() => {
        if (activeGroupIndex >= 0) setOpenGroup(activeGroupIndex);
    }, [activeGroupIndex, url]);

    return (
        <>
            {open && <button type="button" aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden" />}
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-white/10 bg-[#141417] p-4 transition-transform lg:static lg:z-auto lg:block lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 lg:hidden">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#C5A880]">MENU</span>
                    <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white">
                        <X className="size-5" />
                    </button>
                </div>
                <nav className="space-y-6" aria-label="Admin navigation">
                    {groups.map((group, groupIndex) => (
                        <div key={group.heading ?? 'primary'}>
                            {group.heading && (
                                <p className="mb-2 px-3 text-[0.65rem] font-semibold tracking-[0.25em] text-[#C5A880]/70 uppercase">
                                    {group.heading}
                                </p>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <NavigationItem
                                        key={item.href + item.label}
                                        item={item}
                                        url={url}
                                        open={openGroup === groupIndex}
                                        onToggle={() => setOpenGroup(openGroup === groupIndex ? null : groupIndex)}
                                        onClose={onClose}
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

function NavigationItem({ item, url, open, onToggle, onClose }: { item: AdminNavigationItem; url: string; open: boolean; onToggle: () => void; onClose: () => void }) {
    const active = itemIsActive(url, item);
    const controlId = `admin-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    if (!item.children) {
        return (
            <Link
                href={item.href}
                onClick={onClose}
                className={`block rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
                    active
                        ? 'border-l-2 border-[#C5A880] bg-[#C5A880]/15 font-medium text-[#C5A880] shadow-[0_0_15px_rgba(197,168,128,0.1)]'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
                {item.label}
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
                    {item.label}
                </Link>
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={open}
                    aria-controls={controlId}
                    aria-label={`${open ? 'Collapse' : 'Expand'} ${item.label}`}
                    className="px-3 py-2.5 text-white/50 hover:text-white"
                >
                    <ChevronDown className={`size-4 transition-transform duration-200 ${open ? 'rotate-180 text-[#C5A880]' : ''}`} />
                </button>
            </div>
            {open && (
                <div id={controlId} className="mt-1 ml-3.5 space-y-1 border-l border-white/10 pl-3">
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
                            {child.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

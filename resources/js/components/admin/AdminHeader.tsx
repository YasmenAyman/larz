import { Link, usePage } from '@inertiajs/react';
import { Menu, ExternalLink, LogOut, User } from 'lucide-react';
import type { PageProps } from '@/types';

export function AdminHeader({ onMenu }: { onMenu: () => void }) {
    const { auth } = usePage<PageProps>().props;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#141417]/90 px-4 text-white backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenu}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
                    aria-label="Open admin navigation"
                >
                    <Menu className="size-5" />
                </button>

                <Link href="/admin/dashboard" aria-label="LARZ home" className="group flex items-center gap-2">
                    <span className="text-xl font-bold tracking-[0.2em] text-white transition-colors group-hover:text-[#C5A880]">
                        LARZ<sup className="ml-0.5 align-super text-[0.4em]">®</sup>
                    </span>
                    <span className="hidden rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-widest text-[#C5A880] uppercase sm:inline-block">
                        Dashboard
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-3 text-sm">
                {/* View Website Link */}
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white sm:flex"
                >
                    <span>View Website</span>
                    <ExternalLink className="size-3.5 text-[#C5A880]" />
                </a>

                {/* User Badge */}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1e1e22] px-3 py-1.5 text-xs text-white/90">
                    <div className="flex size-6 items-center justify-center rounded-full bg-[#C5A880]/20 text-[#C5A880]">
                        <User className="size-3.5" />
                    </div>
                    <span className="font-medium">{auth.user.name}</span>
                </div>

                {/* Logout Button */}
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-rose-300"
                     title="Logout"
                >
                    <LogOut className="size-3.5" />
                     <span className="hidden sm:inline">Logout</span>
                </Link>
            </div>
        </header>
    );
}

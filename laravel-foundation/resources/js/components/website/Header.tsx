import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import type { WebsiteSharedProps } from '@/types/website';

function isActivePath(currentUrl: string, target: string) {
    return target === '/' ? currentUrl === '/' : currentUrl === target || currentUrl.startsWith(`${target}/`);
}

export function Header() {
    const [open, setOpen] = useState(false);
    const { url, props } = usePage<WebsiteSharedProps>();
    const navLinks = (props.site?.navigation ?? []).filter((link) => link.location === 'header').map((link) => ({ label: link.label, to: link.url }));

    return (
        <header className="absolute inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-5 sm:px-8">
            {/* Pill navbar */}
            <div className="flex w-[914px] max-w-full items-center gap-8 rounded-full border border-white/10 bg-[#1a1a1c]/90 px-6 py-3.5 shadow-[0_4px_32px_rgba(0,0,0,0.55)] backdrop-blur-md">
                {/* Logo */}
                <Link href="/" aria-label="LARZ home" className="shrink-0">
                    <span className="block text-base font-semibold tracking-[0.2em] text-white">
                        LARZ<sup className="ml-0.5 align-super text-[0.38em]">®</sup>
                    </span>
                    <span className="mt-0.5 block text-[0.42rem] tracking-[0.32em] text-white/40 uppercase">
                        developments
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden flex-1 items-center justify-between lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.to}
                            className={`text-[16px] font-light text-white/60 transition-colors duration-200 hover:text-white [&.active]:text-white${isActivePath(url, link.to) ? ' active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                    className="ml-auto grid size-8 shrink-0 place-items-center text-white/60 hover:text-white lg:hidden"
                >
                    {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="mt-2 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#1a1a1c]/95 p-5 backdrop-blur-md lg:hidden">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.to}
                                onClick={() => setOpen(false)}
                                className={`text-sm font-light text-white/60 [&.active]:text-white${isActivePath(url, link.to) ? ' active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}

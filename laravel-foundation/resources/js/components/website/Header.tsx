import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import type { WebsiteSharedProps } from '@/types/website';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useI18n } from '@/i18n';

function isActivePath(currentUrl: string, target: string) {
    return target === '/' ? currentUrl === '/' : currentUrl === target || currentUrl.startsWith(`${target}/`);
}

const projectSections = [
    { label: 'Overview', hash: '#overview' },
    { label: 'Masterplan & Brochure', hash: '#brochure' },
    { label: 'Virtual Tour', hash: '#virtual-tour' },
    { label: '3D Gallery', hash: '#homes3d' },
    { label: 'Gallery', hash: '#gallery' },
    { label: 'Construction Updates', hash: '#construction' },
    { label: 'Amenities & Services', hash: '#amenities' },
    { label: 'Facilities', hash: '#facilities' },
    { label: 'Location & Map', hash: '#location' },
];

export function Header() {
    const [open, setOpen] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const { url, props } = usePage<WebsiteSharedProps>();
    const { t } = useI18n();
    const navLinks = (props.site?.navigation ?? []).filter((link) => link.location === 'header').map((link) => ({ label: t(link.label), to: link.url }));
    const projects = props.site?.projects ?? [];

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
                        {t('developments')}
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden flex-1 items-center justify-between lg:flex">
                    {navLinks.map((link) => {
                        const isProjects = link.to === '/projects';
                        return isProjects ? (
                            <div
                                key={link.label}
                                className="relative"
                                onMouseEnter={() => setMegaOpen(true)}
                                onMouseLeave={() => setMegaOpen(false)}
                            >
                                <Link
                                    href={link.to}
                                    className={`text-[16px] font-light text-white/60 transition-colors duration-200 hover:text-white [&.active]:text-white${isActivePath(url, link.to) ? ' active' : ''}`}
                                >
                                    {link.label}
                                </Link>

                                {/* Mega-menu */}
                                {megaOpen && projects.length > 0 && (
                                    <div className="absolute left-1/2 top-full z-50 mt-4 -translate-x-1/2">
                                        <div className="flex gap-0 rounded-2xl border border-white/10 bg-[#1a1a1c]/95 p-6 backdrop-blur-md shadow-2xl">
                                            {/* Projects label */}
                                            <div className="flex items-start pr-8">
                                                <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-white uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                                    {t('Projects')}
                                                </span>
                                            </div>

                                            {/* Project columns */}
                                            {projects.map((project) => (
                                                <div key={project.slug} className="min-w-[140px] border-l border-white/10 pl-6 first:border-l-0 first:pl-0">
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        className="mb-4 block text-sm font-medium text-white hover:text-gold"
                                                    >
                                                        {project.title}
                                                    </Link>
                                                    <ul className="space-y-2">
                                                        {projectSections.map((section) => (
                                                            <li key={section.label}>
                                                                <Link
                                                                    href={`/projects/${project.slug}${section.hash}`}
                                                                    className="text-[0.7rem] text-white/50 hover:text-white"
                                                                >
                                                                    {section.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.label}
                                href={link.to}
                                className={`text-[16px] font-light text-white/60 transition-colors duration-200 hover:text-white [&.active]:text-white${isActivePath(url, link.to) ? ' active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile hamburger */}
                 <LanguageSwitcher dark />
                 <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? t('Close menu') : t('Open menu')}
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
                        {navLinks.map((link) => {
                            const isProjects = link.to === '/projects';
                            return isProjects ? (
                                <div key={link.label}>
                                    <Link
                                        href={link.to}
                                        onClick={() => setOpen(false)}
                                        className={`text-sm font-light text-white/60 [&.active]:text-white${isActivePath(url, link.to) ? ' active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                    {projects.length > 0 && (
                                        <div className="mt-3 ml-4 space-y-3">
                                            {projects.map((project) => (
                                                <div key={project.slug}>
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        onClick={() => setOpen(false)}
                                                        className="block text-xs font-medium text-white/70 hover:text-white"
                                                    >
                                                        {project.title}
                                                    </Link>
                                                    <ul className="mt-1 ml-3 space-y-1">
                                                        {projectSections.map((section) => (
                                                            <li key={section.label}>
                                                                <Link
                                                                    href={`/projects/${project.slug}${section.hash}`}
                                                                    onClick={() => setOpen(false)}
                                                                    className="block text-[0.65rem] text-white/40 hover:text-white/70"
                                                                >
                                                                    {section.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.to}
                                    onClick={() => setOpen(false)}
                                    className={`text-sm font-light text-white/60 [&.active]:text-white${isActivePath(url, link.to) ? ' active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}

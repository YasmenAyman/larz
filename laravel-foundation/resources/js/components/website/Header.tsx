import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import type { WebsiteSharedProps } from '@/types/website';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useI18n } from '@/i18n';

function isActivePath(currentUrl: string, target: string) {
    return target === '/' ? currentUrl === '/' : currentUrl === target || currentUrl.startsWith(`${target}/`);
}

export function Header() {
    const [open, setOpen] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeProject, setActiveProject] = useState<string | null>(null);
    const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
    const { url, props } = usePage<WebsiteSharedProps>();
    const { t, dir } = useI18n();
    const isRtl = dir === 'rtl';

    const dropdownMenus: Record<string, { label: string; hash: string }[]> = {
        '/about': [
            { label: t('Our Story'), hash: '#story' },
            { label: t('Awards & Achievements'), hash: '#awards' },
            { label: t('Partnerships & Affiliations'), hash: '#partners' },
        ],
        '/media': [
            { label: t('News & Press Releases'), hash: '#news' },
            { label: t('Blogs'), hash: '#blogs' },
            { label: t('Photo Gallery'), hash: '#gallery' },
        ],
        '/careers': [
            { label: t('Vacancies'), hash: '#roles' },
            { label: t('Internship Programs'), hash: '#internship' },
        ],
        '/contact': [
            { label: t('Hotline'), hash: '#hotline' },
            { label: t('Request Pricing/Tour'), hash: '#request' },
            { label: t('Location & Map'), hash: '#location' },
            { label: t('Social Media'), hash: '#social' },
        ],
    };

    const projectSections = [
        { label: t('Overview'), hash: '#overview' },
        { label: t('Masterplan & Brochure'), hash: '#brochure' },
        { label: t('Virtual Tour'), hash: '#virtual-tour' },
        { label: t('3D Gallery'), hash: '#homes3d' },
        { label: t('Gallery'), hash: '#gallery' },
        { label: t('Construction Updates'), hash: '#construction' },
        { label: t('Amenities & Services'), hash: '#amenities' },
        { label: t('Facilities'), hash: '#facilities' },
        { label: t('Location & Map'), hash: '#location' },
    ];
    const settings = props.site?.settings ?? {};
    const logo = settings['brand.logo'] ?? null;
    const navLinks = (props.site?.navigation ?? []).filter((link) => link.location === 'header').map((link) => ({ label: t(link.label), to: link.url }));
    const projects = props.site?.projects ?? [];

    return (
        <header className="absolute inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-5 sm:px-8">
            {/* Pill navbar */}
            <div className="flex w-[914px] max-w-full items-center gap-8 rounded-full border border-white/10 bg-[#1a1a1c]/90 px-6 py-3.5 shadow-[0_4px_32px_rgba(0,0,0,0.55)] backdrop-blur-md">
                {/* Hamburger + Language – RTL (left side) */}
                {isRtl && (
                    <>
                        <button
                            type="button"
                            onClick={() => { setOpen((v) => !v); setMobileDropdown(null); }}
                            aria-label={open ? t('Close menu') : t('Open menu')}
                            aria-expanded={open}
                            className="me-auto grid size-8 shrink-0 place-items-center text-white/60 hover:text-white lg:hidden"
                        >
                            {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
                        </button>
                        <LanguageSwitcher dark />
                    </>
                )}

                {/* Logo */}
                <Link href="/" aria-label="LARZ home" className="shrink-0">
                    {logo ? (
                        <img src={logo} alt="LARZ" className="h-9 w-auto max-w-[160px] object-contain" />
                    ) : (
                        <>
                            <span className="block text-base font-semibold tracking-[0.2em] text-white">
                                LARZ<sup className="ml-0.5 align-super text-[0.38em]">®</sup>
                            </span>
                            <span className="mt-0.5 block text-[0.42rem] tracking-[0.32em] text-white/40 uppercase">
                                {t('developments')}
                            </span>
                        </>
                    )}
                </Link>

                {/* Desktop nav */}
                <nav className="hidden flex-1 items-center justify-between lg:flex">
                    {navLinks.map((link) => {
                        const isProjects = link.to === '/projects';
                        const hasDropdown = dropdownMenus[link.to];

                        if (isProjects) {
                            const projectsHref = projects.length > 0 ? `/projects/${projects[0].slug}` : link.to;
                            return (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => setMegaOpen(true)}
                                    onMouseLeave={() => { setMegaOpen(false); setActiveProject(null); }}
                                >
                                    <Link
                                        href={projectsHref}
                                        className={`text-[16px] font-light text-white/60 transition-colors duration-200 hover:text-white [&.active]:text-white${isActivePath(url, link.to) ? ' active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>

                                    {/* Projects dropdown */}
                                    {megaOpen && projects.length > 0 && (
                                        <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-white/10 bg-[#1a1a1c]/95 p-4 backdrop-blur-md shadow-2xl">
                                            <ul className="space-y-2">
                                                {projects.map((project) => (
                                                    <li
                                                        key={project.slug}
                                                        className="relative"
                                                        onMouseEnter={() => setActiveProject(project.slug)}
                                                        onMouseLeave={() => setActiveProject(null)}
                                                    >
                                                        <Link
                                                            href={`/projects/${project.slug}`}
                                                            className="flex items-center justify-between text-sm text-white/60 hover:text-white"
                                                        >
                                                            {project.title}
                                                            <span className="ms-2 text-[0.6rem] text-white/30 rtl:rotate-180">▶</span>
                                                        </Link>

                                                        {/* Sub-dropdown for project sections */}
                                                        {activeProject === project.slug && (
                                                            <div className="absolute left-full top-0 z-50 ml-2 min-w-[200px] rounded-xl border border-white/10 bg-[#1a1a1c]/95 p-4 backdrop-blur-md shadow-2xl">
                                                                <ul className="space-y-2">
                                                                    {projectSections.map((section) => (
                                                                        <li key={section.hash}>
                                                                            <Link
                                                                                href={`/projects/${project.slug}${section.hash}`}
                                                                                className="block text-sm text-white/60 hover:text-white"
                                                                            >
                                                                                {section.label}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        if (hasDropdown) {
                            return (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => setActiveDropdown(link.to)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={link.to}
                                        className={`text-[16px] font-light text-white/60 transition-colors duration-200 hover:text-white [&.active]:text-white${isActivePath(url, link.to) ? ' active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>

                                    {/* Dropdown */}
                                    {activeDropdown === link.to && (
                                        <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-white/10 bg-[#1a1a1c]/95 p-4 backdrop-blur-md shadow-2xl">
                                            <ul className="space-y-2">
                                                {hasDropdown.map((item) => (
                                                    <li key={item.hash}>
                                                        <Link
                                                            href={`${link.to}${item.hash}`}
                                                            className="block text-sm text-white/60 hover:text-white"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
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

                {/* Language + Hamburger – LTR (right side) */}
                {!isRtl && (
                    <>
                        <LanguageSwitcher dark />
                        <button
                            type="button"
                            onClick={() => { setOpen((v) => !v); setMobileDropdown(null); }}
                            aria-label={open ? t('Close menu') : t('Open menu')}
                            aria-expanded={open}
                            className="ms-auto grid size-8 shrink-0 place-items-center text-white/60 hover:text-white lg:hidden"
                        >
                            {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
                        </button>
                    </>
                )}
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="mt-2 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#1a1a1c]/95 p-5 backdrop-blur-md lg:hidden">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => {
                            const isProjects = link.to === '/projects';
                            const hasDropdown = dropdownMenus[link.to];
                            const isExpanded = mobileDropdown === link.to;

                            if (isProjects) {
                                return (
                                    <div key={link.label}>
                                        <button
                                            type="button"
                                            onClick={() => setMobileDropdown(isExpanded ? null : link.to)}
                                            className={`flex w-full items-center justify-between text-sm font-light text-white/60 ${isExpanded ? 'text-white' : ''}`}
                                        >
                                            {link.label}
                                            <span className={`text-[0.6rem] text-white/30 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${isRtl ? 'rotate-180' : ''}`}>▶</span>
                                        </button>
                                        {isExpanded && projects.length > 0 && (
                                            <div className="mt-3 me-4 space-y-3">
                                                {projects.map((project) => (
                                                    <div key={project.slug}>
                                                        <Link
                                                            href={`/projects/${project.slug}`}
                                                            onClick={() => setOpen(false)}
                                                            className="block text-xs font-medium text-white/70 hover:text-white"
                                                        >
                                                            {project.title}
                                                        </Link>
                                                        <ul className="mt-1 me-3 space-y-1">
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
                                );
                            }

                            if (hasDropdown) {
                                return (
                                    <div key={link.label}>
                                        <button
                                            type="button"
                                            onClick={() => setMobileDropdown(isExpanded ? null : link.to)}
                                            className={`flex w-full items-center justify-between text-sm font-light text-white/60 ${isExpanded ? 'text-white' : ''}`}
                                        >
                                            {link.label}
                                            <span className={`text-[0.6rem] text-white/30 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${isRtl ? 'rotate-180' : ''}`}>▶</span>
                                        </button>
                                        {isExpanded && (
                                            <div className="mt-2 me-4 space-y-2">
                                                {hasDropdown.map((item) => (
                                                    <Link
                                                        key={item.hash}
                                                        href={`${link.to}${item.hash}`}
                                                        onClick={() => setOpen(false)}
                                                        className="block text-xs text-white/50 hover:text-white/80"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
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

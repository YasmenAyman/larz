import { useCallback, useEffect, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, Baby, Bike, BookOpen, ChevronLeft, ChevronRight, Dog, Droplet, Dumbbell, Flame, Leaf, Moon, Play, User, Users, Waves, X } from 'lucide-react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import type { ProjectSections, WebsiteProject } from '@/types/website';
import type { PageProps } from '@/types';

const icons = { user: User, book: BookOpen, bike: Bike, dumbbell: Dumbbell, waves: Waves, moon: Moon, droplet: Droplet, users: Users, baby: Baby, dog: Dog, leaf: Leaf, flame: Flame } as const;

type InquiryForm = { name: string; phone: string; email: string; project_id: string; project_unit_type_id: string; preferred_contact_method: string; message: string; consent_at: string; source_url: string; _hp_website: string };
type BrochureForm = { name: string; phone: string; email: string; project_id: string; source_url: string; _hp_website: string };

export function ProjectHero({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const [ref, api] = useEmblaCarousel({ loop: true });
    const [selected, setSelected] = useState(0);
    const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);
    useEffect(() => { if (!api) return; const onSelect = () => setSelected(api.selectedScrollSnap()); onSelect(); api.on('select', onSelect); const timer = setInterval(() => api.scrollNext(), 5000); return () => { clearInterval(timer); api.off('select', onSelect); }; }, [api]);
    return <section className="relative bg-night" style={{ backgroundImage: `radial-gradient(ellipse 60% 70% at 82% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 35%, transparent 72%), linear-gradient(110deg, rgba(6, 4, 4, 0.98) 28%, rgba(2, 2, 4, 0.73) 100%), url(${project.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}><div className="relative min-h-[86vh] overflow-hidden"><div className="relative mx-auto flex min-h-[86vh] max-w-site flex-col justify-center px-6 pt-40 pb-16 sm:px-10 lg:px-24"><div ref={ref} className="overflow-hidden"><div className="flex">{sections.heroSlides.map((slide, index) => <div key={index} className="w-full shrink-0"><Eyebrow className="text-ink">{slide.eyebrow}</Eyebrow><h1 className="mt-8 text-5xl font-light leading-[1.08] text-ink sm:text-6xl lg:text-[4.5rem]">{slide.titleLine1}<br />{slide.titleLine2}</h1><p className="mt-8 max-w-md text-sm leading-relaxed text-ink-muted">{slide.description}</p><div className="mt-10 flex flex-wrap items-center gap-6"><a href="#brochure" className="inline-flex items-center gap-3 border border-gold px-6 py-4 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10">Request pricing &amp; payment plan <ArrowRight className="size-3.5" /></a><a href="#brochure" className="text-[0.7rem] tracking-[0.18em] text-ink-muted uppercase hover:text-ink">Download brochure</a></div></div>)}</div></div><div className="mt-12 flex items-center gap-2" role="tablist" aria-label="Project hero slides">{sections.heroSlides.map((_, index) => <button key={index} type="button" role="tab" aria-selected={selected === index} aria-label={`Show slide ${index + 1}`} onClick={() => scrollTo(index)} className={`h-px transition-all ${selected === index ? 'w-8 bg-gold' : 'w-6 bg-hairline hover:bg-ink-dim'}`} />)}</div></div></div></section>;
}

export function ProjectStats({ project }: { project: WebsiteProject }) {
    return <section className="relative bg-night"><div className="border-t border-hairline/50"><div className="mx-auto grid max-w-site grid-cols-2 md:grid-cols-4">{project.facts.map((stat) => <div key={stat.label} className="border-r border-b border-hairline/50 px-6 py-8 last:border-r-0 sm:px-10 md:border-b-0"><p className="text-3xl font-light text-ink">{stat.value}</p><p className="mt-2 text-[0.65rem] font-light tracking-[0.22em] text-ink uppercase">{stat.label}</p><p className="mt-1 text-xs text-ink-muted">{stat.note}</p></div>)}</div></div></section>;
}

export function ProjectOverview({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    return <section className="bg-white py-20 text-paper-ink sm:py-24"><div className="mx-auto grid max-w-[1440px] gap-14 px-6 sm:px-10 md:grid-cols-2 lg:items-center"><div><Eyebrow tone="light">Overview</Eyebrow><h2 className="mt-5 text-3xl font-light leading-[1.1] sm:text-[3rem]">{sections.overview.heading}</h2><p className="mt-6 text-sm font-light leading-relaxed text-ink-muted md:text-lg">{sections.overview.body}</p></div><figure className="relative h-[360px] max-w-xl overflow-hidden border border-paper-muted/30 bg-[#e4e4e7] sm:h-[500px]"><img src={project.gallery[0] ?? ''} alt="Courtyard and greenery at KLOVE" className="size-full object-cover" /></figure></div></section>;
}

export function Masterplan({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<BrochureForm>({
        name: '',
        phone: '',
        email: '',
        project_id: String(project.id),
        source_url: typeof window !== 'undefined' ? window.location.href : '',
        _hp_website: '',
    });
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const submit = (event: React.FormEvent) => { event.preventDefault(); post('/brochure-requests', { preserveScroll: true }); };

    return <section id="brochure" className="bg-night py-24 sm:py-28"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-10 md:grid-cols-[1fr_40%]"><div><Eyebrow className="text-ink">Masterplan &amp; brochure</Eyebrow><h2 className="mt-6 text-3xl font-light leading-[1.2] text-ink sm:text-[2.9rem]">{sections.masterplan.heading}</h2><p className="mt-6 text-sm leading-relaxed text-ink-muted">{sections.masterplan.description}</p><figure className="relative mt-8"><img src={project.brochure ?? ''} alt="KLOVE masterplan render" className="h-[320px] w-full border-2 border-hairline/80 object-cover sm:h-[450px]" /></figure></div>
        <div className="bg-surface-card/70 p-7"><h3 className="text-lg font-light text-ink">{sections.masterplan.brochureHeading}</h3><p className="mt-1 text-xs text-ink-muted">{sections.masterplan.brochureDescription}</p>
            <form className="mt-6 space-y-5" onSubmit={submit} noValidate>
                {(flash?.success || recentlySuccessful) && <p className="rounded border border-emerald-700/40 bg-emerald-950/50 px-3 py-2 text-xs text-emerald-300">{flash?.success ?? 'Brochure request received.'}</p>}
                <label className="block text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">Name<input type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} required placeholder="Your name" className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus:outline-none" />{errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name}</span>}</label>
                <label className="block text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">Phone<input type="tel" value={data.phone} onChange={(event) => setData('phone', event.target.value)} required placeholder="Your number" className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus:outline-none" />{errors.phone && <span className="mt-1 block text-xs text-rose-400">{errors.phone}</span>}</label>
                <input type="hidden" value={data.source_url} onChange={() => undefined} />
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true"><label>Do not fill<input type="text" tabIndex={-1} autoComplete="off" value={data._hp_website} onChange={(event) => setData('_hp_website', event.target.value)} /></label></div>
                <button type="submit" disabled={processing} className="flex w-full items-center justify-center gap-3 border border-gold px-6 py-3.5 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10 disabled:opacity-60">{processing ? 'Sending...' : 'Download brochure'} <ArrowRight className="size-3.5" /></button>
                <p className="text-center text-[0.65rem] text-ink-muted">We&apos;ll only use this to send the brochure and follow up.</p>
            </form>
        </div></div></section>;
}

export function VirtualTour({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const [open, setOpen] = useState(false);
    return <><section className="relative overflow-hidden border-b border-hairline/30 py-20" style={{ backgroundImage: 'radial-gradient(ellipse 100% 100% at 55% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 55%, transparent 72%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}><div className="mx-auto max-w-3xl px-6 text-center"><button type="button" onClick={() => setOpen(true)} aria-label="Play virtual tour video" className="mx-auto grid size-11 place-items-center rounded-full border border-gold text-gold transition-all duration-300 hover:scale-110 hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"><Play className="size-4 translate-x-[1px]" /></button><Eyebrow className="mt-6 justify-center text-ink">Virtual tour</Eyebrow><h2 className="mt-5 text-3xl font-light leading-[1.2] text-ink sm:text-[2.3rem]">{sections.virtualTour.heading}</h2><p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">{sections.virtualTour.description}</p><button type="button" onClick={() => setOpen(true)} className="mt-8 inline-flex items-center gap-3 border border-gold px-7 py-3.5 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10">Start the virtual tour <ArrowRight className="size-3.5" /></button></div></section>{open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/90 backdrop-blur-sm" onClick={() => setOpen(false)}><div className="relative mx-4 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => setOpen(false)} className="absolute -top-10 right-0 flex items-center gap-2 text-xs tracking-[0.15em] text-ink-muted uppercase hover:text-ink">Close <X className="size-3.5" /></button><div className="relative aspect-video w-full border border-hairline/30"><iframe src={sections.virtualTour.videoUrl} title="KLOVE New Cairo — Virtual Tour" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="size-full" /></div></div></div>}</>;
}

export function ConstructionUpdates({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) { return <section className="bg-paper py-24"><div className="mx-auto max-w-[1440px] px-6 sm:px-10"><Eyebrow tone="light">Construction updates</Eyebrow><h2 className="mt-6 max-w-xl text-3xl font-light leading-[1.2] text-paper-ink sm:text-[3rem]">{sections.construction.heading}</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-ink-muted">{sections.construction.description}</p><div className="mt-10 grid gap-6 sm:grid-cols-3">{project.updates.map((item) => <article key={item.title}><img src={item.image ?? ''} alt={item.title} className="h-[270px] w-full border border-hairline/40 object-cover" loading="lazy" /><p className="mt-4 text-[0.6rem] tracking-[0.22em] text-paper-muted uppercase">{item.tag}</p><h3 className="mt-2 text-sm text-ink-muted">{item.title}</h3></article>)}</div></div></section>; }

export function Amenities({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) { const groups = [...new Set(project.amenities.map((item) => item.group))]; return <section className="bg-night py-24"><div className="mx-auto max-w-[1440px] px-6 sm:px-10"><Eyebrow className="text-ink">Amenities &amp; services</Eyebrow><h2 className="mt-6 max-w-lg text-3xl font-light leading-[1.2] text-ink sm:text-[3rem]">{sections.amenities.heading}</h2><div className="mt-12 space-y-10">{groups.map((group) => <div key={group}><p className="border-b border-hairline/40 pb-4 text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">{group}</p><div className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{project.amenities.filter((item) => item.group === group).map((item) => { const Icon = icons[item.icon as keyof typeof icons] ?? User; return <div key={item.title}><span className="grid size-12 place-items-center rounded-full border border-gold/60 text-gold"><Icon className="size-4" /></span><h3 className="mt-4 text-sm text-ink">{item.title}</h3><p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.note}</p></div>; })}</div></div>)}</div></div></section>; }

export function LocationMap({ project, sections }: { project: WebsiteProject; sections: ProjectSections }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<InquiryForm>({
        name: '',
        phone: '',
        email: '',
        project_id: String(project.id),
        project_unit_type_id: '',
        preferred_contact_method: 'phone',
        message: '',
        consent_at: new Date().toISOString(),
        source_url: typeof window !== 'undefined' ? window.location.href : '',
        _hp_website: '',
    });
    const { flash } = usePage<PageProps<{ flash?: { success?: string } }>>().props;
    const submit = (event: React.FormEvent) => { event.preventDefault(); post('/project-inquiries', { preserveScroll: true }); };

    return <><section className="bg-paper py-24"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-10 md:grid-cols-2 md:items-center md:grid-cols-[1fr_50%]"><div><Eyebrow tone="light">Location &amp; map</Eyebrow><h2 className="mt-6 text-3xl font-light leading-[1.2] text-paper-ink sm:text-[3rem]">{sections.location.heading}</h2><p className="mt-6 text-sm leading-relaxed text-paper-muted">{sections.location.description}</p><ul className="mt-8">{project.nearbyLocations.map((drive) => <li key={drive.place} className="flex items-baseline justify-between border-b border-paper-muted/25 py-4"><span className="text-md text-paper-ink/80">{drive.place}</span><span className="text-lg font-light text-paper-muted">{drive.time}</span></li>)}</ul><p className="mt-5 text-xs text-paper-muted">{sections.location.gateNote}</p><p className="mt-2 text-[0.7rem] text-paper-muted/70">{sections.location.driveNote}</p></div><figure className="relative"><img src={project.mapImage ?? ''} alt="Interactive map of KLOVE in Al-Qornofel, New Cairo" className="h-full max-h-[600px] w-full object-cover" loading="lazy" /></figure></div></section>
        <section className="bg-gradient-to-b from-surface-deep to-night py-24 text-center" style={{ backgroundImage: 'radial-gradient(ellipse 100% 100% at 55% 10%, rgba(164, 121, 43, 0.30) 0%, rgba(115, 79, 27, 0.2) 55%, transparent 72%)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}><div className="mx-auto max-w-2xl px-6"><Eyebrow className="justify-center text-ink">{sections.cta.eyebrow}</Eyebrow><h2 className="mt-6 text-3xl font-light leading-[1.3] text-ink sm:text-[3rem]">{sections.cta.heading}</h2>
            <form className="mt-8 space-y-5 text-left" onSubmit={submit} noValidate>
                {(flash?.success || recentlySuccessful) && <p className="rounded border border-emerald-700/40 bg-emerald-950/50 px-3 py-2 text-xs text-emerald-300">{flash?.success ?? 'Inquiry submitted.'}</p>}
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">Name<input type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} required className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" />{errors.name && <span className="mt-1 block text-xs text-rose-400">{errors.name}</span>}</label>
                    <label className="text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">Phone<input type="tel" value={data.phone} onChange={(event) => setData('phone', event.target.value)} required className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" />{errors.phone && <span className="mt-1 block text-xs text-rose-400">{errors.phone}</span>}</label>
                </div>
                <label className="block text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">Email<input type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" /></label>
                <label className="block text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">Preferred contact method<select value={data.preferred_contact_method} onChange={(event) => setData('preferred_contact_method', event.target.value)} className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"><option value="phone">Phone</option><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></label>
                <label className="block text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">Unit type<select value={data.project_unit_type_id} onChange={(event) => setData('project_unit_type_id', event.target.value)} className="mt-2 w-full border border-hairline/60 bg-night px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"><option value="">Any</option>{project.unitTypes.map((unit) => <option key={unit.tag} value={unit.tag}>{unit.name}</option>)}</select></label>
                <label className="block text-[0.6rem] tracking-[0.24em] text-ink-muted uppercase">Message<textarea rows={4} value={data.message} onChange={(event) => setData('message', event.target.value)} className="mt-2 w-full resize-none border border-hairline/60 bg-night px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" /></label>
                <input type="hidden" value={data.consent_at} onChange={() => undefined} />
                <input type="hidden" value={data.source_url} onChange={() => undefined} />
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true"><label>Do not fill<input type="text" tabIndex={-1} autoComplete="off" value={data._hp_website} onChange={(event) => setData('_hp_website', event.target.value)} /></label></div>
                <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                    <button type="submit" disabled={processing} className="inline-flex items-center gap-3 border border-gold px-6 py-4 text-[0.7rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold/10 disabled:opacity-60">{processing ? 'Sending...' : 'Talk to a consultant'} <ArrowRight className="size-3.5" /></button>
                    <Link href="/careers" className="text-[0.7rem] tracking-[0.18em] text-ink-muted uppercase hover:text-ink">View careers</Link>
                </div>
            </form>
        </div></section></>;
}